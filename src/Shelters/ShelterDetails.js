import React, { useContext, useState, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import PetlyApi from "../api";
import UserInfoContext from "../common/UserInfoContext";
import AdoptableDogCard from "../AdoptableDogs/AdoptableDogCard";
import "../css/ShelterDetails.css";
import { createInput, checkAllRequiredField } from "../common/helpers";
import swal from "sweetalert";
import Loading from "../common/Loading";
import { FormGroup, Row, Col } from "reactstrap";
import "../css/ShelterDetails.css";
import LOGO from "../assets/shelter.jpg";

const INITIAL_STATE = {
  message: "",
  name: "",
  adopterEmail: "",
};

const ShelterDetails = () => {
  const { token, favoriteDogs, user } = useContext(UserInfoContext);
  const { shelterId } = useParams();
  const [shelter, setShelter] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const history = useHistory();
  const [formData, setFormData] = useState(INITIAL_STATE);
  const [isInvalid, setIsInvalid] = useState(true);
  let dogs;

  useEffect(() => {
    async function getData() {
      try {
        const res = await PetlyApi.get("shelters", shelterId, token);
        setShelter(res);
        setIsLoading(false);
      } catch (err) {
        swal("Oops, not found");
        history.push("/");
        console.log(err);
      }
    }
    getData();
  }, []);

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
    const favoriteDogsIds = favoriteDogs ? favoriteDogs.map(dog => dog.id) : [];
    dogs = adoptableDogs.map(dog => {
      return (
        <AdoptableDogCard
          dog={dog}
          key={dog.id}
          isFavoriteDog={
            user.userType === "adopters" ? favoriteDogsIds.includes(dog.id) : ""
          }
        />
      );
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
      swal({ text: response });
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
        <img
          src={logo.includes("../assets/shelter.jpg") ? LOGO : logo}
          className="ShelterDetails-img"
          alt={name}
        />
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

            <label className="SheltersDetails-contactSectionLabel">
              Message to the shelter:
            </label>
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
        {adoptableDogs ? (
          <div className="allPets">{dogs}</div>
        ) : (
          <div>There are no adoptable dogs</div>
        )}
      </section>
    </div>
  );
};

export default ShelterDetails;
