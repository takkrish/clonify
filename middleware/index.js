import { verify } from 'jsonwebtoken';

export const middleware = async (req) => {
	const token = req.cookies?.token;
	if (token) {
		try {
			const user = verify(JSON.parse(token), process.env.JWT_SECRET_KEY);
			return user && true;
		} catch (e) {
			return false;
		}
	}
	return false;
};
