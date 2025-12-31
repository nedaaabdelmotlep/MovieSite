import api from "./client";

export const loginApi = async ({ username, password }) => {
  const { data } = await api.post("/api/auth/login/", { username, password });
  return data;
};

export const registerApi = async ({ username, password, email, fullName }) => {
  // Include optional fields if provided
  const payload = { username, password };
  if (email) payload.email = email;
  if (fullName) payload.fullName = fullName;
  const { data } = await api.post("/api/auth/register/", payload);
  return data;
};

export const meApi = async () => {
  const { data } = await api.get("/api/auth/me/");
  return data;
};
