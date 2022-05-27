import React, { useState, useContext } from "react";
import { useParams, Redirect } from "react-router-dom";
import UserInfoContext from "../common/UserInfoContext";
import swal from "sweetalert";
import { checkAllRequiredField, createInput, WARNING } from "../common/helpers";
import PetlyApi from "../api";
import "../css/AdopterResetPassword.css";

const INITIAL_VALUE = {
  oldPassword: "",
  newPassword: "",
};

const AdopterResetPassword = () => {
  const { username } = useParams();
  const { user } = useContext(UserInfoContext);
  const [formData, setFormData] = useState(INITIAL_VALUE);
  const [isTouched, setIsTouched] = useState(false);
  const [isInvalid, setIsInvalid] = useState(true);

  //ensure correct shelter adding their dog
  if (username !== user.username) {
    swal({ text: "Unautorized user", icon: "warning" });
    return <Redirect to="/" />;
  }

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
    const isAllRequiredFieldFilled = checkAllRequiredField([formData.password]);
    if (!isInvalid && isAllRequiredFieldFilled) {
      try {
        //authenticate user before updating profile
        await PetlyApi.authenticate("Adopter", {
          username: user.username,
          password: formData.oldPassword,
        });
        const response = await PetlyApi.resetPassword(
          "adopters",
          {
            password: formData.newPassword,
          },
          username
        );
        if (response.updatePassword)
          swal({ text: response.updatePassword, icon: "success" });
      } catch (err) {
        swal({ text: err[0], icon: "warning" });
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
    <div className="AdopterResetPassword-container">
      <div className="AdopterResetPassword-header">Reset Password</div>
      <form onSubmit={handleSubmit} className="AdopterResetPassword-form">
        {createInput(
          "newPassword",
          "password",
          //solution to error A component is changing an uncontrolled input of type text to be controlled.
          formData.newPassword || "",
          handleChange,
          "New Password",
          true,
          "AdopterResetPassword-label",
          "AdopterResetPassword-input"
        )}
        <div className="AdopterResetPassword-reminder">Please confirm your password to update the profile</div>
        {createInput(
          "oldPassword",
          "password",
          formData.oldPassword || "",
          handleChange,
          "Old Password",
          true,
          "AdopterResetPassword-label",
          "AdopterResetPassword-input"
        )}
        {isInvalid && isTouched && <small className="AdopterResetPassword-warning">{WARNING}</small>}
        <button className="AdopterResetPassword-button">Reset</button>
      </form>
    </div>
  );
};

export default AdopterResetPassword;
