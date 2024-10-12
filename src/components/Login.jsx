import React, { useEffect, useState, useContext } from "react";
import { ethers } from "ethers";
import { RolesABI } from "./Register";
import { useNavigate } from "react-router-dom";
import { LoginContext } from "../util/loginstatus";

const roles = {
  1: "Supplier",
  2: "Auditor",
  3: "Regulatory Autority",
  4: "Buyer",
};
function Login() {
  const router = useNavigate();
  const { isLoggedIn, userroles, username, setLoginState } =
    useContext(LoginContext);

  const [loggedIn, setLoggedIn] = useState(false);

  const [role, setRole] = useState(null);
  const [error, setError] = useState("");

  // Contract address (replace with your deployed contract address)
  const CONTRACT_ADDRESS = "0xC17BCFc8af93A170D453E6EB1ef3FEa3eef9a97F";

  const handleLogin = async () => {
    try {
      setError(""); // Clear any previous errors

      if (!window.ethereum) {
        setError("MetaMask is not installed.");
        return;
      }

      // Request account access via MetaMask
      const provider = new ethers.BrowserProvider(window.ethereum);
      await provider.send("eth_requestAccounts", []);

      // Get the signer (user's account)
      const signer = await provider.getSigner();

      // Get the user's address
      const userAddress = await signer.getAddress();

      // Create a contract instance
      const contract = new ethers.Contract(CONTRACT_ADDRESS, RolesABI, signer);

      // Call the getUser function to check if the user exists
      const user = await contract.getUser(userAddress);
      // Check if the user is registered
      if (user.exists) {
        console.log("User found:", user);
        setRole(Number(user.role));
        const lo = true;
        setLoggedIn(true);
        setLoginState({
          isLoggedIn: true,
          userroles: role,
          username: user.name,
        });
        if (lo) {
          setTimeout(() => {
            router(`/${roles[Number(user.role)]}`);
          }, 1000);
        }
      } else {
        setError("User is not registered.");
      }
    } catch (err) {
      console.error(err);
      setError("Error logging in. Please try again.");
    }
  };

  return (
    <div className="flex flex-col justify-start items-start space-y-4 p-4 bg-green-100 shadow-md rounded-md w-96">
      <button
        onClick={handleLogin}
        className="w-full p-2  bg-rose-700 font-bold text-white rounded hover:bg-rose-900 transition"
      >
        Login with MetaMask
      </button>

      {/* Error Message */}
      {error && <p className="text-red-500 mt-2">{error}</p>}

      {/* Success Message */}
      {loggedIn && (
        <div className="mt-4">
          <p className="text-green-500">Login successful!</p>
          <p>Your role: {loggedIn && roles[role]}</p>
        </div>
      )}
    </div>
  );
}

export default Login;
