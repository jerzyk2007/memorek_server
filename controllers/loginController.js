const Users = require('../model/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const handleLogin = async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ 'message': 'Username and password are required' });
    }
    const foundUser = await Users.findOne({ username });
    if (!foundUser) {
        return res.sendStatus(401);
    }
    const match = await bcrypt.compare(password, foundUser.password);
    if (match) {
        const roles = Object.values(foundUser.roles);
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

        foundUser.refreshToken = refreshToken;
        const result = await foundUser.save();

        res.cookie('jwt', refreshToken, {
            httpOnly: true,
            sameSite: 'None',
            secure: true,
            maxAge: 24 * 60 * 60 * 1000
        });


        // res.cookie('jwt', refreshToken,
        //     {
        //         sameSite: "None",
        //         secure: true,
        //         httpOnly: true
        //     });

        // res.cookie('jwt', refreshToken, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 });
        // res.cookie('Logged ', username, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 });
        res.json({ accessToken });
    } else {
        res.sendStatus(401);
    }
};


module.exports = { handleLogin };