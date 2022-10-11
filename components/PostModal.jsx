import Image from 'next/image';
import Link from 'next/link';
import {
	AiFillHeart,
	AiOutlineHeart,
	AiOutlineMessage,
	AiOutlineShareAlt,
} from 'react-icons/ai';
import { BsDot, BsHeart, BsThreeDots } from 'react-icons/bs';
import { IoBookmarkOutline, IoSend } from 'react-icons/io5';
import { MdOutlineInsertComment } from 'react-icons/md';
import { connect } from 'react-redux';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { handleComment, handleLikePost } from '../redux/reducers/userSlice';
import {
	addComment,
	addExploreComment,
	updateExploreLikes,
	updatePostLikes,
} from '../redux/reducers/currentUserSlice';
import { updateComment, updateLike } from '../redux/reducers/feedSlice';
dayjs.extend(relativeTime);

const PostModal = (props) => {
	const {
		data,
		handleComment,
		addComment,
		handleLikePost,
		updatePostLikes,
		updateExploreLikes,
		addExploreComment,
		updateLike,
		updateComment,
		setPost,
		setSetPost,
		self,
		explore,
		feed,
		setOpen,
	} = props;

	const Like = async () => {
		const liked = setPost.likes.includes(data._id);
		await handleLikePost({
			userId: setPost.userId,
			uuid: setPost.uuid,
			add: !liked,
			to: data._id,
		});
		self &&
			updatePostLikes({
				userId: setPost.userId,
				uuid: setPost.uuid,
				add: !liked,
				to: data._id,
			});
		(explore || feed) &&
			updateLike({
				userId: setPost.userId,
				uuid: setPost.uuid,
				add: !liked,
				to: data._id,
			});
		explore &&
			updateExploreLikes({
				userId: setPost.userId,
				uuid: setPost.uuid,
				add: !liked,
				to: data._id,
			});
		setSetPost((prev) => ({
			...prev,
			likes: liked
				? prev.likes.filter((like) => like !== data._id)
				: [...prev.likes, data._id],
		}));
	};

	const Comment = async () => {
		const commentRef = document.getElementById(setPost.uuid);
		const commentData = commentRef.value;
		await handleComment({
			userId: setPost.userId,
			uuid: setPost.uuid,
			add: true,
			details: {
				_id: data._id,
				commentData,
				username: data.username,
				profileImg: data.profileImg,
			},
		});
		self &&
			addComment({
				userId: setPost.userId,
				uuid: setPost.uuid,
				add: true,
				details: {
					_id: data._id,
					commentData,
					username: data.username,
					profileImg: data.profileImg,
				},
			});
		(explore || feed) &&
			updateComment({
				userId: setPost.userId,
				uuid: setPost.uuid,
				add: true,
				details: {
					_id: data._id,
					commentData: commentRef.value,
					username: data.username,
					profileImg: data.profileImg,
				},
			});
		explore &&
			addExploreComment({
				userId: setPost.userId,
				uuid: setPost.uuid,
				add: true,
				details: {
					_id: data._id,
					commentData: commentRef.value,
					username: data.username,
					profileImg: data.profileImg,
				},
			});
		setSetPost((prev) => ({
			...prev,
			comments: [
				...prev.comments,
				{
					_id: data._id,
					commentData,
					username: data.username,
					profileImg: data.profileImg,
				},
			],
		}));
		commentRef.value = '';
	};

	return (
		<>
			<div className='relative w-7/12 bg-black max-h-[95vh]'>
				<Image
					src={setPost.img}
					layout='fill'
					objectFit='contain'
					alt='Post'
					onDoubleClick={() => {
						Like();
					}}
				/>
			</div>
			{/* Comment Box */}
			<div className='w-5/12 flex flex-col max-h-[95vh]'>
				<div className='flex justify-between p-3 border-b border-gray-200'>
					<div className='flex space-x-5'>
						<div className='relative w-[40px] h-[40px]'>
							<Image
								src={setPost.profileImg}
								layout='fill'
								objectFit='cover'
								className='rounded-full'
							/>
						</div>
						<div>
							<Link href={`/profile/${setPost.username}`}>
								<p className='font-semibold cursor-pointer'>
									{setPost.username}
								</p>
							</Link>
							<p className='text-gray-600 text-sm'>Location</p>
						</div>
					</div>
					<div className='flex items-center space-x-5'>
						<p className='text-gray-400 text-xs'>
							{dayjs(setPost.date).fromNow()}
						</p>
						<div className='cursor-pointer p-1 text-xl flex items-center justify-center'>
							<BsThreeDots />
						</div>
					</div>
				</div>
				<div className='flex-grow overflow-scroll no-scrollbar'>
					<div>
						<p className='w-full px-3 mt-3 text-sm'>
							<Link href={`/profile/${setPost.username}`}>
								<span className='mr-2 text-violet-600 cursor-pointer font-medium'>
									{setPost.username}
								</span>
							</Link>
							{setPost.caption}
						</p>
						<hr className='mt-3 border-gray-200' />
					</div>
					{setPost.comments.length === 0 ? (
						<div className='flex flex-col items-center mt-5'>
							<MdOutlineInsertComment className='text-4xl text-gray-300' />
							<p className='text-lg font-medium'>
								No comments yet.
							</p>
							<p className='text-sm text-violet-600 font-light'>
								Be the first one to comment.
							</p>
						</div>
					) : (
						setPost.comments.map((comment, idx) => (
							<div
								className='flex space-x-5 p-3 items-start'
								key={idx}>
								<div className='h-[40px] aspect-1 relative'>
									<Image
										className='rounded-full'
										src={comment.profileImg}
										alt='Post'
										objectFit='cover'
										layout='fill'
									/>
								</div>
								<div className='flex flex-col w-full'>
									<p className='text-sm'>
										<Link
											href={
												comment._id === data._id
													? '/profile'
													: `/profile/${comment.username}`
											}>
											<span className='text-black mr-2 font-semibold cursor-pointer'>
												@{comment.username}
											</span>
										</Link>
										{comment.commentData}
									</p>
									<div className='flex justify-between items-center text-xs text-gray-400 mt-3'>
										<p>{dayjs(comment.date).fromNow()}</p>
										<BsHeart className='text-red-500 cursor-pointer' />
									</div>
								</div>
							</div>
						))
					)}
				</div>
				<div className='flex flex-col w-full items-center border-t border-gray-200 p-3 space-y-3'>
					<div className='flex justify-between w-full text-2xl'>
						<div className='flex space-x-3'>
							<div
								className='flex'
								onClick={() => {
									Like();
								}}>
								{setPost.likes.includes(data._id) ? (
									<AiFillHeart className='text-red-500 hover:text-red-600 cursor-pointer' />
								) : (
									<AiOutlineHeart className='text-red-500 hover:text-red-600 cursor-pointer' />
								)}
							</div>
							<label htmlFor={setPost.uuid}>
								<AiOutlineMessage className='hover:text-violet-600 cursor-pointer' />
							</label>
							<AiOutlineShareAlt className='hover:text-violet-600 cursor-pointer' />
						</div>
						<IoBookmarkOutline className='hover:text-violet-600 cursor-pointer' />
					</div>
					<p className='w-full mt-5 text-sm flex items-center font-light'>
						<span className='font-medium mr-1'>
							{setPost.likes.length}
						</span>
						Likes
						<BsDot className='text-xl text-gray-400' />
						<span className='font-medium mr-1'>
							{setPost.comments.length}
						</span>
						Comments
					</p>
					<div className='flex items-center w-full'>
						<form
							className='flex justify-between w-full space-x-3'
							onSubmit={(e) => {
								e.preventDefault();
								Comment();
							}}>
							<input
								id={setPost.uuid}
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
		</>
	);
};

const mapStateToProps = (state) => {
	return {
		data: state.currentUser.data,
		posts: state.currentUser.posts.data,
		postsStatus: state.currentUser.posts.status,
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		handleComment: (data) => dispatch(handleComment(data)),
		handleLikePost: (data) => dispatch(handleLikePost(data)),
		updatePostLikes: (data) => dispatch(updatePostLikes(data)),
		addComment: (data) => dispatch(addComment(data)),
		updateExploreLikes: (data) => dispatch(updateExploreLikes(data)),
		updateLike: (data) => dispatch(updateLike(data)),
		addExploreComment: (data) => dispatch(addExploreComment(data)),
		updateComment: (data) => dispatch(updateComment(data)),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(PostModal);
