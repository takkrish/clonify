import { ObjectId } from 'mongodb';
import { MongoDB_Users } from '../../db';
import { cloudinary } from '../../cloudinary';

const update = async (req, res) => {
	const { collection, client } = await MongoDB_Users();
	const { method, body } = req;
	switch (method) {
		case 'PUT': {
			try {
				if (body.updateCover) {
					const imgData = await cloudinary.uploader.upload(body.img, {
						upload_preset: 'next-app',
						public_id: body.uuid,
					});
					await collection.findOneAndUpdate(
						{ _id: ObjectId(body._id) },
						{
							$set: {
								coverImg: imgData.secure_url,
							},
						}
					);
				} else {
					const imgData = await cloudinary.uploader.upload(body.img, {
						upload_preset: 'next-app',
						public_id: body.uuid,
					});
					await collection.findOneAndUpdate(
						{ _id: ObjectId(body._id) },
						{
							$set: {
								profileImg: imgData.secure_url,
							},
						}
					);
				}
				res.status(200).json({ message: 'Updated Successfully' });
			} catch (error) {
				res.status(409).json({ message: error.message });
			}
			client.close();
		}
	}
	client.close();
};
export default update;
