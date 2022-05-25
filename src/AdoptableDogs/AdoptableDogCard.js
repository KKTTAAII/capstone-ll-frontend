import React, { useContext } from "react";
import { Link } from "react-router-dom";
import UserInfoContext from "../common/UserInfoContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import { useToggle } from "../common/hooks";
import PetlyApi from "../api";
import swal from "sweetalert";

const AdoptableDogCard = ({ dog, isFavoriteDog }) => {
  const { user, setFavoriteDogs, favoriteDogs } = useContext(UserInfoContext);
  const [like, setLike] = useToggle(isFavoriteDog);
  const { id, name, picture } = dog;

  const favorite = async dogId => {
    try {
      await PetlyApi.favoriteDog(dogId);
      const newFavoriteDog = dog;
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
      setFavoriteDogs(updateFavoriteDogs);
    } catch (err) {
      console.log(err);
      swal({ text: err[0], icon: "warning" });
    }
  };

  return (
    <div id={id}>
      {user.userType === "adopters" ? (
        <button
          type="button"
          onClick={async () => {
            like ? await unFavorite(id) : await favorite(id);
            setLike(!like);
          }}
        >
          {like ? (
            <FontAwesomeIcon icon={faHeart} />
          ) : (
            <FontAwesomeIcon icon={faHeart} inverse />
          )}
        </button>
      ) : (
        ""
      )}
      <Link to={`/adoptableDogs/${id}`}>
        <div>{name}</div>
      </Link>
      <img src={picture} alt={name} />
    </div>
  );
};

export default AdoptableDogCard;
