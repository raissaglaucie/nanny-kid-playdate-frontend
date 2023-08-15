import React from 'react';
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
	Button,
} from '@chakra-ui/react';
import MainNavBar from './MainNavBar';
import './Account.css';

const Account = () => {
	const initState = {
		username: '',
		first_name: '',
		last_name: '',
		email: '',
		phone_num: '',
	};
	const [userAccount, setuserAccount] = useState([]);
	const navigate = useNavigate();

	const config = {
		headers: {
			Authorization: `Bearer ${window.sessionStorage.getItem('token')}`,
		},
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

	const handleRedirect = (e) => {
		e.preventDefault();
		navigate('/account/edit');
	};

	return (
		<Box>
			<MainNavBar></MainNavBar>

			<div className='Account'>
				<FormControl className='profForm' isReadOnly>
					<h2 className='AccountTitle'>
						Account Settings {userAccount.username}
					</h2>
					<Text as='abbr' fontSize='2xl' color={'black'}></Text>

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
							<Input id='first-name' value={userAccount.first_name} />
						</Center>
						<Box w='1%'></Box>
						<Center w='49.5%'>
							<Input id='last-name' value={userAccount.last_name} />
						</Center>
					</Flex>

					<Flex>
						<Box w='49.5%'>
							<p></p>
						</Box>
						<Box w='1%'></Box>
						<Box w='49.5%'>
							<p></p>
						</Box>
					</Flex>

					<FormLabel htmlFor='email' className='profLabel'>
						Email
					</FormLabel>
					<Input id='email' type='email' value={userAccount.email} />
					<p></p>
					<FormLabel htmlFor='phone' className='profLabel'>
						Phone Number
					</FormLabel>
					<Input id='phone' value={userAccount.phone_num} />
					<p></p>

					<Button
						onClick={handleRedirect}
						colorScheme='blue'
						className='butao'
						width='100%'
						style={{
							backgroundColor: '#00BCD4',
							marginTop: '25px',
							height: '50px',
						}}
					>
						EDIT ACCOUNT
					</Button>
				</FormControl>
			</div>
		</Box>
	);
};
export default Account;
