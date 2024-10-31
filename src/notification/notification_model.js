const supabase = require("../../cofig/supabase_config");

const fetch_user_notification = (uuid) => {
  return supabase.from("notification").select("*").eq("to", uuid);
};

const fetch_notification_id = (id) => {
  return supabase.from("notification").select("*").eq("id", id);
};

const insertTransactionNotification = (payload) => {
  return supabase
    .from("notification")
    .insert([
      {
        from: payload.from,
        to: payload.to,
        message: payload.message,
        type: payload.type,
        meta_data: payload,
      },
    ])
    .select();
};

module.exports = {
  fetch_user_notification,
  insertTransactionNotification,
  fetch_notification_id,
};
