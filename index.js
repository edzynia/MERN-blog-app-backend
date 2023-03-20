import express from 'express';
import mongoose from 'mongoose';
import multer from 'multer';
import cors from 'cors';

import {
  registerValidation,
  loginValidation,
  postCreateValidation
} from './validations.js';
import { checkAuth, handleValidationErrorrs } from './utils/index.js';
import { UserController, PostController } from './controllers/index.js';
import * as dotenv from 'dotenv';
dotenv.config();

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log('DB OK'))
  .catch((err) => console.log('DB error', err));

//created express app
const app = express();
const storage = multer.diskStorage({
  destination: (_, __, cb) => {
    cb(null, 'uploads');
  },
  filename: (_, file, cb) => {
    cb(null, file.originalname);
  }
});

const upload = multer({ storage: storage }).single('image');
app.use(express.json());
app.use(cors());
app.use('/uploads', express.static('uploads'));

app.post(
  '/auth/login',
  loginValidation,
  handleValidationErrorrs,
  UserController.login
);
app.post(
  '/auth/register',
  registerValidation,
  handleValidationErrorrs,
  UserController.register
);
app.get('/auth/me', checkAuth, UserController.getMe);

app.post('/upload', upload, (req, res) => {
  res.json({
    url: `/uploads/${req.file.originalname}`
  });
});

app.get('/tags', PostController.getLastTags);

app.get('/posts', PostController.getAll);
app.get('/posts/:id', PostController.getOne);
// app.get('/posts/tags', PostController.getLastTags);
app.post(
  '/posts',
  checkAuth,
  postCreateValidation,
  handleValidationErrorrs,
  PostController.create
);
app.delete('/posts/:id', checkAuth, PostController.remove);
app.patch(
  '/posts/:id',
  checkAuth,
  postCreateValidation,
  handleValidationErrorrs,
  PostController.update
);
//process.env.PORT ||
app.listen(process.env.PORT || 4444, (err) => {
  if (err) {
    return console.log(err);
  }
  console.log('Server OK');
});
