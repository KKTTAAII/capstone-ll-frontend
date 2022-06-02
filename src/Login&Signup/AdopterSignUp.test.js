import React from "react";
import render from "@testing-library/react";
import AdopterSignUp from "./AdopterSignUp.js";
import MemoryRouter from "react-router-dom";

it("renders without crashing", () => {
  render(
    <MemoryRouter>
      <AdopterSignUp />
    </MemoryRouter>
  );
});

it("matches snapshot", () => {
  const { asFragment } = render(
    <MemoryRouter>
      <AdopterSignUp />
    </MemoryRouter>
  );
  expect(asFragment()).toMatchSnapshot();
});
