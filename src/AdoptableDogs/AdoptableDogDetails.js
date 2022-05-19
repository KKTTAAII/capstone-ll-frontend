import React, { useContext } from "react";
import { Link, useParams } from "react-router-dom";
import PetlyApi from "../api";
import { convertToYesNo } from "../common/helpers";
import { useFetch } from "../common/hooks";
import UserInfoContext from "../common/UserInfoContext";

const AdoptableDogDetails = () => {
  const { token } = useContext(UserInfoContext);
  const { dogId } = useParams();
  const [dogs, isLoading] = useFetch(
    PetlyApi.get("adoptableDogs", dogId, token)
  );

  if (isLoading) {
    return (
      <div className="loading">
        <div>LOADING ...</div>
      </div>
    );
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
      <div id={id} key={id}>
        <div>Name: {name}</div>
        <img src={picture} alt={name} />
        <div>
          About
          <ul>
            <li>Breed: {breed}</li>
            <li>Gender: {gender}</li>
            <li>Age: {age}</li>
            <li>Good With Dogs: {convertToYesNo(goodWDogs)}</li>
            <li>Good With Cats: {convertToYesNo(goodWCats)}</li>
            <li>Good With Kids: {convertToYesNo(goodWKids)}</li>
          </ul>
        </div>
        <div>{name}'s Story:</div>
        <div>{description}</div>
        <div>
          Back to the <Link to={`/shelters/${shelter.id}`}>shelter</Link>
        </div>
      </div>
    );
  });

  return <>{allDogs}</>;
};

export default AdoptableDogDetails;
