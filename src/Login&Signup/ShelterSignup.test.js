import React from "react";
import { render } from "@testing-library/react";
import ShelterSignUp from "./ShelterSignup";
import { MemoryRouter } from "react-router-dom";
import App from "../App";

jest.mock("../App");
App.signUp = jest.fn();

it("renders without crashing", () => {
  render(
    <MemoryRouter>
      <ShelterSignUp signUp={App.signUp} />
    </MemoryRouter>
  );
});

it("matches snapshot", () => {
  const { asFragment } = render(
    <MemoryRouter>
      <ShelterSignUp signUp={App.signUp} />
    </MemoryRouter>
  );
  expect(asFragment()).toMatchSnapshot();
});
