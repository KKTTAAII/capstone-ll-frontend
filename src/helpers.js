import React from "react";

const WARNING = "Please fill out the required fields";

function createInput(name, type, value, handleChange, label, required=false) {
  return (
    <>
      <label>
        {label}
        {required ? "*" : ""}:
      </label>
      <input
        name={name}
        id={name}
        type={type}
        value={value}
        onChange={handleChange}
      ></input>
    </>
  );
}

function checkAllRequiredField(fields) {
  let result = fields.every(field => field !== "");
  return result;
}


export { createInput, checkAllRequiredField, WARNING };
