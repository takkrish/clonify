import { ObjectId } from 'mongodb';
import { MongoDB_Users } from '../../db';
const getFriends = async (req, res) => {
	const { collection, client } = await MongoDB_Users();
	const { method, body } = req;
	switch (method) {
		case 'POST': {
			try {
				const ids = body.ids.map((id) => ObjectId(id));
				const friends = await collection
					.find(
						{
							_id: {
								$in: ids,
							},
						},
						{
							projection: {
								fullName: 1,
								profileImg: 1,
								username: 1,
								stories: 1,
							},
						}
					)
					.toArray();
				res.status(200).send(friends);
			} catch (error) {
				res.status(409).json({ message: error.message });
			}
			break;
		}
	}
	client.close();
};
export default getFriends;
