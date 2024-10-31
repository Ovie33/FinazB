const { responseObject, isTokenValid } = require("../utilities");
const {
  Get_user_by_accessToken,
  refresh_token,
  Insert_image_to_public_stroage,
} = require("./user_model");

const getLoggeedInUser = (req, res) => {
  let token = req.headers;

  let authHeader = token["authorization"];

  if (!authHeader) {
    return res.send(responseObject("Missing authorization", false, null));
  }

  let accessToken = authHeader.split(" ")[1];

  // to check if expired
  if (isTokenValid(accessToken) == false) {
    return res.send(responseObject("User session expired", false, null));
  }

  Get_user_by_accessToken(accessToken)
    .then((response) => {
      if (response.error) {
        return res.send(responseObject(response.error, false, null));
      }
      console.log(response.data);

      return res.send(response.data);
    })
    .catch((error) => {
      console.log(error);
      return res.send(responseObject("a sever error occured", false, null));
    });
};

const refreshAccessController = (req, res) => {
  let { token } = req.body;
  refresh_token(token)
    .then((response) => {
      if (response.error) {
        return res.send({
          success: false,
          message: response.error.message,
          data: null,
        });
      }

      return res.send({
        accessToken: response.data.session.access_token,
        refreshToken: response.data.session.refresh_token,
      });
    })
    .catch((error) => {
      console.log(error);
      return res.send({
        success: false,
        message: "a server error occured",
        data: null,
      });
    });
};

// file upload
const UploadFile = (req, res) => {
  // // validate user token
  // const { token } = req.headers;

  // let authHeader = token["authorization"];

  // if (!authHeader) {
  //   return res.send(responseObject("Missing authorization", false, null));
  // }

  // let accessToken = authHeader.split(" ")[1];

  // // to check if expired
  // if (isTokenValid(accessToken) == false) {
  //   return res.send(responseObject("User session expired", false, null));
  // }

  if (!req.file) {
    return res.send(responseObject("No file has been uploaded", false, null));
  }

  // access the binary data of the uplaoded file from the request object

  // extract the buffer data
  const bufferData = req.file.buffer;
  // convert buffer data to base 64 encoded string
  const base64Image = Buffer.from(bufferData).toString("base64");
  // extract the mime type also known as the extension from the request object
  const fileType = req.file.mimetype;
  // check if the file is an image or video or document;
  const feildName = fileType.startsWith("image") ? "image" : "Video";
  // extract the extension
  const fileExtension = fileType.split("/").pop();
  // set file name
  const fileName = `${Math.random()}.${fileExtension}`;

  // converting base64 to blog
  const base64ToBlob = (base64Data, contentType = fileType) => {
    const byteCharacters = atob(base64Data);

    // create an array with the same length of byte characters and iterate over it converting each character to its uni code point ( an integer between 0-65535 )
    const byteNumbers = new Array(byteCharacters.length);

    for (i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }

    // create an array which type is integer8 array wich represents an 8bit unsigned integer
    const byteArray = new Uint8Array(byteNumbers);

    // create a new blob object from the byte array which is going to specify the mime type as the content type
    return new Blob([byteArray], { type: contentType });
  };

  const blob = base64ToBlob(base64Image);
  // create a form data and append the blob as a file of the form data
  const formData = new FormData();
  formData.append(feildName, blob, fileName);

  const payload = { fileName, formData };

  Insert_image_to_public_stroage(payload)
    .then((response) => {
      if (response.error) {
        res.send(responseObject(response.error, false, null));
      }

      return res.send(responseObject("Upload successful", true, response));
    })
    .catch((error) => {
      console.log(error);
      return res.send(responseObject("a sever error occured", false, null));
    });
};

module.exports = { getLoggeedInUser, refreshAccessController, UploadFile };
