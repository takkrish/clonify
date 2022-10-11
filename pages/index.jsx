import Friends from '../components/Friends';
import Groups from '../components/Groups';
import Feed from '../components/Feed';
import Stories from '../components/Stories';
import SideProfile from '../components/SideProfile';
import Activity from '../components/Activity';
import { useRouter } from 'next/router';
import { connect } from 'react-redux';
import { wrapper } from '../redux/store';
// import { getSession, signIn, signOut, useSession } from 'next-auth/react';
import { middleware } from '../middleware';
import { setWantToLogout } from '../redux/reducers/currentUserSlice';

const Home = (props) => {
	return (
		<>
			<div className='py-5 container mx-auto'>
				<div className='grid grid-cols-12 gap-x-5 items-start'>
					<div className='col-span-3 flex flex-col'>
						<Friends />
						<Groups />
					</div>
					<div className='col-span-6 flex flex-col'>
						<Stories />
						<Feed />
					</div>
					<div className='col-span-3 flex flex-col'>
						<SideProfile />
						<Activity />
					</div>
				</div>
			</div>
		</>
	);
};

export const getServerSideProps = wrapper.getServerSideProps(
	(store) => async (context) => {
		store.dispatch(setWantToLogout(false));
		const auth = await middleware(context.req);
		return auth
			? { props: {} }
			: {
					redirect: {
						destination: '/auth',
						permanent: false,
					},
			  };
	}
);

const mapStateToProps = (state) => {
	return {
		currentUser: state.currentUser,
	};
};

export default connect(mapStateToProps)(Home);
