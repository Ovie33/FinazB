const jwt = require("jsonwebtoken");

const jwtToken =
  "VdWr9azcF2epSN7aBy9Lrt2N/145ZiQ2XzTx558RE2RhaXO8/uFzpvvLUjWSldx9KfbI4cQfuaXZvCh7dv5l/Q==";

const responseObject = (message, type, data) => {
  return {
    successKey: type,
    message,
    data,
  };
};

const isTokenValid = (token, jwtSecret = jwtToken) => {
  try {
    // decode the token
    const decodedToken = jwt.decode(token, { complete: true });

    // check expiration
    const expration = decodedToken.payload.exp;

    // check time
    const currentTime = Math.floor(Date.now() / 1000);

    if (expration > currentTime) {
      if (token) {
        jwt.verify(token, jwtSecret);
      }
      return true;
    } else {
      return false;
    }
  } catch (error) {
    return false;
  }
};

module.exports = { responseObject, isTokenValid };
