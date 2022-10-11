import { MongoClient } from 'mongodb';

export const MongoDB_Users = async () => {
	const client = await MongoClient.connect(
		`mongodb+srv://${process.env.MONGO_ID}:${process.env.MONGO_PASSWORD}@next-app.5pxymxl.mongodb.net/?retryWrites=true&w=majority`,
		{
			useUnifiedTopology: true,
			useNewUrlParser: true,
		}
	);
	const db = client.db('User');
	const collection = db.collection('Users');
	return { collection, client, db };
};
export const MongoDB_Posts = async () => {
	const client = await MongoClient.connect(
		`mongodb+srv://${process.env.MONGO_ID}:${process.env.MONGO_PASSWORD}@next-app.5pxymxl.mongodb.net/?retryWrites=true&w=majority`,
		{
			useUnifiedTopology: true,
			useNewUrlParser: true,
		}
	);
	const db = client.db('Post');
	const collection = db.collection('Posts');
	return { collection, client, db };
};
