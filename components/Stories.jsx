import Image from 'next/image';
import FileBase from 'react-file-base64';
import { useRef, useState } from 'react';
import { TiPlus } from 'react-icons/ti';
import { connect } from 'react-redux';
import StoryModal from './StoryModal';
import Modal from './Modal';
import { createStory } from '../redux/reducers/currentUserSlice';
import { STATUSTEXT } from '../redux/constants';
import Loader from './Loader';

const checkStoryTime = (date) => {
	const then = new Date(date);
	const now = new Date();
	const msBetweenDates = Math.abs(then.getTime() - now.getTime());
	const hoursBetweenDates = msBetweenDates / (60 * 60 * 1000);
	if (hoursBetweenDates < 24) {
		return true;
	} else {
		return false;
	}
};

const Stories = ({ currentUser, createStory, friends, friendStatus }) => {
	const storyRef = useRef();
	const [error, setError] = useState('');
	const [show, setShow] = useState(false);
	const [open, setOpen] = useState(false);
	const [storyVideo, setStoryVideo] = useState('');
	const [stories, setStories] = useState([]);
	const [selectedFriend, setSelectedFriend] = useState({});

	return (
		<>
			<div className='overflow-x-scroll p-5 rounded-xl no-scrollbar bg-white shadow'>
				<div className='flex'>
					<div className='flex flex-col'>
						<div className='relative cursor-pointer bg-gray-300 h-[70px] w-[70px] rounded-full grid place-items-center'>
							<div
								className='relative w-[65px] h-[65px] border-[2.5px] border-white rounded-full'
								onClick={() => {
									const filtered =
										currentUser?.data?.stories?.filter(
											(story) =>
												checkStoryTime(story.date) &&
												story
										);
									if (filtered && filtered.length !== 0) {
										setSelectedFriend(currentUser.data);
										setStories(filtered);
										setShow(true);
									} else setOpen(true);
								}}>
								<Image
									src={currentUser.data.profileImg}
									className='rounded-full'
									layout='fill'
									objectFit='cover'
								/>
							</div>
							<div
								className='absolute z-10 right-0 bottom-0 hover:scale-110 hover:bg-violet-800 bg-violet-700 ring-2 ring-white text-white rounded-full grid place-items-center w-5 h-5'
								onClick={() => {
									setOpen(true);
								}}>
								<TiPlus />
							</div>
						</div>
						<p className='text-xs text-center mt-2'>Your Story</p>
					</div>
					{friendStatus === STATUSTEXT.LOADING ? (
						<div className='ml-5 mt-5'>
							<Loader />
						</div>
					) : (
						<div className='flex space-x-5 ml-5 pr-5'>
							{friends.map((friend, idx) => {
								if (friend.stories) {
									const filtered = friend.stories.filter(
										(story) =>
											checkStoryTime(story.date) && story
									);
									if (filtered.length !== 0)
										return (
											<div
												key={idx}
												className='flex flex-col w-[70px] overflow-hidden'>
												<div
													className='relative cursor-pointer bg-gradient-to-tr from-sky-600 to-violet-600 h-[70px] w-[70px] rounded-full grid place-items-center'
													onClick={() => {
														setShow(true);
														setSelectedFriend(
															friend
														);
														setStories(filtered);
													}}>
													<div className='h-[65px] w-[65px] relative rounded-full border-[2.5px] border-white'>
														{friend._id && (
															<Image
																src={
																	friend.profileImg
																}
																alt='image'
																className='rounded-full'
																layout='fill'
																objectFit='cover'
															/>
														)}
													</div>
												</div>
												<p className='text-xs text-center mt-2 w-full overflow-hidden text-ellipsis'>
													{friend.username}
												</p>
											</div>
										);
								}
							})}
						</div>
					)}
				</div>
			</div>
			<StoryModal
				show={show}
				stories={stories}
				friend={selectedFriend}
				onHide={() => {
					setStories([]);
					setShow(false);
					setSelectedFriend({});
				}}
			/>
			<Modal
				show={open}
				width={'500px'}
				notFull={true}
				setShow={() => {
					setError('');
					setOpen(false);
				}}>
				<div className='flex flex-col items-center p-5 w-full'>
					<p className='text-2xl font-semibold'>Create Story</p>
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
							storyRef.current.childNodes[0].click();
						}}>
						Choose Video
					</button>
					<div className='hidden' ref={storyRef}>
						<FileBase
							type='file'
							multiple={false}
							onDone={({ type, base64 }) => {
								const str = type;
								const image = str.includes('video');
								if (!image) {
									setError('Please select video only');
									setStoryVideo('');
								} else {
									setError('');
									setStoryVideo(base64);
								}
							}}
						/>
					</div>
					{storyVideo && (
						<div className='aspect-w-16 aspect-h-9 w-full mt-5'>
							<video
								src={storyVideo}
								autoPlay
								controls
								muted></video>
						</div>
					)}
					<form
						className='w-full'
						onSubmit={async (e) => {
							e.preventDefault();
							if (storyVideo) {
								await createStory({
									_id: currentUser.data._id,
									src: storyVideo,
									type: 'video',
								});
								setStoryVideo('');
								setOpen(false);
							} else {
								setError('Please select a video');
							}
						}}>
						<button
							type='submit'
							className='w-full mt-5 bg-violet-600 text-white px-4 py-2 rounded-md hover:bg-violet-700'>
							Submit
						</button>
					</form>
				</div>
			</Modal>
		</>
	);
};

const mapStateToProps = (state) => {
	return {
		currentUser: state.currentUser,
		friends: state.currentUser.friends.data,
		friendStatus: state.currentUser.friends.status,
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		createStory: (data) => dispatch(createStory(data)),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(Stories);
