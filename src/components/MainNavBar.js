import {
	Box,
	Flex,
	HStack,
	Image,
	Text,
	Button,
	ButtonGroup,
	Menu,
	MenuButton,
	MenuList,
	MenuItem,
} from '@chakra-ui/react';
import logo from '../assets/images/logo.png';
import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { FaHome, FaUser, FaMapMarker, FaCaretDown } from 'react-icons/fa';
import Notification from './Notification';
import axios from 'axios';

function NavBar() {
	const navigate = useNavigate();

	const [isOwner, setIsOwner] = useState(false);
	const [profID, setProfID] = useState(0);

	const config = {
		headers: {
			Authorization: `Bearer ${window.sessionStorage.getItem('token')}`,
		},
	};

	useEffect(() => {
		axios
			.get(
				`https://nanny-kid-playdate-backend.onrender.com/profiles/owned/`,
				config
			)
			.then((respond) => {
				setProfID(respond.data.id);
				setIsOwner(true);
			});
	}, []);

	return (
		<Box bg='#0097A7' h='70px'>
			<Flex justify='space-between'>
				<HStack>
					<Image
						onClick={() => navigate('/profiles')}
						style={{
							cursor: 'pointer',
							height: '50px',
							marginLeft: '1rem',
							marginTop: '.5rem',
						}}
						src={logo}
						alt='Nanny Kid Playdate'
					></Image>
					<Flex>
						<Text
							onClick={() => navigate('/profiles')}
							cursor='pointer'
							style={{
								color: 'white',
								fontSize: '1.75rem',
								fontWeight: 'bold',
							}}
						>
							Nanny Kid
						</Text>
						<Text
							onClick={() => navigate('/profiles')}
							cursor='pointer'
							style={{ color: 'white', fontSize: '1.75rem' }}
						>
							Playdate
						</Text>
					</Flex>
					<ButtonGroup
						style={{ marginTop: '0.5rem', marginLeft: '2rem' }}
						spacing={6}
					>
						<Button
							style={{ textDecoration: 'none', color: 'white' }}
							leftIcon={
								<FaHome
									style={{ color: 'white', width: '20px', height: '20px' }}
								/>
							}
							variantColor='teal'
							variant='link'
							onClick={() => navigate('/profiles')}
						>
							Home
						</Button>
						<Button
							style={{ textDecoration: 'none', color: 'white' }}
							leftIcon={
								<FaMapMarker
									style={{ color: 'white', width: '20px', height: '20px' }}
								/>
							}
							variantColor='teal'
							variant='link'
							onClick={() => navigate('/places')}
						>
							Places
						</Button>
						<Button
							style={{ textDecoration: 'none', color: 'white' }}
							leftIcon={
								<FaUser
									style={{ color: 'white', width: '20px', height: '20px' }}
								/>
							}
							variantColor='teal'
							variant='link'
							onClick={() => {
								if (!isOwner) {
									navigate('/profile/create');
								} else {
									navigate(`/profiles/${profID}`);
								}
							}}
						>
							My Profile
						</Button>
					</ButtonGroup>
				</HStack>
				<HStack style={{ marginTop: '0.5rem', marginRight: '4rem' }}>
					<Notification style={{ textDecoration: 'none' }} />
					<Menu>
						<MenuButton
							style={{
								marginLeft: '1.5rem',
								color: 'white',
								textDecoration: 'none',
							}}
							variant='link'
							as={Button}
							rightIcon={<FaCaretDown />}
						>
							{window.sessionStorage.getItem('username')}
						</MenuButton>
						<MenuList>
							<MenuItem onClick={() => navigate('/account')}>Account</MenuItem>
							<MenuItem
								onClick={() => {
									const config = {
										headers: {
											Authorization: `Bearer ${window.sessionStorage.getItem(
												'token'
											)}`,
										},
									};
									window.sessionStorage.setItem('token', '');
									navigate('/login');
								}}
							>
								Log out
							</MenuItem>
						</MenuList>
					</Menu>
				</HStack>
			</Flex>
		</Box>
	);
}

export default NavBar;
