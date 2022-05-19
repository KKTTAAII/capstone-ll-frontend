import React, { useContext, useState } from "react";
import { useParams } from "react-router-dom";
import { useFetch } from "../common/hooks";
import PetlyApi from "../api";
import UserInfoContext from "../common/UserInfoContext";
import AdoptableDogCard from "../AdoptableDogs/AdoptableDogCard";
import "../css/ShelterDetails.css";
import { createInput, checkAllRequiredField } from "../common/helpers";
import swal from "sweetalert";

const INITIAL_STATE = {
  message: "",
  name: "",
  adopterEmail: "",
};

const ShelterDetails = () => {
  const { token } = useContext(UserInfoContext);
  const { shelterId } = useParams();
  const [shelter, isLoading] = useFetch(
    PetlyApi.get("shelters", shelterId, token)
  );
  const [formData, setFormData] = useState(INITIAL_STATE);
  const [isInvalid, setIsInvalid] = useState(true);
  let dogs;

  if (isLoading) {
    return (
      <div className="loading">
        <div>LOADING ...</div>
      </div>
    );
  }

  const {
    address,
    city,
    state,
    phoneNumber,
    email,
    logo,
    description,
    id,
    postcode,
    name,
    adoptableDogs,
  } = shelter;

  if (!adoptableDogs) {
    console.log("This shelter does not have adoptable dogs");
  } else {
    dogs = adoptableDogs.map(dog => {
      return <AdoptableDogCard dog={dog} key={dog.id} />;
    });
  }

  //form to contact the shelter
  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(formData => ({
      ...formData,
      [name]: value,
    }));
    e.target.value === "" ? setIsInvalid(true) : setIsInvalid(false);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setFormData(INITIAL_STATE);
    const { adopterEmail, message } = formData;
    const isAllRequiredFieldFilled = checkAllRequiredField([
      adopterEmail,
      message,
    ]);
    if (!isInvalid && isAllRequiredFieldFilled) {
      let response = await PetlyApi.contactShelter(formData, shelterId);
      swal({ text: response, icon: "warning" });
    } else {
      swal({
        text: "Oop, please fill out all required fields",
        icon: "warning",
      });
      console.log("Oop, please fill out all required fields");
    }
  };

  return (
    <div id={id}>
      {/* shelter's info section */}
      <section>
        <img src={logo} className="ShelterDetails-img" alt={name} />
        <div>{name}</div>
        <div>
          {address} {city}, {state} {postcode}
        </div>
        <div>Shelter's Mission: {description}</div>
        <div>
          Contact:
          <div>Phone Number: {phoneNumber}</div>
          <div>Email: {email}</div>
        </div>
        <div>Shelter's Pet:</div>
        <div>{adoptableDogs ? dogs : "There are no adoptable dogs"}</div>
      </section>
      {/* contact shelter section */}
      <section>
        <div>
          Contact us:
          <form onSubmit={handleSubmit}>
            {createInput("name", "text", formData.name, handleChange, "Name")}
            {createInput(
              "adopterEmail",
              "email",
              formData.adopterEmail,
              handleChange,
              "Email"
            )}
            <label>Message to the shelter:</label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows="5"
              cols="33"
            ></textarea>
            <button>Message Shelter</button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default ShelterDetails;
