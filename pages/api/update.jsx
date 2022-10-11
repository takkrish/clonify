import { ObjectId } from 'mongodb';
import { MongoDB_Users } from '../../db';
const update = async (req, res) => {
	const { collection, client } = await MongoDB_Users();
	const { method, body } = req;
	switch (method) {
		case 'PUT': {
			try {
				await collection.findOneAndUpdate(
					{ _id: ObjectId(body._id) },
					{
						$set: {
							fullName: body.fullName,
							job: body.job,
							description: body.description,
							tags: body.tags,
							facebook: body.facebook,
							twitter: body.twitter,
							instagram: body.instagram,
							github: body.github,
						},
					}
				);
				return res
					.status(200)
					.json({ message: 'Updated Successfully' });
			} catch (error) {
				return res.status(409).json({ message: error.message });
			}
		}
	}
	client.close();
};
export default update;
