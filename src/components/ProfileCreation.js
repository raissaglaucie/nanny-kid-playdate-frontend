import React from 'react';
import './ProfileCreation.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useState, useEffect } from 'react';
import {
	Box,
	Flex,
	Text,
	Center,
	FormLabel,
	FormControl,
	Input,
	Avatar,
	Button,
} from '@chakra-ui/react';
import MainNavBar from './MainNavBar';

const ProfileCreation = () => {
	const [userProfile, setuserProfile] = useState([]);

	const initState = {
		name: '',
		address: '',
		email: '',
		postal_code: '',
		phone_num: '',
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
			setuserProfile({
				...userProfile,
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
			fd.append('_method', 'POST');
			if (formValue.name !== '') {
				fd.append('name', formValue.name);
			}
			if (formValue.address !== '') {
				fd.append('address', formValue.address);
			}
			if (formValue.email !== '') {
				fd.append('email', formValue.email);
			}
			if (formValue.postal_code !== '') {
				fd.append('postal_code', formValue.postal_code);
			}
			if (formValue.phone_num !== '') {
				fd.append('phone_num', formValue.phone_num);
			}
			if (formValue.avatar !== '') {
				fd.append('profile_pic', formValue.avatar);
			}

			// Validated now send the request
			axios
				.post(
					`https://nanny-kid-playdate-backend.onrender.com/profiles/new/`,
					fd,
					config
				)
				.then((res) => {
					alert('Profile Successfully Created.');
					navigate(`/profiles/${res.data.id}`);
				})
				.catch((error) => {
					if (error.response.status === 401) {
						navigate('/login');
						alert('User Validation Failed. Please Login.');
					}
					if (!error.response.data.id) {
						// output error msg
						alert('Creation Failed: Check Error Messages.');
						if (error.response.data.name) {
							setFormErr((formErr) => ({
								...formErr,
								name: error.response.data.username,
							}));
						}
						if (error.response.data.address) {
							setFormErr((formErr) => ({
								...formErr,
								address: error.response.data.address,
							}));
						}
						if (error.response.data.email) {
							setFormErr((formErr) => ({
								...formErr,
								email: error.response.data.email,
							}));
						}
						if (error.response.data.postal_code) {
							setFormErr((formErr) => ({
								...formErr,
								postal_code: error.response.data.postal_code,
							}));
						}
						if (error.response.data.phone_num) {
							setFormErr((formErr) => ({
								...formErr,
								phone_num: error.response.data.phone_num,
							}));
						}
						if (error.response.data.avatar) {
							setFormErr((formErr) => ({
								...formErr,
								avatar: error.response.data.avatar,
							}));
							alert('The profile picture upload failed.');
						}
					}
					console.log(error.response);
				});
		}
	}, [formErr]);

	const validation = (formValue) => {
		const errors = {};
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
		if (!formValue.name) {
			errors.name = 'Name is required.';
		}
		if (!formValue.address) {
			errors.address = 'City and state are required.';
		}
		if (!formValue.email) {
			errors.email = 'Email is required.';
		} else if (!emailRegex.test(formValue.email)) {
			errors.email = 'Email Format Invalid.';
		}
		if (!formValue.phone_num) {
			errors.phone_num = 'Phone Number is required.';
		}
		if (!formValue.postal_code) {
			errors.postal_code = 'Postal Code is required.';
		}
		if (!formValue.avatar) {
			errors.avatar = 'Picture Required.';
			alert('Please Upload your profile picture.');
		}
		return errors;
	};

	// Check if the user currently owns a profile.
	// Use an axios API request to  http://127.0.0.1:8000/profiles/owned/
	// If yes, redirect to the profile page.
	// If no, render the form.
	useEffect(() => {
		axios
			.get(
				`https://nanny-kid-playdate-backend.onrender.com/profiles/owned/`,
				config
			)
			.then((res) => {
				navigate(`/profiles/${res.data.id}`);
			})
			.catch((err) => {
				if (err.response.status === 401) {
					navigate('/login');
					alert('User Validation Failed. Please Login.');
				} else if (err.response.status === 404) {
				}
			});
	}, []);

	return (
		<Box>
			<MainNavBar></MainNavBar>

			<div className='Profile'>
				<FormControl className='profForm' onSubmit={handleSubmit}>
					<Flex>
						<Center>
							<Box w='300px' class='idCard'>
								<Box>
									<Center>
										<Box>
											<Avatar
												size='2xl'
												bg='#FFA000'
												src={userProfile.avatar}
											/>{' '}
										</Box>
									</Center>
									<Center>
										<Box>
											<Text as='abbr' fontSize='2xl' color={'black'}>
												{formValue.name}
											</Text>
										</Box>
									</Center>
									<Center>
										<Box>
											<Text as='kbd' color={'gray'}>
												{formValue.address}
											</Text>
										</Box>
									</Center>
								</Box>

								<Center pl={'28%'} pt={'3%'} maxWidth={'72%'}>
									<Button
										className='transButton'
										name='avatar'
										colorScheme='transparent'
										size='md'
									>
										<input
											type='file'
											name='avatar'
											accept='image/*'
											id='submitButton'
											onChange={handleChange}
										/>
									</Button>
								</Center>
							</Box>
						</Center>

						<Box w='60%'>
							<h4 className='profileTitle'>Create Your Public Profile</h4>

							<FormLabel htmlFor='name' className='profLabel'>
								Profile Name
							</FormLabel>
							<Input id='name' name='name' onChange={handleChange} />
							<p>{formErr.name}</p>

							<FormLabel htmlFor='address' className='profLabel'>
								City and State
							</FormLabel>
							<Input id='address' name='address' onChange={handleChange} />
							<p>{formErr.address}</p>

							<FormLabel htmlFor='email' className='profLabel'>
								Email
							</FormLabel>
							<Input
								id='email'
								name='email'
								type='email'
								onChange={handleChange}
							/>
							<p>{formErr.email}</p>

							<Flex>
								<Box w='50.5%'>
									<FormLabel htmlFor='postal_code' className='profLabel'>
										Postal Code
									</FormLabel>
								</Box>
								<Box w='49.5%'>
									<FormLabel htmlFor='phone' className='profLabel'>
										Phone Number
									</FormLabel>
								</Box>
							</Flex>
							<Flex>
								<Center w='49.5%'>
									<Input
										id='email'
										name='postal_code'
										type='text'
										onChange={handleChange}
									/>
								</Center>
								<Box w='1%'></Box>
								<Center w='49.5%'>
									<Input id='phone' name='phone_num' onChange={handleChange} />
								</Center>
							</Flex>

							<Flex>
								<Box w='49.5%'>
									<p>{formErr.postal_code}</p>
								</Box>
								<Box w='1%'></Box>
								<Box w='49.5%'>
									<p>{formErr.phone_num}</p>
								</Box>
							</Flex>

							<Button
								type='submit'
								onClick={handleSubmit}
								style={{ marginTop: '60px' }}
								background={'#00BCD4'}
								color='white'
								width='100%'
								opacity='1'
								variant='solid'
								_hover={{ opacity: '0.7' }}
							>
								CREATE PROFILE
							</Button>
						</Box>
					</Flex>
				</FormControl>
			</div>
		</Box>
	);
};

export default ProfileCreation;
