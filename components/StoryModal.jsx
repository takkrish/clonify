import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';
import { AiOutlineHeart, AiOutlineShareAlt } from 'react-icons/ai';
import { FiPause, FiPlus, FiVolume2, FiVolumeX } from 'react-icons/fi';
import {
	MdOutlineKeyboardArrowLeft,
	MdOutlineKeyboardArrowRight,
} from 'react-icons/md';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import Loader from '../components/Loader';
import Link from 'next/link';
dayjs.extend(relativeTime);

const StoryModal = ({ show, onHide, stories, friend }) => {
	const inputRef = useRef(null);
	const storyRef = useRef(null);

	const [storyIndex, setStoryIndex] = useState(0);
	const [timer, setTimer] = useState(null);
	const [duration, setDuration] = useState(3);
	const [playing, setPlaying] = useState(false);
	const [muted, setMuted] = useState(true);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		show
			? document.querySelector('body').classList.add('overflow-hidden')
			: document
					.querySelector('body')
					.classList.remove('overflow-hidden');
	}, [show]);

	useEffect(() => {
		inputRef.current.value = '';
		setLoading(true);
		setPlaying(false);
		storyIndex === stories?.length && hide();
	}, [storyIndex]);

	const handleMute = () => {
		storyRef.current.muted
			? (storyRef.current.muted = false)
			: (storyRef.current.muted = true);
		setMuted((prev) => !prev);
	};

	const hide = () => {
		storyRef.current.muted = true;
		setMuted(true);
		setStoryIndex(0);
		setDuration(3);
		setLoading(true);
		setPlaying(false);
		setTimer(null);
		onHide();
	};

	return (
		<>
			<div
				className={`fixed inset-0 z-50 flex justify-center transition-all ${
					show
						? 'opacity-100 pointer-events-auto delay-75'
						: 'opacity-0 pointer-events-none'
				}`}>
				<div
					className='absolute inset-0 bg-black bg-opacity-50 z-10 backdrop-blur-md'
					onClick={hide}></div>
				<button
					className='p-2 hover:bg-white rounded-full text-gray-900 bg-gray-100 transition-all absolute right-5 top-5 z-30'
					onClick={hide}>
					<FiPlus className='rotate-45 text-2xl font-bold' />
				</button>
				<div
					className={`max-h-[95vh] bg-black rounded-xl mt-[2.5vh] z-20 w-[500px] transition-all flex flex-col p-5 space-y-5 ${
						show ? 'scale-[1] delay-75' : 'scale-[0.95]'
					}`}>
					<div className='flex space-x-1'>
						{stories.map((story, idx) => (
							<div
								key={idx}
								className='relative h-[2px] w-full rounded-full bg-gray-400 overflow-hidden'>
								<span
									className={`absolute top-0 left-0 h-full bg-white rounded-full ${
										idx < storyIndex && 'progressbar-full'
									} ${
										idx > storyIndex && 'progressbar-zero'
									} ${idx === storyIndex && 'progressbar'}`}
									style={{
										animationDuration: duration + 's',
										animationPlayState:
											playing && idx === storyIndex
												? 'running'
												: 'paused',
									}}></span>
							</div>
						))}
					</div>
					<div className='flex items-center space-x-5'>
						<div className='h-[40px] aspect-1 relative'>
							{friend._id && (
								<Image
									src={friend.profileImg}
									alt='image'
									className='rounded-full'
									layout='fill'
									objectFit='cover'
								/>
							)}
						</div>
						<div className='text-sm text-white flex justify-between items-center w-full'>
							<div>
								<Link href={'/profile'}>
									<p className='cursor-pointer font-medium'>
										{friend.username}
									</p>
								</Link>
								<p className='text-gray-400 text-xs'>
									{dayjs(stories[storyIndex]?.date).fromNow()}
								</p>
							</div>
							<div className='flex space-x-5 cursor-pointer'>
								{!playing && (
									<FiPause className='text-gray-200 text-xl' />
								)}
								{muted ? (
									<FiVolumeX
										className='text-gray-400 text-xl'
										onClick={() => handleMute()}
									/>
								) : (
									<FiVolume2
										className='text-gray-200 text-xl'
										onClick={() => handleMute()}
									/>
								)}
							</div>
						</div>
					</div>
					<div className='flex-grow grid place-items-center relative'>
						{loading && <Loader />}
						<video
							onWaiting={() => {
								setPlaying(false);
							}}
							preload='metadata'
							ref={storyRef}
							id='story'
							src={stories[storyIndex]?.src}
							autoPlay
							muted
							className={`w-full ${loading && 'hidden'}`}
							onMouseDown={() => {
								const time = setTimeout(() => {
									storyRef.current.pause();
								}, 100);
								setTimer(time);
							}}
							onMouseUp={() => {
								storyRef.current.play();
								clearTimeout(timer);
								setTimer(null);
							}}
							onClick={() => {
								handleMute();
							}}
							onCanPlayThrough={() => {
								setLoading(false);
							}}
							onPause={() => {
								setPlaying(false);
							}}
							onPlay={() => {
								setDuration(storyRef.current.duration);
								setPlaying(true);
							}}
							onEnded={() => {
								setDuration(3);
								setStoryIndex((prev) => prev + 1);
							}}></video>
					</div>
					<div className='flex w-full items-center space-x-5'>
						<form className='w-full'>
							<input
								type='text'
								ref={inputRef}
								onFocus={() => {
									setPlaying(false);
									storyRef.current.pause();
								}}
								onBlur={() => {
									setPlaying(true);
									storyRef.current.play();
								}}
								className='bg-transparent rounded-full w-full px-4 py-2 outline-none ring-1 focus:ring-gray-200 placeholder:text-gray-400 text-gray-200 font-light ring-gray-400'
								placeholder='Reply ...'
							/>
						</form>
						<AiOutlineHeart className='text-3xl hover:text-gray-200 text-gray-400' />
						<AiOutlineShareAlt className='text-3xl hover:text-gray-200 text-gray-400' />
					</div>
					{storyIndex !== 0 && (
						<div
							className='text-white cursor-pointer absolute top-1/2  transform -translate-y-1/2 -left-16 hover:bg-black hover:bg-opacity-10 transition rounded-md flex justify-center items-center px-3 py-6 text-2xl'
							onClick={() => {
								setDuration(3);
								setStoryIndex((prev) => prev - 1);
							}}>
							<MdOutlineKeyboardArrowLeft />
						</div>
					)}
					{storyIndex !== stories?.length - 1 && (
						<div
							className='text-white cursor-pointer absolute top-1/2 transform -translate-y-1/2 -right-16 hover:bg-black hover:bg-opacity-10 transition rounded-md flex justify-center items-center px-3 py-6 text-2xl'
							onClick={() => {
								setDuration(3);
								setStoryIndex((prev) => prev + 1);
							}}>
							<MdOutlineKeyboardArrowRight />
						</div>
					)}
				</div>
				{/* <div
					className='absolute left-1/2 -translate-x-1/2 z-20 top-10 scale-90 transition-all flex flex-col opacity-0 px-16'
					// ref={dialogRef}
				>
					<div className='container h-[91vh] flex justify-center'>
						<div className='bg-black h-full w-[500px] rounded-xl flex flex-col space-y-5 p-5'>
							<div className='flex space-x-1'>
								{stories?.map((story, idx) => (
									<div
										key={idx}
										className='relative h-[2px] w-full rounded-full bg-gray-400 overflow-hidden'>
										<span
											className={`absolute top-0 left-0 h-full bg-white rounded-full ${
												idx < storyIndex &&
												'progressbar-full'
											} ${
												idx > storyIndex &&
												'progressbar-zero'
											} ${
												idx === storyIndex &&
												'progressbar'
											}`}
											style={{
												animationDuration:
													duration + 's',
												animationPlayState:
													playing &&
													idx === storyIndex
														? 'running'
														: 'paused',
											}}></span>
									</div>
								))}
							</div>
							<div className='flex items-center space-x-5'>
								<div className='h-[40px] aspect-1 relative'>
									{friend?._id && (
										<Image
											src={friend.profileImg}
											alt='image'
											className='rounded-full'
											layout='fill'
											objectFit='cover'
										/>
									)}
								</div>
								<div className='text-sm text-white flex justify-between items-center  w-full'>
									<div>
										<p
											className='cursor-pointer font-medium'
											onClick={() => {
												// handleClose();
												router.push(
													`/profile/${friend._id}`
												);
											}}>
											{friend?.username}
										</p>
										<p className='text-gray-400 text-xs'>
											{dayjs(
												stories[storyIndex]?.date
											).fromNow()}
										</p>
									</div>
									<div className='text-2xl flex space-x-3 cursor-pointer'>
										{muted ? (
											<MdOutlineMusicOff
												className='text-gray-400'
												onClick={() => handleMute()}
											/>
										) : (
											<MdOutlineMusicNote
												className='text-gray-200'
												onClick={() => handleMute()}
											/>
										)}
										{!playing && <MdMotionPhotosPaused />}
									</div>
								</div>
							</div>
							<div className='flex-grow grid place-items-center relative'>
								{loading && <Loader />}
								{stories.length !== 0 && (
									// stories[ storyIndex ]?.type === 'video' &&
									<video
										onWaiting={() => {
											setPlaying(false);
										}}
										preload='metadata'
										ref={storyRef}
										id='story'
										src={stories[storyIndex]?.src}
										autoPlay
										muted
										className={`w-full ${
											loading && 'hidden'
										}`}
										onMouseDown={() => {
											storyRef.current.pause();
										}}
										onMouseUp={() => {
											storyRef.current.play();
										}}
										onClick={() => {
											handleMute();
										}}
										onCanPlayThrough={() => {
											setLoading(false);
										}}
										onPause={() => {
											setPlaying(false);
										}}
										onPlay={() => {
											setDuration(
												storyRef.current.duration
											);
											setPlaying(true);
										}}
										onEnded={() => {
											setDuration(3);
											setStoryIndex((prev) => prev + 1);
										}}></video>
								)}
								{storyIndex !== 0 && (
									<MdOutlineKeyboardArrowLeft
										className='text-white cursor-pointer text-2xl absolute top-1/2 bottom-1/2 -left-16 hover:bg-black transition rounded-full'
										onClick={() => {
											setDuration(3);
											setStoryIndex((prev) => prev - 1);
										}}
									/>
								)}
								{storyIndex !== stories?.length - 1 && (
									<MdOutlineKeyboardArrowRight
										className='text-white cursor-pointer text-2xl absolute top-1/2 bottom-1/2 -right-16 hover:bg-black transition rounded-full'
										onClick={() => {
											setDuration(3);
											setStoryIndex((prev) => prev + 1);
										}}
									/>
								)}
							</div>
							<div className='flex w-full items-center space-x-5'>
								<form className='w-full'>
									<input
										type='text'
										className='bg-transparent rounded-full w-full ring-1 ring-white placeholder:text-white outline-none text-white px-4 py-2 placeholder:font-light focus:ring-2'
										placeholder='Reply ...'
									/>
								</form>
								<AiOutlineHeart className='text-3xl text-white' />
								<AiOutlineShareAlt className='text-3xl text-white' />
							</div>
						</div>
					</div>
				</div> */}
			</div>
		</>
	);
};

export default StoryModal;

/* This example requires Tailwind CSS v2.0+ */
// import { Fragment, useRef, useState } from 'react';
// import { Dialog, Transition } from '@headlessui/react';
// import { ExclamationIcon } from '@heroicons/react/outline';

// export default function Example({ show }) {
// 	const [open, setOpen] = useState(show);
// 	const cancelButtonRef = useRef(null);

// 	return (
// 		<Transition.Root show={open} as={Fragment}>
// 			<Dialog
// 				as='div'
// 				className='relative z-10'
// 				initialFocus={cancelButtonRef}
// 				onClose={setOpen}>
// 				<Transition.Child
// 					as={Fragment}
// 					enter='ease-out duration-300'
// 					enterFrom='opacity-0'
// 					enterTo='opacity-100'
// 					leave='ease-in duration-200'
// 					leaveFrom='opacity-100'
// 					leaveTo='opacity-0'>
// 					<div className='fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity' />
// 				</Transition.Child>

// 				<div className='fixed z-10 inset-0 overflow-y-auto'>
// 					<div className='flex items-end sm:items-center justify-center min-h-full p-4 text-center sm:p-0'>
// 						<Transition.Child
// 							as={Fragment}
// 							enter='ease-out duration-300'
// 							enterFrom='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'
// 							enterTo='opacity-100 translate-y-0 sm:scale-100'
// 							leave='ease-in duration-200'
// 							leaveFrom='opacity-100 translate-y-0 sm:scale-100'
// 							leaveTo='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'>
// 							<Dialog.Panel className='relative bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:max-w-lg sm:w-full'>
// 								<div className='bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4'>
// 									<div className='sm:flex sm:items-start'>
// 										<div className='mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10'>
// 											<ExclamationIcon
// 												className='h-6 w-6 text-red-600'
// 												aria-hidden='true'
// 											/>
// 										</div>
// 										<div className='mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left'>
// 											<Dialog.Title
// 												as='h3'
// 												className='text-lg leading-6 font-medium text-gray-900'>
// 												Deactivate account
// 											</Dialog.Title>
// 											<div className='mt-2'>
// 												<p className='text-sm text-gray-500'>
// 													Are you sure you want to
// 													deactivate your account? All
// 													of your data will be
// 													permanently removed. This
// 													action cannot be undone.
// 												</p>
// 											</div>
// 										</div>
// 									</div>
// 								</div>
// 								<div className='bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse'>
// 									<button
// 										type='button'
// 										className='w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm'
// 										onClick={() => setOpen(false)}>
// 										Deactivate
// 									</button>
// 									<button
// 										type='button'
// 										className='mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm'
// 										onClick={() => setOpen(false)}
// 										ref={cancelButtonRef}>
// 										Cancel
// 									</button>
// 								</div>
// 							</Dialog.Panel>
// 						</Transition.Child>
// 					</div>
// 				</div>
// 			</Dialog>
// 		</Transition.Root>
// 	);
// }
