import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import swal from "sweetalert";
import {
  checkAllRequiredField,
  createInput,
  WARNING,
  createStateOptions,
  USSTATES,
} from "../common/helpers";
import DEFAULT_PIC from "../assets/shelter.jpg";
import "../css/ShelterSignup.css";
import { Row, Col, FormGroup } from "reactstrap";

const INITIAL_STATE = {
  username: "",
  password: "",
  name: "",
  address: "",
  city: "",
  state: "",
  postcode: "",
  phoneNumber: "",
  email: "",
  logo: "",
  description: "",
};

const ShelterSignUp = ({ signUp }) => {
  const [formData, setFormData] = useState(INITIAL_STATE);
  const [isTouched, setIsTouched] = useState(false);
  const [isInvalid, setIsInvalid] = useState(true);
  const [imageFile, setImageFile] = useState(null);
  const history = useHistory();

  const transformFile = file => {
    const reader = new FileReader();
    if (file) {
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        setImageFile(reader.result);
      };
    }
  };

  const onImageChange = e => {
    if (
      e.target.files &&
      e.target.files[0] &&
      e.target.files[0].name.match(/.(jpg|jpeg|png|gif)$/i)
    ) {
      let img = e.target.files[0];
      transformFile(img);
    } else {
      swal({
        text: "Not an image",
        icon: "warning",
      });
    }
  };

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(formData => ({
      ...formData,
      [name]: value,
    }));
    setIsTouched(true);
    e.target.value === "" ? setIsInvalid(true) : setIsInvalid(false);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const {
      username,
      password,
      name,
      city,
      state,
      phoneNumber,
      email,
    } = formData;
    const isAllRequiredFieldFilled = checkAllRequiredField([
      username,
      password,
      name,
      city,
      state,
      phoneNumber,
      email,
    ]);

    formData.logo = imageFile === null ? DEFAULT_PIC : imageFile;

    if (!isInvalid && isAllRequiredFieldFilled) {
      let response = await signUp("Shelter", formData);
      //if there is a response, there is an error
      if (response) {
        swal({ text: response[0], icon: "warning" });
      } else {
        history.push("/shelters");
      }
    } else {
      swal({
        text: "Oops, please fill out all required fields",
        icon: "warning",
      });
      console.log("Oops, please fill out all required fields");
    }
  };

  return (
    <div className="ShelterSignup-container">
      <div className="ShelterSignup-header">Shelter Sign up</div>

      <form onSubmit={handleSubmit} className="ShelterSignup-form">
        <Row>
          <Col md={6}>
            <FormGroup>
              {createInput(
                "username",
                "text",
                formData.username,
                handleChange,
                "Username",
                true,
                "ShelterSignup-label",
                "ShelterSignup-input"
              )}
            </FormGroup>
          </Col>
          <Col md={6}>
            <FormGroup>
              {createInput(
                "password",
                "password",
                formData.password,
                handleChange,
                "Password",
                true,
                "ShelterSignup-label",
                "ShelterSignup-input"
              )}
            </FormGroup>
          </Col>
        </Row>

        <Row>
          <Col md={4}>
            <FormGroup>
              {createInput(
                "name",
                "text",
                formData.name,
                handleChange,
                "Shelter Name",
                true,
                "ShelterSignup-label",
                "ShelterSignup-input"
              )}
            </FormGroup>
          </Col>
          <Col md={4}>
            <FormGroup>
              {createInput(
                "email",
                "email",
                formData.email,
                handleChange,
                "Email",
                true,
                "ShelterSignup-label",
                "ShelterSignup-input"
              )}
            </FormGroup>
          </Col>
          <Col md={4}>
            <FormGroup>
              <label htmlFor="phoneNumber" className="ShelterSignup-label">
                Phone*:
              </label>
              <input
                id="phoneNumber"
                type="tel"
                value={formData.phoneNumber}
                onChange={handleChange}
                required
                name="phoneNumber"
                placeholder="123-456-7890"
                className="ShelterSignup-input"
                pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
              ></input>
            </FormGroup>
          </Col>
        </Row>

        <Row>
          <Col md={3}>
            <FormGroup>
              {createInput(
                "address",
                "text",
                formData.address,
                handleChange,
                "Address",
                false,
                "ShelterSignup-label",
                "ShelterSignup-input"
              )}
            </FormGroup>
          </Col>
          <Col md={3}>
            <FormGroup>
              {createInput(
                "city",
                "text",
                formData.city,
                handleChange,
                "City",
                true,
                "ShelterSignup-label",
                "ShelterSignup-input"
              )}
            </FormGroup>
          </Col>
          <Col md={1}>
            <FormGroup>
              <label htmlFor="state" className="ShelterSignup-label">
                State:
              </label>
              <select
                id="state"
                name="state"
                onChange={handleChange}
                value={formData.state}
                className="ShelterSignup-select"
              >
                {createStateOptions(USSTATES)}
              </select>
            </FormGroup>
          </Col>
          <Col md={2}>
            <FormGroup>
              {createInput(
                "postcode",
                "text",
                formData.postcode,
                handleChange,
                "Post Code",
                false,
                "ShelterSignup-label",
                "ShelterSignup-input"
              )}
            </FormGroup>
          </Col>
        </Row>

        <div className="ShelterSignup-preview-img-container">
          {imageFile && (
            <img
              src={imageFile}
              className="ShelterSignup-preview-img"
              alt={formData.username}
            />
          )}
          <input
            id="logo"
            type="file"
            name="logo"
            onChange={onImageChange}
            className="ShelterSignup-img-button"
            accept="image/"
          />
          <label htmlFor="logo">
            <div className="ShelterSignup-add-picture-button">
              Add shelter's picture
            </div>
          </label>
        </div>

        <label className="ShelterSignup-label" id="bio">
          Shelter's Bio:
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows="5"
          cols="33"
        ></textarea>
        {isInvalid && isTouched && (
          <small className="ShelterSignup-warning">{WARNING}</small>
        )}
        <button className="ShelterSignup-button">Sign up</button>
      </form>

      <div className="ShelterSignup-alreadySignup">
        Already signed up?{" "}
        <Link to={`/shelters/login`} className="ShelterSignup-signupLink">
          Log in
        </Link>
      </div>
    </div>
  );
};

export default ShelterSignUp;
