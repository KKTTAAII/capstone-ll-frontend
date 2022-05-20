import React, { useContext, Redirect } from "react";
import { useParams } from "react-router-dom";
import { useFetch } from "../common/hooks";
import PetlyApi from "../api";
import UserInfoContext from "../common/UserInfoContext";
import swal from "sweetalert";
import AdoptableDogCard from "../AdoptableDogs/AdoptableDogCard";

const AdopterFavoriteDogs = () => {
  const { username } = useParams();
  const { user, token } = useContext(UserInfoContext);
  const [favoriteDogs, isLoading] = useFetch(
    PetlyApi.getFavoriteDog(username, token)
  );

  //ensure correct shelter adding their dog
  if (username !== user.username) {
    swal({ text: "Unautorized user", icon: "warning" });
    return <Redirect to="/" />;
  }

  if (isLoading) {
    return (
      <div className="loading">
        <div>LOADING ...</div>
      </div>
    );
  }

  const allDogs = favoriteDogs.map(dog => {
    return <AdoptableDogCard dog={dog} key={dog.id} />;
  });

  return (
    <div>
      <div>My favorite dogs</div>
      {allDogs}
    </div>
  );
};

export default AdopterFavoriteDogs;
