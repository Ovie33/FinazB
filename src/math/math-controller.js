// for addition
const sumFunction = (req, res) => {
  let num1 = req.body.num1;
  let num2 = req.body.num2;
  let num3 = req.body.num3;
  let Answer = num1 + num2 + num3;

  res.send({ Answer });
};

// for subtration
const subFunction = (req, res) => {
  let num1 = req.body.num1;
  let num2 = req.body.num2;
  let num3 = req.body.num3;
  let Answer = num1 - num2 - num3;

  res.send({ Answer });
};

// for multiplication
const mulFunction = (req, res) => {
  let num1 = req.body.num1;
  let num2 = req.body.num2;
  let num3 = req.body.num3;
  let Answer = num1 * num2 * num3;

  res.send({ Answer });
};

// for division
const divFunction = (req, res) => {
  let num1 = req.body.num1;
  let num2 = req.body.num2;
  let num3 = req.body.num3;
  let Answer = num1 / num2 / num3;

  res.send({ Answer });
};

module.exports = { sumFunction, subFunction, mulFunction, divFunction };
