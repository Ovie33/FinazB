const { Router } = require("express");
const {
  getLoggeedInUser,
  refreshAccessController,
  UploadFile,
} = require("./user_controller");
const multer = require("multer");

const storage = multer.memoryStorage();
const upload = multer({ storage });

const routes = Router();

routes.get("/getloggedinuser", getLoggeedInUser);

routes.post("/refreshUserSession", refreshAccessController);

routes.post("/uploadPhoto", upload.single("file"), UploadFile);

module.exports = routes;
