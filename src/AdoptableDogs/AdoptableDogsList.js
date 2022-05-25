import React, { useState, useContext } from "react";
import UserInfoContext from "../common/UserInfoContext";
import swal from "sweetalert";
import PetlyApi from "../api";
import { useFetch } from "../common/hooks";
import {
  createInput,
  createBreedOptions,
  ERROR,
  DOGBREEDS,
} from "../common/helpers";
import ReactPaginate from "react-paginate";
import "../css/Pagination.css";
import AdoptableDogCard from "./AdoptableDogCard";

const INITIAL_SEARCH = {
  name: "",
  breedId: "",
  gender: "",
  age: "",
  goodWKids: "",
  goodWDogs: "",
  goodWCats: "",
};

const AdoptableDogsList = () => {
  const { token, favoriteDogs, user } = useContext(UserInfoContext);
  const [searchTerms, setSearchTerms] = useState(INITIAL_SEARCH);
  const [dogs, isLoading, setDogs] = useFetch(
    PetlyApi.getAll("adoptableDogs", {}, token)
  );

  const [pageNumber, setPageNumber] = useState(0);
  const dogsPerPage = 10;
  const pagesVisites = pageNumber * dogsPerPage;
  const pageCount = Math.ceil(dogs.length / dogsPerPage);
  const changePage = ({ selected }) => {
    setPageNumber(selected);
  };
  const favoriteDogsIds = favoriteDogs ? favoriteDogs.map(dog => dog.id) : [];
  const allDogs = dogs
    .slice(pagesVisites, pagesVisites + dogsPerPage)
    .map(dog => {
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

  if (isLoading) {
    return (
      <div className="loading">
        <div>LOADING ...</div>
      </div>
    );
  }

  if (user.userType === "adopters" && !favoriteDogs) {
    {
      return (
        <div className="loading">
          <div>LOADING ...</div>
        </div>
      );
    }
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
    setSearchTerms(INITIAL_SEARCH);
    console.log(INITIAL_SEARCH);
    try {
      const response = await PetlyApi.getAll(
        "adoptableDogs",
        searchTerms,
        token
      );
      setDogs(response);
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
          "Dog Name"
        )}

        <label htmlFor="breedId">Breed:</label>
        <select
          id="breedId"
          name="breedId"
          onChange={handleChange}
          value={searchTerms.breedId}
        >
          {createBreedOptions(DOGBREEDS)}
        </select>

        <label htmlFor="gender">Gender:</label>
        <select
          name="gender"
          id="gender"
          onChange={handleChange}
          value={searchTerms.gender}
        >
          <option value="Female">Female</option>
          <option value="Male">Male</option>
        </select>

        <label htmlFor="age">Age:</label>
        <select
          name="age"
          id="age"
          onChange={handleChange}
          value={searchTerms.age}
        >
          <option value="Baby">Baby</option>
          <option value="Young">Young</option>
          <option value="Adult">Adult</option>
          <option value="Senior">Senior</option>
        </select>

        <label htmlFor="goodWDogs">Good with other dogs:</label>
        <select
          name="goodWDogs"
          id="goodWDogs"
          onChange={handleChange}
          value={searchTerms.goodWDogs}
        >
          <option value="0">No</option>
          <option value="1">Yes</option>
        </select>

        <label htmlFor="goodWCats">Good with cats:</label>
        <select
          name="goodWCats"
          id="goodWCats"
          onChange={handleChange}
          value={searchTerms.goodWCats}
        >
          <option value="0">No</option>
          <option value="1">Yes</option>
        </select>

        <label htmlFor="goodWKids">Good with children:</label>
        <select
          name="goodWKids"
          id="goodWKids"
          onChange={handleChange}
          value={searchTerms.goodWKids}
        >
          <option value="0">No</option>
          <option value="1">Yes</option>
        </select>

        <button>Seacrh</button>
      </form>

      {allDogs}

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

export default AdoptableDogsList;
