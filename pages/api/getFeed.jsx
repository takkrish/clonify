import { ObjectId } from 'mongodb';
import { MongoDB_Posts } from '../../db';
const getFeed = async (req, res) => {
	const { collection, client } = await MongoDB_Posts();
	const { method, body } = req;
	switch (method) {
		case 'POST': {
			try {
				const ids = body.ids.map((id) => ObjectId(id));
				const data = await collection
					.find({ userId: { $in: ids } })
					.sort({ date: -1 })
					.toArray();
				res.status(200).send(data);
			} catch (error) {
				res.status(409).json({ message: error.message });
			}
		}
	}
	client.close();
};
export default getFeed;
