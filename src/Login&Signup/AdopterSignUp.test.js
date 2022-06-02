import React from "react";
import {render} from "@testing-library/react";
import AdopterSignUp from "./AdopterSignUp.js";
import {MemoryRouter} from "react-router-dom";
import App from "../App";

jest.mock("../App");
App.signUp = jest.fn();

it("renders without crashing", () => {
  render(
    <MemoryRouter>
      <AdopterSignUp signUp={App.signUp} />
    </MemoryRouter>
  );
});

it("matches snapshot", () => {
  const { asFragment } = render(
    <MemoryRouter>
      <AdopterSignUp signUp={App.signUp} />
    </MemoryRouter>
  );
  expect(asFragment()).toMatchSnapshot();
});
