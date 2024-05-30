const express = require('express')
const router = express.Router()
const Utils = require('./../utils')
const Car = require('./../models/Car')
const path = require('path')

// GET- get all cars ---------------------------
router.get('/', Utils.authenticateToken, (req, res) => {
  Car.find().populate('user', '_id firstName lastName')
    .then(cars => {
      if(cars == null){
        return res.status(404).json({
          message: "No cars found"
        })
      }
      res.json(cars)
    })
    .catch(err => {
      console.log(err)
      res.status(500).json({
        message: "Problem getting cars"
      })
    })  
})

// POST - create new haircut --------------------------------------
router.post('/', (req, res) => {
  // validate 
  if(Object.keys(req.body).length === 0){   
    return res.status(400).send({message: "Car content can't be empty"})
  }
  // validate - check if image file exist
  if(!req.files || !req.files.image){
    return res.status(400).send({message: "Image can't be empty"})
  }

  console.log('req.body = ', req.body)

  // image file must exist, upload, then create new car
  let uploadPath = path.join(__dirname, '..', 'public', 'images')
  Utils.uploadFile(req.files.image, uploadPath, (uniqueFilename) => {    
    // create new car
    let newCar = new Car({
      name: req.body.name,
      price: req.body.price,
      colour: req.body.colour,
      user: req.body.user,
      image: uniqueFilename,
      driveTrain: req.body.driveTrain,
      mileage: req.body.mileage
    })
  
    newCar.save()
    .then(car => {        
      // success!  
      // return 201 status with haircut object
      return res.status(201).json(car)
    })
    .catch(err => {
      console.log(err)
      return res.status(500).send({
        message: "Problem creating car",
        error: err
      })
    })
  })
})

// export
module.exports = router
