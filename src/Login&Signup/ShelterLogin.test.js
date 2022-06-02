import React from "react";
import { fireEvent, render } from "@testing-library/react";
import ShelterLogin from "./ShelterLogin";
import { MemoryRouter } from "react-router-dom";

it("renders without crashing", () => {
  render(
    <MemoryRouter>
      <ShelterLogin />
    </MemoryRouter>
  );
});

it("matches snapshot", () => {
  const { asFragment } = render(
    <MemoryRouter>
      <ShelterLogin />
    </MemoryRouter>
  );
  expect(asFragment()).toMatchSnapshot();
});

it("shows log in button", () => {
  const { getByText } = render(
    <MemoryRouter>
      <ShelterLogin />
    </MemoryRouter>
  );

  //expect the Adopter Log in element in the Document
  expect(getByText("Shelter Log in")).toBeInTheDocument();
  expect(getByText("Log in")).toBeInTheDocument();
});

it("shows error if the form is submitted wihtout required fields", () => {
  const { getByText } = render(
    <MemoryRouter>
      <ShelterLogin />
    </MemoryRouter>
  );

  //click the log in button without filling out the form
  const logInButton = getByText("Log in");
  fireEvent.click(logInButton);

  //an error will pop up with a reminder
  expect(
    getByText("Oops, please fill out all required fields")
  ).toBeInTheDocument();
});
