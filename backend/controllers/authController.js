const User = require('../models/User');
const Otp = require('../models/Otp');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const sendEmail = require('../utils/sendEmail');

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

        // Send OTP via Email
        await sendEmail({
            email,
            subject: 'Your Signup OTP for BolSathi',
            text: `Your OTP is ${otp}`,
            html: `<p>Your OTP for signing up at BolSathi is <strong>${otp}</strong>. It expires in 10 minutes.</p>`
        });

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

        // Generate JWT
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'secret123', {
            expiresIn: '30d'
        });

        res.status(200).json({
            success: true,
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                verifiedAt: user.verifiedAt
            },
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

            // Trusted Device Logic
            const { deviceId } = req.body;
            let skipOTP = false;

            if (deviceId && user.trustedDevices) {
                const trustedDevice = user.trustedDevices.find(d => d.deviceId === deviceId);
                if (trustedDevice) {
                    const oneHour = 60 * 60 * 1000;
                    if (Date.now() - new Date(trustedDevice.lastLogin).getTime() < oneHour) {
                         skipOTP = true;
                         
                         // Update lastLogin time
                         trustedDevice.lastLogin = Date.now();
                         await user.save();
                    }
                }
            }

            if (skipOTP) {
                const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'secret123', {
                    expiresIn: '30d'
                });

                return res.json({
                    success: true,
                    needsOTP: false,
                    token,
                    user: {
                        id: user._id,
                        name: user.name,
                        email: user.email,
                        phone: user.phone,
                        verifiedAt: user.verifiedAt
                    },
                    message: 'Logged in successfully (Trusted Device)'
                });
            }

            const otp = generateOTP();
            console.log(`[DEV ONLY] Login OTP for ${email}: ${otp}`);
            
            await Otp.create({ email, otp });

            // Send OTP via Email (Non-blocking or Graceful Fail)
            try {
                await sendEmail({
                    email,
                    subject: 'Your Login OTP for BolSathi',
                    text: `Your OTP is ${otp}`,
                    html: `<p>Your OTP for logging in at BolSathi is <strong>${otp}</strong>. It expires in 10 minutes.</p>`
                });
            } catch (emailError) {
                console.error("Failed to send login OTP email:", emailError.message);
                // Continue execution to allow manual OTP entry (Dev mode)
            }

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
    const { email, otp, deviceId } = req.body;

    try {
        const otpRecord = await Otp.findOne({ email, otp });

        if (!otpRecord) {
            return res.status(400).json({ success: false, error: 'Invalid or expired OTP' });
        }

        const user = await User.findOne({ email });

        if (user) {
            // Updated Trusted Device Logic
            if (deviceId) {
                const existingDeviceIndex = user.trustedDevices.findIndex(d => d.deviceId === deviceId);
                const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

                if (existingDeviceIndex !== -1) {
                    user.trustedDevices[existingDeviceIndex].lastLogin = Date.now();
                } else {
                    user.trustedDevices.push({
                        deviceId,
                        ip,
                        lastLogin: Date.now()
                    });
                }
                await user.save();
            }

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

// @desc    Forgot Password (Send OTP)
// @route   POST /api/auth/forgot-password
// @access  Public
const forgotPassword = async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ success: false, error: 'User not found' });
        }

        const otp = generateOTP();
        console.log(`[DEV ONLY] Reset OTP for ${email}: ${otp}`);

        await Otp.create({ email, otp });

        await sendEmail({
            email,
            subject: 'Reset Password OTP for BolSathi',
            text: `Your OTP is ${otp}`,
            html: `<p>Your OTP for resetting your password at BolSathi is <strong>${otp}</strong>. It expires in 10 minutes.</p>`
        });

        res.status(200).json({ success: true, message: 'OTP sent to your email' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// @desc    Reset Password (Verify OTP & Update Password)
// @route   POST /api/auth/reset-password
// @access  Public
const resetPassword = async (req, res) => {
    const { email, otp, newPassword } = req.body;

    try {
        const otpRecord = await Otp.findOne({ email, otp });

        if (!otpRecord) {
            return res.status(400).json({ success: false, error: 'Invalid or expired OTP' });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ success: false, error: 'User not found' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        user.password = hashedPassword;
        await user.save();

        await Otp.deleteMany({ email });

        res.status(200).json({ success: true, message: 'Password reset successfully' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

module.exports = {
    signup,
    verifySignup,
    login,
    verifyLogin,
    forgotPassword,
    resetPassword
};
