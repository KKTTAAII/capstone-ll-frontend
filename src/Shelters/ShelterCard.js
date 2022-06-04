import React from "react";
import { Link } from "react-router-dom";
import { Card, CardImg, CardBody, CardTitle, CardSubtitle } from "reactstrap";
import "../css/ShelterCard.css";
import LOGO from "../assets/shelter.jpg";

const ShelterCard = ({ shelter }) => {
  const { id, name, city, state, logo } = shelter;
  return (
    <div id={id} className="ShelterCard-container">
      <Card id="Sheltercard-card">
        <CardImg alt={name} src={logo.includes("../assets/shelter.jpg") ? LOGO : logo} top id="ShelterCard-img" />
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
