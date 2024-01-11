const path = require("path");

// Use the existing dishes data
const dishes = require(path.resolve("src/data/dishes-data"));

// Use this function to assign ID's when necessary
const nextId = require("../utils/nextId");


// TODO: Implement the /dishes handlers needed to make the tests pass

    /* Validation functions */
// check all properties are present
function bodyDataHas(propertyName) {
  return function (req, res, next) {
    const { data = {} } = req.body
    if(data[propertyName]) {
      return next()
    }
//if not present return status code 400 and a message saying what is missing
    next ({
      status: 400,
      message: `${propertyName} is required`
    })
  }
}

// price property is 0 or less or price property is not an integer

function priceIsValid (req, res, next) {
  const { data : {price} = {} } = req.body
  if( price <= 0 || !Number.isInteger(price)) {
    return next ({
      status: 400,
      message: `price requires a valid number`
    })
  }
  next()
}

// check if dishId exists

function dishIdExists(req, res, next) {
  const dishId = req.params.dishId
//  console.log(dishes)
//  console.log(dishId)
  const foundDish = dishes.find((dish) => dish.id === dishId)
//  console.log(foundDish)
  if(foundDish) {
    return next()
  } 
  next({ 
  status: 404,
  message: `Dish does not exist: ${dishId} `
  })
}

function isValidId (req, res, next) {
  const { data: {id} = {}} = req.body
  const dishId = req.params.dishId
  if(!id || dishId === id) {
    return next()
    }
    next ({
      status: 400,
      message: `${id} id does not match ${dishId}`
  })
}
//create
function create(req, res, next) {
  const { data : { name, description, price, image_url } = {} } = req.body
  let newDish = {
     id: nextId(), 
     name, 
     description,
     price,
     image_url,   
   }
  dishes.push(newDish)
  res.status(201).json({ data: newDish })
}

//read
function read(req, res, next) {
  const { dishId } = req.params
  const foundDish = dishes.find((dish) => dish.id === dishId)
  res.json({ data : foundDish })
}

//update
function update(req, res) {
  const dishId = req.params.dishId
  const foundDish = dishes.find((dish) => dish.id === dishId)
  const { data: {name, description, price, image_url} = {} } = req.body
  
  foundDish.name = name
  foundDish.description = description
  foundDish.price = price 
  foundDish.image_url = image_url
  res.json({ data: foundDish })
}
//list

function list (req, res) {
 res.json ({ data : dishes })
}

//dishes cannot be deleted so no need for a delete 

//export
module.exports = {
  create: [
    bodyDataHas("name"),
    bodyDataHas("description"),
    bodyDataHas("price"),
    bodyDataHas("image_url"),
    priceIsValid,
    create,
  ],
  read:[
    dishIdExists, 
    read],
  list,
  update: [
    dishIdExists,
    bodyDataHas("name"),
    bodyDataHas("description"),
    bodyDataHas("price"),
    bodyDataHas("image_url"),
    isValidId,
    priceIsValid,
    update,
   
    
  ],
}
