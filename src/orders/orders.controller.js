const path = require("path");

// Use the existing order data
const orders = require(path.resolve("src/data/orders-data"));

// Use this function to assigh ID's when necessary
const nextId = require("../utils/nextId");

// TODO: Implement the /orders handlers needed to make the tests pass

// Validation functions
function bodyDataHas(propertyName) {
  return function (req, res, next) {
    const { data = {} } = req.body
    if (data[propertyName]) {
      return next()
    }
    next ({
      status: 400,
        message: `Must include ${propertyName}`
    })
  }
}

function dishIsValid(req, res, next) {
  const { data: {dishes} = {} } = req.body
  if(dishes.length <= 0 || !Array.isArray(dishes)) {
    return next ({
      status: 400,
      message: "dish does not exist"
    })
  }
  next()
}

function orderIdExists(req, res, next) {
  const orderId = req.params.orderId
  const foundOrder = orders.find((order) => order.id === orderId)
  if(foundOrder) {
    return next()
  } 
  next({ 
  status: 404,
  message: `Order does not exist: ${orderId} `
  })
}


function quantityIsValid(req, res, next) {
 const { data: { dishes } = {} } = req.body
 for(let i = 0; i<dishes.length; i++) {
   const {quantity} = dishes[i]
   if ( !quantity || quantity <= 0 || !Number.isInteger(quantity)) {
    return next ({
      status: 400,
      message: `Dish ${i} must have a quantity that is an integer greater than 0`
    })
 }
  }
  next()
}

function statusInvalid(req, res, next) {
  const { data: {status} = {} } = req.body
  if(status === "invalid") {
    return next({
      status: 400,
      message: "status invlaid"
    })
  }
  next()
}

function statusPending(req, res, next) {
  const { orderId } = req.params
  const order = orders.find((order) => order.id == Number(orderId))
  if( order.status !== "pending") {
    return next({
      status: 400,
      message: "An order cannot be deleted unless it is pending"
    })
  }
 next()
}

function isValidId (req, res, next) {
  const { data: {id} = {}} = req.body
  const orderId = req.params.orderId
  if(!id || orderId === id) {
    return next()
    }
    next ({
      status: 400,
      message: `Order id does not match route id. Order: ${id}, Route:${orderId}`
  })
}

//create
function create(req, res, next) {
  const { data : { deliverTo, mobileNumber, dishes, status } = {} } = req.body
  const newOrder = {
    id: nextId(),
    deliverTo,
    mobileNumber,
    dishes,
    status,
  }
  orders.push(newOrder)
  res.status(201).json({ data: newOrder})
}
// read
function read(req, res, next) {
  const { orderId } = req.params
  const foundOrder = orders.find((order) => order.id === orderId)
  res.json({ data : foundOrder })
}

//update
function update(req, res) {
  const orderId = req.params.orderId
  const foundOrder = orders.find((order) => order.id === orderId)
  const { data: { deliverTo, mobileNumber, dishes, status} = {} } = req.body
  
  foundOrder.deliverTo = deliverTo
  foundOrder.mobileNumber = mobileNumber
  foundOrder.dishes = dishes 
  foundOrder.status = status
  res.json({ data: foundOrder })
}

//list
function list (req, res) {
  res.json({ data : orders})
}

//delete
function destroy (req, res) {
  const { orderId } = req.params
  const index = orders.findIndex((order) => order.id == Number(orderId))
  const deleteOrder = orders.splice(index, 1)
  res.sendStatus(204)
}

//export
module.exports = {
  list,
  create: [
    bodyDataHas("deliverTo"),
    bodyDataHas("mobileNumber"),
    bodyDataHas("dishes"),
    dishIsValid,
    quantityIsValid,
    create
  ],
  read: [
    orderIdExists,
    read,
  ],
  update: [
    orderIdExists,
    bodyDataHas("deliverTo"),
    bodyDataHas("mobileNumber"),
    bodyDataHas("status"),
    bodyDataHas("dishes"),
    dishIsValid,
    isValidId,
    quantityIsValid,
    statusInvalid,
    update,
  ],
  delete: [
    orderIdExists, 
    statusPending, 
    destroy
  ]
}
