import React from "react";
import ERROR_PIC from "../assets/error-404.png";
import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div>
      <div>
        Sorry, we did not find the page you were looking for. Please try again!
      </div>
      <img src={ERROR_PIC} alt="404-Page-Not-Found" />
      <Link to={`/`}>Back home</Link>
    </div>
  );
}

export default NotFound;
