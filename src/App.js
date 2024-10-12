import logo from "./logo.svg";
import "./App.css";
import LoginSignup from "./components/LoginorRegister";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { LoginContext } from "./util/loginstatus";
import { useContext, useEffect, useState } from "react";
import SupplierDashboard from "./components/Supplier/supplierdash";
import AuditorDashboard from "./components/auditor/auditor";
import BuyerDashboard from "./components/Buyer/Buyer";

function App() {
  const [loginState, setLoginState] = useState({
    isLoggedIn: false,
    role: "",
    username: "",
  });

  // Function to update login state, role, and username
  const updateLoginState = (newState) => {
    setLoginState((prevState) => ({
      ...prevState,
      ...newState,
    }));
  };
  useEffect(() => {
    console.log(loginState);
  }, []);
  return (
    <LoginContext.Provider
      value={{ ...loginState, setLoginState: updateLoginState }}
    >
      <Router className="App">
        <Routes>
          <Route path="/" element={<LoginSignup />} />
          <Route
            path="/Supplier"
            element={
              loginState.isLoggedIn ? (
                <SupplierDashboard />
              ) : (
                "Supplier Not logged in"
              )
            }
          />
          <Route
            path="/Auditor"
            element={
              loginState.isLoggedIn ? (
                <AuditorDashboard />
              ) : (
                "Auditor Not logged in"
              )
            }
          />
          <Route
            path="/Buyer"
            element={
              loginState.isLoggedIn ? <BuyerDashboard /> : "Buyer Not logged in"
            }
          />
        </Routes>
      </Router>
    </LoginContext.Provider>
  );
}

export default App;
