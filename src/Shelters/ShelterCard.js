import React from "react";
import { Link } from "react-router-dom";
import "../css/ShelterCard.css";

const ShelterCard = ({ shelter }) => {
  const { id, name, city, state, logo } = shelter;
  return (
    <div id={id}>
      <Link to={`/shelters/${id}`}>
        <div>{name}</div>
      </Link>
      <div>
        <small>{city}</small>
        <small>{state}</small>
      </div>
      <img src={logo} alt="logo" className="ShelterCard-img" />
    </div>
  );
};

export default ShelterCard;
