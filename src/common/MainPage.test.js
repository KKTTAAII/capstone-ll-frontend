import React from "react";
import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import MainPage from "./MainPage";

it("renders without crashing", () => {
  render(
    <MemoryRouter>
      <MainPage />
    </MemoryRouter>
  );
});

it("matches snapshot", () => {
  const { asFragment } = render(
    <MemoryRouter>
      <MainPage />
    </MemoryRouter>
  );
  expect(asFragment()).toMatchSnapshot();
});

it("shows main page text", () => {
  const { getByText } = render(
    <MemoryRouter>
      <MainPage />
    </MemoryRouter>
  );

  //expect the welcome text in the Document
  expect(getByText("Welcome to Petly!")).toBeInTheDocument();
});