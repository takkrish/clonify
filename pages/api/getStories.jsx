import { ObjectId } from 'mongodb';
import { MongoDB_Users } from '../../db';
const getExplore = async (req, res) => {
	const { collection, client } = await MongoDB_Users();
	const { method, body } = req;
	switch (method) {
		case 'POST': {
			try {
				const data = await collection
					// .aggregate([
					// 	{
					// 		$unwind: '$stories',
					// 	},
					// 	{
					// 		$sort: {
					// 			'stories.date': -1,
					// 		},
					// 	},
					// ])
					.find(
						{ _id: ObjectId(body._id) },
						{
							projection: {
								stories: 1,
							},
							sortArray: {
								input: '$stories',
								sortby: { date: -1 },
							},
						}
					)
					// .sort({
					// 	stories: {
					// 		'stories.date': -1,
					// 	},
					// })
					.toArray();
				res.status(200).send(data);
			} catch (error) {
				res.status(409).json({ message: error.message });
			}
		}
	}
	client.close();
};
export default getExplore;
