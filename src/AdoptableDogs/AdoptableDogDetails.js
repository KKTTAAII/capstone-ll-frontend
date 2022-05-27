import React, { useContext } from "react";
import { Link, useParams } from "react-router-dom";
import PetlyApi from "../api";
import { convertToYesNo } from "../common/helpers";
import { useFetch } from "../common/hooks";
import Loading from "../common/Loading";
import UserInfoContext from "../common/UserInfoContext";
import "../css/AdoptableDogDetails.css";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const AdoptableDogDetails = () => {
  const { token, user } = useContext(UserInfoContext);
  const { dogId } = useParams();
  const [dogs, isLoading] = useFetch(
    PetlyApi.get("adoptableDogs", dogId, token)
  );

  if (isLoading) {
    return <Loading />;
  }

  //in case there are more than 1 dog with the same ids (from db and from petfinder)
  const allDogs = dogs.map(dog => {
    const {
      name,
      age,
      breed,
      description,
      gender,
      goodWCats,
      goodWDogs,
      goodWKids,
      id,
      picture,
      shelter,
    } = dog;
    return (
      <div id={id} key={id} className="AdoptableDogDetails-container">
        {/* show edit button for the correct shelter */}
        {user.userType === "shelters" && user.id === shelter.id ? (
          <button className="edit-button">
            <a href={`/adoptableDogs/edit/${id}/${shelter.id}`}><FontAwesomeIcon icon={faPenToSquare}>Edit</FontAwesomeIcon></a>
          </button>
        ) : (
          ""
        )}

        <div className="AdoptableDogDetails-name">{name}</div>
        <img src={picture} alt={name} className="AdoptableDogDetails-img" />
        <div className="AdoptableDogDetails-infoContainer">
          <div className="label">About</div>
          <ul className="list">
            <li className="item">
              <div className="label">Breed: </div>
              {breed}
            </li>
            <li className="item">
              <div className="label">Gender: </div>
              {gender}
            </li>
            <li className="item">
              <div className="label">Age: </div>
              {age}
            </li>

            <li className="item">
              <div className="label">Good With Dogs: </div>
              {convertToYesNo(goodWDogs)}
            </li>
            <li className="item">
              <div className="label">Good With Cats: </div>
              {convertToYesNo(goodWCats)}
            </li>
            <li className="item">
              <div className="label">Good With Kids: </div>
              {convertToYesNo(goodWKids)}
            </li>
          </ul>
        </div>
        <div className="label story">{name}'s Story:</div>
        <div className="description">{description}</div>
        <div className="back-to-link">
          Back to the{" "}
          <Link to={`/shelters/${shelter.id}`} className="link">
            shelter
          </Link>
        </div>
      </div>
    );
  });

  return <>{allDogs}</>;
};

export default AdoptableDogDetails;
