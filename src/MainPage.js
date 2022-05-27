import React from "react";
import "./css/MainPage.css";
import PawPrints from "./assets/paw-print-mainpage/pawPrint.jpg";

const MainPage = () => {
  return (
    <div className="MainPage-container">
      {/* {credit <a href="https://www.vecteezy.com/free-vector/paw-print">Paw Print Vectors by Vecteezy</a>} */}
      <img alt="pawprint" src={PawPrints} />
      <div className="MainPage-header">Welcome to Petly!</div>
    </div>
  );
};

export default MainPage;
