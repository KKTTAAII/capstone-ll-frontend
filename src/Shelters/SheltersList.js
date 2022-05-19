import React, { useState, useContext } from "react";
import UserInfoContext from "../common/UserInfoContext";
import swal from "sweetalert";
import PetlyApi from "../api";
import { useFetch } from "../common/hooks";
import {
  createInput,
  createStateOptions,
  ERROR,
  USSTATES,
} from "../common/helpers";
import ShelterCard from "./ShelterCard";
import ReactPaginate from "react-paginate";
import "../css/Pagination.css";

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
  const [pageNumber, setPageNumber] = useState(0);
  const sheltersPerPage = 10;
  const pagesVisites = pageNumber * sheltersPerPage;
  const displayShelters = shelters
    .slice(pagesVisites, pagesVisites + sheltersPerPage)
    .map(shelter => {
      return <ShelterCard shelter={shelter} key={shelter.id} />;
    });
  const pageCount = Math.ceil(shelters.length / sheltersPerPage);
  const changePage = ({ selected }) => {
    setPageNumber(selected);
  };

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
      swal({ text: ERROR, icon: "warning" });
    }
  };

  return (
    <div>
      {/* Form for shelter search */}
      <form onSubmit={handleSubmit}>
        {createInput(
          "name",
          "text",
          searchTerms.name,
          handleChange,
          "Shelter Name"
        )}
        {createInput("city", "text", searchTerms.city, handleChange, "City")}

        <label htmlFor="state">State:</label>
        <select
          id="state"
          name="state"
          onChange={handleChange}
          value={searchTerms.state}
        >
          {createStateOptions(USSTATES)}
        </select>

        {createInput(
          "postcode",
          "text",
          searchTerms.postcode,
          handleChange,
          "Zip Code"
        )}
        <button>Seacrh</button>
      </form>

      {displayShelters}

      <ReactPaginate
        previousLabel={"Previous"}
        nextLabel={"Next"}
        pageCount={pageCount}
        onPageChange={changePage}
        containerClassName={"paginationBtns"}
        previousLinkClassName={"previousBtn"}
        nextLinkClassName={"nextBtn"}
        disabledClassName={"paginationDisabled"}
        activeClassName={"paginationActive"}
      />
    </div>
  );
};

export default SheltersList;
