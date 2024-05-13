const otpGenerator = require('otp-generator');
const nodeMailer = require('nodemailer');
const Cache = require('cache');
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const router = require('express').Router();

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

    res.cookie('refresh_token', refreshToken, {
    });

    const { password, ...userData } = user._doc;
    return res.status(200).header('Authorization', accessToken).json(userData);
  } catch (error) {
    console.log(error);
    return res.status(500).json('Cannot login Internal server error');
  }
};

router.get("/anime-proxy", (req, res) => {
  try {
    const response = http.get(
      `http://myanimelist.net/v1/oauth2/authorize?response_type=code&client_id=${process.env.CLIENT_ID}&code_challenge=${req.query.challenge}&state=RequestID42`,
      {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*", // Replace '*' with the appropriate origin URL if known
        },
      }
    );
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json(error);
  }
});

// request for getting token using the code got in above request
router.post("/get-token", async function (req, res) {
  try {
    const params = {
      client_id: process.env.CLIENT_ID,
      client_secret: process.env.CLIENT_SECRET,
      code: `${req.body.code}`,
      code_verifier: `${req.body.challenge}`,
      grant_type: "authorization_code",
    };

    // for making data in form-urlencoded
    const formData = new URLSearchParams();
    for (const key in params) {
      formData.append(key, params[key]);
    }

    const response = await axios.post(
      "https://myanimelist.net/v1/oauth2/token",
      formData.toString(),
      { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
    );
    res.status(200).json(response.data);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

//request for getting profile information
router.get("/get-profile-info", async (req, res) => {
  try {
    const response = await axios.get(
      "https://api.myanimelist.net/v2/users/@me?fields=anime_statistics",
      { headers: { Authorization: `Bearer ${req.query.access_token}` } }
    );

    res.status(200).json(response.data);
  } catch (error) {
    res.status(500).json(error);
  }
});


module.exports = {
  login,
  register,
  sendOtp,
};
