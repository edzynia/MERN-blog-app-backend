import { body } from 'express-validator';

export const loginValidation = [
  body('email', 'Invalid mail format').isEmail(),
  body('password', 'Password must be at least 5 characters').isLength({
    min: 5,
  }),
];

export const registerValidation = [
  body('email', 'Invalid mail format').isEmail(),
  body('password', 'Password must be at least 5 characters').isLength({
    min: 5,
  }),
  body('fullName', 'Full name must be at least 3 characters').isLength({
    min: 3,
  }),
  body('avatarUrl', 'Invalid avatar link').optional().isURL(),
];

export const postCreateValidation = [
  body('title', 'Enter the tiyle')
    .isLength({
      min: 3,
    })
    .isString(),
  body('text', 'Enter the text of post')
    .isLength({
      min: 7,
    })
    .isString(),
  body('tags', 'Invalid tag format').optional().isString(),
  body('imageUrl', 'Invalid image link').optional().isString(),
];
