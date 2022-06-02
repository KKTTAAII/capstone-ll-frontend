import React from "react";
import NotFound from "./NotFound";
import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

const ERROR = "Sorry, we did not find the page you were looking for.";

it("renders the 404 page w/o crashing", function() {
  render(
    <MemoryRouter>
      <NotFound />
    </MemoryRouter>
  );
});

it("matches snapshot", function() {
  const { asFragment } = render(
    <MemoryRouter>
      <NotFound />
    </MemoryRouter>
  );
  expect(asFragment).toMatchSnapshot();
});

it("shows 404 page when user goes to unknown route", function() {
  const { getByText } = render(
    <MemoryRouter>
      <NotFound />
    </MemoryRouter>
  );
  expect(getByText(ERROR)).toBeInTheDocument();
});
