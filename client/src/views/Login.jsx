import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function Login({ socket }) {
  const [username, setUsername] = useState("");
  const navigate = useNavigate();
  function handleSubmit(e) {
    e.preventDefault();
    localStorage.setItem("username", username);
    navigate("/chat");
  }
  return (
    <>
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="w-full max-w-md p-8 space-y-6 bg-white shadow-lg rounded-xl">
          <h1 className="text-2xl font-bold text-center text-gray-800">
            Welcome Back
          </h1>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Username
              </label>
              <input
                type="text"
                placeholder="Your username"
                className="w-full px-4 py-3 mt-2 text-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            <button
              type="submit"
              className="w-full px-4 py-3 font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Log In
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
