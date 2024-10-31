const supabase = require("../../cofig/supabase_config");

const signUp_public_model = ({ fullName, email, phoneNumber, uuid }) => {
  return supabase
    .from("user_public")
    .insert([
      {
        name: fullName,
        email: email,
        UUID: uuid,
        phone_number: phoneNumber,
      },
    ])
    .select();
};

const sign_up_private_model = (payload) => {
  return supabase.auth.signUp({
    email: payload.email,
    password: payload.password,
    options: { data: payload.data },
  });
};

const sign_up_private_model2 = (payload) => {
  return supabase.auth.signUp({
    phone: payload.phoneNumber,
    password: payload.password,
    options: { data: payload.data },
  });
};

const login_model = ({ email, password }) => {
  return supabase.auth.signInWithPassword({ email, password });
};

const fetch_user_publuic_model = (payload) => {
  return supabase
    .from("user_public")
    .select("*")
    .or(`email.eq.${payload}`, `phoneNumber.eq.${payload}`);
};

const update_otp_model = (otpNumber, email) => {
  return supabase
    .from("user_public")
    .update({ otp: { otpNumber } }) // Storing OTP as a key in jsonb
    .eq("email", email)
    .select();
};

const update_name_model = (name, email, phone) => {
  return supabase
    .from("user_public")
    .update([{ name: name, phone_number: phone }]) // Storing OTP as a key in jsonb
    .eq("email", email)
    .select();
};

const fetch_user_publuic_uuid = (uuid) => {
  return supabase.from("user_public").select("*").eq("UUID", uuid);
};

const fetch_user_publuic_phone = (phone) => {
  return supabase.from("user_public").select("*").eq("phone_number", phone);
};

const fetch_user_private_uuid = (uuid) => {
  return supabase.auth.admin.getUserById(uuid);
};

const fetch_user_private_phone = (phone) => {
  return supabase.auth.admin.getUserById(phone);
};

const update_user_info = (uuid, data) => {
  return supabase.auth.admin.updateUserById(uuid, { user_metadata: data });
};

const Delete_user_auth = (uuid) => {
  supabase.auth.admin.deleteUser(uuid);
};

module.exports = {
  signUp_public_model,
  sign_up_private_model,
  sign_up_private_model2,
  login_model,
  fetch_user_publuic_model,
  update_otp_model,
  update_name_model,
  fetch_user_publuic_uuid,
  fetch_user_private_uuid,
  update_user_info,
  fetch_user_publuic_phone,
  Delete_user_auth,
};
