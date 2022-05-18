import React from "react";
import { Link } from "react-router-dom";

const AdoptableDogCard = ({ dog }) => {
  const { id, name, picture } = dog;
  return (
    <div id={id}>
      <Link to={`/adoptableDogs/${id}`}>
        <div>{name}</div>
      </Link>
      <img src={picture} alt={name} />
    </div>
  );
};

export default AdoptableDogCard;
