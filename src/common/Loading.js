import React from "react";
import { Spinner } from "reactstrap";
import "../css/Loading.css";

const Loading = () => {
  return (
    <div className="loading">
      <Spinner className="spinner">LOADING ...</Spinner>
    </div>
  );
};

export default Loading;
