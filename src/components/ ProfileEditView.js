import {
	Box,
	Tab,
	Input,
	TabList,
	TabPanel,
	TabPanels,
	Tabs,
	Button,
	Heading,
	Spinner,
	Center,
	Tag,
	TagLabel,
	Image,
	Grid,
	Textarea,
	GridItem,
	Stack,
	HStack,
	IconButton,
	useDisclosure,
	Modal,
	Text,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalFooter,
	ModalBody,
} from '@chakra-ui/react';
import { FaHeart, FaUserFriends, FaPlusCircle } from 'react-icons/fa';
import * as colors from '../utils/colors';
import axios from 'axios';
import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import MainNavBar from './MainNavBar';
import Kids from './Kids';
import Comments from './Comments';
// import Carousel from '../../components/Carousel';
import PlacesSmall from './PlacesSmall';
import { useNavigate } from 'react-router-dom';

function ProfileEditView() {
	const { id } = useParams();
	const [profile, setProfile] = useState([]);
	const [followers, setFollowers] = useState(0);
	const [likes, setLikes] = useState(0);
	const [loading, setLoading] = useState(false);
	const [hoveringLogo, setHoveringLogo] = useState(false);

	const [kidName, setKidName] = useState('');
	const [description, setDescription] = useState('');
	const [age, setAge] = useState(0);
	const [kidPicture, setKidPicture] = useState(null);

	const [profileName, setProfileName] = useState('');
	const [profileAddr, setProfileAddr] = useState('');
	const [profilePhoneNum, setProfilePhoneNum] = useState('');
	const [curProfileLogo, setCurNewProfileLogo] = useState(null);
	const [newProfileLogo, setNewProfileLogo] = useState(null);
	const logoChooser = useRef(null); //VERIFICAR ISSO AQUI

	const config = {
		headers: {
			Authorization: `Bearer ${window.sessionStorage.getItem('token')}`,
		},
	};
	const navigate = useNavigate();
	const { isOpen, onOpen, onClose } = useDisclosure();

	const getOwnedProfile = () => {
		setLoading(true);
		axios
			.get(
				'https://nanny-kid-playdate-backend.onrender.com/profiles/owned/',
				config
			)
			.then((res) => {
				if (res.data.id != id || !window.sessionStorage.getItem('token')) {
					navigate('/profiles');
				}
				setLoading(false);
			})
			.catch((err) => {
				if (err.response.status == 401) {
					navigate('/profiles');
				}
				if (err.response.status == 401) navigate('/login');
			});
	};

	const createKid = () => {
		if (!isNaN(age)) {
		}
		setLoading(true);
		const configModified = {
			headers: {
				Authorization: `Bearer ${window.sessionStorage.getItem('token')}`,
				'content-type': 'multipart/form-data',
			},
		};

		let formData = new FormData();
		formData.append('name', kidName);
		formData.append('age', age);
		formData.append('description', description);
		formData.append('picture', kidPicture);

		axios
			.post(
				`https://nanny-kid-playdate-backend.onrender.com/profiles/${id}/kids/new/`,
				formData,
				configModified
			)
			.then((res) => {
				// need to trigger reload in menu items
				onClose();
				setLoading(false);
			})
			.catch((err) => {
				if (err.response.status == 400) {
					alert('Invalid input was entered. Please try again.');
				} else {
					alert('Something went wrong...');
				}

				setLoading(false);
			});
	};

	const getProfile = () => {
		setLoading(true);
		axios
			.get(
				`https://nanny-kid-playdate-backend.onrender.com/profiles/info/${id}/`
			)
			.then((res) => {
				setProfile(res.data);

				setProfileName(res.data.name);
				setProfileAddr(res.data.address);
				setProfilePhoneNum(res.data.phone_num);
				setCurNewProfileLogo(res.data.profile_pic);

				setFollowers(res.data.followers.length);
				setLikes(res.data.likes.length);

				setLoading(false);
			})
			.catch((err) => {
				if (err.response.status == 401) navigate('/login');
			});
	};

	const handleEditConfirm = () => {
		if (profileName === '' || profileAddr === '' || profilePhoneNum === '') {
			alert('Please check that all fields are valid!');
			return;
		}

		setLoading(true);

		let formData = new FormData();
		formData.append('name', profileName);
		formData.append('address', profileAddr);
		formData.append('phone_num', profilePhoneNum);
		if (newProfileLogo) formData.append('profile_pic', newProfileLogo);

		axios
			.patch(
				`https://nanny-kid-playdate-backend.onrender.com/profiles/${id}/edit/`,
				formData,
				config
			)
			.then((res) => {
				setLoading(false);
				navigate(`/profiles/${id}`);
			})
			.catch((err) => {
				if (err.response.status == 400) {
					alert('Please check that all fields are valid!');
					setLoading(false);
				}
			});
	};

	useEffect(() => {
		getOwnedProfile();
		getProfile();
	}, []);

	return (
		<Box>
			<MainNavBar />
			{!loading ? (
				<Box
					style={{
						marginLeft: '2rem',
						margin: 'auto',
						marginTop: '1rem',
						background: 'white',
						height: '100vh',
					}}
				>
					<Grid templateColumns='repeat(5, 1fr)' gap={5}>
						<GridItem rowSpan={2} colSpan={1}>
							<Stack marginLeft='2rem'>
								<Heading
									marginTop='8'
									as='h3'
									fontSize='23px'
									color='#FFA000'
									textAlign='center'
									marginBottom='35px'
								>
									Nanny's Information
									{/* TODO: Add no profiles if there is none in the db */}
								</Heading>
								<Box
									style={{
										marginTop: '2rem',
									}}
									//   boxSize="sm"
									background='white'
									borderRadius='0.2rem'
									height='200px'
								>
									<Stack>
										<input
											ref={logoChooser}
											onChange={(event) => {
												setNewProfileLogo(event.target.files[0]);
												setCurNewProfileLogo(
													URL.createObjectURL(event.target.files[0])
												);
											}}
											type='file'
											class='form-control'
											id='customFile'
											accept='image/*'
											hidden
										></input>
										<Center>
											<Image
												onMouseEnter={() => setHoveringLogo(true)}
												onMouseLeave={() => setHoveringLogo(false)}
												borderRadius='full'
												objectFit='cover'
												boxshadow='2xl'
												boxSize='250px'
												marginTop='1.4rem'
												src={curProfileLogo}
												cursor={'pointer'}
												onClick={() => logoChooser.current.click()}
											/>
										</Center>
										{hoveringLogo && (
											<Center>
												<Box width='100px' background='#FFA000' opacity='0.6'>
													<Text textAlign='center' color='white'>
														EDIT
													</Text>
												</Box>
											</Center>
										)}
									</Stack>
								</Box>
								{/* <Center>
									<Heading
										marginTop='0.5rem'
										as='h3'
										fontSize='23px'
										style={{ color: '#FFA000' }}
									>
										{profile.name}
									</Heading>
								</Center> */}

								<Button
									style={{ marginTop: '150px' }}
									background={'#00BCD4'}
									color='white'
									opacity='1'
									variant='solid'
									_hover={{ opacity: '0.7' }}
									onClick={handleEditConfirm}
								>
									CONFIRM
								</Button>

								<Center>
									<Stack marginTop='2rem' marginBottom='1rem'>
										<Tag size='md' background='#BDBDBD'>
											<FaUserFriends color='#FFECB3' />
											<TagLabel marginLeft='0.5rem' color='black'>
												{profile.followers && `Followers: ${followers}`}
											</TagLabel>
										</Tag>
										<Tag size='md' background='#BDBDBD'>
											<FaHeart color='red' />
											<TagLabel marginLeft='0.5rem' color='black'>
												{profile.likes && `Likes: ${likes}`}
											</TagLabel>
										</Tag>
									</Stack>
								</Center>
							</Stack>
						</GridItem>
						<GridItem rowSpan={8} colSpan={4}>
							<Box marginLeft='5rem'>
								<Tabs variant='enclosed' marginTop='2rem'>
									<TabList color='white'>
										<Tab
											_selected={{ color: 'white', bg: '#0097A7' }}
											color='#FFA000'
										>
											GENERAL
										</Tab>
										<Tab
											_selected={{ color: 'white', bg: '#0097A7' }}
											color='#FFA000'
										>
											COMMENTS
										</Tab>
										<Tab
											_selected={{ color: 'white', bg: '#0097A7' }}
											color='#FFA000'
										>
											PLACES
										</Tab>
									</TabList>
									<TabPanels>
										{/* General */}
										<TabPanel>
											<Stack>
												<Box>
													<Heading
														marginTop='0.5rem'
														as='h3'
														size='md'
														style={{ color: '#FFA000' }}
													>
														Name
													</Heading>
													<Input
														size='md'
														defaultValue={profileName && profileName}
														onChange={(e) => setProfileName(e.target.value)}
														style={{
															width: '30%',
															fill: 'white',
															marginTop: '0.5rem',
															background: 'white',
															color: 'black',
														}}
													/>
												</Box>
												<Box>
													<Heading
														marginTop='0.5rem'
														as='h3'
														size='md'
														style={{ color: '#FFA000' }}
													>
														Address
													</Heading>
													<Input
														size='md'
														defaultValue={profileAddr && profileAddr}
														onChange={(e) => setProfileAddr(e.target.value)}
														style={{
															width: '30%',
															fill: 'white',
															marginTop: '0.5rem',
															background: 'white',
															color: 'black',
														}}
													/>
												</Box>
												<Box>
													<Heading
														marginTop='0.5rem'
														as='h3'
														size='md'
														style={{ color: '#FFA000' }}
													>
														Phone Number
													</Heading>
													<Input
														size='md'
														onChange={(e) => setProfilePhoneNum(e.target.value)}
														defaultValue={profilePhoneNum && profilePhoneNum}
														style={{
															width: '30%',
															fill: 'white',
															marginTop: '0.5rem',
															background: 'white',
															color: 'black',
														}}
													/>
												</Box>
												<Box>
													<HStack>
														<Heading
															marginTop='0.5rem'
															as='h3'
															size='md'
															style={{ color: '#FFA000' }}
														>
															Kids
														</Heading>
														{/* <IconButton
															style={{ marginTop: '.5rem' }}
															height='3vh'
															color='#0097A7'
															icon={<FaPlusCircle />}
															onClick={onOpen}
														/> */}
														<Button
															rightIcon={<FaPlusCircle />}
															onClick={onOpen}
															colorScheme='teal'
															variant='outline'
														>
															ADD KID
														</Button>
													</HStack>
													<Kids prof_id={id} isOwner />
												</Box>
											</Stack>
											<Modal isOpen={isOpen} onClose={onClose}>
												<ModalOverlay />
												<ModalContent>
													<ModalHeader>Add new kid </ModalHeader>
													{/* <ModalCloseButton /> */}
													<ModalBody>
														<Heading
															marginTop='0.5rem'
															as='h3'
															size='sm'
															style={{ color: 'black', opacity: '0.6' }}
														>
															Kid Name
														</Heading>
														<Input
															size='md'
															onChange={(event) =>
																setKidName(event.target.value)
															}
															style={{
																fill: 'white',
																marginTop: '0.5rem',
																background: 'white',
																color: 'black',
															}}
														/>
														<Heading
															marginTop='0.5rem'
															as='h3'
															size='sm'
															style={{ color: 'black', opacity: '0.6' }}
														>
															Description
														</Heading>
														<Textarea
															onChange={(event) =>
																setDescription(event.target.value)
															}
															maxHeight='30vh'
															size='sm'
														/>
														<Heading
															marginTop='0.5rem'
															as='h3'
															size='sm'
															style={{ color: 'black', opacity: '0.6' }}
														>
															Age
														</Heading>
														<Input
															onChange={(event) => setAge(event.target.value)}
															size='md'
															style={{
																fill: 'white',
																marginTop: '0.5rem',
																background: 'white',
																color: 'black',
															}}
														/>
														<Stack>
															<Heading
																marginTop='0.5rem'
																as='h3'
																size='sm'
																style={{ color: 'black', opacity: '0.6' }}
															>
																Select an image
															</Heading>
															<input
																onChange={(event) => {
																	setKidPicture(event.target.files[0]);
																}}
																type='file'
																class='form-control'
																id='customFile'
																accept='image/*'
															></input>
														</Stack>
													</ModalBody>

													<ModalFooter>
														<Button mr={3} onClick={onClose}>
															CANCEL
														</Button>
														<Button
															colorScheme='blue'
															mr={3}
															onClick={() => {
																createKid();
															}}
														>
															CONFIRM CHANGES
														</Button>
													</ModalFooter>
												</ModalContent>
											</Modal>
										</TabPanel>
										<TabPanel>
											<Comments id={id} isOwner />
										</TabPanel>
										<TabPanel>
											<PlacesSmall id={id} isOwner />
										</TabPanel>
									</TabPanels>
								</Tabs>
							</Box>
						</GridItem>
					</Grid>
				</Box>
			) : (
				<Box textAlign='center' marginTop='50vh'>
					<Spinner
						thickness='4px'
						speed='0.65s'
						emptyColor='gray.200'
						color={'orange'}
						size='xl'
					/>
				</Box>
			)}
		</Box>
	);
}

export default ProfileEditView;
