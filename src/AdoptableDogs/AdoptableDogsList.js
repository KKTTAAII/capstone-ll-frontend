import React, { useState, useContext, useEffect } from "react";
import { useHistory } from "react-router-dom";
import UserInfoContext from "../common/UserInfoContext";
import swal from "sweetalert";
import PetlyApi from "../api";
import {
  createInput,
  createBreedOptions,
  ERROR,
  DOGBREEDS,
} from "../common/helpers";
import ReactPaginate from "react-paginate";
import "../css/Pagination.css";
import AdoptableDogCard from "./AdoptableDogCard";
import "../css/AdoptableDogList.css";
import Loading from "../common/Loading";

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
  const { token, favoriteDogs, user, isFavoriteDogsLoading } = useContext(
    UserInfoContext
  );
  const [searchTerms, setSearchTerms] = useState(INITIAL_SEARCH);
  const [dogs, setDogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const history = useHistory();

  useEffect(() => {
    async function getData() {
      try {
        const res = await PetlyApi.getAll("adoptableDogs", {}, token);
        setDogs(res);
        setIsLoading(false);
      } catch (err) {
        swal("Oops, not found");
        history.push("/");
        console.log(err);
      }
    }
    getData();
  }, []);

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
    return <Loading />;
  }

  if (user.userType === "adopters" && isFavoriteDogsLoading) {
    return <Loading />;
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
      const response = await PetlyApi.getAll(
        "adoptableDogs",
        searchTerms,
        token
      );
      setDogs(response);
    } catch (err) {
      console.log(e);
      swal({ text: ERROR, icon: "warning" });
    }
  };

  const clearSearchTerms = async () => {
    setSearchTerms(INITIAL_SEARCH);
  };

  return (
    <div className="AdoptableDogList-container">
      {/* Form for shelter search */}
      <div className="AdoptableDogList-form-container">
        <form onSubmit={handleSubmit} className="AdoptableDogList-form">
          {createInput(
            "name",
            "text",
            searchTerms.name,
            handleChange,
            "Dog Name",
            false,
            "AdoptableDogList-label",
            "AdoptableDogList-input"
          )}

          <label htmlFor="breedId" className="AdoptableDogList-label">
            Breed:
          </label>
          <select
            id="breedId"
            name="breedId"
            onChange={handleChange}
            value={searchTerms.breedId}
            className="AdoptableDogList-select breed"
          >
            <option value=""></option>
            {createBreedOptions(DOGBREEDS)}
          </select>

          <label htmlFor="gender" className="AdoptableDogList-label">
            Gender:
          </label>
          <select
            name="gender"
            id="gender"
            onChange={handleChange}
            value={searchTerms.gender}
            className="AdoptableDogList-select"
          >
            <option value=""></option>
            <option value="Female">Female</option>
            <option value="Male">Male</option>
          </select>

          <label htmlFor="age" className="AdoptableDogList-label">
            Age:
          </label>
          <select
            name="age"
            id="age"
            onChange={handleChange}
            value={searchTerms.age}
            className="AdoptableDogList-select"
          >
            <option value=""></option>
            <option value="Baby">Baby</option>
            <option value="Young">Young</option>
            <option value="Adult">Adult</option>
            <option value="Senior">Senior</option>
          </select>

          <label htmlFor="goodWDogs" className="AdoptableDogList-label">
            Good with other dogs:
          </label>
          <select
            name="goodWDogs"
            id="goodWDogs"
            onChange={handleChange}
            value={searchTerms.goodWDogs}
            className="AdoptableDogList-select"
          >
            <option value=""></option>
            <option value="0">No</option>
            <option value="1">Yes</option>
          </select>

          <label htmlFor="goodWCats" className="AdoptableDogList-label">
            Good with cats:
          </label>
          <select
            name="goodWCats"
            id="goodWCats"
            onChange={handleChange}
            value={searchTerms.goodWCats}
            className="AdoptableDogList-select"
          >
            <option value=""></option>
            <option value="0">No</option>
            <option value="1">Yes</option>
          </select>

          <label htmlFor="goodWKids" className="AdoptableDogList-label">
            Good with children:
          </label>
          <select
            name="goodWKids"
            id="goodWKids"
            onChange={handleChange}
            value={searchTerms.goodWKids}
            className="AdoptableDogList-select"
          >
            <option value=""></option>
            <option value="0">No</option>
            <option value="1">Yes</option>
          </select>

          <button className="AdoptableDogList-button">Search</button>
        </form>
        <button className="AdoptableDogList-clearSearch-button" onClick={clearSearchTerms}>
          Clear search
        </button>
      </div>

      {allDogs.length !== 0 ? (
        <div className="AdoptableDogList-list">{allDogs}</div>
      ) : (
        <div className="AdoptableDogList-no-dogs">No dogs found</div>
      )}

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
