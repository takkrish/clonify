import Link from 'next/link';
import { useRouter } from 'next/router';
import { FiLogOut } from 'react-icons/fi';
import { connect } from 'react-redux';
import axios from 'axios';

const Navbar = () => {
	const router = useRouter();

	return (
		<div className='w-screen bg-white z-50 shadow sticky top-0'>
			<nav className='py-3 container mx-auto grid grid-cols-12 items-center font-light'>
				<div className='col-span-3'>
					<Link href='/'>
						<a className='text-violet-600 font-medium'>Clonify</a>
					</Link>
				</div>
				<div className='col-span-6 mx-auto'>
					<ul className='flex items-center space-x-10 text-gray-400 transition-all duration-100'>
						<Link href='/' passHref>
							<a className='px-4 py-1 hover:text-violet-600 transition text-violet-600'>
								Feed
							</a>
						</Link>
						<Link href='/users'>
							<a className='px-4 py-1 hover:text-violet-600 transition'>
								Users
							</a>
						</Link>
						<Link href='/explore'>
							<a className='px-4 py-1 hover:text-violet-600 transition'>
								Explore
							</a>
						</Link>
						<Link href='/profile'>
							<a className='px-4 py-1 hover:text-violet-600 transition'>
								Accout
							</a>
						</Link>
					</ul>
				</div>
				<div className='col-span-3 flex justify-end'>
					<button
						className='px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition'
						onClick={async () => {
							await axios
								.get('/api/logout')
								.catch((err) => err.response);
							router.push('/auth');
						}}>
						<FiLogOut />
					</button>
				</div>
			</nav>
		</div>
	);
};

const mapStateToProps = (state) => {
	return {
		auth: state.currentUser.exists ? true : false,
	};
};

export default connect(mapStateToProps, null)(Navbar);
