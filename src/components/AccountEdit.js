import React from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useState, useEffect } from 'react';
import {
	Box,
	Flex,
	Center,
	FormLabel,
	FormControl,
	Input,
	Button,
} from '@chakra-ui/react';
import MainNavBar from './MainNavBar';

const AccountEdit = () => {
	const [userAccount, setuserAccount] = useState([]);

	const initState = {
		first_name: '',
		last_name: '',
		email: '',
		phone_num: '',
		avatar: '',
	};
	const [formValue, setFormValue] = useState(initState);
	const [formErr, setFormErr] = useState({});
	const [isSubmit, setIsSubmit] = useState(false);
	const navigate = useNavigate();

	const config = {
		headers: {
			Authorization: `Bearer ${window.sessionStorage.getItem('token')}`,
		},
	};

	const handleChange = (e) => {
		if (e.target.type === 'file') {
			setFormValue({ ...formValue, [e.target.name]: e.target.files[0] });
			setuserAccount({
				...userAccount,
				[e.target.name]: URL.createObjectURL(e.target.files[0]),
			});
		} else {
			const { name, value } = e.target;
			setFormValue({ ...formValue, [name]: value });
			setFormErr((formErr) => ({ ...formErr, [name]: '' }));
		}
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		setFormErr(validation(formValue));
		setIsSubmit(true);
	};

	useEffect(() => {
		if (Object.keys(formErr).length === 0 && isSubmit) {
			const fd = new FormData();
			fd.append('_method', 'PATCH');
			if (formValue.first_name !== '') {
				fd.append('first_name', formValue.first_name);
			}
			if (formValue.last_name !== '') {
				fd.append('last_name', formValue.last_name);
			}
			if (formValue.email !== '') {
				fd.append('email', formValue.email);
			}
			if (formValue.phone_num !== '') {
				fd.append('phone_num', formValue.phone_num);
			}
			if (formValue.avatar !== '') {
				fd.append('avatar', formValue.avatar);
			}

			// Validated now send the request
			axios
				.patch(
					`https://nanny-kid-playdate-backend.onrender.com/accounts/update/`,
					fd,
					config
				)
				.then((respond) => {
					axios
						.get(
							`https://nanny-kid-playdate-backend.onrender.com/accounts/view/`,
							config
						)
						.then((respond) => {
							window.sessionStorage.setItem('avatar', respond.data.avatar);
						})
						.catch((err) => {
							if (err.response.status === 401) {
								navigate('/login');
								alert('User Validation Failed. Please Login.');
							}
						});
					alert('Account Saved.');
					navigate('/account');
				})
				.catch((error) => {
					if (error.response.status === 401) {
						navigate('/login');
						alert('User Validation Failed. Please Login.');
					}
					if (!error.response.data.id) {
						// output error msg
						alert('Saving Failed: Check Error Messages.');
						if (error.response.data.first_name) {
							setFormErr((formErr) => ({
								...formErr,
								first_name: error.response.data.username,
							}));
						}
						if (error.response.data.last_name) {
							setFormErr((formErr) => ({
								...formErr,
								last_name: error.response.data.last_name,
							}));
						}
						if (error.response.data.email) {
							setFormErr((formErr) => ({
								...formErr,
								email: error.response.data.email,
							}));
						}
						if (error.response.data.phone_num) {
							setFormErr((formErr) => ({
								...formErr,
								phone_num: error.response.data.phone_num,
							}));
						}
					}
					console.log(error.response);
				});
		}
	}, [formErr]);

	const validation = (formValue) => {
		const errors = {};
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
		if (formValue.email) {
			if (!emailRegex.test(formValue.email)) {
				errors.email = 'Email Format Invalid.';
			}
		}
		return errors;
	};

	useEffect(() => {
		axios
			.get(
				`https://nanny-kid-playdate-backend.onrender.com/accounts/view/`,
				config
			)
			.then((respond) => {
				setuserAccount(respond.data);
			})
			.catch((err) => {
				if (err.response.status === 401) {
					navigate('/login');
					alert('User Validation Failed. Please Login.');
				}
			});
	}, []);

	return (
		<Box>
			<MainNavBar></MainNavBar>

			<div className='Account'>
				<FormControl className='profForm' onSubmit={handleSubmit}>
					<h2 className='AccountTitle'>
						Account Settings {userAccount.username}
					</h2>

					<Flex>
						<Box w='50.5%'>
							<FormLabel htmlFor='first-name' className='profLabel'>
								First name
							</FormLabel>
						</Box>
						<Box w='49.5%'>
							<FormLabel htmlFor='last-name' className='profLabel'>
								Last name
							</FormLabel>
						</Box>
					</Flex>
					<Flex>
						<Center w='49.5%'>
							<Input
								id='first-name'
								name='first_name'
								onChange={handleChange}
								defaultValue={userAccount.first_name}
							/>
						</Center>
						<Box w='1%'></Box>
						<Center w='49.5%'>
							<Input
								id='last-name'
								name='last_name'
								onChange={handleChange}
								defaultValue={userAccount.last_name}
							/>
						</Center>
					</Flex>

					<Flex>
						<Box w='49.5%'>
							<p>{formErr.first_name}</p>
						</Box>
						<Box w='1%'></Box>
						<Box w='49.5%'>
							<p>{formErr.last_name}</p>
						</Box>
					</Flex>

					<FormLabel htmlFor='email' className='profLabel'>
						Email
					</FormLabel>
					<Input
						id='email'
						name='email'
						type='email'
						onChange={handleChange}
						defaultValue={userAccount.email}
					/>
					<p>{formErr.email}</p>
					<FormLabel htmlFor='phone' className='profLabel'>
						Phone Number
					</FormLabel>
					<Input
						id='phone'
						name='phone_num'
						onChange={handleChange}
						defaultValue={userAccount.phone_num}
					/>
					<p>{formErr.phone_num}</p>

					<Button
						type='submit'
						onClick={handleSubmit}
						colorScheme='blue'
						width='100%'
						style={{
							backgroundColor: '#00BCD4',
							marginTop: '25px',
							height: '50px',
						}}
					>
						SAVE ACCOUNT
					</Button>
				</FormControl>
			</div>
		</Box>
	);
};

export default AccountEdit;
