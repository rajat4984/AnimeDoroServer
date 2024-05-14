require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');

app.use(
  cors({ credentials: true, origin: true, exposedHeaders: ['Authorization'] })
);
const userRouter = require('./routers/userRouter.js');
const authRouter = require('./routers/authRouter.js');
const animeRouter = require("./routers/animeRouter.js")
const mongoose = require('mongoose');
const PORT = process.env.PORT;

app.use(express.json());
app.use('/api/users', userRouter);
app.use('/api/auth', authRouter);
app.use('/api/anime', animeRouter);

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
