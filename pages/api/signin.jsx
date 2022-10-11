import { compare } from 'bcrypt';
import { sign } from 'jsonwebtoken';
import { MongoDB_Users } from '../../db';
import cookie from 'cookie';
const signin = async (req, res) => {
	const { collection, client } = await MongoDB_Users();
	const { method, body } = req;
	switch (method) {
		case 'POST': {
			try {
				const check = await collection.findOne({ email: body.email });
				if (check) {
					const checkPassword = await compare(
						body.password,
						check.password
					);
					if (checkPassword) {
						const token = sign(
							{
								_id: check._id,
								email: check.email,
							},
							process.env.JWT_SECRET_KEY
						);
						const CookieExpiry = new Date();
						CookieExpiry.setMonth(CookieExpiry.getMonth() + 1);
						const resp = Object.keys(check)
							.filter((key) => key !== 'password')
							.reduce((acc, key) => {
								acc[key] = check[key];
								return acc;
							}, {});
						res.status(200)
							.setHeader(
								'Set-Cookie',
								cookie.serialize(
									'token',
									JSON.stringify(token),
									{
										httpOnly: true,
										sameSite: true,
										expires: CookieExpiry,
										path: '/',
										maxAge: 60 * 60 * 24 * 30,
									}
								)
							)
							.send(resp);
					} else {
						res.status(400).json({
							message: 'Invalid Credentials',
						});
					}
				} else
					res.status(404).json({
						message: 'No user found with this Email',
					});
			} catch (error) {
				res.status(409).json({ message: error.message });
			}
			break;
		}
	}
	client.close();
};
export default signin;
