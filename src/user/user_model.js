const supabase = require("../../cofig/supabase_config");

const Get_user_by_accessToken = (token) => {
  return supabase.auth.getUser(token);
};

const Refresh_token = (token) => {
  return supabase.auth.refreshSession({ refresh_token: token });
};

const Delete_user = (uuid) => {
  return supabase.from("user_public").delete().eq("UUID", uuid);
};

const Insert_image_to_public_stroage = (payload) => {
  return supabase.storage
    .from("Images")
    .upload(payload.fileName, payload.formData);
};

module.exports = {
  Get_user_by_accessToken,
  Refresh_token,
  Delete_user,
  Insert_image_to_public_stroage,
};
