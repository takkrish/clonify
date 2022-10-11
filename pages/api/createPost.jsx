import { ObjectId } from 'mongodb';
import { MongoDB_Posts } from '../../db';
import { cloudinary } from '../../cloudinary';
const createPost = async (req, res) => {
	const { method, body } = req;
	const { collection, client } = await MongoDB_Posts();
	switch (method) {
		case 'POST': {
			try {
				const imgData = await cloudinary.uploader.upload(body.img, {
					upload_preset: 'next-app',
					public_id: body.uuid,
				});
				const data = await collection.insertOne({
					userId: ObjectId(body.userId),
					uuid: body.uuid,
					img: imgData.secure_url,
					caption: body.caption,
					likes: [],
					comments: [],
					shares: 0,
					saved: 0,
					date: body.date,
				});
				res.status(200).send(data);
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
// 		const data = await fetch('/api/createPost', {
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

export default createPost;
