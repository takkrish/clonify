import { ObjectId } from 'mongodb';
import { MongoDB_Users } from '../../db';
import { cloudinary } from '../../cloudinary';
const createStory = async (req, res) => {
	const { method, body } = req;
	const { collection, client } = await MongoDB_Users();
	switch (method) {
		case 'PUT': {
			try {
				const storyData = await cloudinary.uploader.upload(body.src, {
					upload_preset: 'next-app',
					public_id: body.uuid,
					resource_type: 'auto',
				});
				const data = await collection.findOneAndUpdate(
					{
						_id: ObjectId(body._id),
					},
					{
						$push: {
							stories: {
								uuid: body.uuid,
								src: storyData.secure_url,
								date: body.date,
								type: body.type,
							},
						},
					}
				);
				res.status(200).send(storyData.secure_url);
			} catch (error) {
				res.status(409).json({ message: error.message });
			}
			client.close();
		}
	}
};

// const uploadImage = async (elem) => {
// 	const file = elem.files[0];
// 	const reader = new FileReader();
// 	reader.readAsDataURL(file);
// 	reader.onloadend = async () => {
// 		const data = await fetch('/api/createStory', {
// 			method: 'POST',
// 			headers: {
// 				'content-type': 'application/json',
// 			},
// 			body: JSON.stringify({
// 				file: reader.result,
// 				id: 'id',
// 			}),
// 		}).then((res) => res.json());
// 	};
// };

export const config = {
	api: {
		bodyParser: {
			sizeLimit: '20mb',
		},
	},
};

export default createStory;
