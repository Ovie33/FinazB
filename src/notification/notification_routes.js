const { Router } = require("express");
const { getUserNotification } = require("./notification_controller");
const routes = Router();

// gets all notification
routes.post("/all-notification", getUserNotification);

module.exports = routes;
