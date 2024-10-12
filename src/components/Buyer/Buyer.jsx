import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { abi } from "../Supplier/use";

const BuyerDashboard = () => {
  const [balance, setBalance] = useState(0);
  const [amount, setAmount] = useState("");
  const [supplier, setSupplier] = useState("");
  const contractAddress = "0x48Cc1De535E038C0223EEB781e793774f8CE6590";

  useEffect(() => {
    const fetchBalance = async () => {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(contractAddress, abi, signer);
      const accounts = await provider.send("eth_requestAccounts", []);
      const balance = await contract.balanceOf(accounts[0]);
      setBalance(ethers.formatEther(balance));
    };
    fetchBalance();
  }, []);

  const handlePurchase = async () => {
    // Logic to purchase credits from a supplier
  };

  return (
    <div>
      <h2>Buyer Dashboard</h2>
      <p>Balance: {balance} Credits</p>
      <input
        type="text"
        placeholder="Amount to purchase"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      <input
        type="text"
        placeholder="Supplier address"
        value={supplier}
        onChange={(e) => setSupplier(e.target.value)}
      />
      <button onClick={handlePurchase}>Purchase Credits</button>
    </div>
  );
};

export default BuyerDashboard;
