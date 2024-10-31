const { Router } = require("express");
const routes = Router();

// authentication
routes.use("/auth", require("../auth/auth-route"));

// maths
routes.use("/math", require("../math/math-route"));

// transaction
routes.use("/transaction", require("../transaction/transaction_routes"));

// notifications
routes.use("/notification", require("../notification/notification_routes"));

// user
routes.use("/user", require("../user/user_routes"));

module.exports = routes;
