import {
	Box,
	Tab,
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
	GridItem,
	Stack,
} from '@chakra-ui/react';
import { FaHeart, FaUserFriends } from 'react-icons/fa';

import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import MainNavBar from '../components/MainNavBar';
import Kids from '../components/Kids';
import Comments from '../components/Comments';
import PlacesSmall from '../components/PlacesSmall';
import { useNavigate } from 'react-router-dom';

function ProfileView() {
	const { id } = useParams();
	const [profile, setProfile] = useState([]);
	const [followers, setFollowers] = useState(0);
	const [isFollowing, setIsFollowing] = useState(false);
	const [likes, setLikes] = useState(0);
	const [isLiked, setIsLiked] = useState(false);
	const [loading, setLoading] = useState(false);
	const [isOwner, setIsOwner] = useState(false);
	const config = {
		headers: {
			Authorization: `Bearer ${window.sessionStorage.getItem('token')}`,
		},
	};
	const navigate = useNavigate();

	const followProfile = async () => {
		axios
			.patch(
				`https://nanny-kid-playdate-backend.onrender.com/profiles/${id}/follow/`,
				null,
				config
			)
			.then(() => {
				setFollowers(followers + 1);
				setIsFollowing(true);
			})
			.catch((err) => {
				if (err.response.status == 401) navigate('/login');
			});
	};

	const unFollowProfile = async () => {
		axios
			.patch(
				`https://nanny-kid-playdate-backend.onrender.com/profiles/${id}/unfollow/`,
				null,
				config
			)
			.then(() => {
				setFollowers(followers - 1);
				setIsFollowing(false);
			})
			.catch((err) => {
				if (err.response.status == 401) navigate('/login');
			});
	};

	const doesFollow = () => {
		setLoading(true);
		axios
			.get(
				`https://nanny-kid-playdate-backend.onrender.com/profiles/doesfollow/${id}/`,
				config
			)
			.then((res) => {
				setIsFollowing(res.data.is_followed);
				console.log(`follows? ${res.data.is_followed}`);
				setLoading(false);
			})
			.catch((err) => {
				if (err.response.status == 401) navigate('/login');
			});
	};

	const likeProfile = async () => {
		axios
			.patch(
				`https://nanny-kid-playdate-backend.onrender.com/profiles/${id}/like/`,
				null,
				config
			)
			.then(() => {
				setLikes(likes + 1);
				setIsLiked(true);
			})
			.catch((err) => {
				if (err.response.status == 401) navigate('/login');
			});
	};

	const unLikeProfile = async () => {
		axios
			.patch(
				`https://nanny-kid-playdate-backend.onrender.com/profiles/${id}/unlike/`,
				null,
				config
			)
			.then(() => {
				setLikes(likes - 1);
				setIsLiked(false);
			})
			.catch((err) => {
				if (err.response.status == 401) navigate('/login');
			});
	};

	const doesLike = () => {
		setLoading(true);
		axios
			.get(
				`https://nanny-kid-playdate-backend.onrender.com/profiles/doeslike/${id}/`,
				config
			)
			.then((res) => {
				setIsLiked(res.data.is_liked);
				setLoading(false);
			})
			.catch((err) => {
				if (err.response.status == 401) navigate('/login');
			});
	};

	const getOwnedProfile = () => {
		setLoading(true);
		axios
			.get(
				'https://nanny-kid-playdate-backend.onrender.com/profiles/owned/',
				config
			)
			.then((res) => {
				console.log(res.data.id == id);
				if (res.data.id == id) {
					setIsOwner(true);
				}
				setLoading(false);
			})
			.catch((err) => {
				if (err.response.status == 401) navigate('/login');
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
				setFollowers(res.data.followers.length);
				setLikes(res.data.likes.length);
				setLoading(false);
			})
			.catch((err) => {
				if (err.response.status == 401) navigate('/login');
			});
	};

	useEffect(() => {
		getProfile();
		getOwnedProfile();

		if (!isOwner) {
			doesFollow();
			doesLike();
		}
	}, [window.location.pathname]);

	return (
		<Box>
			<MainNavBar />
			{!loading ? (
				<Box
					style={{
						marginLeft: '2rem',
						height: '100vh',
						margin: 'auto',
						marginTop: '1rem',
						background: 'white',
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
								</Heading>
								<Box
									style={{
										marginTop: '2rem',
										display: 'flex',
										justifyContent: 'center',
										alignItems: 'center',
										height: '250px',
										width: '250px',
										margin: '25px auto',
										borderRadius: '50%',
										overflow: 'hidden',
									}}
								>
									<Image
										alt='Profile Pic'
										width='100%'
										src={profile.profile_pic}
									/>
								</Box>

								{isOwner ? (
									<Button
										style={{ marginTop: '60px' }}
										background={'#00BCD4'}
										color='white'
										opacity='1'
										variant='solid'
										_hover={{ opacity: '0.7' }}
										onClick={() => {
											navigate(`/profiles/${id}/edit`);
										}}
									>
										EDIT PROFILE
									</Button>
								) : (
									<Stack>
										<Button
											style={{ marginTop: '6rem' }}
											background={!isFollowing ? '#FFA000' : '#FFC107'}
											color='white'
											opacity='1'
											variant='solid'
											_hover={{ opacity: '0.9' }}
											onClick={() => {
												isFollowing ? unFollowProfile() : followProfile();
											}}
										>
											{isFollowing ? 'Unfollow' : 'Follow'}
										</Button>
										<Button
											leftIcon={<FaHeart />}
											background={!isLiked ? '#0097A7' : '#00BCD4'}
											color='white'
											opacity='1'
											variant='solid'
											_hover={{ opacity: 'O.9' }}
											onClick={() => {
												isLiked ? unLikeProfile() : likeProfile();
											}}
										>
											{isLiked ? 'Unlike' : 'Like'}
										</Button>
									</Stack>
								)}
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
											<TagLabel marginLeft='0.5rem' color='wblack'>
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
										<TabPanel>
											<Stack>
												<Box>
													<Heading
														marginTop='0.5rem'
														as='h3'
														size='md'
														style={{ color: '#0097A7' }}
													>
														Name
													</Heading>
													<Heading
														marginTop='0.5rem'
														as='h3'
														size='xl'
														style={{
															color: '#black',
															marginLeft: '1.5rem',
														}}
													>
														{profile.name && profile.name}
													</Heading>
												</Box>
												<Box>
													<Heading
														marginTop='0.5rem'
														as='h3'
														size='md'
														style={{ color: '#0097A7' }}
													>
														Address
													</Heading>
													<Heading
														marginTop='0.5rem'
														as='h3'
														size='xl'
														style={{
															color: '#black',
															marginLeft: '1.5rem',
														}}
													>
														{profile.address && profile.address}
													</Heading>
												</Box>
												<Box>
													<Heading
														marginTop='0.5rem'
														as='h3'
														size='md'
														style={{ color: '#0097A7' }}
													>
														Postal Code
													</Heading>
													<Heading
														marginTop='0.5rem'
														as='h3'
														size='xl'
														style={{
															color: 'black',
															marginLeft: '1.5rem',
														}}
													>
														{profile.postal_code && profile.postal_code}
													</Heading>
												</Box>
												<Box>
													<Heading
														marginTop='0.5rem'
														as='h3'
														size='md'
														style={{ color: '#0097A7' }}
													>
														Phone Number
													</Heading>
													<Heading
														marginTop='0.5rem'
														as='h3'
														size='xl'
														style={{
															color: 'black',
															marginLeft: '1.5rem',
														}}
													>
														{profile.phone_num && profile.phone_num}
													</Heading>
												</Box>
												<Box>
													<Heading
														marginTop='0.5rem'
														as='h3'
														size='md'
														style={{ color: '#FFA000' }}
													>
														Kids
													</Heading>
													<Kids prof_id={id} />
												</Box>
											</Stack>
										</TabPanel>
										<TabPanel>
											<Comments id={id} />
										</TabPanel>
										<TabPanel>
											<PlacesSmall id={id} />
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
						color='blue.500'
						size='xl'
					/>
				</Box>
			)}
		</Box>
	);
}

export default ProfileView;
