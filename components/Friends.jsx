import Link from 'next/link';
import Image from 'next/image';
import { BsThreeDots } from 'react-icons/bs';
import { GoPrimitiveDot } from 'react-icons/go';
import { connect } from 'react-redux';
import { STATUSTEXT } from '../redux/constants';
import Loader from './Loader';

const Friends = ({ friends }) => {
	if (friends.status === STATUSTEXT.ERROR)
		return <p className='text-red-500'>Error Occured</p>;

	return (
		<>
			<div className='bg-white rounded-xl shadow'>
				<div className='flex justify-between items-center p-5'>
					<p className='font-semibold'>Friends</p>
					<BsThreeDots />
				</div>
				<div className='max-h-[45vh] overflow-scroll px-5'>
					{friends.status === STATUSTEXT.LOADING ? (
						<div className='pb-5'>
							<Loader />
						</div>
					) : (
						<>
							{friends.data.map((friend, idx) => (
								<div
									key={idx}
									className='flex justify-between items-center mb-3'>
									<Link href={`/profile/${friend.username}`}>
										<div className='flex items-center cursor-pointer'>
											<div className='relative w-[30px] aspect-1'>
												<Image
													src={friend.profileImg}
													layout='fill'
													className='rounded-full'
													objectFit='cover'
												/>
											</div>
											<p className='ml-3'>
												{friend.fullName}
											</p>
										</div>
									</Link>
									<GoPrimitiveDot className='text-green-500' />
								</div>
							))}
						</>
					)}
				</div>
			</div>
		</>
	);
};

const mapStateToProps = (state) => {
	return {
		friends: state.currentUser.friends,
	};
};

export default connect(mapStateToProps)(Friends);
