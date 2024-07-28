const user = require('../models/userModel');
const bcrypt = require('bcrypt');


// view signin page
const viewSignin = (req,res)=>{
    res.render('auth/signin')
};

// signin a user
const signin = async (req,res)=>{
    const userObject = await user.findOne({username : req.body.username});
    if(!userObject){
       return res.send('invalid user or password')
    }
    const validPassword = bcrypt.compareSync(req.body.password,userObject.password);
    if(!validPassword){
       return res.send('invalid user or password')
    }
    req.session.user = {
        username: user.username,
        userId: user.id
      };
    let userId = userObject.id
    res.redirect(`/${userId}/recipes`);
};

// view signup page
const viewSignup = (req,res)=>{
    res.render('auth/signup')
};

// create a user
const createUser = (req,res)=>{
    if(! user.findOne({username:req.body.username})){
        res.send('user already exists')
    }
    else{
        user.create({
            username:req.body.username,
            password:bcrypt.hashSync(req.body.password, Number(process.env.Salt_Rounds)),
        })
        res.redirect('/auth/signin')
    }
}

// signout
const signout = (req,res)=>{
    req.session.destroy();
    res.redirect("/");
}

module.exports = {viewSignin, signin, viewSignup, createUser, signout};