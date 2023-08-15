import { Box, Stack, Text, Badge, HStack, IconButton } from '@chakra-ui/react';
import React, { useState } from 'react';
import { FaTrashAlt } from 'react-icons/fa';
import axios from 'axios';

/* Used https://chakra-ui.com/docs/components/layout/box as a reference*/
function Comment({
	authorName,
	timestamp,
	contents,
	isOwner,
	setComment,
	prof_id,
	id,
}) {
	const deleteComment = () => {
		const config = {
			headers: {
				Authorization: `Bearer ${window.sessionStorage.getItem('token')}`,
			},
		};

		axios
			.delete(
				`https://nanny-kid-playdate-backend.onrender.com/profiles/${prof_id}/comments/${id}/remove/`,
				config
			)
			.then((res) => {
				// need to trigger reload in menu items
				setComment(res.data);
			})
			.catch((err) => {
				setComment(err.data);
			});
	};

	return (
		<Stack>
			<Box
				background={'#EFFAFF'}
				marginRight='400px'
				boxshadow='2xl'
				borderRadius='lg'
				overflow='hidden'
			>
				<HStack>
					<Badge
						marginTop='1rem'
						marginLeft='1rem'
						bg={'#FFA000'}
						color='#FFFFFF'
						borderRadius='5px'
						fontSize='md'
					>
						{authorName}
					</Badge>
					<Text color='black' size='xs'>
						{new Date(timestamp).toUTCString()}
					</Text>

					{isOwner && (
						<IconButton
							style={{ marginTop: '.5rem' }}
							height='3vh'
							color='#00BCD4'
							icon={<FaTrashAlt />}
							onClick={() => {
								deleteComment();
							}}
						/>
					)}
				</HStack>
				<Text
					color='black'
					marginTop='1rem'
					marginLeft='1rem'
					fontSize='24px'
					fontFamily='sans-serif'
				>
					{contents}
				</Text>
			</Box>
		</Stack>
	);
}

export default Comment;
