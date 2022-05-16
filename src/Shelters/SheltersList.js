import React, { useState, useContext } from "react";
import UserInfoContext from "../UserInfoContext";
import swal from "sweetalert";
import PetlyApi from "../api";
import { useFetch } from "../hooks";
import { ERROR } from "../helpers";

const INITIAL_SEARCH = {
  name: "",
  city: "",
  state: "",
  postcode: "",
};

const SheltersList = () => {
  const { token } = useContext(UserInfoContext);
  const [searchTerms, setSearchTerms] = useState(INITIAL_SEARCH);
  const [shelters, isLoading, setShelters] = useFetch(
    PetlyApi.getAll("shelters", {}, token)
  );

  if (isLoading) {
    return (
      <div className="loading">
        <div>LOADING ...</div>
      </div>
    );
  }

  const handleChange = e => {
    const { name, value } = e.target;
    setSearchTerms(searchTerms => ({
      ...searchTerms,
      [name]: value,
    }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const response = await PetlyApi.getAll("shelters", searchTerms, token);
      setShelters(response);
      setSearchTerms(INITIAL_SEARCH);
    } catch (err) {
      console.log(e);
      swal(ERROR);
    }
  };

  return (
    <div>
      {shelters.map(shelter => {
        const { name, id } = shelter;
        return <div key={id}>{name}</div>;
      })}
    </div>
  );
};

export default SheltersList;
