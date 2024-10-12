import React, { useState } from "react";
import { ethers } from "ethers";

const RolesABI = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "userAddress",
        type: "address",
      },
      {
        indexed: false,
        internalType: "enum Roles.Role",
        name: "role",
        type: "uint8",
      },
    ],
    name: "UserLoggedIn",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "userAddress",
        type: "address",
      },
      {
        indexed: false,
        internalType: "string",
        name: "name",
        type: "string",
      },
      {
        indexed: false,
        internalType: "enum Roles.Role",
        name: "role",
        type: "uint8",
      },
    ],
    name: "UserSignedUp",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "users",
    outputs: [
      {
        internalType: "string",
        name: "name",
        type: "string",
      },
      {
        internalType: "address",
        name: "userAddress",
        type: "address",
      },
      {
        internalType: "enum Roles.Role",
        name: "role",
        type: "uint8",
      },
      {
        internalType: "bool",
        name: "exists",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
    constant: true,
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "_name",
        type: "string",
      },
      {
        internalType: "uint8",
        name: "_role",
        type: "uint8",
      },
    ],
    name: "signup",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "userAddress",
        type: "address",
      },
    ],
    name: "getUser",
    outputs: [
      {
        components: [
          {
            internalType: "string",
            name: "name",
            type: "string",
          },
          {
            internalType: "address",
            name: "userAddress",
            type: "address",
          },
          {
            internalType: "enum Roles.Role",
            name: "role",
            type: "uint8",
          },
          {
            internalType: "bool",
            name: "exists",
            type: "bool",
          },
        ],
        internalType: "struct Roles.User",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
    constant: true,
  },
  {
    inputs: [],
    name: "getUserRole",
    outputs: [
      {
        internalType: "enum Roles.Role",
        name: "",
        type: "uint8",
      },
    ],
    stateMutability: "view",
    type: "function",
    constant: true,
  },
];

function Register() {
  const [name, setName] = useState("");
  const [role, setRole] = useState("None");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Replace with your deployed contract address
  const CONTRACT_ADDRESS = "0xC17BCFc8af93A170D453E6EB1ef3FEa3eef9a97F";

  // Handle form submission to register user
  const handleRegister = async () => {
    if (name === "" || role === "None") {
      setError("Please fill in all fields");
      return;
    }

    try {
      setError("");
      setLoading(true);

      if (window.ethereum == null) {
        console.log("MetaMask not installed");
        setError("MetaMask not installed. Please install it to proceed.");
        return;
      }

      // Connect to MetaMask provider
      const provider = new ethers.BrowserProvider(window.ethereum);

      // Request account access if needed
      await provider.send("eth_requestAccounts", [1]);

      // Get the signer (user who will sign the transaction)
      const signer = await provider.getSigner();

      // Create contract instance
      const contract = new ethers.Contract(CONTRACT_ADDRESS, RolesABI, signer);

      // Mapping role names to corresponding enum values
      const roleMap = {
        None: 0,
        Supplier: 1,
        Auditor: 2,
        RegulatoryAuthority: 3,
        Buyer: 4,
      };

      // Call the signup function from the contract
      const tx = await contract.signup(name, roleMap[role]);
      console.log("Transaction:", tx);

      // Wait for transaction to be mined
      await tx.wait();
      setLoading(false);
      setSuccess(`User ${name} successfully registered as ${role}`);
      setError("");
    } catch (err) {
      setLoading(false);
      console.error(err);
      setError("Error during registration. Please try again.");
    }
  };

  return (
    <div className="flex flex-col justify-start items-start space-y-4 p-4 bg-green-100 shadow-md rounded-md w-96">
      <h1 className="text-xl font-bold text-green-700">Register User</h1>

      {/* Name Input */}
      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full p-2 border-2 border-green-500 rounded focus:outline-none focus:ring focus:ring-green-300"
      />

      {/* Role Dropdown */}
      <select
        name="role"
        id="role"
        value={role}
        onChange={(e) => setRole(e.target.value)}
        className="w-full p-2 border-2 border-green-500 rounded font-medium text-green-800 bg-white focus:outline-none focus:ring focus:ring-green-300"
      >
        {["None", "Supplier", "Auditor", "RegulatoryAuthority", "Buyer"].map(
          (Item, index) => {
            return (
              <option key={index} value={Item}>
                {Item}
              </option>
            );
          }
        )}
      </select>

      {/* Register Button */}
      <button
        onClick={handleRegister}
        className="w-full p-2 bg-green-500 text-white font-bold rounded hover:bg-green-600 transition"
        disabled={loading}
      >
        {loading ? "Registering..." : "Register"}
      </button>

      {/* Error Message */}
      {error && <p className="text-red-500 mt-2">{error}</p>}

      {/* Success Message */}
      {success && <p className="text-green-500 mt-2">{success}</p>}
    </div>
  );
}

export { Register, RolesABI };
