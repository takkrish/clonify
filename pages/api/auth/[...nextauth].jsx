import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import { MongoDB_Users } from '../../../db';
// import { MongoDBAdapter } from '@next-auth/mongodb-adapter';

export default NextAuth({
	providers: [
		GoogleProvider({
			clientId: process.env.GOOGLE_ID,
			clientSecret: process.env.GOOGLE_SECRET,
			authorization: {
				url: 'https://accounts.google.com/o/oauth2/v2/auth?prompt=consent&access_type=offline&response_type=code',
			},
			// profile: (profile) => {
			// 	return {
			// 		id: profile.sub,
			// 		...profile,
			// 		img: 'img',
			// 		data: 'data',
			// 		connections: [],
			// 	};
			// },
		}),
		// CredentialsProvider({
		// 	name: 'credentials',
		// 	type: 'credentials',
		// 	id: 'credentials',
		// 	// credentials: {
		// 	// 	email: {
		// 	// 		label: 'email',
		// 	// 		placeholder: 'email',
		// 	// 		type: 'email',
		// 	// 	},
		// 	// 	password: {
		// 	// 		label: 'password',
		// 	// 		type: 'password',
		// 	// 		placeholder: 'password',
		// 	// 	},
		// 	// },
		// 	async authorize(data, req) {
		// 		if (data.signin) {
		// 			const res = await fetch('/api/signin', {
		// 				method: 'POST',
		// 				headers: {
		// 					'content-type': 'application/json',
		// 				},
		// 				body: JSON.stringify({
		// 					email: data.email,
		// 					password: data.password,
		// 				}),
		// 			});
		// 			const user = await res.json();
		// 			if (res.status !== 200) {
		// 				return false;
		// 			}
		// 			return user;
		// 		}
		// 		const { collection, client } = await MongoDB_Users();
		// 		const user = await collection.findOne(
		// 			{
		// 				email: data.email,
		// 			},
		// 			{
		// 				$projection: {
		// 					_id: 0,
		// 					email: 1,
		// 				},
		// 			}
		// 		);
		// 		if (user) {
		// 			return false;
		// 		}
		// 		const newUser = await fetch('/api/signup', {
		// 			method: 'POST',
		// 			headers: {
		// 				'content-type': 'application/json',
		// 			},
		// 			body: JSON.stringify(),
		// 		});
		// 	},
		// }),
	],
	secret: process.env.NEXTAUTH_SECRET,
	// callbacks: {
	// 	signIn: async (data) => {
	// 		// console.log('signin', data);
	// 		// const { collection, client } = await MongoDB_Users();
	// 		// const user = await collection.findOne(
	// 		// 	{
	// 		// 		email: data.user.email,
	// 		// 	},
	// 		// 	{
	// 		// 		$projection: {
	// 		// 			_id: 0,
	// 		// 			email: 1,
	// 		// 		},
	// 		// 	}
	// 		// );
	// 		// if (user) {
	// 		// 	client.close();
	// 		// 	return true;
	// 		// }
	// 		// if (!data.credentials) {
	// 		// 	const newUser = await collection.insertOne({
	// 		// 		email: data.user.email,
	// 		// 		password: null,
	// 		// 		job: '',
	// 		// 		description: '',
	// 		// 		tags: '',
	// 		// 		facebook: 'https://facebook.com',
	// 		// 		twitter: 'https://twitter.com',
	// 		// 		instagram: 'https://instagram.com',
	// 		// 		github: 'https://github.com',
	// 		// 		profileImg: '/empty.png',
	// 		// 		coverImg: '/empty.png',
	// 		// 		connections: [],
	// 		// 		connected: [],
	// 		// 		posts: [],
	// 		// 	});
	// 		// 	console.log(newUser);
	// 		// 	return true;
	// 		// } else {
	// 		// }
	// 		// client.close();
	// 	},
	// 	// session: async (data) => {
	// 	// 	console.log('session : ', data);
	// 	// 	return data.session;
	// 	// },
	// },
	// session: {
	// 	strategy: 'jwt',
	// 	updateAge: 60 * 60 * 24,
	// 	maxAge: 30 * 24 * 60 * 60,
	// },
	// jwt: {
	// 	maxAge: 60 * 60 * 24 * 30,
	// },
	// adapter: MongoDBAdapter(
	// 	MongoClient.connect(
	// 		`mongodb+srv://${process.env.MONGO_ID}:${process.env.MONGO_PASSWORD}@next-app.5pxymxl.mongodb.net/?retryWrites=true&w=majority`,
	// 		{
	// 			useUnifiedTopology: true,
	// 			useNewUrlParser: true,
	// 		}
	// 	)
	// ),
});
