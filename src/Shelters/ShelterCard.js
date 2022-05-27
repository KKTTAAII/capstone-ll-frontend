import React from "react";
import { Link } from "react-router-dom";
import { Card, CardImg, CardBody, CardTitle, CardSubtitle } from "reactstrap";
import "../css/ShelterCard.css";

const ShelterCard = ({ shelter }) => {
  const { id, name, city, state, logo } = shelter;
  return (
    <div id={id} className="ShelterCard-container">
      <Card id="Sheltercard-card">
        <CardImg alt={name} src={logo} top id="ShelterCard-img"/>
        <CardBody>
          <CardTitle>
            <Link to={`/shelters/${id}`} className="ShelterCard-link">
              <div>{name}</div>
            </Link>
          </CardTitle>
          <CardSubtitle>
            <div>City: {city}</div>
            <div>State: {state}</div>
          </CardSubtitle>
        </CardBody>
      </Card>
    </div>
  );
};

export default ShelterCard;
