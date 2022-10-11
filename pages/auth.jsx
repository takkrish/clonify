import axios from 'axios';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { connect } from 'react-redux';
import {
	setUser,
	fetchFriends,
	clearUser,
	setWantToLogout,
} from '../redux/reducers/currentUserSlice';
import { FcGoogle } from 'react-icons/fc';
import { FaGithub } from 'react-icons/fa';
// import { getSession, signIn } from 'next-auth/react';
import { wrapper } from '../redux/store';
import { middleware } from '../middleware';
import { clearFeed } from '../redux/reducers/feedSlice';
import { removeUser } from '../redux/reducers/userSlice';

const Auth = (props) => {
	const { setUser, fetchFriends } = props;
	const router = useRouter();
	const [signinDetail, setSigninDetail] = useState({
		email: '',
		password: '',
	});
	const [signin, setSignin] = useState(true);
	const [isdisabled, setIsdisabled] = useState(false);
	const [confirmPassword, setConfirmPassword] = useState('');
	const [error, setError] = useState('');
	const [signupDetail, setSignupDetail] = useState({
		fullName: '',
		username: '',
		email: '',
		password: '',
	});
	const handleSignin = async () => {
		setIsdisabled(true);
		const data = await axios
			.post('/api/signin', signinDetail)
			.catch((err) => err.response);
		if (data.status !== 200) {
			setError(data.data.message);
			setIsdisabled(false);
			return;
		}
		setUser(data.data);
		fetchFriends({ ids: data.data.connections });
		setIsdisabled(false);
		router.push('/');
	};
	const handleSignup = async () => {
		setIsdisabled(true);
		if (signupDetail.password === confirmPassword) {
			const data = await axios
				.post('/api/signup', { ...signupDetail })
				.catch((err) => err.response);
			if (data.status !== 200) {
				setError(data.data.message);
				setIsdisabled(false);
				return;
			}
			setUser({
				_id: data.data._id,
				email: signupDetail.email,
				username: signupDetail.username,
				fullName: signupDetail.fullName,
				job: '',
				description: '',
				tags: '',
				facebook: 'https://facebook.com',
				twitter: 'https://twitter.com',
				instagram: 'https://instagram.com',
				github: 'https://github.com',
				profileImg: '/empty.png',
				coverImg: '/empty.png',
				connections: [],
				connected: [],
				posts: [],
			});
			router.push('/');
		} else {
			setIsdisabled(false);
			setError('Passwords do not match');
			setSignupDetail({ ...signupDetail, password: '' });
			setConfirmPassword('');
		}
	};
	const toggle = () => {
		setError('');
		setSignin((prev) => !prev);
	};

	return (
		<div className='p-10 h-screen w-screen grid bg-white grid-cols-12'>
			<div
				className={`h-full text-gray-700 rounded-lg relative col-span-8 ${
					!signin && 'col-span-6'
				}`}>
				<p className='text-2xl font-bold text-violet-600 uppercase'>
					Clonify
				</p>
				<p
					className={` mt-16 text-6xl font-bold tracking-tight text-gray-700 leading-[3.75rem] ${
						signin ? 'w-4/5' : 'w-full'
					}`}>
					You don't need a corporation or a
					<span className='text-gray-400 line-through'>
						{' '}
						marketing company{' '}
					</span>
					to brand you now, you can do it yourself.
					<br />
					You can establish who you are with a
					<span className='text-violet-600'> social media </span>
					following.
				</p>
				{/* <div className='absolute right-10 bottom-5'>
					<img src='login.svg' alt='login image' className='h-96' />
				</div> */}
				<p className='mt-20'>Don't have an account ?</p>
				<button
					className='py-4 px-8 rounded-md font-medium transition bg-violet-600 text-white hover:bg-violet-700 mt-2'
					onClick={() => setSignin(false)}>
					Create Account
				</button>
			</div>
			<div
				className={`flex flex-col px-16 pt-5 ${
					signin ? 'col-span-4' : 'col-span-6 px-24'
				}`}>
				<p className='text-3xl font-semibold'>
					{signin ? 'Sign In' : 'Sign Up'}
				</p>
				<p className='text-gray-700 mt-5'>
					{signin
						? "Don't have an account ?"
						: 'Already have an account ?'}
					<a
						className={`ml-2 underline ${
							isdisabled ? 'text-violet-300' : 'text-violet-600'
						}`}
						style={{ cursor: 'pointer' }}
						onClick={() => {
							!isdisabled && toggle();
						}}>
						{signin ? 'Signup' : 'Signin'}
					</a>
				</p>
				{signin ? (
					<form
						className='flex flex-col space-y-8 items-stretch mt-10'
						onSubmit={async (e) => {
							e.preventDefault();
							setError('');
							handleSignin();
							// const data = await signIn('credentials', {
							// 	redirect: false,
							// 	callbackUrl: '/',
							// 	email: 'takkrish',
							// 	password: '2002',
							// });
							// router.push(data.url);
						}}>
						<button
							type='button'
							className='flex items-center justify-center ring-1 ring-gray-300 py-3 rounded-md font-medium hover:ring-gray-400 hover:bg-gray-100 hover:ring-2 transition shadow-md'
							// onClick={() => {
							// 	// dispatch(
							// 	// 	addData({
							// 	// 		username: 'takkrish',
							// 	// 	})
							// 	// );
							// 	// props.add({
							// 	// 	username: 'takkrish',
							// 	// });
							// 	// router.push('/');
							// 	signIn('google', {
							// 		redirect: false,
							// 		callbackUrl: '/',
							// 	});
							// }}
						>
							<FcGoogle className='mr-5 text-2xl' />
							Sign In with Google
						</button>
						<button
							type='button'
							className='flex items-center justify-center ring-1 ring-gray-300 py-3 rounded-md font-medium hover:ring-gray-400 transition hover:ring-2   hover:bg-gray-900 text-white bg-gray-800 shadow-md shadow-gray-300'
							// onClick={() => {
							// 	// dispatch(
							// 	// 	addData({
							// 	// 		username: 'takkrish',
							// 	// 	})
							// 	// );
							// 	// props.add({
							// 	// 	username: 'takkrish',
							// 	// });
							// 	// router.push('/');
							// 	signIn('google', {
							// 		redirect: false,
							// 		callbackUrl: '/',
							// 	});
							// }}
						>
							<FaGithub className='mr-5 text-2xl' />
							Sign In with Github
						</button>
						<div className='border-t border-gray-300 h-0 flex items-center justify-center mt-3'>
							<p className='text-gray-600 bg-white px-4 text-sm'>
								OR
							</p>
						</div>
						{error && (
							<div className='bg-red-50 px-4 py-3 rounded-md border-x-2 border-red-600'>
								<p className='text-red-600 text-sm text-left'>
									* {error}
								</p>
							</div>
						)}
						<div className='flex flex-col'>
							<label
								htmlFor='email'
								className='text-sm mb-1 text-gray-700'>
								Email
							</label>
							<input
								autoFocus
								autoComplete='email'
								required
								type='email'
								className='rounded-md px-4 py-2 ring-gray-300 ring-1 focus:ring-violet-600 outline-none focus:ring-2 focus:invalid:ring-red-500 focus:invalid:bg-red-50 focus:bg-violet-50 transition'
								id='email'
								value={signinDetail.email}
								onChange={(e) => {
									setSigninDetail((prev) => ({
										...prev,
										email: e.target.value,
									}));
									setError('');
								}}
							/>
						</div>
						<div className='flex flex-col'>
							<label
								htmlFor='password'
								className='text-sm mb-1 text-gray-700'>
								Password
							</label>
							<input
								type='password'
								required
								id='password'
								className='rounded-md px-4 py-2 ring-gray-300 ring-1 focus:ring-violet-600 outline-none focus:ring-2 focus:bg-violet-50 transition'
								value={signinDetail.password}
								onChange={(e) => {
									setSigninDetail((prev) => ({
										...prev,
										password: e.target.value,
									}));
									setError('');
								}}
							/>
						</div>
						<button
							type='submit'
							disabled={isdisabled}
							className='bg-violet-600 py-2 rounded-md hover:bg-violet-700 text-white disabled:bg-violet-300 transition'>
							{isdisabled ? 'Checking...' : 'Submit'}
						</button>
					</form>
				) : (
					<form
						className='flex flex-col space-y-6 items-stretch mt-10'
						onSubmit={(e) => {
							e.preventDefault();
							setError('');
							handleSignup();
						}}>
						<div className='flex space-x-5'>
							<button
								type='button'
								className='flex items-center justify-center ring-1 ring-gray-300 py-3 rounded-md font-medium hover:ring-gray-400 hover:bg-gray-100 hover:ring-2 transition shadow-md w-full'
								// onClick={() => {
								// 	// dispatch(
								// 	// 	addData({
								// 	// 		username: 'takkrish',
								// 	// 	})
								// 	// );
								// 	// props.add({
								// 	// 	username: 'takkrish',
								// 	// });
								// 	// router.push('/');
								// 	signIn('google', {
								// 		redirect: false,
								// 		callbackUrl: '/',
								// 	});
								// }}
							>
								<FcGoogle className='mr-5 text-2xl' />
								Sign Up with Google
							</button>
							<button
								type='button'
								className='flex items-center justify-center ring-1 ring-gray-300 py-3 rounded-md font-medium hover:ring-gray-400 transition hover:ring-2   hover:bg-gray-900 text-white bg-gray-800 shadow-md shadow-gray-300 w-full'
								// onClick={() => {
								// 	// dispatch(
								// 	// 	addData({
								// 	// 		username: 'takkrish',
								// 	// 	})
								// 	// );
								// 	// props.add({
								// 	// 	username: 'takkrish',
								// 	// });
								// 	// router.push('/');
								// 	signIn('google', {
								// 		redirect: false,
								// 		callbackUrl: '/',
								// 	});
								// }}
							>
								<FaGithub className='mr-5 text-2xl' />
								Sign Up with Github
							</button>
						</div>
						<div className='border-t border-gray-300 h-0 flex items-center justify-center mt-3'>
							<p className='text-gray-600 bg-white px-4 text-sm'>
								OR
							</p>
						</div>
						{error && (
							<div className='bg-red-50 px-4 py-3 rounded-md border-x-2 border-red-600'>
								<p className='text-red-600 text-sm text-left'>
									* {error}
								</p>
							</div>
						)}
						<div className='flex flex-col'>
							<label
								htmlFor='fullName'
								className='text-sm mb-1 text-gray-700'>
								Full Name
							</label>
							<input
								required={true}
								autoFocus={true}
								type='text'
								className='rounded-md px-4 py-2 ring-gray-300 ring-1 focus:ring-violet-600 outline-none focus:ring-2 focus:bg-violet-50 transition'
								id='fullName'
								value={signupDetail.fullName}
								onChange={(e) => {
									setSignupDetail({
										...signupDetail,
										fullName: e.target.value,
									});
									setError('');
								}}
							/>
						</div>
						<div className='flex flex-col'>
							<label
								htmlFor='username'
								className='text-sm mb-1 text-gray-700'>
								Username
							</label>
							<input
								required={true}
								type='text'
								className='rounded-md px-4 py-2 ring-gray-300 ring-1 focus:ring-violet-600 outline-none focus:ring-2 focus:bg-violet-50 transition'
								id='username'
								value={signupDetail.username}
								onChange={(e) => {
									setSignupDetail((prev) => ({
										...prev,
										username: e.target.value,
									}));
									setError('');
								}}
							/>
						</div>
						<div className='flex flex-col'>
							<label
								htmlFor='email'
								className='text-sm mb-1 text-gray-700'>
								Email
							</label>
							<input
								required={true}
								autoComplete='email'
								type='email'
								className='rounded-md px-4 py-2 ring-gray-300 ring-1 focus:ring-violet-600 outline-none focus:ring-2 focus:invalid:ring-red-500 focus:invalid:bg-red-50 focus:bg-violet-50 transition'
								id='email'
								value={signupDetail.email}
								onChange={(e) => {
									setSignupDetail((prev) => ({
										...prev,
										email: e.target.value,
									}));
									setError('');
								}}
							/>
						</div>
						<div className='flex flex-col'>
							<label
								htmlFor='password'
								className='text-sm mb-1 text-gray-700'>
								Password
							</label>
							<input
								required={true}
								type='password'
								className='rounded-md px-4 py-2 ring-gray-300 ring-1 focus:ring-violet-600 outline-none focus:ring-2 focus:bg-violet-50 transition'
								id='password'
								value={signupDetail.password}
								onChange={(e) => {
									setSignupDetail((prev) => ({
										...prev,
										password: e.target.value,
									}));
									setError('');
								}}
							/>
						</div>
						<div className='flex flex-col'>
							<label
								htmlFor='confirmPassword'
								className='text-sm mb-1 text-gray-700'>
								Confirm Password
							</label>
							<input
								required={true}
								type='password'
								className='rounded-md px-4 py-2 ring-gray-300 ring-1 focus:ring-violet-600 outline-none focus:ring-2 focus:bg-violet-50 transition'
								id='confirmPassword'
								value={confirmPassword}
								onChange={(e) => {
									setConfirmPassword(e.target.value);
									setError('');
								}}
							/>
						</div>
						<button
							type='submit'
							disabled={isdisabled}
							className='bg-violet-600 py-2 rounded-md hover:bg-violet-700 text-white disabled:bg-violet-300 transition'>
							{isdisabled ? 'Checking...' : 'Submit'}
						</button>
					</form>
				)}
			</div>
		</div>
	);
};

export const getServerSideProps = wrapper.getServerSideProps(
	(store) => async (context) => {
		store.dispatch(setWantToLogout(true));
		store.dispatch(clearUser());
		store.dispatch(clearFeed());
		store.dispatch(removeUser());
		const auth = await middleware(context.req);
		return auth
			? {
					redirect: {
						destination: '/',
						permanent: false,
					},
			  }
			: { props: {} };
	}
);

const mapStateToProps = (state) => {
	return {
		state,
	};
};
const mapDispatchToProps = (dispatch) => {
	return {
		setUser: (data) => dispatch(setUser(data)),
		fetchFriends: (data) => dispatch(fetchFriends(data)),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(Auth);
