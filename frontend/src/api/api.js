const API_URL = import.meta.env.VITE_API_URL;

// Register User
export const registerUser = async (userData) => {
  const response = await fetch(`${API_URL}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData),
  });

  if (!response.ok) {
    throw new Error("Failed to register");
  }

  return response.json(); // Assuming your backend sends back JSON
};

// Login User
export const loginUser = async (loginData) => {
  const response = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(loginData),
  });

  if (!response.ok) {
    throw new Error("Failed to login");
  }

  return response.json(); // Assuming your backend sends back a token or user details
};
