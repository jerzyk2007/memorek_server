const User = require('../model/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const handleLogin = async (req, res) => {
    const { user, pwd } = req.body;
    if (!user || !pwd) {
        return res.status(400).json({ 'message': 'Username and password are required.' });
    }
    const foundUser = await User.findOne({ username: user }).exec();
    if (!foundUser) {
        return res.sendStatus(401); // unauthorized
    }
    // evaluate password
    const match = await bcrypt.compare(pwd, foundUser.password);
    if (match) {
        const roles = Object.values(foundUser.roles);
        // create JWTs
        const accessToken = jwt.sign({
            "UserInfo": {
                "username": foundUser.username,
                "roles": roles
            }
        },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '30m' });

        const refreshToken = jwt.sign({
            "username": foundUser.username
        },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: '8h' });

        // saving refresh token with current user
        // try {
        //     const result = await User.updateOne(
        //         { username: foundUser.username },
        //         { $set: { refreshToken } });
        // }
        // catch (err) {
        //     res.status(500).json({ 'message': err.message });
        // }
        foundUser.refreshToken = refreshToken;
        const result = await foundUser.save();

        // res.cookie('jwt', refreshToken, { httpOnly: true, sameSite: 'None', secure: true, maxAge: 24 * 60 * 60 * 1000 });
        res.cookie('jwt', refreshToken, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 });
        res.json({ accessToken });
    } else {
        res.sendStatus(401);
    }
};

module.exports = { handleLogin };