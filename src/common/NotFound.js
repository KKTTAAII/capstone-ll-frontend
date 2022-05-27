import React from "react";
import ERROR_PIC from "../assets/error-404.png";
import { Link } from "react-router-dom";
import "../css/NotFound.css";

function NotFound() {
  return (
    <div className="NotFound-container">
      <div className="NotFound-message">
        Sorry, we did not find the page you were looking for. 
      </div>
      <img src={ERROR_PIC} alt="404-Page-Not-Found" className="NotFound-img"/>
      <Link to={`/`} className="NotFound-backHome">Back home</Link>
    </div>
  );
}

export default NotFound;
