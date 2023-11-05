const User = require('../model/User');
const bcrypt = require('bcrypt');

const handleNewUser = async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ 'message': 'Username and password are required.' });
    }
    // check for duplicate usernames in db
    const duplicate = await User.findOne({ username }).exec();
    if (duplicate) return res.status(409).json({ message: `User ${username} is existing in databse` }); // conflict - Unauthorized
    // if (duplicate) return res.sendStatus(409); // conflict - Unauthorized

    try {
        // encrypt the password
        const hashesPwd = await bcrypt.hash(password, 10);
        // create and store the new user
        const result = await User.create({
            "username": username,
            "password": hashesPwd
        });
        res.status(201).json(`New user ${username} created.`);
    }
    catch (err) {
        res.status(500).json({ 'message': err.message });
    }
};

module.exports = { handleNewUser };