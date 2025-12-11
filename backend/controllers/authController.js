const User = require('../models/User');
const Otp = require('../models/Otp');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

// @desc    Register a new user (Stage 1: Initiate)
// @route   POST /api/auth/signup
// @access  Public
const signup = async (req, res) => {
    const { name, email, phone, password } = req.body;

    try {
        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.status(400).json({ success: false, error: 'User already exists' });
        }

        const otp = generateOTP();
        console.log(`[DEV ONLY] Signup OTP for ${email}: ${otp}`);

        // Save OTP to DB
        await Otp.create({ email, otp });

        // Temporarily store user data? In this flow, we will return a success and let frontend call verify 
        // passing all data again OR temporarily store partial user.
        // BETTER APPROACH for stateless API: Frontend sends data again with OTP.
        // OR: Store temp user in DB with isVerified: false.
        
        // Let's go with: Create User with isVerified: false
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await User.create({
            name,
            email,
            phone,
            password: hashedPassword,
            isVerified: false
        });

        res.status(200).json({
            success: true,
            message: 'OTP sent to your email',
            // In a real app, don't send OTP in response
            // devOtp: otp 
        });

    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// @desc    Verify OTP and Finalize Signup
// @route   POST /api/auth/verify-signup
// @access  Public
const verifySignup = async (req, res) => {
    const { email, otp } = req.body;

    try {
        const otpRecord = await Otp.findOne({ email, otp });

        if (!otpRecord) {
            return res.status(400).json({ success: false, error: 'Invalid or expired OTP' });
        }

        const user = await User.findOne({ email });
        
        if (!user) {
            return res.status(404).json({ success: false, error: 'User not found' });
        }

        user.isVerified = true;
        user.verifiedAt = Date.now();
        await user.save();

        // Delete OTP
        await Otp.deleteMany({ email });

        res.status(200).json({
            success: true,
            message: 'Email verified successfully'
        });

    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// @desc    Auth user & get token (Stage 1: Credentials Check)
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (user && (await bcrypt.compare(password, user.password))) {
            if (!user.isVerified) {
                 return res.status(401).json({ success: false, error: 'Account not verified. Please verify your email.' });
            }

            const otp = generateOTP();
            console.log(`[DEV ONLY] Login OTP for ${email}: ${otp}`);
            
            await Otp.create({ email, otp });

            res.json({
                success: true,
                needsOTP: true,
                message: 'OTP sent to your email'
            });
        } else {
            res.status(401).json({ success: false, error: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// @desc    Verify OTP and Get Token
// @route   POST /api/auth/verify-login
// @access  Public
const verifyLogin = async (req, res) => {
    const { email, otp } = req.body;

    try {
        const otpRecord = await Otp.findOne({ email, otp });

        if (!otpRecord) {
            return res.status(400).json({ success: false, error: 'Invalid or expired OTP' });
        }

        const user = await User.findOne({ email });

        if (user) {
            // Delete OTP
            await Otp.deleteMany({ email });
             
            // Generate JWT
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'secret123', {
                expiresIn: '30d'
            });

            res.json({
                success: true,
                token,
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    phone: user.phone,
                    verifiedAt: user.verifiedAt
                }
            });
        } else {
            res.status(404).json({ success: false, error: 'User not found' });
        }

    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

module.exports = {
    signup,
    verifySignup,
    login,
    verifyLogin
};
