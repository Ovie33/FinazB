const { Router } = require("express");
const {
  sumFunction,
  subFunction,
  mulFunction,
  divFunction,
} = require("./math-controller");

const routes = Router();

routes.post("/sum", sumFunction);
routes.post("/sub", subFunction);
routes.post("/mul", mulFunction);
routes.post("/div", divFunction);

module.exports = routes;
