const express = require("express");
const app = express();
const port = 3000;
app.use(express.json());

app.use("/api/v1", require("./routes/index"));

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
