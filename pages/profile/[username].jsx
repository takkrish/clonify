import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { FaFacebookF, FaGithub, FaInstagram, FaTwitter } from 'react-icons/fa';
import { FiPlus } from 'react-icons/fi';
import { TiTick } from 'react-icons/ti';
import { BsHeartFill, BsChatText } from 'react-icons/bs';
import { FaComment } from 'react-icons/fa';
import Image from 'next/image';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import {
	fetchUser,
	fetchPosts,
	handleLikePost,
	handleComment,
	removeUser,
} from '../../redux/reducers/userSlice';
import Modal from '../../components/Modal';
import { connect } from 'react-redux';
import { wrapper } from '../../redux/store';
import { STATUSTEXT } from '../../redux/constants';
import Loader from '../../components/Loader';
import { updateComment, updateLike } from '../../redux/reducers/feedSlice';
import {
	addFriend,
	handleConnections,
} from '../../redux/reducers/currentUserSlice';
import PostModal from '../../components/PostModal';
import Link from 'next/link';
dayjs.extend(relativeTime);

const Id = (props) => {
	const {
		fetchPosts,
		fetchUser,
		handleConnections,
		posts,
		postStatus,
		currentUser,
		data,
		status,
		removeUser,
		addFriend,
	} = props;
	const router = useRouter();
	const [showPost, setShowPost] = useState(false);
	const [setPost, setSetPost] = useState({});

	console.log(status);

	useEffect(async () => {
		if (router.isReady) {
			if (data?.username !== router.query.username) {
				setShowPost(false);
				removeUser();
				fetchUser({ username: router.query.username });
			}
		}
	}, [router.isReady, router.query]);

	useEffect(() => {
		data?._id && posts?.length === 0 && fetchPosts({ _id: data._id });
	}, [data]);

	if (status === STATUSTEXT.ERROR)
		return (
			<div className='container mx-auto mt-10'>
				<p className='text-center text-2xl font-medium'>
					Sorry, this page isn't available.
				</p>
				<p className='text-center text-gray-500 text-lg mt-2 font-light'>
					The link you followed may be broken, or the page may have
					been removed.{' '}
					<Link href={'/'}>
						<span className='text-violet-600 cursor-pointer underline font-normal hover:text-violet-800'>
							Go back to Home
						</span>
					</Link>
				</p>
			</div>
		);
	else if (data?._id)
		return (
			<>
				<section className='container mx-auto py-5 flex flex-col'>
					<div className='bg-white shadow p-5 rounded-xl flex flex-col'>
						<div className='aspect-w-16 aspect-h-6 relative'>
							<Image
								className='rounded-xl'
								src={data?.coverImg}
								alt='Cover Image'
								layout='fill'
								objectFit='cover'
							/>
						</div>
						<div className='flex justify-between items-end -mt-16'>
							<div className='flex items-end'>
								<div className='aspect-1 w-[150px] ring-4 ring-white rounded-full relative'>
									<Image
										className='rounded-full'
										src={data?.profileImg}
										alt='Profile Picture'
										objectFit='cover'
										layout='fill'
									/>
								</div>
								<p className='ml-3 font-semibold text-2xl'>
									@{data.username}
								</p>
							</div>
							<div className='flex items-center space-x-10'>
								<div className='flex flex-col items-center'>
									<p className='text-4xl font-semibold text-green-600'>
										{data.connections.length}
									</p>
									<p className='text-gray-700 font-light'>
										Connections
									</p>
								</div>
								<div className='flex flex-col items-center'>
									<p className='text-4xl font-semibold text-violet-600'>
										{data.connections.length}
									</p>
									<p className='text-gray-700 font-light'>
										Connected
									</p>
								</div>
							</div>
						</div>
						<div className='w-1/4 self-end flex space-x-4 mt-5'>
							<button
								onClick={() => {
									const add =
										!currentUser.connections.includes(
											data._id
										);
									handleConnections({
										_id: currentUser._id,
										userId: data._id,
										add,
										userDetail: {
											_id: data._id,
											profileImg: data.profileImg,
											fullName: data.fullName,
										},
									});
									add &&
										addFriend({
											_id: data._id,
										});
								}}
								className={`flex px-4 py-2 rounded-md w-full justify-center ${
									currentUser?.connections?.includes(data._id)
										? 'bg-green-600 text-white hover:bg-green-700 transition-all duration-150'
										: 'text-white bg-blue-500  hover:bg-blue-600 transition-all duration-150'
								}`}>
								{currentUser?.connections?.includes(data._id)
									? 'Connected'
									: 'Connect'}
								{currentUser?.connections?.includes(
									data._id
								) ? (
									<TiTick className='ml-2 self-center' />
								) : (
									<FiPlus className='ml-2 self-center' />
								)}
							</button>
							<button className='flex px-4 py-2 rounded-md w-full justify-center items-center bg-violet-50 ring-1 ring-violet-600 text-violet-600 hover:ring-2 hover:bg-violet-100'>
								Message{' '}
								<BsChatText className='ml-3 self-center' />
							</button>
						</div>
					</div>
					<div className='bg-white shadow p-5 rounded-xl mt-5'>
						<p className='text-2xl'>{data.fullName}</p>
						<p className='mt-2 text-violet-600'>{data.job}</p>
						<p className='mt-5 text-gray-700 w-5/6'>
							{data.description}
						</p>
						<p className='mt-5 flex flex-wrap w-3/4 space-x-3'>
							{data.tags === '' ? (
								<span className='bg-gray-200 px-4 py-1 capitalize text-sm rounded-full font-medium'>
									#hashTags
								</span>
							) : (
								data.tags?.split(',')?.map((tags, idx) => (
									<span
										key={idx}
										className='bg-gray-200 px-4 py-1 capitalize text-sm rounded-full font-medium'>
										#{tags}
									</span>
								))
							)}
						</p>
						<ul className='flex justify-start space-x-5 mt-5'>
							<a
								className='px-4 py-2 flex items-center gap-3 bg-violet-50 ring-1 ring-violet-600 hover:ring-2 rounded-xl transition'
								href={data.facebook}
								target='__blank'>
								<FaFacebookF className='text-lg' />
								Facebook
							</a>
							<a
								className='px-4 py-2 flex items-center gap-3 bg-violet-50 ring-1 ring-violet-600 hover:ring-2 rounded-xl transition'
								href={data.twitter}
								target='__blank'>
								<FaTwitter className='text-lg' />
								Twitter
							</a>
							<a
								className='px-4 py-2 flex items-center gap-3 bg-violet-50 ring-1 ring-violet-600 hover:ring-2 rounded-xl transition'
								href={data.instagram}
								target='__blank'>
								<FaInstagram className='text-lg' />
								Instagram
							</a>
							<a
								className='px-4 py-2 flex items-center gap-3 bg-violet-50 ring-1 ring-violet-600 hover:ring-2 rounded-xl transition'
								href={data.github}
								target='__blank'>
								<FaGithub className='text-lg' />
								Github
							</a>
						</ul>
					</div>
					<div className='mt-10'>
						<p className='text-2xl font-medium'>Posts</p>
					</div>
					{postStatus === STATUSTEXT.LOADING ? (
						<div className='mt-5'>
							<Loader />
						</div>
					) : (
						<div className='grid grid-cols-12 gap-5 mt-5'>
							{posts && posts.length === 0
								? 'No Post Yet'
								: posts.map((post, idx) => (
										<div
											key={idx}
											className='col-span-3 cursor-pointer relative'>
											<div className='aspect-1 relative peer'>
												<Image
													placeholder='blur'
													blurDataURL={post.img}
													src={post.img}
													quality={10}
													alt='Post'
													objectFit='cover'
													layout='fill'
													className='rounded-xl'
													onClick={() => {
														setSetPost(post);
														setShowPost(true);
													}}
												/>
											</div>
											<div className='absolute inset-0 rounded-xl bg-black bg-opacity-30 backdrop-blur-sm z-10 pointer-events-none peer-hover:opacity-100 opacity-0 transition-all flex items-center justify-center space-x-10 text-white font-black'>
												<p>
													<BsHeartFill className='text-xl inline-block mr-2' />
													{post.likes.length}
												</p>
												<p>
													<FaComment className='text-xl inline-block mr-2' />
													{post.comments.length}
												</p>
											</div>
										</div>
								  ))}
						</div>
					)}
				</section>
				<Modal
					show={showPost}
					setShow={() => {
						setSetPost({});
						setShowPost(false);
					}}>
					{setPost?.uuid && (
						<PostModal
							setPost={setPost}
							setSetPost={setSetPost}
							setOpen={setShowPost}
							feed={true}
						/>
					)}
				</Modal>
			</>
		);
	else
		return (
			<div className='container mx-auto mt-5'>
				<Loader />
			</div>
		);
};

const mapStateToProps = (state) => {
	return {
		currentUser: state.currentUser.data,
		data: state.user.data,
		status: state.user.status,
		posts: state.user.posts.data,
		postStatus: state.user.posts.status,
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		fetchUser: (data) => dispatch(fetchUser(data)),
		fetchPosts: (data) => dispatch(fetchPosts(data)),
		handleConnections: (data) => dispatch(handleConnections(data)),
		addFriend: (data) => dispatch(addFriend(data)),
		handleLikePost: (data) => dispatch(handleLikePost(data)),
		handleComment: (data) => dispatch(handleComment(data)),
		updateComment: (data) => dispatch(updateComment(data)),
		updateLike: (data) => dispatch(updateLike(data)),
		removeUser: () => dispatch(removeUser()),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(Id);
