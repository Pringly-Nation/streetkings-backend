const express = require('express')
const router = express.Router()
const Utils = require('./../utils')
const User = require('./../models/User')
const path = require('path')

// PUT - add favourite Car --------------------------------------
router.put('/addFavCar/', Utils.authenticateToken, (req, res) => {  
  // validate check
  if(!req.body.carId){
    return res.status(400).json({
      message: "No car specified"
    })
  }
  // add carId to favouriteCars field (array - push)
  User.updateOne({
    _id: req.user._id
  }, {
    $push: {
      favouriteCars: req.body.carId
    }
  })
    .then((user) => {            
      res.json({
        message: "Car added to favourites"
      })
    })
    .catch(err => {
      console.log(err)
      res.status(500).json({
        message: "Problem adding favourite car"
      })
    })
})

router.put('/addCartCar/', Utils.authenticateToken, (req, res) => {  
  // validate check
  if(!req.body.carId){
    return res.status(400).json({
      message: "No car specified"
    })
  }
  // add carId to cartCars field (array - push)
  User.updateOne({
    _id: req.user._id
  }, {
    $push: {
      cartCars: req.body.carId
    }
  })
    .then((user) => {            
      res.json({
        message: "Car added to cart"
      })
    })
    .catch(err => {
      console.log(err)
      res.status(500).json({
        message: "Problem adding car to cart"
      })
    })
})

router.put('/removeCartCar/', Utils.authenticateToken, (req, res) => {   //function to remove carted cars
  // validate check
  if(!req.body.carId){
    return res.status(400).json({
      message: "No car specified"
    })
  }
  // remove carId from cartCars field (array - pull)
  User.updateOne({
    _id: req.user._id
  }, {
    $pull: {
      cartCars: req.body.carId
    }
  })
    .then((user) => {            
      res.json({
        message: "Car removed from cart"
      })
    })
    .catch(err => {
      console.log(err)
      res.status(500).json({
        message: "Problem removing car from cart"
      })
    })
})

router.put('/removeGarageCar/', Utils.authenticateToken, (req, res) => {  //function to remove garage cars
  // validate check
  if(!req.body.carId){
    return res.status(400).json({
      message: "No car specified"
    })
  }
  // remove carId from favouriteCars field (array - pull)
  User.updateOne({
    _id: req.user._id
  }, {
    $pull: {
      favouriteCars: req.body.carId
    }
  })
    .then((user) => {            
      res.json({
        message: "Car removed from garage"
      })
    })
    .catch(err => {
      console.log(err)
      res.status(500).json({
        message: "Problem removing car from garage"
      })
    })
})

// GET - get single user -------------------------------------------------------
router.get('/:id', Utils.authenticateToken, (req, res) => {
  if(req.user._id != req.params.id){
    return res.status(401).json({
      message: "Not authorised"
    })
  }

  User.findById(req.params.id).populate('favouriteCars').populate('cartCars') //populate both favouritecars and cart cars to work
    .then(user => {
      res.json(user)
    })
    .catch(err => {
      console.log(err)
      res.status(500).json({
        message: "Couldn't get user",
        error: err
      })
    })
})


// PUT - update user ---------------------------------------------
router.put('/:id', Utils.authenticateToken, (req, res) => {
  // validate request
  if(!req.body) return res.status(400).send("Task content can't be empty")
  
  let avatarFilename = null

  // if avatar image exists, upload!
  if(req.files && req.files.avatar){
    // upload avater image then update user
    let uploadPath = path.join(__dirname, '..', 'public', 'images')
    Utils.uploadFile(req.files.avatar, uploadPath, (uniqueFilename) => {
      avatarFilename = uniqueFilename
      // update user with all fields including avatar
      updateUser({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,  
        avatar: avatarFilename,
        bio: req.body.bio, 
        accessLevel: req.body.accessLevel
    })
  })
  }else{
    // update user without avatar
    updateUser(req.body)
  }
  
  // update User
  function updateUser(update){    
    User.findByIdAndUpdate(req.params.id, update, {new: true})
    .then(user => res.json(user))
    .catch(err => {
      res.status(500).json({
        message: 'Problem updating user',
        error: err
      })
    }) 
  }
})

// POST - create new user --------------------------------------
router.post('/', (req, res) => {
  // validate request
  if(Object.keys(req.body).length === 0){   
    return res.status(400).send({message: "User content can not be empty"})
  }

  // check account with email doen't already exist
  User.findOne({email: req.body.email})
  .then(user => {
    if( user != null ){
      return res.status(400).json({
        message: "email already in use, use different email address"
      })
    }
  // create new user       
  let newUser = new User(req.body)
  newUser.save()
    .then(user => {        
      // success!  
      // return 201 status with user object
      return res.status(201).json(user)
    })
    .catch(err => {
      console.log(err)
      return res.status(500).send({
        message: "Problem creating account",
        error: err
      })
    })
  })
})

module.exports = router