import { ObjectId } from 'mongodb';
import { MongoDB_Posts } from '../../db';
const manageLike = async (req, res) => {
	const { collection, client } = await MongoDB_Posts();
	const { method, body } = req;
	switch (method) {
		case 'PUT':
			{
				try {
					if (body.add) {
						await collection.findOneAndUpdate(
							{
								userId: ObjectId(body.userId),
								uuid: body.uuid,
							},
							{
								$addToSet: {
									likes: body.to,
								},
							}
						);
						res.status(200).json({
							message: 'Like Added Successfully',
						});
					} else {
						const data = await collection.findOneAndUpdate(
							{
								userId: ObjectId(body.userId),
								uuid: body.uuid,
							},
							{
								$pull: {
									likes: body.to,
								},
							}
						);
						res.status(200).json({
							message: 'Like Removed Successfully',
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
export default manageLike;
