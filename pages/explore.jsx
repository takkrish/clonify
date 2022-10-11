import Image from 'next/image';
import { useState, useEffect } from 'react';
import { BsHeartFill } from 'react-icons/bs';
import { connect } from 'react-redux';
import Loader from '../components/Loader';
import Modal from '../components/Modal';
import { STATUSTEXT } from '../redux/constants';
import {
	addExploreComment,
	updateExploreLikes,
	fetchExplore,
} from '../redux/reducers/currentUserSlice';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { FaComment } from 'react-icons/fa';
import { handleComment, handleLikePost } from '../redux/reducers/userSlice';
import { updateComment, updateLike } from '../redux/reducers/feedSlice';
import PostModal from '../components/PostModal';
dayjs.extend(relativeTime);

const Explore = (props) => {
	const { currentUser, data, status, fetchExplore } = props;
	const [showPost, setShowPost] = useState(false);
	const [setPost, setSetPost] = useState({});
	useEffect(() => {
		data.length === 0 && fetchExplore({ userId: currentUser._id });
	}, []);
	return (
		<>
			<div className='container mx-auto py-5'>
				{status === STATUSTEXT.LOADING ? (
					<Loader />
				) : (
					<div className='grid grid-cols-12 gap-5'>
						{data.length === 0
							? 'No Post Yet'
							: data.map((post, idx) => (
									<div
										key={idx}
										className='col-span-3 cursor-pointer relative shadow rounded-xl overflow-hidden'>
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
			</div>
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
						explore={true}
						feed={true}
					/>
				)}
			</Modal>
		</>
	);
};

const mapStateToProps = (state) => {
	return {
		currentUser: state.currentUser.data,
		data: state.currentUser.explore.data,
		status: state.currentUser.explore.status,
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		fetchExplore: (data) => dispatch(fetchExplore(data)),
		handleLikePost: (data) => dispatch(handleLikePost(data)),
		handleComment: (data) => dispatch(handleComment(data)),
		updateLike: (data) => dispatch(updateLike(data)),
		updateComment: (data) => dispatch(updateComment(data)),
		addExploreComment: (data) => dispatch(addExploreComment(data)),
		updateExploreLikes: (data) => dispatch(updateExploreLikes(data)),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(Explore);
