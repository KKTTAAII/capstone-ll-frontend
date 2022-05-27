import React, { useContext, useState } from "react";
import { useParams } from "react-router-dom";
import { useFetch } from "../common/hooks";
import PetlyApi from "../api";
import UserInfoContext from "../common/UserInfoContext";
import AdoptableDogCard from "../AdoptableDogs/AdoptableDogCard";
import "../css/ShelterDetails.css";
import { createInput, checkAllRequiredField } from "../common/helpers";
import swal from "sweetalert";
import Loading from "../common/Loading";
import { FormGroup, Row, Col } from "reactstrap";
import "../css/ShelterDetails.css";

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
    return <Loading />;
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
    <div id={id} className="ShelterDetails-container">
      {/* shelter's info section */}
      <section className="ShelterDetails-infoSection">
        <img src={logo} className="ShelterDetails-img" alt={name} />
        <div className="ShelterDetails-info">
          <div className="name">{name}</div>
          <div className="address">
            {address} {city}, {state} {postcode}
          </div>
          <div className="mission">
            <div className="label">Shelter's Mission:</div> {description}
          </div>
          <div className="contact">
            <div className="label">Contact:</div>
            <div>Phone Number: {phoneNumber}</div>
            <div>Email: {email}</div>
          </div>
        </div>
      </section>
      {/* contact shelter section */}
      <section className="ShelterDetails-contactSection">
        <div className="ShelterDetails-contactSectionContainer">
          <div className="label contact-us">Contact us:</div>
          <form onSubmit={handleSubmit} className="ShelterDetails-form">
            <Row>
              <Col md={4}>
                <FormGroup>
                  {createInput(
                    "name",
                    "text",
                    formData.name,
                    handleChange,
                    "Name",
                    false,
                    "SheltersDetails-contactSectionLabel",
                    "SheltersDetails-contactSectionInput"
                  )}
                </FormGroup>
              </Col>
              <Col md={4}>
                <FormGroup>
                  {createInput(
                    "adopterEmail",
                    "email",
                    formData.adopterEmail,
                    handleChange,
                    "Email",
                    false,
                    "SheltersDetails-contactSectionLabel",
                    "SheltersDetails-contactSectionInput"
                  )}
                </FormGroup>
              </Col>
            </Row>

            <label className="SheltersDetails-contactSectionLabel">Message to the shelter:</label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows="5"
              cols="33"
            ></textarea>
            <button className="ShelterDetails-button">Message Shelter</button>
          </form>
        </div>
      </section>
      <section className="ShelterDetails-petSection">
        <div className="label pets">Shelter's Pet:</div>
        <div className="allPets">{adoptableDogs ? dogs : "There are no adoptable dogs"}</div>
      </section>
    </div>
  );
};

export default ShelterDetails;
