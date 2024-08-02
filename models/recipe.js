const mongoose = require('mongoose');
const recipeSchema = new mongoose.Schema({
   name: {
    type: String,
    required : true
   },
   instructions: {
    type: String,
    required : false
   },
   owner: {
    type: mongoose.Schema.Types.ObjectId,
    required : true
   },
   ingredients: {
    type: [mongoose.Schema.Types.ObjectId],
    required : true
   }
});
const recipe = mongoose.model('recipe', recipeSchema);
module.exports = recipe;