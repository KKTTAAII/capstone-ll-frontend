import React, { useContext } from "react";
import { useParams, Redirect } from "react-router-dom";
import UserInfoContext from "../common/UserInfoContext";
import swal from "sweetalert";
import AdoptableDogCard from "../AdoptableDogs/AdoptableDogCard";

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
    return (
      <div className="loading">
        <div>LOADING ...</div>
      </div>
    );
  }

  const allDogs = favoriteDogs.map(dog => {
    return <AdoptableDogCard dog={dog} key={dog.id} isFavoriteDog={true} />;
  });

  return (
    <div>
      <div>My favorite dogs</div>
      {allDogs}
    </div>
  );
};

export default AdopterFavoriteDogs;
