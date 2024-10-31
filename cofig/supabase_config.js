const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
  "https://mioxtmuctuiekqemyxwl.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1pb3h0bXVjdHVpZWtxZW15eHdsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcyMzU0NDU1MCwiZXhwIjoyMDM5MTIwNTUwfQ.drWmOkG8C94FPq9uXEKefEx-jnn1KSHbGzg8qbVoRQw"
);

module.exports = supabase;
