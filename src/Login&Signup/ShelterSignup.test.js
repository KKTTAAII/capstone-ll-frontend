import React from "react";
import { render } from "@testing-library/react";
import ShelterSignup from "./ShelterSignup";
import { MemoryRouter } from "react-router-dom";


it("renders without crashing", () => {
  render(
    <MemoryRouter>
      <ShelterSignup />
    </MemoryRouter>
  );
});

it("matches snapshot", () => {
  const { asFragment } = render(
    <MemoryRouter>
      <ShelterSignup />
    </MemoryRouter>
  );
  expect(asFragment()).toMatchSnapshot();
});
