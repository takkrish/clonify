import { hash } from 'bcrypt';
import { MongoDB_Users } from '../../db';
import { sign } from 'jsonwebtoken';
import cookie from 'cookie';
const signup = async (req, res) => {
	const { collection, client } = await MongoDB_Users();
	const { method, body } = req;
	switch (method) {
		case 'POST': {
			try {
				const check = await collection.findOne(
					{ email: body.email },
					{
						projection: {
							email: 1,
						},
					}
				);
				if (check)
					return res
						.status(400)
						.json({ message: 'Email Already Exists' });
				const hashedPassword = await hash(body.password, 10);
				const data = await collection.insertOne({
					...body,
					password: hashedPassword,
					job: '',
					description: '',
					tags: '',
					facebook: 'https://facebook.com',
					twitter: 'https://twitter.com',
					instagram: 'https://instagram.com',
					github: 'https://github.com',
					profileImg:
						'https://res.cloudinary.com/takkrish/image/upload/v1665498518/next-app/empty_th8mkx.jpg',
					coverImg:
						'https://res.cloudinary.com/takkrish/image/upload/v1665498897/next-app/empty-futuristic-digital-horizontal-gap-white-background-with-black-grid-space-line-color-surface-network-cyber-technology-banner-cover-terrain-sci-fi-wireframe-and-related-to-background-vector_sd1obh.webp',
					connections: [],
					connected: [],
					posts: [],
					stories: [],
				});
				const token = await sign(
					{
						_id: data.insertedId,
						email: body.email,
					},
					process.env.JWT_SECRET_KEY
				);
				const CookieExpiry = new Date();
				CookieExpiry.setMonth(CookieExpiry.getMonth() + 1);
				res.status(200)
					.setHeader(
						'Set-Cookie',
						cookie.serialize('token', JSON.stringify(token), {
							httpOnly: true,
							sameSite: true,
							expires: CookieExpiry,
							path: '/',
							maxAge: 60 * 60 * 24 * 30,
						})
					)
					.send({ _id: data.insertedId });
			} catch (error) {
				res.status(409).json({ message: error.message });
			}
		}
	}
	client.close();
};
export default signup;
