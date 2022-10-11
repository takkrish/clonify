import { ObjectId } from 'mongodb';
import { MongoDB_Users } from '../../db';
const manageConnection = async (req, res) => {
	const { collection, client } = await MongoDB_Users();
	const { method, body } = req;
	switch (method) {
		case 'PUT':
			{
				try {
					if (body.add) {
						await collection.findOneAndUpdate(
							{ _id: ObjectId(body._id) },
							{
								$addToSet: {
									connections: body.connection,
								},
							}
						);
						res.status(200).json({
							message: 'Connection Updated Successfully',
						});
					} else {
						await collection.findOneAndUpdate(
							{ _id: ObjectId(body._id) },
							{
								$pull: {
									connections: body.connection,
								},
							}
						);
						res.status(200).json({
							message: 'Connection Updated Successfully',
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
export default manageConnection;
