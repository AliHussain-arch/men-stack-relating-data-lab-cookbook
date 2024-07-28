const bcrypt = require('bcrypt');
const express = require('express');
const app = express();
const dotenv = require('dotenv');
dotenv.config();
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const isSignedIn = require('./middleware/is-signed-in.js');
const passUserToView = require('./middleware/pass-user-to-view.js');

const ingridient = require('./models/ingredients');
const recipe = require('./models/recipe');
const user = require('./models/userModel');


// connecting to the database
const mongoDBconnection = require('./config/mongoDBconnection');

// requiring the view template engine and all the parsing middleware
const ejs = require('ejs');
app.set('view engine','ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// setting up express session middleware
app.use(
    session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
}));

// method override
const methodOverride = require('method-override');
app.use(methodOverride('_method'));

const morgan = require('morgan');
app.use(morgan('dev'));

 
app.get('/',(req,res)=>{
    res.render('index', {user: req.session.user,})
});

// auth
const authRoutes = require('./routes/authRoutes')
app.use(passUserToView);
app.use('/', authRoutes);
app.use(isSignedIn);
//////////////////////////////////////////////////////////////////



//Index
app.get('/:id/recipes',async (req,res)=>{
 let id = req.params.id
 const recipes = await recipe.find({owner: id});
 res.render('recipes/recipesIndex',{id, recipes});
})

//New
app.get('/:id/recipes/new',(req,res)=>{
    let id = req.params.id
    res.render('recipes/createRecipe',{id})
})

//Create
app.post('/recipes',async (req,res)=>{
    let id = req.body.owner
    await recipe.create({
        name: req.body.name,
        instructions: req.body.instructions,
        owner: req.body.owner, 
        ingredient: [req.body.ingredient],
    })
    const recipes = await recipe.find({owner: id});
    res.render('recipes/recipesIndex',{id, recipes});
})

//Show
app.get('/:id/recipes/:recipeId',async (req,res)=>{
    const view = await recipe.findOne({_id: req.params.recipeId});
    const id = req.params.id;
    res.render('recipes/recipesView',{view, id});
})

//Edit page
app.get('/recipes/:recipeId/edit',async (req,res)=>{
    const view = await recipe.findOne({_id: req.params.recipeId});
    const id = view.owner;
    res.render('recipes/recipeUpdate',{view, id});
})

// Update
app.put('/recipes/:recipeId',async (req,res)=>{
    const recipeId = req.params.recipeId.slice(1); 
    const updatedRecipe = await recipe.findByIdAndUpdate(recipeId,{
        name : req.body.newname,
        instructions : req.body.newinstructions,
        ingredient : req.body.newingredients,
    });
    let id = updatedRecipe.owner;
    const recipes = await recipe.find({owner: id});
    res.render('recipes/recipesIndex',{id, recipes});
})

//Delete
app.delete('/recipes/:recipeId',async (req,res)=>{
    const result = await recipe.findByIdAndDelete(req.params.recipeId);
    const id = result.owner;
    if (result) {
        const recipes = await recipe.find({owner: id});
        res.render('recipes/recipesIndex',{id, recipes});
    } else {
      res.status(404).send('Recipe not found');
    }
})

PORT = process.env.PORT || 3000;
app.listen(PORT,console.log(`Listening on port ${PORT}`));