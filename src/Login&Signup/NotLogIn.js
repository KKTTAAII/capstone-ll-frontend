import React from "react";
import { Link } from "react-router-dom";

const NotLogIn = () => {
  return (
    <div>
      <p>Please log in to access this page</p>
      <Link to={`/`}>Go Back to Home</Link>
    </div>
  );
};

export default NotLogIn;
