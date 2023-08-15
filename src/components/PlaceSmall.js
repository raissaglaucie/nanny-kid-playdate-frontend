import {
	Box,
	Text,
	Flex,
	Image,
	HStack,
	Button,
	IconButton,
} from '@chakra-ui/react';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaHeart, FaTrashAlt } from 'react-icons/fa';
import axios from 'axios';

function PlaceSmall({ title, contents, place_pic, id, setPlace, isOwner }) {
	const navigate = useNavigate();

	const deletePlace = () => {
		const config = {
			headers: {
				Authorization: `Bearer ${window.sessionStorage.getItem('token')}`,
			},
		};

		axios
			.delete(
				`https://nanny-kid-playdate-backend.onrender.com/profiles/places/${id}/delete/`,
				config
			)
			.then((res) => {
				// need to trigger reload in menu items
				setPlace(res.data);
			})
			.catch((err) => {
				setPlace(err.response);
			});
	};

	return (
		<Box
			boxShadow='lg'
			background='#EFFAFF'
			borderRadius='lg'
			p='1rem'
			width={['100%', '80%']}
		>
			<Flex alignItems='center' justifyContent='space-between'>
				<Box flex='1'>
					<Text color='#0097A7' fontSize='xl' fontWeight='bold' mb='0.5rem'>
						{title}
					</Text>
					<Text color='#0097A7' fontSize='md' lineHeight='1.5'>
						{contents}
					</Text>
					<HStack spacing='1rem' mt='1rem'>
						<Button
							bg='#FFA000'
							color='white'
							_hover={{ opacity: '0.9' }}
							onClick={() => navigate(`/places/${id}`)}
						>
							READ MORE
						</Button>
						{isOwner && (
							<IconButton
								bg='#FFA000'
								color='white'
								_hover={{ opacity: '0.9' }}
								icon={<FaTrashAlt />}
								onClick={deletePlace}
							/>
						)}
					</HStack>
				</Box>
				<Image
					borderRadius='1rem'
					width='40%'
					height='40%'
					src={place_pic}
					alt={title}
					ml={['0', '1rem']}
					objectFit='cover'
				/>
			</Flex>
		</Box>
	);
}

export default PlaceSmall;
