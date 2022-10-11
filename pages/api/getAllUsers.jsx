import { ObjectId } from 'mongodb';
import { MongoDB_Users } from '../../db';
const getAllUsers = async (req, res) => {
	const { collection, client } = await MongoDB_Users();
	const { method, body } = req;
	switch (method) {
		case 'POST': {
			try {
				const users = await collection
					.find(
						{
							_id: {
								$ne: ObjectId(body._id),
							},
						},
						{
							projection: {
								profileImg: 1,
								username: 1,
								fullName: 1,
								description: 1,
							},
						}
					)
					.toArray();
				res.status(200).send(users);
			} catch (error) {
				res.status(409).json({ message: error.message });
			}
			break;
		}
	}
	client.close();
};
export default getAllUsers;
