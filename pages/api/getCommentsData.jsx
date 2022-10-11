import { ObjectId } from 'mongodb';
import { MongoDB_Users } from '../../db';
const getUserDetail = async (req, res) => {
	const { collection, client } = await MongoDB_Users();
	const { method, body } = req;
	switch (method) {
		case 'POST': {
			try {
				const ids = body.ids.map((id) => ObjectId(id));
				const data = await collection
					.find(
						{
							_id: {
								$in: ids,
							},
						},
						{
							projection: {
								username: 1,
								profileImg: 1,
							},
						}
					)
					.toArray();
				return res.status(200).send(data);
			} catch (error) {
				res.status(409).json({ message: error.message });
			}
			break;
		}
	}
	client.close();
};
export default getUserDetail;
