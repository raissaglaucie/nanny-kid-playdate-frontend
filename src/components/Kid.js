import {
	Box,
	Image,
	Stack,
	Text,
	Badge,
	Flex,
	Input,
	Button,
	Heading,
	Textarea,
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalFooter,
	ModalBody,
	useDisclosure,
	HStack,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import React, { useState } from 'react';

/* Used https://chakra-ui.com/docs/components/layout/box as a reference*/
function Kid({ kidImg, name, description, age, id, isOwner, prof_id, setKid }) {
	const navigate = useNavigate();
	const [isHovering, setIsHovering] = useState(false);
	const { isOpen, onOpen, onClose } = useDisclosure();

	const [kidName, setKidName] = useState(name);
	const [descriptionState, setDescriptionState] = useState(description);
	const [ageState, setAgeState] = useState(age);
	const [kidPicture, setKidPicture] = useState(null);

	const editKid = () => {
		const configModified = {
			headers: {
				Authorization: `Bearer ${window.sessionStorage.getItem('token')}`,
				'content-type': 'multipart/form-data',
			},
		};

		let formData = new FormData();
		if (kidName) formData.append('name', kidName);

		if (ageState) formData.append('age', ageState);

		if (descriptionState) formData.append('description', descriptionState);

		if (kidPicture) formData.append('picture', kidPicture);

		axios
			.patch(
				`https://nanny-kid-playdate-backend.onrender.com/profiles/${prof_id}/kids/${id}/edit/`,
				formData,
				configModified
			)
			.then((res) => {
				// need to trigger reload in menu items
				setKid(res.data);
				onClose();
			})
			.catch((err) => {
				if (err.response.status === 400) {
					alert(
						'Invalid input was provided. Please provide valid input and try again!'
					);
				}
			});
	};

	const deleteKid = () => {
		const config = {
			headers: {
				Authorization: `Bearer ${window.sessionStorage.getItem('token')}`,
			},
		};

		axios
			.delete(
				`https://nanny-kid-playdate-backend.onrender.com/profiles/${prof_id}/kids/${id}/remove/`,
				config
			)
			.then((res) => {
				// need to trigger reload in menu items
				setKid(res.data);
				onClose();
			})
			.catch((err) => {
				setKid(err.data);
				onClose();
			});
	};

	function deployModal() {
		return (
			<>
				<Modal isOpen={isOpen} onClose={onClose}>
					<ModalOverlay />
					<ModalContent>
						<ModalHeader>EDIT KID </ModalHeader>
						<ModalBody>
							<Heading
								marginTop='0.5rem'
								as='h3'
								size='sm'
								style={{ color: 'black', opacity: '0.6' }}
							>
								Kid's Name
							</Heading>
							<Input
								size='md'
								defaultValue={kidName}
								onChange={(event) => setKidName(event.target.value)}
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
								defaultValue={description}
								onChange={(event) => setDescriptionState(event.target.value)}
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
								defaultValue={age}
								onChange={(event) => setAgeState(event.target.value)}
								size='md'
								placeholder='12'
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
									// class='form-control'
									// id='customFile'
									accept='image/*' //PRECISAMOS OLHAR ISSO DEPOIS
								></input>
							</Stack>
						</ModalBody>

						<ModalFooter>
							<Box marginRight='1.5rem'>
								<Button
									mr={3}
									onClick={deleteKid}
									bg='orange'
									color='white'
									_hover={{ transform: 'scale(1.05)' }}
								>
									DELETE
								</Button>
							</Box>
							<HStack>
								<Button
									mr={3}
									onClick={onClose}
									_hover={{ transform: 'scale(1.05)' }}
								>
									CANCEL
								</Button>
								<Button
									colorScheme='cyan'
									color='white'
									mr={3}
									_hover={{ transform: 'scale(1.05)' }}
									onClick={() => {
										editKid();
									}}
								>
									SAVE CHANGES
								</Button>
							</HStack>
						</ModalFooter>
					</ModalContent>
				</Modal>
			</>
		);
	}

	return (
		<Stack>
			<Box
				background={'#00BCD4'}
				padding='15px'
				maxW='450px'
				minWidth='450px'
				maxHeight='250px'
				// minHeight="260px"
				// borderWidth="1px"
				borderRadius='lg'
				overflow='hidden'
				_hover={{ transform: 'scale(1.01)' }}
				cursor={isOwner ? 'pointer' : 'default'}
				onMouseEnter={() => setIsHovering(true)}
				onMouseLeave={() => setIsHovering(false)}
				onClick={() => {
					if (isOwner) {
						// alert("gi");
						onOpen();
						// setIsClicked(true);
					}
				}}
			>
				<Flex>
					<Image
						style={{ marginTop: 'auto' }}
						borderRadius='full'
						boxSize='150px'
						marginTop='1.4rem'
						src={kidImg}
						ml='3'
						mb='3'
						objectFit='cover' // Add this line
					/>

					<Box ml='3'>
						{/* <Badge
							mt='4'
							bg={colors.blue.medium}
							color='white'
							borderRadius='5px'
						>
							Kid Name
						</Badge> */}
						<Text
							fontSize='xl'
							isTruncated
							fontWeight='bold'
							color='white'
							// fontSize='sm'
						>
							{name}
						</Text>
						{/* <Badge bg={colors.blue.medium} color='white' borderRadius='5px'>
							Description
						</Badge> */}
						<Text maxW='240px' color='white' fontSize='sm'>
							{description}
						</Text>
						<Badge bg={'#FFA000'} color='white' borderRadius='5px'>
							Age
						</Badge>
						<Text maxW='240px' color='white' fontSize='sm'>
							{age}
						</Text>
					</Box>
				</Flex>
			</Box>
			{isOwner && isHovering && (
				<Box bg='orange' opacity='0.6'>
					<Text color='white' marginLeft='40%'>
						EDIT
					</Text>
				</Box>
			)}
			){deployModal()}
		</Stack>
	);
}

export default Kid;
