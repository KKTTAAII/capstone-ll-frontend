import React, { useContext } from "react";
import { Link } from "react-router-dom";
import UserInfoContext from "../common/UserInfoContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import { useToggle } from "../common/hooks";
import { Card, CardImg, CardBody, CardTitle, CardSubtitle } from "reactstrap";
import PetlyApi from "../api";
import swal from "sweetalert";
import "../css/AdoptableDogCard.css";
import LOCAL_IMAGE from "../assets/dog.png";

const AdoptableDogCard = ({ dog, isFavoriteDog }) => {
  const { user, setFavoriteDogs, favoriteDogs, allFavoritedDogs } = useContext(
    UserInfoContext
  );
  const [like, setLike] = useToggle(isFavoriteDog);
  const { id, name, picture, gender, age } = dog;

  const favorite = async dogId => {
    try {
      await PetlyApi.favoriteDog(dogId);
      const newFavoriteDog = dog;
      setLike(!like);
      //add to allFavoritedDogs so we can check through frontend data
      //first before calling API if the data does not exist
      allFavoritedDogs.current[newFavoriteDog.id] = newFavoriteDog;
      setFavoriteDogs(dogs => [...dogs, newFavoriteDog]);
    } catch (err) {
      console.log(err);
      swal({ text: err[0], icon: "warning" });
    }
  };

  const unFavorite = async dogId => {
    try {
      await PetlyApi.unFavoriteDog(dogId);
      const updateFavoriteDogs = favoriteDogs.filter(dog => dog.id !== dogId);
      setLike(!like);
      setFavoriteDogs(updateFavoriteDogs);
    } catch (err) {
      console.log(err);
      swal({ text: err[0], icon: "warning" });
    }
  };

  return (
    <div id={id} className="AdoptableDogCard-container">
      <Card id="AdoptableDogCard-card">
        <CardImg
          alt={name}
          src={picture.includes("../assets/dog.png") ? LOCAL_IMAGE : picture}
          top
          id="AdoptableDogCard-img"
        />
        {user.userType === "adopters" ? (
          <button
            className="button"
            type="button"
            onClick={async () => {
              like ? await unFavorite(id) : await favorite(id);
            }}
          >
            {like ? (
              <FontAwesomeIcon icon={faHeart} className="like-button" />
            ) : (
              <FontAwesomeIcon icon={faHeart} inverse className="like-button" />
            )}
          </button>
        ) : (
          ""
        )}
        <CardBody>
          <CardTitle>
            <Link to={`/adoptableDogs/${id}`} className="AdoptableDogCard-link">
              <div className="AdoptableDogCard-name">{name}</div>
            </Link>
          </CardTitle>
          <CardSubtitle>
            <div>{gender}</div>
            <div>{age}</div>
          </CardSubtitle>
        </CardBody>
      </Card>
    </div>
  );
};

export default AdoptableDogCard;
