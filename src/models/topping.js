"use strict"
/* -------------------------------------------------------
    | FULLSTACK TEAM | NODEJS / EXPRESS |
------------------------------------------------------- */
const { mongoose } = require('../configs/dbConnection')
const {Schema, model} = mongoose
/* ------------------------------------------------------- */

const ToppingSchema = new Schema(
    {
      name: {
        type: String,
        trim: true,
        required: true,
        unique: true,
      },
    },
    {
      collection: "toppings",
      timestamps: true,
    },
);
  
module.exports = model("Topping", ToppingSchema);