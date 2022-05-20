import React, { useState, useContext } from "react";
import { useParams, Redirect } from "react-router-dom";
import UserInfoContext from "../common/UserInfoContext";
import swal from "sweetalert";
import { checkAllRequiredField, createInput, WARNING } from "../common/helpers";
import PetlyApi from "../api";

const INITIAL_VALUE = {
  oldPassword: "",
  newPassword: "",
};

const ShelterResetPassword = () => {
  const { shelterId } = useParams();
  const { user } = useContext(UserInfoContext);
  const [formData, setFormData] = useState(INITIAL_VALUE);
  const [isTouched, setIsTouched] = useState(false);
  const [isInvalid, setIsInvalid] = useState(true);

  //ensure correct shelter adding their dog
  if (+shelterId !== user.id) {
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
        await PetlyApi.authenticate("Shelter", {
          username: user.username,
          password: formData.oldPassword,
        });
        const response = await PetlyApi.resetPassword(
          "shelters",
          {
            password: formData.newPassword,
          },
          shelterId
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
    <div>
      <div>Reset Password</div>
      <form onSubmit={handleSubmit}>
        {createInput(
          "newPassword",
          "password",
          //solution to error A component is changing an uncontrolled input of type text to be controlled.
          formData.newPassword || "",
          handleChange,
          "New Password",
          true
        )}
        <div>Please confirm your password to update the profile</div>
        {createInput(
          "oldPassword",
          "password",
          formData.oldPassword || "",
          handleChange,
          "Old Password",
          true
        )}
        {isInvalid && isTouched && <small>{WARNING}</small>}
        <button>Reset</button>
      </form>
    </div>
  );
};

export default ShelterResetPassword;
