import React from "react";
import "../assets/css/header.css";
import logo from "../assets/image/logoISQ_CTAG.png";

function Header() {
  return (
    <header className="header" id="headerPrincipal">
      <div className="container">
        <img src={logo} alt="Logo ICQ CTAG" className="imageLogo" />
      </div>
    </header>
  );
}

export default Header;
