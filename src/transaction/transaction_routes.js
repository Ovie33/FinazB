const { Router } = require("express");
const {
  sendMoney,
  addMoney,
  requestMoney,
  requestResponse,
} = require("./transaction_controller");
const routes = Router();

routes.get("/all-transactions");

routes.post("/send-money", sendMoney);

routes.post("/add-money", addMoney);

routes.post("/request-money", requestMoney);

routes.post("/request-response", requestResponse);

module.exports = routes;
