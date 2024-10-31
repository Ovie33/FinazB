const {
  fetch_user_publuic_uuid,
  fetch_user_private_uuid,
  update_user_info,
  fetch_user_private_phone,
  fetch_user_publuic_phone,
} = require("../auth/model");
const {
  insertTransactionNotification,
  fetch_notification_id,
} = require("../notification/notification_model");
const { responseObject } = require("../utilities");

// add Money function
const addMoney = (req, res) => {
  let { user, amount } = req.body;

  // verify id user exists
  fetch_user_private_uuid(user)
    .then((response) => {
      if (response.error) {
        return res.send(responseObject(response.error.message, false, null));
      }

      console.log(response.data.user.user_metadata);

      // check if uuid exists
      if (!response) {
        return res.send(responseObject("Invalid UUID", false, null));
      }

      let userData = response.data.user.user_metadata;
      let userNewWallet = userData.wallet + parseInt(amount);

      console.log(userNewWallet);

      let userNewData = { wallet: userNewWallet };

      console.log(userNewData);

      // update user info
      update_user_info(user, userNewData) // user here is the UUID
        .then((updateResponse) => {
          if (updateResponse.error) {
            return res.send(
              responseObject(updateResponse.error.message, false, null)
            );
          }

          // insert notification
          let payload = {
            from: "Finaz",
            to: user,
            type: "CASH DEPOSIT",
            message: "Deposit successful",
            data: {
              amount: amount,
              WalletBalance: userNewWallet,
            },
          };

          insertTransactionNotification(payload)
            .then((notificationResponse) => {
              if (notificationResponse.error) {
                return res.send(
                  responseObject(
                    notificationResponse.error.message,
                    false,
                    null
                  )
                );
              }
              return res.send(
                responseObject(
                  "User updated successfully",
                  true,
                  updateResponse.data.user.user_metadata
                )
              );
            })
            .catch((error) => {
              console.log(error);
              return res.send(
                responseObject("a sever error occured", false, null)
              );
            });
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
};

// send money function
const sendMoney = (req, res) => {
  let { amount, reciver, sender } = req.body;

  //   verify sender
  fetch_user_private_uuid(sender)
    .then((response) => {
      if (response.error) {
        return res.send(responseObject(response.error.message, false, null));
      }

      // check if uuid exists
      if (!response) {
        return res.send(responseObject("Invalid UUID", false, null));
      }

      //   verify reciver
      fetch_user_private_uuid(reciver)
        .then((response1) => {
          if (response1.error) {
            return res.send(
              responseObject(response1.error.message, false, null)
            );
          }

          // check if uuid exists
          if (!response1) {
            return res.send(responseObject("Invalid UUID", false, null));
          }

          let senderData = response.data.user.user_metadata;
          let reciverData = response1.data.user.user_metadata;

          //   check wallet balance
          if (senderData.wallet < amount) {
            return res.send(
              responseObject("INSUFFICENT WALLET BALANCE", false, null)
            );
          }

          //   transaction
          let senderNewWallet = senderData.wallet - parseInt(amount);
          let reciverNewWallet = reciverData.wallet + parseInt(amount);

          //   updated data
          let senderNewData = { wallet: senderNewWallet };
          let reciverNewData = { wallet: reciverNewWallet };

          //   update sender info
          update_user_info(sender, senderNewData)
            .then((updateResponse) => {
              if (updateResponse.error) {
                return res.send(
                  responseObject(updateResponse.error.message, false, null)
                );
              }

              //   updating reciver
              update_user_info(reciver, reciverNewData)
                .then((updateResponse1) => {
                  if (updateResponse1.error) {
                    return res.send(
                      responseObject(updateResponse1.error.message, false, null)
                    );
                  }

                  // insert notification
                  let payload = {
                    from: sender,
                    to: reciver,
                    type: "CASH TRANSFER",
                    message: "Transfer successful",
                    data: {
                      amount: amount,
                      WalletBalance: reciverNewWallet,
                    },
                  };

                  insertTransactionNotification(payload)
                    .then((notificationResponse) => {
                      if (notificationResponse.error) {
                        return res.send(
                          responseObject(
                            notificationResponse.error.message,
                            false,
                            null
                          )
                        );
                      }

                      let senderData = updateResponse.data.user.user_metadata;
                      let reciverData = updateResponse1.data.user.user_metadata;

                      return res.send({ senderData, reciverData });
                    })
                    .catch((error) => {
                      console.log(error);
                      return res.send(
                        responseObject("a sever error occured", false, null)
                      );
                    });
                })
                .catch((error) => {
                  console.log(error);
                  return res.send(
                    responseObject("a sever error occured", false, null)
                  );
                });
            })
            .catch((error) => {
              console.log(error);
              return res.send(
                responseObject("a sever error occured", false, null)
              );
            });
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
};

// request money
const requestMoney = (req, res) => {
  let { from, user, amount } = req.body;

  let phone = `0${from.slice(-10)}`;

  fetch_user_publuic_phone(phone)
    .then((response) => {
      if (response.error) {
        return res.send(responseObject(response.error.message, false, null));
      }
      if (response.data.length < 1) {
        return res.send(responseObject("User not Found", false, null));
      }

      // insert notification
      let payloadReciver = {
        from: user,
        to: response.data[0].UUID,
        type: "CASH REQUEST",
        message: `You have a cash request of amount ${amount}`,
        data: {
          amount: amount,
        },
      };

      insertTransactionNotification(payloadReciver)
        .then((notificationResponse) => {
          if (notificationResponse.error) {
            return res.send(
              responseObject(notificationResponse.error.message, false, null)
            );
          }

          // insert notification for the sender
          let payloadSender = {
            from: "FINAZ",
            to: user,
            type: "CASH REQUEST SENT",
            message: `You have sent a cash request of amount ${amount} to ${response.data[0].name}`,
            data: {
              amount: amount,
              to: response.data[0].UUID,
            },
          };

          insertTransactionNotification(payloadSender)
            .then((notificationResponseSender) => {
              if (notificationResponseSender.error) {
                return res.send(
                  responseObject(
                    notificationResponseSender.error.message,
                    false,
                    null
                  )
                );
              }
              return res.send(
                responseObject("REQUEST SENT", true, notificationResponse.data)
              );
            })
            .catch((error) => {
              console.log(error);
              return res.send(
                responseObject("a sever error occured", false, null)
              );
            });
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
};

// request response
const requestResponse = (req, res) => {
  const { user, status, id } = req.body;

  //  fetch request from data
  fetch_notification_id(id).then((response) => {
    if (response.error) {
      return res.send(responseObject(response.error.message, false, null));
    }

    // confirmt thet the user responding to the request is the user meant to make the response
    if (response.data[0].to !== user) {
      return res.send(responseObject("Invalid User Action", false, null));
    }

    // store amount
    let amount = response.data[0].meta_data.data.amount;
    // store recivers UUID
    let reciver = response.data[0].from;

    // if user is confirmed the we write the conditions for the status
    if (status === "accepted") {
      fetch_user_private_uuid(user)
        .then((userResponse) => {
          if (userResponse.error) {
            return res.send(
              responseObject(userResponse.error.message, false, null)
            );
          }

          //   verify reciver
          fetch_user_private_uuid(reciver)
            .then((reciverResponse) => {
              if (reciverResponse.error) {
                return res.send(
                  responseObject(reciverResponse.error.message, false, null)
                );
              }

              // check if uuid exists
              if (!reciverResponse) {
                return res.send(
                  responseObject("Unable to send moeny", false, null)
                );
              }

              let userData = userResponse.data.user.user_metadata;
              let reciverData = reciverResponse.data.user.user_metadata;

              //   check wallet balance
              if (userData.wallet < amount) {
                return res.send(
                  responseObject("INSUFFICENT WALLET BALANCE", false, null)
                );
              }

              //   transaction
              let userNewWallet = userData.wallet - parseInt(amount);
              let reciverNewWallet = reciverData.wallet + parseInt(amount);

              //   updated data
              let userNewData = { wallet: userNewWallet };
              let reciverNewData = { wallet: reciverNewWallet };

              //   update sender info
              update_user_info(user, userNewData)
                .then((updateResponse) => {
                  if (updateResponse.error) {
                    return res.send(
                      responseObject(updateResponse.error.message, false, null)
                    );
                  }

                  //   updating reciver
                  update_user_info(reciver, reciverNewData)
                    .then((updateResponse1) => {
                      if (updateResponse1.error) {
                        return res.send(
                          responseObject(
                            updateResponse1.error.message,
                            false,
                            null
                          )
                        );
                      }

                      // insert notification for user
                      let payloadUser = {
                        from: "FINAZ",
                        to: user,
                        type: "CASH REQUEST ACCEPTED",
                        message: `You successfully sent ${amount} to ${reciverData.name} your new balance is ${userNewWallet}`,
                        data: {
                          amount: amount,
                          WalletBalance: userNewWallet,
                        },
                      };

                      insertTransactionNotification(payloadUser)
                        .then((notificationResponse) => {
                          if (notificationResponse.error) {
                            return res.send(
                              responseObject(
                                notificationResponse.error.message,
                                false,
                                null
                              )
                            );
                          }

                          // insert notification for reciver
                          let payloadReciverr = {
                            from: user,
                            to: reciver,
                            type: "CASH REQUEST ACCEPTED",
                            message: `Your reques from ${userData.name} was accepted and a total amount of ${amount} was credited to you and your new balance is ${reciverNewWallet}`,
                            data: {
                              amount: amount,
                              WalletBalance: reciverNewWallet,
                            },
                          };

                          insertTransactionNotification(payloadReciverr)
                            .then((notificationResponseReciver) => {
                              if (notificationResponseReciver.error) {
                                return res.send(
                                  responseObject(
                                    notificationResponseReciver.error.message,
                                    false,
                                    null
                                  )
                                );
                              }
                              let userData =
                                updateResponse.data.user.user_metadata;
                              let reciverData =
                                updateResponse1.data.user.user_metadata;
                              return res.send({ userData, reciverData });
                            })
                            .catch((error) => {
                              console.log(error);
                              return res.send(
                                responseObject(
                                  "a sever error occured",
                                  false,
                                  null
                                )
                              );
                            });
                        })
                        .catch((error) => {
                          console.log(error);
                          return res.send(
                            responseObject("a sever error occured", false, null)
                          );
                        });
                    })
                    .catch((error) => {
                      console.log(error);
                      return res.send(
                        responseObject("a sever error occured", false, null)
                      );
                    });
                })
                .catch((error) => {
                  console.log(error);
                  return res.send(
                    responseObject("a sever error occured", false, null)
                  );
                });
            })
            .catch((error) => {
              console.log(error);
              return res.send(
                responseObject("a sever error occured", false, null)
              );
            });
        })
        .catch((error) => {
          console.log(error);
          return res.send(responseObject("a sever error occured", false, null));
        });
    }

    // if user declines request
    if (status === "declined") {
      // insert notification
      let payloaduser = {
        from: "FINAZ",
        to: user,
        type: "CASH REQUEST DECLINED",
        message: `You declined the cash request of amount ${amount}`,
        data: {
          amount: amount,
        },
      };

      insertTransactionNotification(payloaduser)
        .then((notificationResponse) => {
          if (notificationResponse.error) {
            return res.send(
              responseObject(notificationResponse.error.message, false, null)
            );
          }

          // send notification to the reciver
          let payloadReciver = {
            from: user,
            to: reciver,
            type: "CASH REQUEST DECLINED",
            message: `Your cash request of amount ${amount} was declined by the user`,
            data: {
              amount: amount,
            },
          };

          insertTransactionNotification(payloadReciver)
            .then((notificationResponse) => {
              if (notificationResponse.error) {
                return res.send(
                  responseObject(
                    notificationResponse.error.message,
                    false,
                    null
                  )
                );
              }

              return res.send(
                responseObject("Cash request was declined", false, null)
              );
            })
            .catch((error) => {
              console.log(error);
              return res.send(
                responseObject("a sever error occured", false, null)
              );
            });
        })
        .catch((error) => {
          console.log(error);
          return res.send(responseObject("a sever error occured", false, null));
        });
    }
  });
};

module.exports = { sendMoney, addMoney, requestMoney, requestResponse };
