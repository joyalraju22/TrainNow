const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:5000";

async function request(path, body) {
  const url = `${API_BASE}${path}`;
  // Debug: log where requests are sent from the client
  console.debug('[authService] request ->', { url, body });

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const text = await res.text();
    let data;
    try {
      data = text ? JSON.parse(text) : {};
    } catch (e) {
      data = { message: text };
    }

    if (!res.ok) {
      const err = data && data.message ? data.message : res.statusText || "Request failed";
      throw new Error(err);
    }

    return data;
  } catch (networkErr) {
    console.warn('[authService] network error, trying relative path fallback', networkErr);
    // Try relative path (works with CRA proxy or if backend is same origin)
    try {
      const res2 = await fetch(path, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const text2 = await res2.text();
      let data2;
      try {
        data2 = text2 ? JSON.parse(text2) : {};
      } catch (e) {
        data2 = { message: text2 };
      }

      if (!res2.ok) {
        const err2 = data2 && data2.message ? data2.message : res2.statusText || "Request failed";
        throw new Error(err2);
      }

      return data2;
    } catch (err) {
      // Re-throw original network error with both messages for debugging
      const message = err && err.message ? err.message : err;
      throw new Error(networkErr.message + ' | fallback: ' + message);
    }
  }
}

export async function register({ username, email, password }) {
  return request("/api/auth/register", { username, email, password });
}

export async function login({ username, password }) {
  return request("/api/auth/login", { username, password });
}

export default { register, login };
