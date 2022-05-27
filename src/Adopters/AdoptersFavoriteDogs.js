import React, { useContext } from "react";
import { useParams, Redirect } from "react-router-dom";
import UserInfoContext from "../common/UserInfoContext";
import swal from "sweetalert";
import AdoptableDogCard from "../AdoptableDogs/AdoptableDogCard";
import Loading from "../common/Loading";

const AdopterFavoriteDogs = () => {
  const { username } = useParams();
  const { user, favoriteDogs, isFavoriteDogsLoading } = useContext(
    UserInfoContext
  );

  // const [isLoading, setIsLoading] = useState(true)
  // const [favoriteDogs, setFavoriteDogs] = useState([])
  // // //useEffect(()=> {
  //   if (user && user.userType === "adopters") {
  //     async function getFavoriteDogs() {
  //       try {
  //         const favDogs = await PetlyApi.getFavoriteDogs(user.username, token);
  //         console.log(favDogs)
  //         setFavoriteDogs(favDogs);
  //         setIsLoading(false);
  //       } catch (err) {
  //         console.log(err);
  //         swal({ text: err[0], icon: "warning" });
  //         return <Redirect to="/" />;
  //       }
  //     }
  //     getFavoriteDogs();
  // // }, [favoriteDogs.length])

  console.log(favoriteDogs);
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
    <div>
      <div>My favorite dogs</div>
      {allDogs}
    </div>
  );
};

export default AdopterFavoriteDogs;
