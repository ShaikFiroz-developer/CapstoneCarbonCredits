import React, { useEffect, useState } from "react";
import VpnKeyIcon from "@mui/icons-material/VpnKey";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";

function SidenavLS({ loginorregister }) {
  const [menuopen, setmenustatus] = useState(false);
  const [logorreg, setstate] = useState(null);
  useEffect(() => {
    loginorregister(logorreg);
  }, [logorreg]);
  return (
    <div
      style={menuopen ? { width: "160px" } : {}}
      className="w-20 max-w-40 min-h-screen shadow flex flex-col justify-start items-center"
    >
      <section
        style={menuopen ? { backgroundColor: "white" } : {}}
        className="h-20 w-full flex justify-center items-center bg-green-700"
      >
        <div
          onClick={() => {
            setmenustatus(!menuopen);
          }}
          className="cursor-pointer"
        >
          {menuopen ? <ChevronLeftIcon /> : <MenuIcon />}
        </div>
      </section>
      <section>
        {!menuopen ? (
          <div
            className=" cursor-pointer"
            onClick={() => {
              setstate("login");
            }}
          >
            <VpnKeyIcon />
          </div>
        ) : (
          <div className="flex justify-around items-center">
            <div
              className=" cursor-pointer"
              onClick={() => {
                setstate("login");
              }}
            >
              <VpnKeyIcon />
            </div>
            <p className="font-semibold">Login</p>
          </div>
        )}
        {!menuopen ? (
          <div
            className=" cursor-pointer"
            onClick={() => {
              setstate("register");
            }}
          >
            <PersonAddIcon />
          </div>
        ) : (
          <div className="flex justify-around items-center">
            <div
              className=" cursor-pointer"
              onClick={() => {
                setstate("register");
              }}
            >
              <PersonAddIcon />
            </div>
            <p className="font-semibold pl-3">Signup</p>
          </div>
        )}
      </section>
    </div>
  );
}

export default SidenavLS;
