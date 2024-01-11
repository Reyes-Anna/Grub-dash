const router = require("express").Router();
// require the handlers exported from controller
const controller = require("./dishes.controller")
//require the methodNotAllowed
const methodNotAllowed = require("../errors/methodNotAllowed")

// TODO: Implement the /dishes routes needed to make the tests pass

// /dishes/:dishId
router.route("/:dishId")
  .get(controller.read)
  .put(controller.update)
  .all(methodNotAllowed)


// /dishes
router.route("/")
  .get(controller.list)
  .post(controller.create)
  .all(methodNotAllowed)



module.exports = router;
