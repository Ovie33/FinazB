const { responseObject } = require("../utilities");
const {
  passwordValidator,
  nameValidator,
  emailValidator,
} = require("../utilities/validator");

const {
  signUp_public_model,
  sign_up_private_model,
  sign_up_private_model2,
  login_model,
  fetch_user_publuic_model,
  update_otp_model,
  update_name_model,
} = require("./model");

const loginFunction = (req, res) => {
  let { email, password } = req.body;

  // validate email
  let emailValidation = emailValidator(email);
  if (!emailValidation.successKey) {
    return res.send(emailValidation);
  }
  // validate password
  let passwordValidation = passwordValidator(password);
  if (!passwordValidation.successKey) {
    return res.send(passwordValidation);
  }

  fetch_user_publuic_model(email).then((checkResponse) => {
    if (checkResponse.error) {
      return res.send(responseObject(checkResponse.error.message, false, null));
    }
    if (checkResponse.lenght < 1) {
      return res.send("Invalid login details");
    }

    let userData = checkResponse.data[0];
    let actualEmail = userData.email;

    login_model({ email: actualEmail, password })
      .then((loginResponse) => {
        if (loginResponse.error) {
          return res.send(
            responseObject(loginResponse.error.message, false, null)
          );
        }
        res.send(
          responseObject("Login successful", true, {
            ...loginResponse.data.user.user_metadata,
            accessToken: loginResponse.data.session.access_token,
            UUID: loginResponse.data.user.id,
            refreshToken: loginResponse.data.session.refresh_token,
          })
        );
      })
      .catch((error) => {
        console.log(error);
        return res.send(responseObject("a sever error occured", false, null));
      });
  });
};

const registerFunction = (req, res) => {
  let { fullName, email, password, data, phoneNumber } = req.body;

  // validating first name
  let nameValidattion = nameValidator(fullName);
  if (!nameValidattion.successKey) {
    return res.send(nameValidattion);
  }

  // validate email
  let emailValidation = emailValidator(email);
  if (!emailValidation.successKey) {
    return res.send(emailValidation);
  }

  // validate password
  let passwordValidation = passwordValidator(password);
  if (!passwordValidation.successKey) {
    return res.send(passwordValidation);
  }

  let newPhonenumber = `0${phoneNumber.slice(-10)}`;

  let payload = {
    email,
    password,
    data,
    newPhonenumber,
    data: {
      wallet: 0,
    },
  };

  sign_up_private_model(payload)
    .then((signUpResponse) => {
      if (signUpResponse.error) {
        return res.send(
          responseObject(signUpResponse.error.message, false, null)
        );
      }
      signUp_public_model({
        fullName,
        email,
        uuid: signUpResponse.data.user.id,
        phoneNumber: newPhonenumber,
        data: {
          ...data,
          password,
          wallet: 0,
        },
      })
        .then((response) => {
          if (response.error) {
            return res.send(
              responseObject(response.error.message, false, null)
            );
          }
          res.send(
            responseObject("registration successful", true, {
              ...signUpResponse.data.user.user_metadata,
              accessToken: signUpResponse.data.session.access_token,
              UUID: signUpResponse.data.user.id,
              refreshToken: signUpResponse.data.session.refresh_token,
            })
          );
        })
        .catch((error) => {
          console.log(error);
          return res.send(responseObject("a sever error occured", false, null));
        });
    })
    .catch((error) => {
      console.log(error);
      return res.send(responseObject("a sever error occured", false, null));
    });
  // }
};

const requestOtp = (req, res) => {
  let { email } = req.body;

  fetch_user_publuic_model(email)
    .then((checkResponse) => {
      if (checkResponse.error) {
        return res.send(
          responseObject(checkResponse.error.message, false, null)
        );
      }
      if (checkResponse.lenght < 1) {
        return res.send("Invalid Email");
      }

      let userData = checkResponse.data[0];

      if (!userData) {
        return res.send("Invalid Email");
      }

      let actualEmail = userData.email;

      // generate otp
      function otp() {
        return Math.floor(100000 + Math.random() * 900000);
      }
      let otpNumber = otp();

      // Update the OTP in the database
      update_otp_model(otpNumber, actualEmail)
        .then((updateResponse) => {
          if (updateResponse.error) {
            return res.send(
              responseObject(updateResponse.error.message, false, null)
            );
          }

          res.send(responseObject("OTP sent and saved", true, otpNumber));
        })
        .catch((error) => {
          console.log(error);
          return res.send(
            responseObject("A server error occurred", false, null)
          );
        });
    })
    .catch((error) => {
      console.log(error);
      return res.send(responseObject("a sever error occured", false, null));
    });
};

const verifyOtp = (req, res) => {
  const { otp, email } = req.body;
  fetch_user_publuic_model(email)
    .then((checkResponse) => {
      if (checkResponse.error) {
        return res.send(
          responseObject(checkResponse.error.message, false, null)
        );
      }
      if (checkResponse.lenght < 1) {
        return res.send("Invalid Email");
      }

      let userData = checkResponse.data[0];
      console.log(userData);

      if (!userData) {
        return res.send("Invalid Email");
      }

      if (userData.otp.otpNumber == otp) {
        return res.send("otp verified", true, userData);
      }

      if (userData.otp.otpNumber !== otp) {
        return res.send("Invalid verification code", true, userData);
      }
    })
    .catch((error) => {
      console.log(error);
      return res.send(responseObject("a sever error occured", false, null));
    });
};

const updateProfile = (req, res) => {
  let { email, phoneNumber, fullName } = req.body;

  fetch_user_publuic_model(email)
    .then((checkResponse) => {
      if (checkResponse.error) {
        return res.send(
          responseObject(checkResponse.error.message, false, null)
        );
      }
      if (checkResponse.lenght < 1) {
        return res.send("Invalid Email");
      }

      let userData = checkResponse.data[0];

      if (!userData) {
        return res.send("Invalid Email");
      }

      let actualEmail = userData.email;

      // Update the OTP in the database
      update_name_model(fullName, actualEmail, phoneNumber)
        .then((updateResponse) => {
          if (updateResponse.error) {
            return res.send(
              responseObject(updateResponse.error.message, false, null)
            );
          }

          res.send(
            responseObject("update Successful", true, updateResponse.data)
          );
        })
        .catch((error) => {
          console.log(error);
          return res.send(
            responseObject("A server error occurred", false, null)
          );
        });
    })
    .catch((error) => {
      console.log(error);
      return res.send(responseObject("a sever error occured", false, null));
    });
};

module.exports = {
  loginFunction,
  registerFunction,
  requestOtp,
  verifyOtp,
  updateProfile,
};
