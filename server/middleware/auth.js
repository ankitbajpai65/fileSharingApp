const jwt = require('jsonwebtoken');
const User = require('../models/user');

const verifyToken = async (req, res, next) => {
    const token = req.cookies.filegem_token;

    try {
        if (!token) {
            return res.status(403).json({
                status: 'error',
                message: "A token is required for authentication"
            });
        }

        const decoded = jwt.verify(token, process.env.TOKEN_KEY);

        const user = await User.findOne({ email: decoded.email });

        if (!user) {
            return res.status(404).json({
                status: 'error',
                message: 'User not found'
            });
        }
        req.user = user;
        
        next();
    } catch (error) {
        console.error(error);
        return res.status(401).json({
            status: 'error',
            message: 'Invalid token'
        });
    }
};

module.exports = verifyToken;
