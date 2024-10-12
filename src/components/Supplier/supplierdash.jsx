import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import { abi } from "./use";
import Header from "../Header";
import HistoryIcon from "@mui/icons-material/History";

const SupplierDashboard = () => {
  const [balance, setBalance] = useState(0);
  const [amount, setAmount] = useState("");
  const [status, setStatus] = useState("");
  const [requestid, setRequestId] = useState(null);
  const contractAddress = "0x48Cc1De535E038C0223EEB781e793774f8CE6590";

  const [issuereqobjvalues, setissuevalues] = useState({
    amount: null,
    project: "",
  });

  const [balances, setBalancesRequest] = useState(false);
  const [trans, setTransferReq] = useState(false);
  const [issuereq, setIssuanceReq] = useState(false);

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        // Connect provider and signer
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();

        // Connect contract with signer
        const contract = new ethers.Contract(contractAddress, abi, signer);

        // Request accounts and fetch balance
        const accounts = await provider.send("eth_requestAccounts", []);
        const balance = await contract.balanceOf(accounts[0]);

        // Format and set the balance
        setBalance(ethers.formatEther(balance));
        console.log(Number(balance));
      } catch (error) {
        console.error("Error fetching balance:", error);
        setStatus("Error fetching balance: " + error.message);
      }
    };
    fetchBalance();
  }, [contractAddress]);

  const handleRequestIssuance = async () => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(contractAddress, abi, signer);

      const tx = await contract.requestIssuance(
        ethers.parseUnits(issuereqobjvalues.amount, 18), // Adjust the units based on token decimals
        issuereqobjvalues.project
      );
      await tx.wait();
      setStatus("Issuance requested successfully!");
    } catch (error) {
      setStatus("Error requesting issuance: " + error.message);
    }
  };

  const handleTransfer = async (e) => {
    e.preventDefault();
    const amount = e.target[0].value;
    const addresss = e.target[1].value;
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(contractAddress, abi, signer);

      const tx = await contract.transfer(
        addresss,
        ethers.parseUnits(amount, 18) // Adjust the units based on token decimals
      );
      await tx.wait();
      setStatus("Transfer successful!");
    } catch (error) {
      setStatus("Error during transfer: " + error.message);
    }
  };

  return (
    <div className="flex flex-col">
      <Header />
      <div className="flex justify-between mb-5 h-12 items-center shadow">
        <h2 className="text-3xl font-extrabold text-green-500">
          Supplier Dashboard
        </h2>
        <HistoryIcon style={{ fontSize: "30px" }} />
      </div>
      <div className="grid grid-flow-row grid-cols-2 pt-10 place-items-center bg-green-50 h-[60vh]">
        {[
          "Check Balance Credits",
          "Transfer Credits",
          "Request Carbon Credit Issuance",
        ].map((item, index) => {
          return (
            <div key={index}>
              <input
                type="button"
                value={item}
                onClick={() => {
                  setRequestId(index);
                  if (index === 0) {
                    setBalancesRequest(true);
                  } else if (index === 1) {
                    setTransferReq(true);
                  } else if (index === 2) {
                    setIssuanceReq(true);
                  }
                }}
                className="bg-rose-500 cursor-pointer text-white font-medium h-20 rounded p-4"
              />
            </div>
          );
        })}
        {balances && (
          <div className="w-full h-[70vh] fixed bg-slate-50 flex flex-col justify-center items-center p-4">
            <p onClick={() => setBalancesRequest(false)}>close</p>
            <div>
              <h2>Account: </h2> <p>{/* Add account info here */}</p>
            </div>
            <div>
              <h2>Balance: {balance}</h2>
            </div>
          </div>
        )}
        {issuereq && (
          <div className="w-full h-[70vh] fixed bg-slate-50 flex flex-col justify-center items-center p-4">
            <p
              onClick={() => setIssuanceReq(false)}
              className="cursor-pointer text-red-500 mb-4"
            >
              close
            </p>

            {/* Input for amount */}
            <input
              type="number"
              value={issuereqobjvalues.amount}
              onChange={(e) =>
                setissuevalues({ ...issuereqobjvalues, amount: e.target.value })
              }
              required
              placeholder="Amount of Carbon Credits"
              className="mb-4 p-2 border border-gray-300 rounded"
            />

            {/* Input for project */}
            <input
              type="text"
              value={issuereqobjvalues.project}
              onChange={(e) =>
                setissuevalues({
                  ...issuereqobjvalues,
                  project: e.target.value,
                })
              }
              required
              placeholder="Project Name"
              className="mb-4 p-2 border border-gray-300 rounded"
            />

            {/* Request Issuance button */}
            <input
              type="button"
              value="Request Issuance"
              onClick={handleRequestIssuance}
              className="bg-green-500 text-white p-2 rounded cursor-pointer"
            />
            <p>{status}</p>
          </div>
        )}
        {trans && (
          <div className="w-full h-[70vh] fixed bg-slate-50 flex flex-col justify-center items-center p-4">
            <form
              onSubmit={handleTransfer}
              className="flex flex-col gap-3 bg-white shadow p-3"
            >
              <input
                type="number"
                name="amount"
                id="amount"
                required
                className="p-2 rounded border border-gray-300 cursor-pointer"
                placeholder="amount"
              />
              <input
                type="text"
                name="address"
                id="address"
                placeholder="reciepient address"
                required
                className="p-2 rounded border border-gray-300 cursor-pointer"
              />
              <input
                type="submit"
                value="transfer Credits"
                className="bg-green-500 border text-white p-2 rounded cursor-pointer"
              />
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default SupplierDashboard;
