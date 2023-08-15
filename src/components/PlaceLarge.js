import {
	Box,
	Stack,
	Text,
	Flex,
	Image,
	HStack,
	Button,
} from '@chakra-ui/react';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaHeart, FaTrashAlt } from 'react-icons/fa';
import axios from 'axios';

function PlaceLarge(props) {
	const navigate = useNavigate();

	const place = props.thisPlace;
	const title = place.title;
	const contents = place.contents;
	const place_pic = place.place_pic;
	const id = place.id;
	const prof_id = place.profile_id;
	const likes = place.likes.length;
	var timestamp = place.publish_timestamp.substring(0, 10);

	const [loading, setLoading] = useState(true);
	const [profName, setProfName] = useState({});
	const [isLiked, setIsLiked] = useState(false);
	const [liked, setLikes] = useState(likes);

	const config = {
		headers: {
			Authorization: `Bearer ${window.sessionStorage.getItem('token')}`,
		},
	};

	// Source: https://jasonwatmore.com/post/2020/01/27/react-fetch-http-get-request-examples
	useEffect(() => {
		// GET request using fetch inside useEffect React hook
		function fetchProf() {
			fetch(
				`https://nanny-kid-playdate-backend.onrender.com/profiles/info/${prof_id}/`,
				{
					method: 'GET',
				}
			)
				.then((response) => response.json())
				.then((json) => {
					setProfName(json.name);
					setLoading(false);
				})
				.finally(
					axios
						.get(
							`https://nanny-kid-playdate-backend.onrender.com/profiles/places/doeslike/${id}/`,
							config
						)
						.then((res) => {
							setIsLiked(res.data.is_liked);
						})
						.catch((err) => {
							if (err.response.status == 401) navigate('/login');
						})
				);
		}
		fetchProf();
	}, []);

	// Set Likes in real time
	const getLikes = async () => {
		axios
			.get(
				`https://nanny-kid-playdate-backend.onrender.com/profiles/places/${id}/`,
				null
			)
			.then((res) => {
				setLikes(res.data.likes.length);
			})
			.catch((err) => {
				if (err.response.status == 401) navigate('/login');
			});
	};

	const likePlace = async () => {
		axios
			.patch(
				`https://nanny-kid-playdate-backend.onrender.com/profiles/places/${id}/like/`,
				null,
				config
			)
			.then(() => {
				setIsLiked(true);
				getLikes();
			})
			.catch((err) => {
				if (err.response.status == 401) navigate('/login');
			});
	};

	const unLikePlace = async () => {
		axios
			.patch(
				`https://nanny-kid-playdate-backend.onrender.com/profiles/places/${id}/unlike/`,
				null,
				config
			)
			.then(() => {
				setIsLiked(false);
				getLikes();
			})
			.catch((err) => {
				if (err.response.status == 401) navigate('/login');
			});
	};

	return (
		<Box>
			{!loading ? (
				<Box
					boxShadow='lg'
					background='#EFFAFF'
					borderRadius='lg'
					p='1rem'
					width={['100%', '80%']}
				>
					<Flex justifyContent='space-between'>
						<Stack w='70%'>
							<Text color='#0097A7' fontSize='xl' fontWeight='bold' mb='0.5rem'>
								{title}
							</Text>

							<Stack w='45%'>
								<Flex style={{ marginLeft: '2rem' }}>
									<Box w='40%'>
										<Button
											color='#0097A7'
											size='sm'
											width='100px'
											height='22px'
										>
											Posted By:{' '}
										</Button>
									</Box>
									<Box w='60%'>
										<Text color='#0097A7'>{profName} </Text>
									</Box>
								</Flex>

								<Flex style={{ marginLeft: '2rem' }}>
									<Box w='40%'>
										<Button
											color='#0097A7'
											size='sm'
											width='100px'
											height='22px'
											marginRight='2rem'
										>
											Date:{' '}
										</Button>
									</Box>
									<Box w='60%'>
										<Text color='#0097A7'>{timestamp} </Text>
									</Box>
								</Flex>

								<Flex style={{ marginLeft: '2rem' }}>
									<Box w='40%'>
										<Button
											color='#0097A7'
											size='sm'
											width='100px'
											height='22px'
										>
											Like:{' '}
										</Button>
									</Box>
									<Box w='60%'>
										<Text color='#0097A7'>{liked} </Text>
									</Box>
								</Flex>
							</Stack>

							<Flex>
								<Text
									isTruncated
									color='#0097A7'
									fontSize='lg'
									maxWidth='130vh'
									style={{ marginLeft: '2rem' }}
								>
									{contents}
								</Text>
							</Flex>

							<HStack style={{ marginTop: '1.5rem' }}>
								<Button
									bg='#FFA000'
									color='white'
									_hover={{ opacity: '0.9' }}
									onClick={() => navigate(`/places/${id}`)}
								>
									READ MORE
								</Button>
								<Button
									leftIcon={<FaHeart />}
									bg='#FFA000'
									color='white'
									_hover={{ opacity: '0.9' }}
									onClick={() => (isLiked ? unLikePlace() : likePlace())}
								>
									{isLiked ? 'UNLIKE' : 'LIKE'}
								</Button>
							</HStack>
						</Stack>

						<Flex
							w='30%'
							maxWidth='30%'
							maxHeight='30%'
							style={{
								position: 'relative',
								borderRadius: '1rem',
								overflow: 'hidden',
							}}
						>
							<Image
								src={place_pic}
								style={{ width: '100%', height: '100%', objectFit: 'cover' }}
							/>
						</Flex>
					</Flex>
				</Box>
			) : (
				<></>
			)}
		</Box>
	);
}

export default PlaceLarge;
