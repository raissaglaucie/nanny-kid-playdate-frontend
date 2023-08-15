import React from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useState, useEffect } from 'react';
import { Box, Text, Stack, Spinner } from '@chakra-ui/react';
import MainNavBar from './MainNavBar';
import PlaceLarge from './PlaceLarge';

const Feed = () => {
	const [place, setPlace] = useState({});
	const [totalPlaces, setTotalPlaces] = useState(0);
	const [loading, setLoading] = useState(true);
	const navigate = useNavigate();

	const config = {
		headers: {
			Authorization: `Bearer ${window.sessionStorage.getItem('token')}`,
		},
	};

	useEffect(() => {
		axios
			.get(
				`https://nanny-kid-playdate-backend.onrender.com/profiles/places/feed/`,
				config
			)
			.then((respond) => {
				setPlace(respond.data.results);
				setTotalPlaces(respond.data.count);
				setLoading(false);
			})
			.catch((err) => {
				if (err.response.status == 401) {
					navigate('/login');
					alert('User Validation Failed. Please Login.');
				}
			});
	}, []);

	return (
		<Box>
			<MainNavBar />

			{totalPlaces > 0 ? (
				!loading ? (
					<Box marginLeft='20%'>
						<Stack mt='2%' ml='1.5%' mr='1.5%'>
							{place.map((thisPlace) => (
								<PlaceLarge key={thisPlace.id} thisPlace={thisPlace} />
							))}
						</Stack>
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
				)
			) : (
				<Box textAlign='center' marginTop='40vh'>
					<Text color='#FFA000' fontSize='5xl'>
						Nothing to show
					</Text>
				</Box>
			)}
		</Box>
	);
};

export default Feed;
