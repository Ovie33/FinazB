const { responseObject } = require(".");

const passwordValidator = (password) => {
  if (password.length < 6) {
    return responseObject(
      "Provide should not be less than six(6) characters",
      false,
      null
    );
  }

  // Check for at least one uppercase letter
  const hasUpperCase = /[A-Z]/.test(password);
  if (!hasUpperCase) {
    return responseObject(
      "Password must include at least one uppercase letter.",
      false,
      null
    );
  }

  // Check for at least one special character
  const hasSpecialCharacter = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  if (!hasSpecialCharacter) {
    return responseObject(
      "Password must include at least one special character.",
      false,
      null
    );
  }

  return responseObject("Password is valid.", true, null);
};

const nameValidator = (fullName) => {
  if (fullName.length < 6 || fullName.split(" ").length < 2) {
    return responseObject(
      "invalid fullname, provide a valid fullname",
      false,
      null
    );
  }
  4;
  return responseObject("name is valid", true, null);
};

const emailValidator = (email) => {
  if (email.length < 6 || !email.includes("@") || !email.includes(".")) {
    return responseObject("Email is not valid.", false, null);
  }
  return responseObject("email is valid", true, null);
};

module.exports = { passwordValidator, nameValidator, emailValidator };
2;
