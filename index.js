const express = require('express');
const app = express();
const userRouter = require('./routers/userRoute.js');
const authRouter = require('./routers/authRouter.js');
const mongoose = require('mongoose');
const PORT = 5000;
require('dotenv').config();

app.use(express.json());
app.use('/api/users', userRouter);
app.use('/api/auth', authRouter);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(PORT, () => {
      console.log('Database connected');
      console.log(`Server started on ${PORT}`);
    });
  })
  .catch((error) => {
    console.log(error);
  });
