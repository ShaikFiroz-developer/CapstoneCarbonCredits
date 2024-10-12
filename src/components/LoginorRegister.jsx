import Header from "./Header";
import SidenavLS from "../util/sidenavLS";
import { useState } from "react";
import { Register } from "./Register";
import Login from "./Login";

function LoginSignup() {
  const [logorreg, setstate] = useState(null);
  const loginorregister = (e) => {
    setstate(e);
  };
  return (
    <div className="flex">
      <SidenavLS loginorregister={loginorregister} />
      <div className="w-full min-h-screen">
        <div className="w-full flex flex-col justify-center items-center h-30">
          <Header />
          <div className="w-full shadow overflow-hidden">
            {/* Container for scrolling text */}
            <div className="text-scroll font-semibold">
              <p className="inline-block whitespace-nowrap">
                {"<<"} --------------- Click Key to Login
              </p>
              <br />
              <p className="inline-block whitespace-nowrap">
                {"<<"} --------------- Click Add User to Register
              </p>
            </div>
          </div>
        </div>
        <div className="w-full flex justify-center  items-center h-[80vh] text-pretty">
          {logorreg == null && (
            <h1 className="text-orange-600 text-2xl lg:text-4xl font-extrabold">
              CARBON CREDITS D-APP
            </h1>
          )}
          {logorreg != null && logorreg == "register" && <Register />}
          {logorreg != null && logorreg == "login" && <Login />}
        </div>
      </div>
    </div>
  );
}

export default LoginSignup;
