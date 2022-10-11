import { ObjectId } from 'mongodb';
import { MongoDB_Posts } from '../../db';
const getExplore = async (req, res) => {
	const { collection, client } = await MongoDB_Posts();
	const { method, body } = req;
	switch (method) {
		case 'POST': {
			try {
				const data = await collection
					.find({ userId: { $ne: ObjectId(body.userId) } })
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
export default getExplore;
