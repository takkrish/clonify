import Image from 'next/image';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { FiPlus } from 'react-icons/fi';
import { TiTick } from 'react-icons/ti';
import { connect } from 'react-redux';
import Loader from '../components/Loader';
import { STATUSTEXT } from '../redux/constants';
import {
	handleConnections,
	fetchUsers,
	addFriend,
} from '../redux/reducers/currentUserSlice';
import { wrapper } from '../redux/store';
const Users = (props) => {
	const { users, currentUser, fetchUsers, handleConnections, addFriend } =
		props;
	const router = useRouter();
	useEffect(() => {
		users.data.length === 0 &&
			fetchUsers({
				_id: currentUser._id,
			});
	}, []);

	if (users.status === STATUSTEXT.LOADING)
		return (
			<div className='container mx-auto mt-5'>
				<Loader />
			</div>
		);

	return (
		<>
			<div className='py-5 container mx-auto'>
				<div className='grid grid-cols-12 gap-5'>
					{users?.data?.map((user, idx) => (
						<div
							key={idx}
							className='p-5 bg-white shadow rounded-xl col-span-4 flex flex-col space-y-5 justify-between'>
							<div className='space-y-5'>
								<div className='flex items-center'>
									<div className='w-[60px] h-[60px]'>
										<Image
											src={user.profileImg}
											width='60px'
											height='60px'
											layout='fixed'
											objectFit='cover'
											className='rounded-full'
										/>
									</div>
									<div className='ml-3 flex flex-col'>
										<p className='text-lg'>
											{user.fullName}
										</p>
										<span className='text-violet-600 text-sm'>
											@{user.username}
										</span>
									</div>
								</div>
								<p className='line-clamp-3'>
									{user.description}
								</p>
							</div>
							<div className='flex space-x-3'>
								<button
									onClick={() => {
										const add =
											!currentUser.connections.includes(
												user._id
											);
										handleConnections({
											_id: currentUser._id,
											userId: user._id,
											add,
											userDetail: {
												_id: user._id,
												profileImg: user.profileImg,
												fullName: user.fullName,
											},
										});
										add &&
											addFriend({
												_id: user._id,
											});
									}}
									className={`flex px-4 py-2 rounded-md w-full justify-center ${
										currentUser?.connections?.includes(
											user._id
										)
											? 'bg-green-600 text-white hover:bg-green-700 transition-all duration-150'
											: 'text-white bg-blue-500  hover:bg-blue-600 transition-all duration-150'
									}`}>
									{currentUser?.connections?.includes(
										user._id
									)
										? 'Connected'
										: 'Connect'}
									{currentUser?.connections?.includes(
										user._id
									) ? (
										<TiTick className='ml-2 self-center' />
									) : (
										<FiPlus className='ml-2 self-center' />
									)}
								</button>
								<button
									className='ring-1 ring-violet-600 px-4 py-2 rounded-md text-violet-600  hover:bg-violet-50 hover:ring-2 transition w-full'
									onClick={() => {
										router.push(
											`/profile/${user.username}`
										);
									}}>
									View Profile
								</button>
							</div>
						</div>
					))}
				</div>
			</div>
		</>
	);
};

// export const getServerSideProps = wrapper.getServerSideProps(
// 	(store) =>
// 		async ({ req, res }) => {
// 			// const data = await parseCookies(req);
// 			// if (res) {
// 			// 	if (Object.keys(data).length === 0 && data.constructor === Object) {
// 			// 		res.writeHead(301, { Location: '/auth' });
// 			// 		res.end();
// 			// 	}
// 			// }
// 			const { collection, client } = await MongoDB_Users();
// 			const _data = await collection
// 				.find(
// 					{},
// 					{
// 						projection: {
// 							profileImg: 1,
// 							username: 1,
// 							fullName: 1,
// 							description: 1,
// 						},
// 					}
// 				)
// 				.toArray();
// 			// const currentUser = JSON.parse(data.currentUser);
// 			const users = JSON.parse(JSON.stringify(_data));
// 			const filtered = users.filter((user) => user._id !== currentUser._id);
// 			client.close();
// 			return {
// 				props: {
// 					users: filtered,
// 				},
// 			};
// 		}
// );

// export const getServerSideProps = wrapper.getServerSideProps(
// 	(store) => (context) => {
// 		const token = context.req.cookies?.token;
// 		const value = verify(JSON.parse(token), process.env.JWT_SECRET_KEY);
// 		return { props: {} };
// 	}
// );

const mapStateToProps = (state) => {
	return {
		users: state.currentUser.users,
		currentUser: state.currentUser.data,
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		fetchUsers: (data) => dispatch(fetchUsers(data)),
		handleConnections: (data) => dispatch(handleConnections(data)),
		addFriend: (data) => dispatch(addFriend(data)),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(Users);
