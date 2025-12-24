// Client-side auth fallback using localStorage
// This replaces network calls with persistent local behavior

const USERS_KEY = "auth_users"; // array of users
const SESSIONS_KEY = "auth_sessions"; // { token: username }

const readJSON = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
};

const writeJSON = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // ignore
  }
};

const sanitizeUser = (u) => {
  if (!u) return null;
  const { password, ...rest } = u;
  return rest;
};

const usernameTaken = (username) => {
  const users = readJSON(USERS_KEY, []);
  return users.some((u) => u.username.toLowerCase() === String(username).toLowerCase());
};

const getUserByCreds = (username, password) => {
  const users = readJSON(USERS_KEY, []);
  return users.find(
    (u) => u.username.toLowerCase() === String(username).toLowerCase() && u.password === password
  );
};

const addUser = (user) => {
  const users = readJSON(USERS_KEY, []);
  users.push(user);
  writeJSON(USERS_KEY, users);
  return user;
};

const createSession = (username) => {
  const token = `token_${username}_${Math.random().toString(36).slice(2)}`;
  const sessions = readJSON(SESSIONS_KEY, {});
  sessions[token] = username;
  writeJSON(SESSIONS_KEY, sessions);
  return token;
};

const getUserFromToken = (token) => {
  const sessions = readJSON(SESSIONS_KEY, {});
  const username = sessions[token];
  if (!username) return null;
  const users = readJSON(USERS_KEY, []);
  return users.find((u) => u.username === username) || null;
};

export const registerApi = async ({ username, password, email, fullName }) => {
  if (!username || !password) {
    throw new Error("Username and password are required");
  }
  if (usernameTaken(username)) {
    throw new Error("Username is already taken");
  }
  const newUser = addUser({ username, password, email: email || null, fullName: fullName || null });
  const token = createSession(newUser.username);
  return { user: sanitizeUser(newUser), token };
};

export const loginApi = async ({ username, password }) => {
  const user = getUserByCreds(username, password);
  if (!user) {
    throw new Error("Invalid username or password");
  }
  const token = createSession(user.username);
  return { user: sanitizeUser(user), token };
};

export const meApi = async () => {
  // Try to read the auth payload persisted by the store
  try {
    const persisted = JSON.parse(localStorage.getItem("user") || "null");
    const token = persisted?.token;
    if (!token) throw new Error("Not authenticated");
    const user = getUserFromToken(token);
    if (!user) throw new Error("Session expired");
    return { user: sanitizeUser(user) };
  } catch (err) {
    throw new Error(err?.message || "Unable to load user");
  }
};
