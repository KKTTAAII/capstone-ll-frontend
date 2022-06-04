import React, { useContext } from "react";
import { useParams, Redirect } from "react-router-dom";
import UserInfoContext from "../common/UserInfoContext";
import swal from "sweetalert";
import AdoptableDogCard from "../AdoptableDogs/AdoptableDogCard";
import Loading from "../common/Loading";
import "../css/AdopterFavoriteDogs.css";

const AdopterFavoriteDogs = () => {
  const { username } = useParams();
  const { user, favoriteDogs, isFavoriteDogsLoading } = useContext(
    UserInfoContext
  );
  
  //ensure correct shelter adding their dog
  if (username !== user.username) {
    swal({ text: "Unautorized user", icon: "warning" });
    return <Redirect to="/adoptableDogs" />;
  }

  if (isFavoriteDogsLoading) {
    return <Loading />;
  }

  const allDogs = favoriteDogs.map(dog => {
    return <AdoptableDogCard dog={dog} key={dog.id} isFavoriteDog={true} />;
  });

  return (
    <div className="AdopterFavoriteDogs-container">
      <div className="AdopterFavoriteDogs-header">My favorite dogs</div>
      <div className="AdopterFavoriteDogs-dogs">{allDogs}</div>
    </div>
  );
};

export default AdopterFavoriteDogs;
