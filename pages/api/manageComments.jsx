import { ObjectId } from 'mongodb';
import { MongoDB_Posts } from '../../db';
const manageComments = async (req, res) => {
	const { collection, client } = await MongoDB_Posts();
	const { method, body } = req;
	switch (method) {
		case 'PUT':
			{
				try {
					if (body.add) {
						const data = await collection.findOneAndUpdate(
							{
								userId: ObjectId(body.userId),
								uuid: body.uuid,
							},
							{
								$push: {
									comments: body.details,
								},
							}
						);
						res.status(200).json({
							message: 'Comment Added Successfully',
						});
					} else {
						const data = await collection.findOneAndUpdate(
							{
								userId: ObjectId(body.userId),
								uuid: body.uuid,
							},
							{
								$pull: {
									comments: body.details,
								},
							}
						);
						res.status(200).json({
							message: 'Comment Deleted Successfully',
						});
					}
				} catch (error) {
					res.status(409).json({ message: error.message });
				}
			}
			break;
	}
	client.close();
};
export default manageComments;
