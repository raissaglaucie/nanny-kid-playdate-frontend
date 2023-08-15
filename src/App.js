import { Route, Routes, BrowserRouter } from 'react-router-dom';
import Profiles from './components/Profiles';
import { ChakraProvider, theme } from '@chakra-ui/react';
import ProfileView from './components/ProfileView';
import ProfileEditView from './components/ ProfileEditView';
import Login from './components/Login';
import SignUp from './components/SignUp';
import Account from './components/Account';
import AccountEdit from './components/AccountEdit';
import ProfileCreation from './components/ProfileCreation';
import Feed from './components/Feed';
import PlaceCreate from './components/PlaceCreate';
import PlaceView from './components/PlaceView';

function App() {
	return (
		<ChakraProvider theme={theme}>
			<BrowserRouter style={{ height: '100vh' }}>
				<Routes>
					<Route path='/'>
						<Route index element={<Login />} />
						<Route path='login' element={<Login />} />
						<Route path='signup' element={<SignUp />} />
					</Route>
					<Route path='/profiles' element={<Profiles />}></Route>
					<Route path='/profiles/search' element={<Profiles />}></Route>
					<Route path='/profiles/:id' element={<ProfileView />}></Route>
					<Route
						path='/profiles/:id/edit'
						element={<ProfileEditView />}
					></Route>
					<Route
						path='/profiles/:id/places/create'
						element={<PlaceCreate />}
					></Route>
					<Route path='/places/:id/' element={<PlaceView />}></Route>
					<Route path='/account' element={<Account />}></Route>
					<Route path='/account/edit' element={<AccountEdit />}></Route>
					<Route path='/profile/create' element={<ProfileCreation />}></Route>
					<Route path='/places' element={<Feed />}></Route>
				</Routes>
			</BrowserRouter>
		</ChakraProvider>
	);
}

export default App;
