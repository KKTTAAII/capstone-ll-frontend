import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import swal from "sweetalert";
import { createInput, checkAllRequiredField, WARNING } from "../common/helpers";
import DEFAULT_PIC from "../assets/user.png";
import { Row, Col, FormGroup } from "reactstrap";
import "../css/AdopterSignup.css";

const INITIAL_STATE = {
  username: "",
  password: "",
  email: "",
  picture: DEFAULT_PIC,
  description: "",
  privateOutdoors: false,
  numOfDogs: 0,
  preferredGender: "Female",
  preferredAge: "Adult",
};

const AdopterSignUp = ({ signUp }) => {
  const [formData, setFormData] = useState(INITIAL_STATE);
  const [isTouched, setIsTouched] = useState(false);
  const [isInvalid, setIsInvalid] = useState(true);
  const [image, setImage] = useState(null);
  const history = useHistory();

  const handleChange = e => {
    const { name, value } = e.target;
    if (e.target.files && e.target.files[0]) {
      let img = e.target.files[0];
      setImage(URL.createObjectURL(img));
      formData.picture = URL.createObjectURL(img);
    }
    setFormData(formData => ({
      ...formData,
      [name]: value,
    }));
    setIsTouched(true);
    console.log(formData);
    e.target.value === "" ? setIsInvalid(true) : setIsInvalid(false);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setFormData(INITIAL_STATE);
    let { username, password, email } = formData;
    const isAllRequiredFieldFilled = checkAllRequiredField([
      username,
      password,
      email,
    ]);

    if (!isInvalid && isAllRequiredFieldFilled) {
      let response = await signUp("Adopter", formData);
      //if there is a response, there is an error
      if (response) {
        swal({ text: response[0], icon: "warning" });
      } else {
        history.push("/adoptableDogs");
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
    <div className="AdopterSignup-container">
      <div className="AdopterSignup-header">Adopter Sign up</div>
      <form onSubmit={handleSubmit} className="AdopterSignup-form">
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
                "AdopterSignup-label",
                "AdopterSignup-input"
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
                "AdopterSignup-label",
                "AdopterSignup-input"
              )}
            </FormGroup>
          </Col>
        </Row>

        {createInput(
          "email",
          "email",
          formData.email,
          handleChange,
          "Email",
          true,
          "AdopterSignup-label",
          "AdopterSignup-input"
        )}

        <div>
          <img src={image} className="AdopterSignup-preview-img" />
          <h1>Select Image</h1>
          <input type="file" name="picture" onChange={handleChange} />
        </div>
        {/* {createInput(
          "picture",
          "text",
          formData.picture,
          handleChange,
          "Profile Picture URL",
          false,
          "AdopterSignup-label",
          "AdopterSignup-input-long"
        )} */}

        <Row>
          <Col>
            <FormGroup>
              <label htmlFor="privateOutdoors" className="AdopterSignup-label">
                Private Outdoors:
              </label>
              <select
                name="privateOutdoors"
                id="privateOutdoors"
                onChange={handleChange}
                value={formData.privateOutdoors}
                className="AdopterSignup-select"
              >
                <option value="0">No</option>
                <option value="1">Yes</option>
              </select>
            </FormGroup>
          </Col>
          <Col>
            <FormGroup>
              <label htmlFor="numOfDogs" className="AdopterSignup-label">
                Number of dogs:
              </label>
              <input
                onChange={handleChange}
                type="number"
                id="numOfDogs"
                name="numOfDogs"
                min="0"
                max="20"
                value={formData.numOfDogs}
                className="AdopterSignup-select"
              ></input>
            </FormGroup>
          </Col>
          <Col>
            <FormGroup>
              <label htmlFor="preferredGender" className="AdopterSignup-label">
                Preferred Gender:
              </label>
              <select
                name="preferredGender"
                id="preferredGender"
                onChange={handleChange}
                value={formData.preferredGender}
                className="AdopterSignup-select"
              >
                <option value="Female">Female</option>
                <option value="Male">Male</option>
              </select>
            </FormGroup>
          </Col>
          <Col>
            <FormGroup>
              <label htmlFor="preferredAge" className="AdopterSignup-label">
                Preferred Age:
              </label>
              <select
                name="preferredAge"
                id="preferredAge"
                onChange={handleChange}
                value={formData.preferredAge}
                className="AdopterSignup-select"
              >
                <option value="Baby">Baby</option>
                <option value="Young">Young</option>
                <option value="Adult">Adult</option>
                <option value="Senior">Senior</option>
              </select>
            </FormGroup>
          </Col>
        </Row>

        <label htmlFor="description" className="AdopterSignup-label">
          Adopter's Bio:
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows="5"
          cols="45"
        ></textarea>

        {isInvalid && isTouched && <small>{WARNING}</small>}
        <button className="AdopterSignup-button">Sign up</button>
      </form>

      <div className="AdopterSignup-alreadySignup">
        Already signed up?{" "}
        <Link to={`/adopters/login`} className="AdopterSignup-signupLink">
          Log in
        </Link>
      </div>
    </div>
  );
};

export default AdopterSignUp;
