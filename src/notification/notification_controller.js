const { responseObject } = require("../utilities");
const { fetch_user_notification } = require("./notification_model");

const getUserNotification = (req, res) => {
  const { uuid } = req.body;

  fetch_user_notification(uuid)
    .then((notificationResponse) => {
      if (notificationResponse.error) {
        return res.send(
          responseObject(notificationResponse.error.message, false, null)
        );
      }

      console.log(notificationResponse);

      //   check if user has any notification
      if (notificationResponse.data.length < 1) {
        return res.send(
          responseObject("User has no notification", false, null)
        );
      }

      return res.send(
        responseObject(notificationResponse.data, true, notificationResponse)
      );
    })
    .catch((error) => {
      console.log(error);
      return res.send(responseObject("a sever error occured", false, null));
    });
};

module.exports = { getUserNotification };
