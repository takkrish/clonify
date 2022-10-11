import Image from 'next/image';
import { BsThreeDots } from 'react-icons/bs';
import {
	AiFillHeart,
	AiOutlineMessage,
	AiOutlineHeart,
	AiOutlineShareAlt,
} from 'react-icons/ai';
import { BsDot } from 'react-icons/bs';
import { IoBookmarkOutline, IoSend } from 'react-icons/io5';
import { useEffect } from 'react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { connect } from 'react-redux';
import {
	fetchFeed,
	updateLike,
	updateComment,
} from '../redux/reducers/feedSlice';
import { STATUSTEXT } from '../redux/constants';
import { handleLikePost, handleComment } from '../redux/reducers/userSlice';
import Loader from './Loader';
import Link from 'next/link';
dayjs.extend(relativeTime);

const Feed = (props) => {
	const {
		feed,
		currentUser,
		fetchFeed,
		status,
		handleLikePost,
		handleComment,
		updateLike,
		updateComment,
	} = props;
	useEffect(() => {
		feed.length === 0 && fetchFeed({ ids: currentUser.connections });
	}, []);
	if (status === STATUSTEXT.LOADING) {
		return (
			<div className='mt-5'>
				<Loader />
			</div>
		);
	} else if (status === STATUSTEXT.ERROR) return <p>Error</p>;
	return (
		<>
			{feed.map((post, idx) => (
				<div
					key={idx}
					className='bg-white shadow p-5 rounded-xl flex flex-col items-center mt-5'>
					<div className='flex justify-between items-center w-full'>
						<div className='flex items-start space-x-5'>
							<div className='h-[40px] w-[40px] relative'>
								<Image
									src={post.profileImg}
									alt='image'
									className='rounded-full'
									layout='fill'
									objectFit='cover'
								/>
							</div>
							<div className='text-sm'>
								<Link href={`/profile/${post.username}`}>
									<p className='cursor-pointer font-medium'>
										{post.username}
									</p>
								</Link>
								<p className='text-gray-600 text-xs'>
									Location
								</p>
							</div>
						</div>
						<div className='flex space-x-5 items-center'>
							<p className='text-gray-400 text-xs'>
								{dayjs(post.date).fromNow()}
							</p>
							<div className='cursor-pointer p-1 text-xl flex items-center justify-center'>
								<BsThreeDots />
							</div>
						</div>
					</div>
					<div className='w-full aspect-w-4 aspect-h-3 relative mt-5'>
						<Image
							onDoubleClick={async () => {
								const liked = post.likes.includes(
									currentUser._id
								);
								await handleLikePost({
									userId: post.userId,
									uuid: post.uuid,
									add: !liked,
									to: currentUser._id,
								});
								updateLike({
									userId: post.userId,
									uuid: post.uuid,
									add: !liked,
									to: currentUser._id,
								});
							}}
							placeholder='blur'
							blurDataURL={post.img}
							draggable={false}
							src={post.img}
							layout='fill'
							objectFit='contain'
						/>
					</div>
					<div className='flex justify-between w-full mt-5 text-2xl'>
						<div className='flex space-x-3'>
							<div
								onClick={async () => {
									const liked = post.likes.includes(
										currentUser._id
									);
									await handleLikePost({
										userId: post.userId,
										uuid: post.uuid,
										add: !liked,
										to: currentUser._id,
									});
									updateLike({
										userId: post.userId,
										uuid: post.uuid,
										add: !liked,
										to: currentUser._id,
									});
								}}
								className='flex'>
								{post.likes.includes(currentUser._id) ? (
									<AiFillHeart className='text-red-500 hover:text-red-600 cursor-pointer' />
								) : (
									<AiOutlineHeart className='text-red-500 hover:text-red-600 cursor-pointer' />
								)}
							</div>
							<label htmlFor={post.uuid}>
								<AiOutlineMessage className='hover:text-violet-600 cursor-pointer' />
							</label>
							<AiOutlineShareAlt className='hover:text-violet-600 cursor-pointer' />
						</div>
						<IoBookmarkOutline className='hover:text-violet-600 cursor-pointer' />
					</div>
					<p className='w-full mt-5 text-sm flex items-center font-light'>
						<span className='font-medium mr-1'>
							{post.likes.length}
						</span>
						Likes
						<BsDot className='text-xl text-gray-400' />
						<span className='font-medium mr-1'>
							{post.comments.length}
						</span>
						Comments
					</p>
					<hr className='w-full my-3' />
					<p className='w-full line-clamp-5'>
						<Link href={`/profile/${post.username}`}>
							<span className='mr-2 text-violet-600 font-medium cursor-pointer'>
								{post.username}
							</span>
						</Link>
						{post.caption}
					</p>
					<div className='flex w-full items-center mt-5'>
						<div className='flex items-center w-full'>
							<form
								className='flex justify-between w-full space-x-3'
								onSubmit={async (e) => {
									e.preventDefault();
									const commentRef = document.getElementById(
										post.uuid
									);
									await handleComment({
										userId: post.userId,
										uuid: post.uuid,
										add: true,
										details: {
											_id: currentUser._id,
											commentData: commentRef.value,
											username: currentUser.username,
											profileImg: currentUser.profileImg,
										},
									});
									updateComment({
										userId: post.userId,
										uuid: post.uuid,
										add: true,
										details: {
											_id: currentUser._id,
											commentData: commentRef.value,
											username: currentUser.username,
											profileImg: currentUser.profileImg,
										},
									});
									commentRef.value = '';
								}}>
								<input
									id={post.uuid}
									className='w-full px-4 py-2 outline-none focus:bg-violet-50 focus:ring-2 focus:ring-violet-600 ring-1 ring-gray-400 rounded-xl placeholder:to-gray-400 placeholder:text-sm'
									required
									type='text'
									placeholder='Write a comment ...'></input>
								<button
									type='submit'
									className='flex items-center justify-center px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-xl'>
									<IoSend className='text-center text-lg' />
								</button>
							</form>
						</div>
					</div>
				</div>
			))}
		</>
	);
};

const mapStateToProps = (state) => {
	return {
		feed: state.feed.data,
		status: state.feed.status,
		currentUser: state.currentUser.data,
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		fetchFeed: (data) => dispatch(fetchFeed(data)),
		handleLikePost: (data) => dispatch(handleLikePost(data)),
		handleComment: (data) => dispatch(handleComment(data)),
		updateLike: (data) => dispatch(updateLike(data)),
		updateComment: (data) => dispatch(updateComment(data)),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(Feed);
