import {
	Box,
	Flex,
	HStack,
	Image,
	Text,
	Input,
	Button,
	ButtonGroup,
	Menu,
	MenuButton,
	MenuList,
	MenuItem,
	Select,
} from '@chakra-ui/react';
import logo from '../assets/images/logo.png';
import * as colors from '../utils/colors';
import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import {
	FaHome,
	FaMapMarker,
	FaUser,
	FaSearch,
	FaCaretDown,
} from 'react-icons/fa';
import Notification from './Notification';
import axios from 'axios';

function SearchNavBar() {
	const navigate = useNavigate();
	const [searchQuery, setSearchQuery] = useState('');
	const [searchType, setSearchType] = useState('name');

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
						alt='Nannykid'
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
					<Input
						placeholder='Search'
						_placeholder={{ color: 'black' }}
						size='md'
						onChange={(event) => {
							setSearchQuery(event.target.value);
						}}
						style={{
							width: '250px',
							fill: 'white',
							marginLeft: '1rem',
							marginTop: '0.5rem',
							background: 'white',
							color: 'black',
						}}
					/>
					<Select
						border='none'
						color='white'
						placeholder=''
						width='25px'
						onChange={(event) => {
							console.log(event.target.value);
							setSearchType(event.target.value);
						}}
						textColor={colors.purple.medium}
						_focus={{ outline: 'none' }}
					>
						<option value='name'>Filter by name</option>
						<option value='postal_code'>Filter by postal code</option>
					</Select>
					<Button
						style={{
							marginLeft: '-0.2rem',
							marginTop: '0.5rem',
							background: '#FFA000',
							color: 'white',
							fontWeight: 'normal',
						}}
						leftIcon={
							<FaSearch
								style={{ color: 'white', width: '20px', height: '20px' }}
							/>
						}
						onClick={() => {
							if (!searchQuery) {
								navigate('/profiles');
							} else {
								navigate(
									`/profiles/search?type=${searchType}&${searchType}=${searchQuery}`
								);
							}
						}}
					></Button>
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
							variantcolor='teal'
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
							variantcolor='teal'
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
							variantcolor='teal'
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

export default SearchNavBar;
