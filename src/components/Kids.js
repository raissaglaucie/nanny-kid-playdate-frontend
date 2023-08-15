import { Box, Flex, Spinner, Center } from '@chakra-ui/react';
import axios from 'axios';
import React, { useState, useEffect } from 'react';
import Kid from '../components/Kid';
import Pagination from '../components/Pagination';
import { useNavigate } from 'react-router-dom';

let PageSize = 10;

function Kids({ prof_id, isOwner }) {
	const [currentPage, setCurrentPage] = useState(1);
	const [kidsReq, setKidsReq] = useState([]);
	const [loading, setLoading] = useState(false);
	const [kid, setKid] = useState(false);
	const navigate = useNavigate();

	const getKids = (searchUrl) => {
		setLoading(true);
		axios
			.get(searchUrl)
			.then((res) => {
				setKidsReq(res.data);
				setLoading(false);
			})
			.catch((err) => {
				if (err.response.status == 401) navigate('/login');
			});
	};

	useEffect(() => {
		if (currentPage) {
			getKids(
				`https://nanny-kid-playdate-backend.onrender.com/profiles/${prof_id}/kids/items/?page=${currentPage}`
			);
		} else {
			getKids(
				`https://nanny-kid-playdate-backend.onrender.com/profiles/${prof_id}/kids/items/`
			);
		}
	}, [currentPage, kid]);

	return (
		<Box>
			{!loading ? (
				<Box h='280px' overflowY='scroll'>
					<Flex wrap='wrap' gap='1.5rem' mt='1.2rem'>
						{kidsReq.count > 0 &&
							kidsReq.results.map((kid) => (
								<Kid
									key={kid.id}
									isOwner={isOwner}
									id={kid.id}
									name={kid.name}
									description={kid.description}
									kidImg={kid.picture}
									age={kid.age}
									prof_id={prof_id}
									setKid={setKid}
								/>
							))}
					</Flex>
					<Center marginBottom='0.5rem' marginTop='0.5rem' marginRight='30%'>
						{kidsReq.count > 0 && (
							<Pagination
								className='pagination-bar'
								currentPage={currentPage}
								totalCount={kidsReq.count}
								pageSize={PageSize}
								onPageChange={(page) => setCurrentPage(page)}
							/>
						)}
					</Center>
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

export default Kids;
