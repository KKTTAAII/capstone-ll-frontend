import React from "react";
import "../css/ShelterCard.css"

const ShelterCard = ({
  id,
  name,
  city,
  state,
  logo,
}) => {
  return (
    <div id={id}>
      <div>{name}</div>
      <small>{city}</small>
      <small>{state}</small>
      <img src={logo} alt="logo" className="ShelterCard-img"/>
    </div>
  );
};

export default ShelterCard;
