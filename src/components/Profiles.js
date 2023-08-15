import { Box, Flex, Heading, Spinner, Center, Text } from '@chakra-ui/react';
import ProfileCard from '../components/ProfileCard';
import Pagination from '../components/Pagination';
import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import SearchNavBar from '../components/SearchNavBar';

let PageSize = 10;

function Profiles() {
	const navigate = useNavigate();
	const search = useLocation().search;
	const [profilesReq, setProfilesReq] = useState([]);
	const [loading, setLoading] = useState(false);

	const getProfiles = (searchUrl) => {
		setLoading(true);
		axios
			.get(searchUrl)
			.then((res) => {
				setProfilesReq(res.data);
				setLoading(false);
			})
			.catch((err) => {
				if (err.response.status == 401) navigate('/login');
			});
	};

	const [currentPage, setCurrentPage] = useState(1);

	useEffect(() => {
		const filterType = new URLSearchParams(search).get('type');
		let searchUrl;

		if (filterType) {
			searchUrl = `https://nanny-kid-playdate-backend.onrender.com/profiles/search/?${filterType}=${new URLSearchParams(
				search
			).get(filterType)}`;
			if (currentPage > 1) {
				searchUrl = searchUrl.concat(`&?page=${currentPage}`);
			}
		} else {
			searchUrl =
				'https://nanny-kid-playdate-backend.onrender.com/profiles/search/';
			if (currentPage > 1) {
				searchUrl = searchUrl.concat(`?page=${currentPage}`);
			}
		}

		getProfiles(searchUrl);
	}, [currentPage, search]);

	return (
		<Box>
			<SearchNavBar />
			{!loading ? (
				<Box
					style={{
						marginLeft: '2rem',
						width: '82%',
						margin: 'auto',
						marginTop: '2rem',
						display: 'flex',
						flexDirection: 'column',
						alignItems: 'center',
						justifyContent: 'center',
					}}
				>
					<Heading
						as='h3'
						size='lg'
						style={{ color: '#FFA000', margin: '1rem 0' }}
					>
						NANNIES
					</Heading>

					{profilesReq.count > 0 ? (
						<Flex justify='center' wrap='wrap' gap='1rem'></Flex>
					) : (
						<Center>
							<Text color={'#FFA000'} fontSize='5xl' marginTop='35vh'>
								NOTHING TO SHOW
							</Text>
						</Center>
					)}

					<Box
						id='profiles'
						style={{
							marginTop: '2rem',
							height: '70vh',
						}}
					>
						<Flex style={{ flexWrap: 'wrap' }} gap='0.5rem'>
							{profilesReq.count > 0 &&
								profilesReq.results.map((profile, index) => (
									<ProfileCard
										key={index}
										id={profile.id}
										title={profile.name}
										likes={profile.likes.length}
										profile_pic={profile.profile_pic}
									/>
								))}
						</Flex>
						<Center marginBottom='25px'>
							{profilesReq.count > 0 && (
								<Pagination
									className='pagination-bar'
									currentPage={currentPage}
									totalCount={profilesReq.count}
									pageSize={PageSize}
									onPageChange={(page) => setCurrentPage(page)}
								/>
							)}
						</Center>
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

export default Profiles;
