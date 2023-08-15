import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { useState, useEffect } from 'react';
import {
	Box,
	Flex,
	Spinner,
	Text,
	Center,
	FormLabel,
	FormControl,
	Input,
	Textarea,
	Button,
} from '@chakra-ui/react';
import MainNavBar from '../components/MainNavBar';

const PlaceCreate = () => {
	const { id } = useParams();
	const [userProfile, setuserProfile] = useState([]);
	const [loading, setLoading] = useState(false);

	const initState = {
		title: '',
		contents: '',
		thumbnail: '',
	};
	const [formValue, setFormValue] = useState(initState);
	const [selectedImageName, setSelectedImageName] = useState('');
	const [formErr, setFormErr] = useState({});
	const [isSubmit, setIsSubmit] = useState(false);
	const navigate = useNavigate();

	const config = {
		headers: {
			Authorization: `Bearer ${window.sessionStorage.getItem('token')}`,
		},
	};
	const handleChange = (e) => {
		if (e.target.type === 'file') {
			setFormValue({ ...formValue, [e.target.name]: e.target.files[0] });
			setuserProfile({
				...userProfile,
				[e.target.name]: URL.createObjectURL(e.target.files[0]),
			});
			setSelectedImageName(e.target.files[0]?.name || '');
		} else {
			const { name, value } = e.target;
			setFormValue({ ...formValue, [name]: value });
		}
	};

	const handleSubmit = (e) => {
		setLoading(true);
		e.preventDefault();
		setFormErr(validation(formValue));
		setIsSubmit(true);
	};

	useEffect(() => {
		if (Object.keys(formErr).length === 0 && isSubmit) {
			const fd = new FormData();
			fd.append('_method', 'POST');
			if (formValue.name !== '') {
				fd.append('title', formValue.title);
			}

			if (formValue.thumbnail !== '') {
				fd.append('place_pic', formValue.thumbnail);
			}

			if (formValue.contents !== '') {
				fd.append('contents', formValue.contents);
			}

			// Validated now send the request
			axios
				.post(
					`https://nanny-kid-playdate-backend.onrender.com/profiles/${id}/places/new/`,
					fd,
					config
				)
				.then((res) => {
					navigate(`/profiles/${id}`);
					setLoading(false);
				})
				.catch((error) => {
					if (error.response.status === 401) {
						navigate('/login');
						alert('User Validation Failed. Please Login.');
					}
					if (!error.response.data.id) {
						if (error.response.data.title) {
							setFormErr((formErr) => ({
								...formErr,
								title: error.response.data.title,
							}));
						}
						if (error.response.data.contents) {
							setFormErr((formErr) => ({
								...formErr,
								contents: error.response.data.contents,
							}));
						}
						if (error.response.data.thumbnail) {
							setFormErr((formErr) => ({
								...formErr,
								place_pic: error.response.data.place_pic,
							}));
							alert('Thumbnail Upload Failed.');
						}
					}
					console.log(error.response);
				});
		}
	}, [formErr]);

	const validation = (formValue) => {
		const errors = {};
		return errors;
	};

	// Check if the user currently owns a profile.
	// Use an axios API request to  http://127.0.0.1:8000/profiles/owned/
	// If yes, redirect to the profile page.
	// If no, render the form.

	useEffect(() => {
		axios
			.get(
				`https://nanny-kid-playdate-backend.onrender.com/profiles/owned/`,
				config
			)
			.then((res) => {
				console.log('navigating... to id ');
			})
			.catch((err) => {
				console.log(err);
				if (err.response.status === 401) {
					navigate('/login');
					alert('User Validation Failed. Please Login.');
				} else if (err.response.status === 404) {
					console.log(err.response);
				}
			});
	}, []);

	return !loading ? (
		<Box>
			<MainNavBar />

			<FormControl className='profForm' onSubmit={handleSubmit}>
				<Flex>
					<Center>
						<Box w='100%' class='idCard'>
							<Box>
								<Center>
									<Box>
										<Text as='abbr' fontSize='2xl' color={'black'}></Text>
									</Box>
								</Center>
							</Box>
						</Box>
					</Center>

					<Box w='50%'>
						<h4 className='profileTitle'>ADD A PLACE THAT YOU VISITED</h4>
						<Center></Center>
						<Box w='50.5%'>
							<FormLabel
								htmlFor='title'
								className='profLabel'
								color='#FFA000'
								fontSize='24px'
							>
								Title
							</FormLabel>
						</Box>
						<Flex>
							<Center w='100%'>
								<Input
									placeholder='The name of the place'
									id='title'
									name='title'
									onChange={handleChange}
								/>
							</Center>
						</Flex>

						<Flex>
							<Box w='49.5%'>
								<p>{formErr.name}</p>
							</Box>
							<Box w='1%'></Box>
						</Flex>

						<FormLabel
							htmlFor='thumbnail'
							className='profLabel'
							color='#FFA000'
							fontSize='24px'
						>
							Chose a picture
						</FormLabel>
						<Button
							className='transButton'
							name='avatar'
							colorScheme='transparent'
							size='md'
						>
							<input
								type='file'
								name='thumbnail'
								color='black'
								id='submitButton'
								accept='image/*'
								onChange={handleChange}
							/>
						</Button>
						{selectedImageName && <p> {selectedImageName}</p>}
						<FormLabel
							htmlFor='contents'
							className='profLabel'
							color='#FFA000'
							fontSize='24px'
						>
							Description
						</FormLabel>
						<Textarea
							placeholder='Write description of the place here'
							id='contents'
							name='contents'
							onChange={handleChange}
							maxHeight='20%'
						/>
						<p>{formErr.email}</p>

						<Center>
							<Button
								style={{ marginTop: '60px' }}
								type='submit'
								width='100%'
								background={'#00BCD4'}
								color='white'
								variant='solid'
								_hover={{ opacity: '0.9' }}
								onClick={handleSubmit}
							>
								POST A PLACE
							</Button>
						</Center>
					</Box>
				</Flex>
			</FormControl>
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
	);
};

export default PlaceCreate;
