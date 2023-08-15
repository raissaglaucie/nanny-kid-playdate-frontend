import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
	Box,
	Flex,
	Heading,
	Text,
	Center,
	Input,
	Button,
	FormControl,
	FormLabel,
	FormErrorMessage,
} from '@chakra-ui/react';

import backgroundImage from '../assets/images/kidsss.JPG';

const Login = () => {
	document.body.style.backgroundImage = `url(${backgroundImage})`;
	document.body.style.backgroundSize = 'cover';
	document.body.style.backgroundPosition = 'center';
	document.body.style.backgroundRepeat = 'no-repeat';

	const initState = { username: '', password: '' };
	const [formValue, setFormValue] = useState(initState);
	const [formErr, setFormErr] = useState({});
	const [isSubmit, setIsSubmit] = useState(false);
	const [user, setUser] = useState({ token: '' });
	const navigate = useNavigate();

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormValue({ ...formValue, [name]: value });
		setFormErr((formErr) => ({ ...formErr, [name]: '' }));
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		setFormErr(validation(formValue));
		setIsSubmit(true);
	};

	useEffect(() => {
		if (Object.keys(formErr).length === 0 && isSubmit) {
			fetch(
				'https://nanny-kid-playdate-backend.onrender.com/accounts/api/token/',
				{
					method: 'POST',
					headers: {
						Accept: 'application/json',
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({
						username: formValue.username,
						password: formValue.password,
					}),
				}
			)
				.then((response) => response.json())
				.then((json) => {
					if (!json.access) {
						alert('Login Failed. Please Recheck Login Information.');
					} else {
						setUser({ token: json.access });
						window.sessionStorage.setItem('token', json.access);
						const config = {
							headers: {
								Authorization: `Bearer ${window.sessionStorage.getItem(
									'token'
								)}`,
							},
						};
						axios
							.get(
								'https://nanny-kid-playdate-backend.onrender.com/accounts/view/',
								config
							)
							.then((respond) => {
								window.sessionStorage.setItem(
									'username',
									respond.data.username
								);
								window.sessionStorage.setItem('avatar', respond.data.avatar);
							})
							.catch((err) => {
								if (err.response.status === 401) {
									navigate('/login');
									alert('Login Failed.');
								}
							});
						alert('Login Success.');
						document.body.style = 'background: transparent;';
						navigate('/profiles');
					}
				});
		}
	}, [formErr]);

	const validation = (formValue) => {
		const errors = {};
		if (!formValue.username) {
			errors.username = 'Username is required.';
		}
		if (!formValue.password) {
			errors.password = 'Password is required.';
		}
		return errors;
	};

	return (
		<Flex height='100vh' alignItems='center' justifyContent='flex-end'>
			<Box
				p={8}
				maxWidth='500px'
				width='100%'
				bg='rgba(0, 0, 0, 0.8)'
				boxShadow='lg'
				marginLeft='auto' // This will align the form container on the right side
				height='100vh' // This will make the height cover the entire viewport height
			>
				<Center marginBottom='30px' marginTop='120px'>
					<img
						src={require('../assets/images/logo.png')}
						alt='logo'
						style={{ width: '124px', height: '120px' }}
					/>
				</Center>
				<Heading as='h1' fontSize='4xl' textAlign='center' mt={2} color='white'>
					Nanny Kid Playdate
				</Heading>
				<Heading
					as='h3'
					fontSize='xl'
					textAlign='center'
					mt={4}
					mb={6}
					color='#00BCD4'
				>
					LOGIN
				</Heading>
				<form onSubmit={handleSubmit}>
					<FormControl isInvalid={formErr.username}>
						<FormLabel>
							<span style={{ color: 'white' }}>Username</span>
						</FormLabel>
						<Input
							type='text'
							name='username'
							value={formValue.username}
							onChange={handleChange}
							placeholder='Username'
							color='white'
						/>
						<FormErrorMessage>{formErr.username}</FormErrorMessage>
					</FormControl>
					<FormControl isInvalid={formErr.password} mt={2}>
						<FormLabel>
							<span style={{ color: 'white' }}>Password</span>
						</FormLabel>
						<Input
							type='password'
							name='password'
							value={formValue.password}
							onChange={handleChange}
							placeholder='Password'
							color='white'
						/>
						<FormErrorMessage>{formErr.password}</FormErrorMessage>
					</FormControl>
					<Button
						mt={4}
						type='submit'
						isFullWidth
						style={{ backgroundColor: '#00BCD4' }}
					>
						<Text color='white'>Login</Text>
					</Button>
					<Text mt={2} textAlign='center' color='white'>
						No account?{' '}
						<Link to='/signup' color='teal.500'>
							Sign up now!
						</Link>
					</Text>
				</form>
			</Box>
		</Flex>
	);
};

export default Login;
