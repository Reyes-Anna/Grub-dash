const router = require("express").Router();
// require the handlers exported from controller
const controller = require("./orders.controller")
// method not allowed
const methodNotAllowed = require("../errors/methodNotAllowed")
// TODO: Implement the /orders routes needed to make the tests pass

// /orders/:orderId
router.route("/:orderId")
  .get(controller.read)
  .put(controller.update)
  .delete(controller.delete)
  .all(methodNotAllowed)


// /orders
router.route("/")
  .get(controller.list)
  .post(controller.create)
  .all(methodNotAllowed)

module.exports = router;
