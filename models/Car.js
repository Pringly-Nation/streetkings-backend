const mongoose = require('mongoose')
const Schema = mongoose.Schema
const Utils = require('./../utils')

// schema
const carSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  user: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  image: {
    type: String,
    required: true    
  },
  mileage: {
    type: String,
    required: true
  }
  
}, { timestamps: true })


// model
const carModel = mongoose.model('Car', carSchema)

// export
module.exports = carModel
