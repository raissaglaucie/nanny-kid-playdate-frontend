import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Box, Flex } from '@chakra-ui/react';
import { AlertIcon, AlertTitle, AlertDescription } from '@chakra-ui/react';

import {
	Popover,
	PopoverTrigger,
	PopoverContent,
	PopoverHeader,
	PopoverArrow,
	PopoverCloseButton,
	IconButton,
	Button,
	Alert,
	Center,
	HStack,
} from '@chakra-ui/react';
import { FaBell, FaCircle } from 'react-icons/fa';

function Notification({ style }) {
	const [currentPage, setCurrentPage] = useState(1);
	const [notifReq, setNotifReq] = useState([]);
	const [loading, setLoading] = useState(false);

	const navigate = useNavigate();

	function constructNotificationMessage(notif) {
		let message = '';
		if (notif.type === 'LIKED') {
			message = `${notif.actor_user.username} liked your profile`;
		} else if (notif.type === 'FOLLOWED') {
			message = `${notif.actor_user.username} followed your profile`;
		} else if (notif.type === 'COMMENTED') {
			message = `${notif.actor_user.username} commented on your profile`;
		} else if (notif.type === 'LIKEDPLACE') {
			message = `${notif.actor_user.username} liked your place`;
		} else if (notif.type === 'KIDUPDATE') {
			message = `${notif.profile.name} updated their kid`;
		} else if (notif.type === 'NEWPLACE') {
			message = `${notif.profile.name} posted a new place`;
		} else {
			// should never be reached unless there is a bug
			message = `TODO add message for ${notif.type}`;
		}
		return message;
	}

	const getNotifications = (searchUrl) => {
		const config = {
			headers: {
				Authorization: `Bearer ${window.sessionStorage.getItem('token')}`,
			},
		};

		setLoading(true);
		axios
			.get(searchUrl, config)
			.then((res) => {
				setNotifReq(res.data);
				setLoading(false);
			})
			.catch((err) => {
				if (err.response.status === 401) navigate('/login');
			});
	};

	useEffect(() => {
		if (currentPage) {
			getNotifications(
				`https://nanny-kid-playdate-backend.onrender.com/accounts/notifications/?page=${currentPage}`
			);
		} else {
			getNotifications(
				`https://nanny-kid-playdate-backend.onrender.com/accounts/notifications/`
			);
		}
	}, [currentPage]);

	return (
		<Popover>
			<PopoverTrigger>
				<HStack>
					<IconButton
						variant='link'
						aria-label='notifications'
						style={style}
						icon={
							<FaBell
								style={{ color: 'white', width: '20px', height: '20px' }}
							/>
						}
					/>
					{notifReq.count > 0 && (
						<FaCircle
							fontSize='5px'
							color='red'
							style={{ marginLeft: '-0.8rem', marginTop: '-1rem' }}
						/>
					)}
				</HStack>
			</PopoverTrigger>
			<PopoverContent className='popoverClass'>
				<PopoverHeader>Notifications</PopoverHeader>
				<PopoverArrow />
				<PopoverCloseButton />

				{loading ? (
					<Center></Center>
				) : (
					<Box overflowY='scroll' maxHeight='80vh'>
						{notifReq.count > 0 &&
							notifReq.results.map((notif) => (
								<Alert
									key={notif.id}
									status={notif.viewed ? 'success' : 'info'}
									mb={2}
									cursor='pointer'
									onClick={() => {
										if (!notif.viewed) {
											notif.viewed = true;
											axios
												.delete(
													`https://nanny-kid-playdate-backend.onrender.com/accounts/notifications/delete/${notif.id}/`,
													{
														headers: {
															Authorization: `Bearer ${window.sessionStorage.getItem(
																'token'
															)}`,
														},
													}
												)
												.then((res) => {
													navigate(`/profiles/${notif.profile.id}/`);
												})
												.catch((err) => {
													if (err.response.status === 401) navigate('/login');
												});
										}
										navigate(`/profiles/${notif.profile.id}/`);
									}}
								>
									<AlertIcon />
									<AlertTitle>{constructNotificationMessage(notif)}</AlertTitle>
								</Alert>
							))}
						{notifReq.count === 0 && (
							<Alert status='info'>
								<AlertIcon />
								<AlertTitle>No notifications</AlertTitle>
								<AlertDescription>
									You have no notifications at this time.
								</AlertDescription>
							</Alert>
						)}
						<Flex justify='space-between'>
							{notifReq.next && (
								<Button
									variant='link'
									onClick={() => {
										setCurrentPage(currentPage + 1);
										document.getElementsByClassName('popoverClass')[0].focus();
									}}
								>
									Next
								</Button>
							)}
							{notifReq.previous && (
								<Button
									variant='link'
									onClick={() => {
										setCurrentPage(currentPage - 1);
										document.getElementsByClassName('popoverClass')[0].focus();
										// focus on the notificiation popup element
									}}
								>
									Previous
								</Button>
							)}
						</Flex>
					</Box>
				)}
			</PopoverContent>
		</Popover>
	);
}

export default Notification;
