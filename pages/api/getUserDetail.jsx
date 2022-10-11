import { MongoDB_Users } from '../../db';

const getUserDetail = async (req, res) => {
	const { collection, client } = await MongoDB_Users();
	const { method, body } = req;
	switch (method) {
		case 'POST': {
			try {
				const user = await collection.findOne(
					{
						username: body.username,
					},
					{
						projection: {
							password: 0,
						},
					}
				);
				if (user) res.status(200).send(user);
				else res.status(404).send({ message: 'No User Found' });
			} catch (error) {
				res.status(409).json({ message: error.message });
			}
		}
	}
	client.close();
};
export default getUserDetail;
