import React from "react";
import { fireEvent, render } from "@testing-library/react";
import AdopterLogin from "./AdopterLogin";
import { MemoryRouter } from "react-router-dom";

it("renders without crashing", () => {
  render(
    <MemoryRouter>
      <AdopterLogin />
    </MemoryRouter>
  );
});

it("matches snapshot", () => {
  const { asFragment } = render(
    <MemoryRouter>
      <AdopterLogin />
    </MemoryRouter>
  );
  expect(asFragment()).toMatchSnapshot();
});

it("shows log in button", () => {
  const { getByText } = render(
    <MemoryRouter>
      <AdopterLogin />
    </MemoryRouter>
  );

  //expect the Adopter Log in element in the Document
  expect(getByText("Adopter Log in")).toBeInTheDocument();
  expect(getByText("Log in")).toBeInTheDocument();
});

it("shows error if the form is submitted wihtout required fields", () => {
  const { getByText } = render(
    <MemoryRouter>
      <AdopterLogin />
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


