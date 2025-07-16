const express = require('express');
const router = express.Router();
const User = require('../model/user_model'); // ✅ Correct model name
const { jwtAuthenticationMiddleware, generateToken } = require('../jwt');

// Signup route
router.post('/signup', async (req, res) => {
    try {
        const data = req.body;
        const newUser = new User(data);
        const response = await newUser.save();
        console.log('Data saved');

        const payload = { id: response.id };
        const token = generateToken(payload);
        console.log('Token generated:', token);

        res.status(200).json({ response, token });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Login route
router.post('/login', async (req, res) => {
    try {
        const { aadharCardNo, password } = req.body;

        const user = await User.findOne({ aadharCardNo });
        if (!user) {
            return res.status(401).json({ error: 'Invalid aadharCardNo' });
        }

        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid password' });
        }

        const payload = { id: user.id };
        const token = generateToken(payload);

        res.status(200).json({ token });
        console.log('Login successful, token generated:', token);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Profile route
router.get('/profile', jwtAuthenticationMiddleware, async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.status(200).json(user);
        console.log('Profile fetched successfully');
    } catch (error) {
        console.error('Error fetching profile:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Update password route
router.put('/profile/password', jwtAuthenticationMiddleware, async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId);
        const { currentPassword, newPassword } = req.body;

        if (!(await user.comparePassword(currentPassword))) {
            return res.status(401).json({ error: 'Current password is incorrect' });
        }

        user.password = newPassword;
        await user.save(); // Will trigger `pre('save')` to hash password
        console.log('Password updated');

        res.status(200).json({ message: 'Password updated successfully' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

//all users route
router.get('/dashboard',  async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
        console.log('Users fetched successfully');
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
