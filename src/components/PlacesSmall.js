import {
	Box,
	Spinner,
	Button,
	Center,
	Stack,
	Text,
	HStack,
} from '@chakra-ui/react';
import axios from 'axios';
import React, { useState, useEffect } from 'react';
import Pagination from '../components/Pagination';
import { useNavigate } from 'react-router-dom';
import * as constants from '../utils/constants';
import PlaceSmall from './PlaceSmall';
import { FaPlusCircle } from 'react-icons/fa';

function Comments({ id, isOwner }) {
	const [currentPage, setCurrentPage] = useState(1);
	const [placesReq, setPlacesReq] = useState([]);
	const [loading, setLoading] = useState(false);
	const [place, setPlace] = useState(null);
	const navigate = useNavigate();

	const getPlaces = (searchUrl) => {
		setLoading(true);
		axios
			.get(searchUrl)
			.then((res) => {
				setPlacesReq(res.data);
				setLoading(false);
			})
			.catch((err) => {
				if (err.response.status == 401) navigate('/login');
			});
	};

	useEffect(() => {
		if (currentPage) {
			getPlaces(
				`https://nanny-kid-playdate-backend.onrender.com/profiles/${id}/places/?page=${currentPage}`
			);
		} else {
			getPlaces(
				`https://nanny-kid-playdate-backend.onrender.com/profiles/${id}/places/`
			);
		}
	}, [currentPage, place]);

	return (
		<Box>
			{isOwner && (
				<HStack ml='2'>
					<Button
						rightIcon={<FaPlusCircle />}
						onClick={() => navigate(`/profiles/${id}/places/create`)}
						style={{ marginTop: '.5rem' }}
						colorScheme='teal'
						variant='outline'
					>
						POST A PLACE
					</Button>
				</HStack>
			)}

			{placesReq.count > 0 ? (
				!loading ? (
					<Box>
						<Box
							overflowY={placesReq.count > 3 ? 'scroll' : 'none'}
							h='70vh'
							mt='1'
						>
							<Stack mt='1.2rem' ml='2' mr='2'>
								{placesReq.count > 0 &&
									placesReq.results.map((place) => (
										<PlaceSmall
											key={place.id}
											title={place.title}
											contents={place.contents}
											place_pic={place.place_pic}
											id={place.id}
											setPlace={setPlace}
											isOwner={isOwner}
										/>
									))}
								<Center
									marginBottom='0.5rem'
									marginTop='0.5rem'
									marginRight='30%'
								>
									{placesReq.count > 0 && (
										<Pagination
											className='pagination-bar'
											currentPage={currentPage}
											totalCount={placesReq.count}
											pageSize={constants.pageSize}
											onPageChange={(page) => setCurrentPage(page)}
										/>
									)}
								</Center>
							</Stack>
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
				)
			) : (
				<Center>
					<Stack>
						<Text color='#FFA000' fontSize='5xl' marginTop='30vh'>
							NOTING TO SHOW
						</Text>
					</Stack>
				</Center>
			)}
		</Box>
	);
}

export default Comments;
