import cookie from 'cookie';
const logout = async (req, res) => {
	res.status(200)
		.setHeader(
			'Set-Cookie',
			cookie.serialize(
				'token',
				{},
				{
					httpOnly: true,
					sameSite: true,
					path: '/',
					maxAge: -1,
				}
			)
		)
		.json({ message: 'Logout Successful' });
};
export default logout;
