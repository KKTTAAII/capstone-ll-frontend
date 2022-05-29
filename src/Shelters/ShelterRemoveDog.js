import React, { useContext } from "react";
import PetlyApi from "../api";
import { useFetch } from "../common/hooks";
import { useParams, Redirect } from "react-router-dom";
import swal from "sweetalert";
import UserInfoContext from "../common/UserInfoContext";
import AdoptableDogCard from "../AdoptableDogs/AdoptableDogCard";
import { faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "../css/ShelterRemoveDog.css";
import Loading from "../common/Loading";

const RemoveDog = ({ removeDog }) => {
  const { shelterId } = useParams();
  const { user, token } = useContext(UserInfoContext);
  const [shelter, isLoading, setShelter] = useFetch( 
    PetlyApi.get("shelters", shelterId, token),
    !isLoading && shelter ? [shelter.adoptableDogs.length] : []
  );
  let dogs;
  //ensure correct shelter adding their dog
  if (+shelterId !== user.id) {
    swal({ text: "Unautorized user", icon: "warning" });
    return <Redirect to="/" />;
  }

  if (isLoading) {
    return <Loading />;
  }

  const { adoptableDogs } = shelter;

  const handleClick = async (e, dogId) => {
    e.preventDefault();
    const response = await removeDog(shelterId, dogId);
    const remainingDogs = adoptableDogs.filter(dog => {
      return dog.id !== dogId;
    });
    //is it okay i mutate the adoptableDogs here? I need to update it
    shelter.adoptableDogs = remainingDogs;
    setShelter(shelter => ({ ...shelter }));
    //if there is an error, an array is returned
    if (response[0]) {
      swal({ text: response, icon: "warning" });
    }
  };

  if (!adoptableDogs) {
    console.log("This shelter does not have adoptable dogs");
  } else {
    dogs = adoptableDogs.map(dog => {
      return (
        <div key={dog.id} className="ShelterRemoveDog-dogContainer">
          <AdoptableDogCard dog={dog} />
          <button
            onClick={e => handleClick(e, dog.id)}
            className="ShelterRemoveDog-deleteButton"
          >
            <FontAwesomeIcon icon={faTrashCan} />
          </button>
        </div>
      );
    });
  }

  return (
    <div className="ShelterRemoveDog-container">
      <div className="ShelterRemoveDog-header">All dogs at the shelter</div>
      <div className="ShelterRemoveDog-list">{dogs}</div>
    </div>
  );
};

export default RemoveDog;
