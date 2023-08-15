import { Box, Image, Stack } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';

/* Used https://chakra-ui.com/docs/components/layout/box as a reference*/
function ProfileCard({ profile_pic, title, likes, id }) {
	const navigate = useNavigate();
	const [likesState, setLikesState] = useState(likes);
	const config = {
		headers: {
			Authorization: `Bearer ${window.sessionStorage.getItem('token')}`,
		},
	};

	const property = {
		profile_pic: profile_pic,
		title: title,
	};

	return (
		<Stack marginBottom='1rem'>
			<Box
				background='#00BCD4'
				boxShadow='xl'
				maxW='350px'
				maxHeight='450px'
				borderWidth='1px'
				borderRadius='lg'
				overflow='hidden'
				style={{ cursor: 'pointer' }}
				_hover={{ transform: 'scale(1.02)' }}
				onClick={() => navigate(`/profiles/${id}`)}
			>
				<Box
					height='240px'
					width='240px' // Set the width and height of the wrapper box
					margin='25px'
					borderRadius='full' // Makes the wrapper box rounded
					overflow='hidden' // Hides any overflow from the image
				>
					<Image
						src={property.profile_pic}
						alt='Profile Pic'
						width='100%' // Maintain aspect ratio
					/>
				</Box>
				<Box p='6'>
					<Box display='flex' alignItems='baseline'></Box>
					<Box
						mt='1'
						fontWeight='semibold'
						as='h1'
						lineHeight='tight'
						isTruncated
						fontSize='30px'
						color='white'
						align='center'
					>
						{property.title}
					</Box>
					<Box display='flex' mt='2' alignItems='center'>
						<Box
							as='span'
							ml='2'
							color='white'
							fontSize='md'
							style={{
								padding: '4px',
								borderRadius: '4px',
								textShadow: '0 0 2px #FFA000',
							}}
						>
							{likesState} LIKES
						</Box>
					</Box>
				</Box>
			</Box>
		</Stack>
	);
}

export default ProfileCard;
