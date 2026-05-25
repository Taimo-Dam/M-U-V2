import User from '../models/User.js';
import jwt from 'jsonwebtoken';

const generateToken = (id) => {
    // Uses the JWT_SECRET from .env, defaults to a fallback for development if not present
    return jwt.sign({ id }, process.env.JWT_SECRET || 'meandyou_super_secret_key', {
        expiresIn: '30d',
    });
};

export const registerUser = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        const userExists = await User.findOne({ $or: [{ email }, { username }] });

        if (userExists) {
            return res.status(400).json({ message: 'User already exists with that email or username' });
        }

        const user = await User.create({
            username,
            email,
            password,
        });

        if (user) {
            res.status(201).json({
                _id: user._id,
                username: user.username,
                email: user.email,
                token: generateToken(user._id),
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (user && (await user.matchPassword(password))) {
            res.json({
                _id: user._id,
                username: user.username,
                email: user.email,
                token: generateToken(user._id),
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const logoutUser = (req, res) => {
    // If using cookies, clear cookie here.
    // Since we're using localStorage on frontend, just send success response.
    res.json({ message: 'User logged out successfully' });
};
