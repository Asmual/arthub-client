
const BASE_URL = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000").replace(/\/$/, "");


export const fetchBackendToken = async (email) => {
  if (!email) return null;
  try {
    const res = await fetch(`${BASE_URL}/api/users/generate-token`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    if (!res.ok) throw new Error("Express backend JWT token exchange failed.");
    const data = await res.json();
    return data.token;
  } catch (err) {
    console.error("Token generation wrapper error:", err);
    return null;
  }
};

export const backendFetch = async (endpoint, options = {}, userEmail = null) => {
  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (userEmail) {
    const token = await fetchBackendToken(userEmail);
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  return response;
};