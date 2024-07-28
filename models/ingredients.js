const mongoose = require('mongoose');
const ingredientSchema = new mongoose.Schema({
   name: {
    type: String,
    required : true
   },
});
const ingredient = mongoose.model('Ingredient', ingredientSchema);
module.exports = ingredient;