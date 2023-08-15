import React, { useState, useEffect } from 'react';
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
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import backgroundImage from '../assets/images/kidsss.JPG';

const SignUp = () => {
	document.body.style.backgroundImage = `url(${backgroundImage})`;
	document.body.style.backgroundSize = 'cover';
	document.body.style.backgroundPosition = 'center';
	document.body.style.backgroundRepeat = 'no-repeat';

	const initState = {
		username: '',
		password: '',
		password2: '',
		email: '',
		firstname: '',
		lastname: '',
	};
	const [formValue, setFormValue] = useState(initState);
	const [formErr, setFormErr] = useState({});
	const [isSubmit, setIsSubmit] = useState(false);
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
			// Validated now send the request
			axios
				.post(
					'https://nanny-kid-playdate-backend.onrender.com/accounts/register/',
					{
						username: formValue.username,
						password: formValue.password,
						password2: formValue.password2,
						email: formValue.email,
						first_name: formValue.firstname,
						last_name: formValue.lastname,
					}
				)
				.then((response) => {
					if (!response.data.last_name) {
						alert('Register Failed: Check Error Messages.');
						if (response.data.username) {
							setFormErr((formErr) => ({
								...formErr,
								username: response.data.username,
							}));
						}
						if (response.data.password) {
							setFormErr((formErr) => ({
								...formErr,
								password: response.data.password,
							}));
						}
						if (response.data.email) {
							setFormErr((formErr) => ({
								...formErr,
								email: response.data.email,
							}));
						}
					} else {
						alert('Register Success.');
						navigate('/login');
					}
				});
		}
	}, [
		formErr,
		formValue.email,
		formValue.firstname,
		formValue.lastname,
		formValue.password,
		formValue.password2,
		formValue.username,
		isSubmit,
		navigate,
	]);

	const validation = (formValue) => {
		const errors = {};
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
		if (!formValue.username) {
			errors.username = 'Username is required.';
		}
		if (!formValue.password) {
			errors.password = 'Password is required.';
		}
		if (!formValue.password2) {
			errors.password2 = 'Confirm Password is required.';
		} else if (formValue.password !== formValue.password2) {
			errors.password2 = "Password doesn't match.";
		}
		if (!formValue.email) {
			errors.email = 'Email is required.';
		} else if (!emailRegex.test(formValue.email)) {
			errors.email = 'Email Format Invalid.';
		}
		if (!formValue.firstname) {
			errors.firstname = 'Firstname is required.';
		}
		if (!formValue.lastname) {
			errors.lastname = 'Lastname is required.';
		}
		return errors;
	};

	return (
		<Flex
			height='100vh'
			alignItems='center'
			justifyContent='flex-end' // Alinhar os elementos verticalmente no lado direito
		>
			<Box
				p={8}
				maxWidth='500px'
				width='100%'
				bg='rgba(0, 0, 0, 0.8)'
				borderRadius='8px'
				boxShadow='lg'
				height='100vh'
			>
				<Center>
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
					SIGN UP
				</Heading>
				<form onSubmit={handleSubmit}>
					<FormControl isInvalid={formErr.username}>
						<FormLabel>
							{' '}
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
					<FormControl isInvalid={formErr.password2} mt={2}>
						<FormLabel>
							<span style={{ color: 'white' }}>Confirm Password</span>
						</FormLabel>
						<Input
							type='password'
							name='password2'
							value={formValue.password2}
							onChange={handleChange}
							placeholder='Confirm Password'
							color='white'
						/>
						<FormErrorMessage>{formErr.password2}</FormErrorMessage>
					</FormControl>
					<FormControl isInvalid={formErr.email} mt={2}>
						<FormLabel>
							{' '}
							<span style={{ color: 'white' }}>Email address</span>
						</FormLabel>
						<Input
							type='email'
							name='email'
							value={formValue.email}
							onChange={handleChange}
							placeholder='Enter email'
							color='white'
						/>
						<FormErrorMessage>{formErr.email}</FormErrorMessage>
					</FormControl>
					<FormControl isInvalid={formErr.firstname} mt={2}>
						<FormLabel>
							{' '}
							<span style={{ color: 'white' }}>First name</span>
						</FormLabel>
						<Input
							type='text'
							name='firstname'
							value={formValue.firstname}
							onChange={handleChange}
							placeholder='First name'
							color='white'
						/>
						<FormErrorMessage>{formErr.firstname}</FormErrorMessage>
					</FormControl>
					<FormControl isInvalid={formErr.lastname} mt={2}>
						<FormLabel>
							{' '}
							<span style={{ color: 'white' }}>Last name</span>
						</FormLabel>
						<Input
							type='text'
							name='lastname'
							id='lastSign'
							value={formValue.lastname}
							onChange={handleChange}
							placeholder='Last name'
							color='white'
						/>
						<FormErrorMessage>{formErr.lastname}</FormErrorMessage>
					</FormControl>
					<Button
						mt={4}
						type='submit'
						isFullWidth
						style={{ backgroundColor: '#00BCD4' }} // Set the background color to #00BCD4
					>
						<Text color='white'>SIGN UP</Text>{' '}
						{/* Set the text color to white */}
					</Button>
					<Text mt={2} textAlign='center' color='white'>
						Already have an account?{' '}
						<Link to='/login' color='teal.500'>
							Login!
						</Link>
					</Text>
				</form>
			</Box>
		</Flex>
	);
};

export default SignUp;
