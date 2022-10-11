import '../styles/global.css';
import { wrapper, persist } from '../redux/store';
import Navbar from '../components/Navbar';
import { PersistGate } from 'redux-persist/integration/react';
import { connect } from 'react-redux';
// import { SessionProvider } from 'next-auth/react';

function MyApp({ Component, pageProps, auth }) {
	return (
		<>
			<PersistGate loading={null} persistor={persist}>
				{/* <SessionProvider
					session={pageProps.session}
					refetchInterval={3600}
					refetchOnWindowFocus={false}> */}
				{auth && <Navbar />}
				<Component {...pageProps} />
				{/* </SessionProvider> */}
			</PersistGate>
		</>
	);
}

const mapStateToProps = (state) => {
	return {
		auth: state.currentUser.data._id ? true : false,
	};
};

export default wrapper.withRedux(connect(mapStateToProps)(MyApp));
