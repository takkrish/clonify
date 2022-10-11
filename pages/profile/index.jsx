import { useEffect, useState } from 'react';
import { FaFacebookF, FaGithub, FaInstagram, FaTwitter } from 'react-icons/fa';
import Loader from '../../components/Loader';
import { BsHeartFill, BsImage } from 'react-icons/bs';
import { RiEditCircleFill } from 'react-icons/ri';
import { FaComment } from 'react-icons/fa';
import { FiPlus } from 'react-icons/fi';
import Image from 'next/image';
import FileBase from 'react-file-base64';
import { useRef } from 'react';
import { connect } from 'react-redux';
import {
	updateCoverImg,
	updateProfileImg,
	createPost,
	fetchCurrentUserPosts,
	addComment,
	updateUserDetails,
	updatePostLikes,
} from '../../redux/reducers/currentUserSlice';
import { STATUSTEXT } from '../../redux/constants';
import Modal from '../../components/Modal';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { handleComment, handleLikePost } from '../../redux/reducers/userSlice';
import PostModal from '../../components/PostModal';
dayjs.extend(relativeTime);

const Profile = (props) => {
	const {
		data,
		posts,
		postsStatus,
		updateCoverImg,
		updateProfileImg,
		createPost,
		fetchCurrentUserPosts,
		updateUserDetails,
	} = props;
	const caption = useRef();
	const coverImgRef = useRef();
	const profileImgRef = useRef();
	const createPostRef = useRef();
	const [postImg, setPostImg] = useState('');
	const [show, setShow] = useState(false);
	const [showUpdate, setShowUpdate] = useState(false);
	const [showPost, setShowPost] = useState(false);
	const [setPost, setSetPost] = useState({});
	const [error, setError] = useState('');
	const [isdisabled, setIsdisabled] = useState(false);
	const [updateDetails, setUpdateDetails] = useState({});

	useEffect(() => {
		posts.length === 0 && fetchCurrentUserPosts({ _id: data._id });
	}, []);

	return (
		<>
			<section className='container mx-auto py-5 flex flex-col'>
				<div className='bg-white shadow p-5 rounded-xl'>
					<div className='relative'>
						<div className='aspect-w-9 aspect-h-2 relative'>
							<Image
								className='rounded-xl'
								src={data.coverImg}
								alt='Cover Image'
								layout='fill'
								objectFit='cover'
							/>
						</div>
						<div className='absolute right-5 bottom-5 text-white bg-gray-600 hover:bg-gray-700 transition rounded-full'>
							<button
								className='p-3 flex items-center justify-center'
								onClick={() => {
									coverImgRef.current.childNodes[0].click();
								}}>
								<BsImage />
							</button>
							<div className='hidden' ref={coverImgRef}>
								<FileBase
									type='file'
									multiple={false}
									onDone={({ base64 }) => {
										updateCoverImg({
											_id: data._id,
											img: base64,
										});
									}}
								/>
							</div>
						</div>
					</div>
					<div className='flex justify-between items-end -mt-16'>
						<div className='flex items-end'>
							<div className='relative'>
								<div className='aspect-1 w-[150px] ring-4 ring-white rounded-full relative'>
									<Image
										className='rounded-full'
										src={data.profileImg}
										alt='Profile Picture'
										objectFit='cover'
										layout='fill'
									/>
								</div>
								<div className='absolute right-0 bottom-0 text-black bg-gray-200 hover:bg-gray-300 transition rounded-full'>
									<button
										className='p-3 flex items-center justify-center'
										onClick={() => {
											profileImgRef.current.childNodes[0].click();
										}}>
										<BsImage />
									</button>
									<div className='hidden' ref={profileImgRef}>
										<FileBase
											type='file'
											multiple={false}
											onDone={({ base64 }) => {
												updateProfileImg({
													_id: data._id,
													img: base64,
												});
											}}
										/>
									</div>
								</div>
							</div>
							<p className='ml-3 font-semibold text-2xl'>
								@{data.username}
							</p>
						</div>
						<div className='flex items-center space-x-10'>
							<div className='flex flex-col items-center'>
								<p className='text-4xl font-semibold text-green-600'>
									{data.connections?.length}
								</p>
								<p className='text-gray-700 font-light'>
									Connections
								</p>
							</div>
							<div className='flex flex-col items-center'>
								<p className='text-4xl font-semibold text-violet-600'>
									{data.connections?.length}
								</p>
								<p className='text-gray-700 font-light'>
									Connected
								</p>
							</div>
						</div>
					</div>
				</div>
				<div className='bg-white shadow p-5 rounded-xl mt-5'>
					<div className='flex justify-between items-start'>
						<div>
							<p className='text-2xl'>{data.fullName}</p>
							<p className='mt-1 text-violet-600'>{data.job}</p>
						</div>
						<button
							className='px-4 py-2 hover:bg-violet-50 hover:ring-2 transition-all text-violet-600 ring-violet-600 ring-1 rounded-md flex items-center gap-3'
							onClick={() => {
								setUpdateDetails(data);
								setShowUpdate(true);
							}}>
							Update <RiEditCircleFill />
						</button>
					</div>
					<p className='mt-5 text-gray-700'>{data.description}</p>
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
				<div className='flex justify-between items-center mt-10'>
					<p className='text-2xl font-medium'>Posts</p>
					<button
						className='px-4 py-2 bg-violet-600 text-white rounded-md hover:bg-violet-700 flex items-center gap-3'
						onClick={() => setShow(true)}>
						Create Post <FiPlus />
					</button>
				</div>

				{postsStatus === STATUSTEXT.LOADING ? (
					<div className='mt-5'>
						<Loader />
					</div>
				) : (
					<div className='grid grid-cols-12 gap-5 mt-5'>
						{posts.length === 0
							? 'No Post Yet'
							: posts.map((post, idx) => (
									<div
										key={idx}
										className='relative col-span-3'>
										<div className='aspect-1 relative peer'>
											<Image
												onClick={() => {
													setSetPost(post);
													setShowPost(true);
												}}
												placeholder='blur'
												blurDataURL={post.img}
												src={post.img}
												quality={10}
												alt='Post'
												objectFit='cover'
												layout='fill'
												className='rounded-xl cursor-pointer'
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
				show={show}
				width={'500px'}
				notFull={true}
				setShow={() => {
					setError('');
					setShow(false);
				}}>
				<div className='flex flex-col items-center p-5'>
					<p className='text-2xl font-semibold w-full'>Create Post</p>
					{error && (
						<div className='bg-red-50 px-4 py-3 rounded-md border-x-2 border-red-600 w-full mt-5'>
							<p className='text-red-600 text-sm text-left'>
								* {error}
							</p>
						</div>
					)}
					<button
						className='w-full px-4 py-2 bg-violet-600 text-white rounded-md hover:bg-violet-700 mt-5'
						onClick={() => {
							setError('');
							createPostRef.current.childNodes[0].click();
						}}>
						Choose Image
					</button>
					<div className='hidden' ref={createPostRef}>
						<FileBase
							type='file'
							multiple={false}
							onDone={({ base64 }) => {
								setPostImg(base64);
							}}
						/>
					</div>
					{postImg !== '' && (
						<div className='aspect-w-16 aspect-h-9 w-full mt-5 relative'>
							<Image
								src={postImg}
								layout='fill'
								objectFit='contain'
							/>
						</div>
					)}
					<form
						className='w-full'
						onSubmit={async (e) => {
							e.preventDefault();
							if (postImg) {
								await createPost({
									_id: data._id,
									img: postImg,
									caption: caption.current.value,
								});
								setPostImg('');
								caption.current.value = '';
								setShow(false);
							} else {
								setError('Please choose an image');
							}
						}}>
						<input
							// required
							className='placeholder:text-gray-400 mt-5 w-full rounded-xl ring-gray-400 ring-1 focus:ring-2 focus:ring-violet-600 focus:bg-violet-50 py-2 px-4 outline-none'
							type='text'
							placeholder='Location'
							// ref={caption}
						/>
						<input
							required
							className='placeholder:text-gray-400 mt-5 w-full rounded-xl ring-gray-400 ring-1 focus:ring-2 focus:ring-violet-600 focus:bg-violet-50 py-2 px-4 outline-none'
							type='text'
							placeholder='Caption'
							ref={caption}
						/>
						<button
							type='submit'
							className='w-full mt-5 bg-violet-600 text-white px-4 py-2 rounded-md hover:bg-violet-700'>
							Submit
						</button>
					</form>
				</div>
			</Modal>
			<Modal
				show={showUpdate}
				notFull={true}
				setShow={() => {
					setShowUpdate(false);
				}}
				width={'500px'}>
				{updateDetails?._id && (
					<div className='p-5 w-full overflow-scroll'>
						<h1 className='text-xl text-center'>Update Details</h1>
						<form
							onSubmit={async (e) => {
								e.preventDefault();
								setIsdisabled(true);
								await updateUserDetails(updateDetails);
								setIsdisabled(false);
								setUpdateDetails({});
								setShowUpdate(false);
							}}
							className='flex flex-col space-y-6 items-stretch text-sm mt-2'>
							<div className='flex flex-col'>
								<label
									htmlFor='fullName'
									className='text-sm mb-1 text-violet-600'>
									Full Name
								</label>
								<input
									autoFocus
									required
									type='text'
									className='rounded-md px-4 py-2 ring-gray-300 ring-1 focus:ring-violet-600 outline-none focus:ring-2 focus:bg-violet-50 transition'
									value={updateDetails.fullName}
									id='fullName'
									onChange={(e) => {
										setUpdateDetails((prev) => ({
											...prev,
											fullName: e.target.value,
										}));
									}}
									placeholder='Full Name'
								/>
							</div>
							<div className='flex flex-col'>
								<label
									htmlFor='job'
									className='text-sm mb-1 text-violet-600'>
									Job
								</label>
								<input
									required
									type='text'
									className='rounded-md px-4 py-2 ring-gray-300 ring-1 focus:ring-violet-600 outline-none focus:ring-2 focus:bg-violet-50 transition'
									id='job'
									placeholder='Job / Currently Working'
									value={updateDetails.job}
									onChange={(e) => {
										setUpdateDetails((prev) => ({
											...prev,
											job: e.target.value,
										}));
									}}
								/>
							</div>
							<div className='flex flex-col'>
								<label
									htmlFor='description'
									className='text-sm mb-1 text-violet-600'>
									Description
								</label>
								<textarea
									required
									className='resize-none rounded-md px-4 py-2 ring-gray-300 ring-1 focus:ring-violet-600 outline-none focus:ring-2 focus:bg-violet-50 transition'
									id='description'
									placeholder='Description'
									rows={2}
									value={updateDetails.description}
									onChange={(e) => {
										setUpdateDetails((prev) => ({
											...prev,
											description: e.target.value,
										}));
									}}
								/>
							</div>
							<div className='flex flex-col'>
								<label
									htmlFor='tags'
									className='text-sm mb-1 text-violet-600'>
									Tags
								</label>
								<input
									required
									type='text'
									className='rounded-md px-4 py-2 ring-gray-300 ring-1 focus:ring-violet-600 outline-none focus:ring-2 focus:bg-violet-50 transition'
									id='tags'
									placeholder='Tags'
									value={updateDetails.tags}
									onChange={(e) => {
										setUpdateDetails((prev) => ({
											...prev,
											tags: e.target.value,
										}));
									}}
								/>
							</div>
							<div className='flex flex-col'>
								<label
									htmlFor='facebook'
									className='text-sm mb-1 text-violet-600'>
									Facebook
								</label>
								<input
									required
									type='text'
									className='rounded-md px-4 py-2 ring-gray-300 ring-1 focus:ring-violet-600 outline-none focus:ring-2 focus:bg-violet-50 transition'
									id='facebook'
									placeholder='Facebook'
									value={updateDetails.facebook}
									onChange={(e) => {
										setUpdateDetails((prev) => ({
											...prev,
											facebook: e.target.value,
										}));
									}}
								/>
							</div>
							<div className='flex flex-col'>
								<label
									htmlFor='twitter'
									className='text-sm mb-1 text-violet-600'>
									Twitter
								</label>
								<input
									required
									type='text'
									className='rounded-md px-4 py-2 ring-gray-300 ring-1 focus:ring-violet-600 outline-none focus:ring-2 focus:bg-violet-50 transition'
									id='twitter'
									placeholder='Twitter'
									value={updateDetails.twitter}
									onChange={(e) => {
										setUpdateDetails((prev) => ({
											...prev,
											twitter: e.target.value,
										}));
									}}
								/>
							</div>
							<div className='flex flex-col'>
								<label
									htmlFor='instagram'
									className='text-sm mb-1 text-violet-600'>
									Instagram
								</label>
								<input
									required
									type='text'
									className='rounded-md px-4 py-2 ring-gray-300 ring-1 focus:ring-violet-600 outline-none focus:ring-2 focus:bg-violet-50 transition'
									id='instagram'
									placeholder='Instagram'
									value={updateDetails.instagram}
									onChange={(e) => {
										setUpdateDetails((prev) => ({
											...prev,
											instagram: e.target.value,
										}));
									}}
								/>
							</div>
							<div className='flex flex-col'>
								<label
									htmlFor='github'
									className='text-sm mb-1 text-violet-600'>
									Github
								</label>
								<input
									required
									type='text'
									className='rounded-md px-4 py-2 ring-gray-300 ring-1 focus:ring-violet-600 outline-none focus:ring-2 focus:bg-violet-50 transition'
									id='github'
									placeholder='Github'
									value={updateDetails.github}
									onChange={(e) => {
										setUpdateDetails((prev) => ({
											...prev,
											github: e.target.value,
										}));
									}}
								/>
							</div>
							<div className='flex items-center space-x-2'>
								<button
									type='submit'
									disabled={isdisabled}
									className='bg-violet-600 py-2 rounded-md hover:bg-violet-700 text-white disabled:bg-violet-300 transition w-full'>
									{isdisabled ? 'Updating...' : 'Submit'}
								</button>
								<button
									type='button'
									disabled={isdisabled}
									className='hover:bg-red-50 py-2 rounded-md text-red-500 disabled:bg-red-200 disabled:text-white ring-1 ring-red-500 transition w-full'
									onClick={() => {
										setShowUpdate(false);
									}}>
									Cancel
								</button>
							</div>
						</form>
					</div>
				)}
			</Modal>
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
						self={true}
					/>
				)}
			</Modal>
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
		fetchCurrentUserPosts: (data) => dispatch(fetchCurrentUserPosts(data)),
		updateUserDetails: (data) => dispatch(updateUserDetails(data)),
		updateCoverImg: (data) => dispatch(updateCoverImg(data)),
		updateProfileImg: (data) => dispatch(updateProfileImg(data)),
		createPost: (data) => dispatch(createPost(data)),
		handleComment: (data) => dispatch(handleComment(data)),
		handleLikePost: (data) => dispatch(handleLikePost(data)),
		updatePostLikes: (data) => dispatch(updatePostLikes(data)),
		addComment: (data) => dispatch(addComment(data)),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(Profile);
