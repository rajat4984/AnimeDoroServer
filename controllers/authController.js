const otpGenerator = require('otp-generator');
const nodeMailer = require('nodemailer');
const Cache = require('cache');
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const jwtSecret = process.env.JWT_SECRET;
console.log(jwtSecret, 'jwtSecret');

const memoryCache = new Cache(30 * 1000);

const sendOtp = async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (user) return res.status(400).json('User already exist');

  const generatedOtp = otpGenerator.generate(4, {
    lowerCaseAlphabets: false,
    upperCaseAlphabets: false,
    specialChars: false,
  });

  const transporter = nodeMailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: 'rs20021023@gmail.com   ',
      pass: 'sjpg crnj kpto xgoq',
    },
  });

  const mailOptions = {
    from: {
      name: 'AnimeDoro',
      address: 'rs20021023@gmail.com',
    },
    to: email,
    subject: 'Your One Time Password For Animedoro',
    html: `
    <p>OTP-${generatedOtp}
    <p>Ignore this mail if you haven't tried to register on Animdoro</p>`,
  };

  try {
    await transporter.sendMail(mailOptions);
    memoryCache.put('generatedOtp', generatedOtp);
    res.status(200).json('Otp sent successfully');
  } catch (error) {
    console.log(error);
    res.status(500).json('Otp not sent');
  }
};

const register = async (req, res) => {
  const generatedOtp = memoryCache.get('generatedOtp');

  const {
    otp: enteredOtp,
    email,
    username,
    password: enteredPassowrd,
  } = req.body;
  if (!generatedOtp)
    return res.status(500).json('Otp expired please generated a new Otp');
  if (enteredOtp == generatedOtp) {
    try {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(enteredPassowrd, salt);

      const newUser = new User({
        email,
        username,
        password: hashedPassword,
      });

      await newUser.save();
      memoryCache.del('generatedOtp');
      let { password, ...userData } = newUser._doc;
      res
        .status(200)
        .json({ message: 'User registered successfully', user: userData });
    } catch (error) {
      console.log(error);
      return res.status(500).json('User not registered internal server error');
    }
  } else {
    res.status(401).json('Wrong otp entered');
  }
};

const login = async (req, res) => {
  const { email, password: enteredPassword } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json('User not found');

    const isPasswordCorrect = await bcrypt.compare(
      enteredPassword,
      user.password
    );

    if (!isPasswordCorrect)
      return res.status(401).json('Incorrect password please try again');

    const accessToken = jwt.sign({ user }, jwtSecret, { expiresIn: '1h' });
    const refreshToken = jwt.sign({ user }, jwtSecret, { expiresIn: '1d' });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      sameSite: 'strict',
    });

    const { password, ...userData } = user._doc;
    return res.status(200).header('Authorization', accessToken).json(userData);
  } catch (error) {
    console.log(error);
    return res.status(500).json('Cannot login Internal server error');
  }
};

module.exports = {
  login,
  register,
  sendOtp,
};
