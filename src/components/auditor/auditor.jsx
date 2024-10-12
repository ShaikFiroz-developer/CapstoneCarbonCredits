import { ethers } from "ethers";
import React from "react";
import { useState, useEffect } from "react";
import { abi } from "../Supplier/use";
import Header from "../Header";
import HistoryIcon from "@mui/icons-material/History";

const AuditorDashboard = () => {
  const [status, setStatus] = useState([]);
  const contractAddress = "0x48Cc1De535E038C0223EEB781e793774f8CE6590";

  const handleApproveRequest = async (e) => {
    e.preventDefault();
    const requestId = e.target[0].value;
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(contractAddress, abi, signer);
      const tx = await contract.approveIssuance(requestId);
      await tx.wait();
      console.log("Request approved");
    } catch (error) {
      setStatus("Error during approving: " + error.message);
    }
  };

  /*const fetchPendingRequests = async () => {

  };*/

  return (
    <div>
      <Header />
      <div className="flex justify-between mb-5 h-12 items-center shadow">
        <h2 className="text-3xl font-extrabold text-green-500">
          Auditor Dashboard
        </h2>
        <HistoryIcon style={{ fontSize: "30px" }} />
      </div>
      <form
        className="flex flex-col justify-start items-start bg-green-100"
        onSubmit={handleApproveRequest}
      >
        <h2>Approve credits</h2>
        <input
          type="text"
          className="p-3 border border-gray-300 rounded"
          placeholder="requestId"
        />
        <button
          className="bg-green-500 p-3 rounded hover:bg-green-400"
          type="submit"
        >
          Approve
        </button>
      </form>
      {status && status}
    </div>
  );
};

export default AuditorDashboard;
