const express = require('express');
const router = express.Router();

const authControllers = require('../controllers/authControllers')
// view signin page
router.get('/auth/signin', authControllers.viewSignin);
// signin a user
router.post('/auth/signin', authControllers.signin);
// view signup page
router.get('/auth/signup', authControllers.viewSignup);
// create a user
router.post('/auth/signup', authControllers.createUser);
//sign out
router.get('/auth/sign-out', authControllers.signout);

module.exports = router;
