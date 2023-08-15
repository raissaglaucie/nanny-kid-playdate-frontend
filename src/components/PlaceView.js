import {
	Box,
	Heading,
	Spinner,
	Badge,
	Image,
	Divider,
	Button,
} from '@chakra-ui/react';
import { Text } from '@chakra-ui/react';
import { FaHeart } from 'react-icons/fa';
import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import MainNavBar from '../components/MainNavBar';
import { useNavigate } from 'react-router-dom';

function PlaceView() {
	const { id } = useParams();
	const [place, setPlace] = useState([]);
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

	const doesLike = () => {
		setLoading(true);
		axios
			.get(
				`https://nanny-kid-playdate-backend.onrender.com/profiles/places/doeslike/${id}/`,
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

	const likePlace = async () => {
		axios
			.patch(
				`https://nanny-kid-playdate-backend.onrender.com/profiles/places/${id}/like/`,
				null,
				config
			)
			.then(() => {
				setIsLiked(true);
				setLikes(likes + 1);
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
				setLikes(likes - 1);
			})
			.catch((err) => {
				if (err.response.status == 401) navigate('/login');
			});
	};

	const getPlace = () => {
		setLoading(true);
		axios
			.get(
				`https://nanny-kid-playdate-backend.onrender.com/profiles/places/${id}/`
			)
			.then((res) => {
				console.log('Got response of ', res);
				setPlace(res.data);
				setLikes(res.data.likes.length);
				setLoading(false);
			})
			.catch((err) => {
				if (err.response.status == 401) navigate('/login');
			});
	};

	useEffect(() => {
		getPlace();
		if (!isOwner) {
			doesLike();
		}
	}, [window.location.pathname]);

	return (
		<Box>
			<MainNavBar />
			{!loading ? (
				<Box
					display='flex'
					flexDirection='column'
					alignItems='center'
					justifyContent='center'
					minHeight='100vh'
					paddingX='20px'
				>
					<Box width='100%' maxWidth='900px'>
						<Heading
							mt='1'
							as='h1'
							size='3xl'
							color='#FFC107'
							marginBottom='10px'
							fontWeight='bold'
						>
							{place.title}
						</Heading>
						<Text marginLeft='6%' color='grey' fontStyle='italic'>
							Posted on {new Date(place.publish_timestamp).toDateString()}
						</Text>
						<Badge marginLeft='6%' bg={'#0097A7'} color='white'>
							{likes} Likes
						</Badge>

						<Image
							marginLeft='5%'
							borderRadius='0.5rem'
							height='400px'
							marginTop='1.4rem'
							src={place.place_pic}
						/>

						<Text color='black' fontSize='xl' maxWidth='90%' marginLeft='5%'>
							{place.contents}
						</Text>
						<Divider />
						<Button
							marginLeft='5%'
							mt='5'
							mb='2'
							leftIcon={<FaHeart />}
							background={'#FFA000'}
							color='white'
							variant='solid'
							_hover={{ opacity: '0.7' }}
							onClick={() => (isLiked ? unLikePlace() : likePlace())}
						>
							{isLiked ? 'UNLIKE' : 'LIKE'}
						</Button>
					</Box>
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

export default PlaceView;
