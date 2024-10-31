const { Router } = require("express");
const {
  loginFunction,
  registerFunction,
  requestOtp,
  verifyOtp,
  updateProfile,
} = require("./auth-controller");
const routes = Router();

routes.post("/login", loginFunction);

routes.post("/register", registerFunction);

routes.post("/request-otp", requestOtp);

routes.post("/verify-otp", verifyOtp);

routes.post("/update-profile", updateProfile);

module.exports = routes;
