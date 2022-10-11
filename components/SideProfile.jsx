import Image from 'next/image';
import Link from 'next/link';
import { BsImage } from 'react-icons/bs';
import { FaVideo } from 'react-icons/fa';
import { connect } from 'react-redux';

const SideProfile = ({ currentUser }) => {
	return (
		<>
			{currentUser.exists && (
				<div className='bg-white p-5 rounded-xl shadow'>
					<div className='flex flex-col mb-3'>
						<div className='flex items-center'>
							<div className='h-[40px] w-[40px] border-[2.5px] border-white relative'>
								<Image
									src={currentUser.data.profileImg}
									alt='image'
									layout='fill'
									objectFit='cover'
									className='rounded-full'
								/>
							</div>
							<div className='ml-2'>
								<Link href='/profile'>
									<p className='text-gray-700 font-semibold text-sm cursor-pointer'>
										{currentUser.data.username}
									</p>
								</Link>
								<p className='text-xs text-gray-500'>
									Currently working at company
								</p>
							</div>
						</div>
						{/* <p className='text-violet-600 mt-3 text-sm'>
							Want to tell something to your friends ?
						</p> */}
						<textarea
							placeholder={`What do you think, ${
								currentUser.data.fullName.split(' ')[0]
							}?`}
							rows={4}
							className='outline-none border-none bg-gray-100 w-full text-sm resize-none p-3 rounded-md mt-5 placeholder:text-gray-500 focus:ring-violet-600 ring-1 ring-gray-100 focus:bg-violet-50'></textarea>
						<hr className='my-5' />
						<div className='flex justify-between space-x-5'>
							<button className='bg-violet-600 text-white flex py-2 items-center justify-center rounded-full w-full hover:bg-violet-700 transition'>
								<BsImage />
								<p className='ml-2 text-sm'>Image</p>
							</button>
							<button className='text-violet-600 bg-white ring-1 ring-violet-600 flex py-2 items-center justify-center rounded-full w-full hover:ring-2 transition'>
								<FaVideo />
								<p className='ml-2 text-sm'>Video</p>
							</button>
						</div>
					</div>
				</div>
			)}
		</>
	);
};

const mapStateToProps = (state) => {
	return {
		currentUser: state.currentUser,
	};
};

export default connect(mapStateToProps)(SideProfile);
