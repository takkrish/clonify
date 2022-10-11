import Image from 'next/image';
import { BsThreeDots } from 'react-icons/bs';
import { GoPrimitiveDot } from 'react-icons/go';

const Activity = () => {
	return (
		<>
			<div className='mt-5'>
				<div className='flex justify-between items-center'>
					<p className='font-semibold'>Latest Activity</p>
					<BsThreeDots />
				</div>
				<div className='mt-2'>
					<div className='flex items-start bg-white rounded-xl p-3 shadow'>
						<div className='w[40px] h-[40px]'>
							<Image
								src='/friend.png'
								alt='image'
								className='rounded-full'
								width={40}
								height={40}
								layout='fixed'
								objectFit='cover'
							/>
						</div>
						<div className='flex flex-col ml-3  w-full'>
							<p className='text-gray-800 text-sm'>
								<span className='text-violet-600 font-medium'>
									@garima
								</span>
								,
								<span className='text-violet-600 font-medium'>
									@harry{' '}
								</span>
								and 46 others liked your post.
							</p>
							<p className='flex justify-end items-center text-gray-500 text-xs mt-2'>
								<GoPrimitiveDot className='mr-2' /> 5m ago
							</p>
						</div>
					</div>
					<div className='flex items-start bg-white rounded-xl p-3 shadow mt-2'>
						<div className='w-[40px] h-[40px]'>
							<Image
								src='/logo.png'
								alt='image'
								className='rounded-full'
								width='40px'
								height='40px'
								layout='fixed'
								objectFit='cover'
							/>
						</div>
						<div className='flex flex-col ml-3  w-full'>
							<p className='text-gray-800 text-sm'>
								<span className='text-violet-600 font-medium'>
									@peter
								</span>{' '}
								tagged you in a post , This is so beautiful!,
								isn't it
								<span className='text-green-600 font-medium'>
									{' '}
									@username
								</span>
							</p>
							<p className='flex justify-end items-center text-gray-500 text-xs mt-2'>
								<GoPrimitiveDot className='mr-2' /> 12m ago
							</p>
						</div>
					</div>
					<div className='flex items-start bg-white rounded-xl p-3 shadow mt-2'>
						<div className='w-[40px] h-[40px]'>
							<Image
								src='/friend.png'
								alt='image'
								className='rounded'
								width='40px'
								height='40px'
								layout='fixed'
								objectFit='cover'
							/>
						</div>
						<div className='flex flex-col ml-3 w-full'>
							<p className='text-gray-800 text-sm'>
								<span className='text-violet-600 font-medium'>
									@jenny
								</span>{' '}
								want to connect to you.
							</p>
							<div className='flex mt-2 space-x-2'>
								<button className='py-1 ring-1 ring-green-600 hover:bg-green-50 text-green-600 hover:ring-2 rounded-full w-full transition'>
									Connect
								</button>
								<button className='py-1 hover:bg-red-50 ring-1 ring-red-600 text-red-600 hover:ring-2 rounded-full w-full transition'>
									Discard
								</button>
							</div>
							<p className='flex justify-end items-center text-gray-500 text-xs mt-2'>
								<GoPrimitiveDot className='mr-2' /> 34m ago
							</p>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default Activity;
