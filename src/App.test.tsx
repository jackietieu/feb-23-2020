import React from "react";
import { render } from "@testing-library/react";
import App from "./App";

test("renders page header", () => {
  const { getByText } = render(<App />);
  const divElement = getByText(/find pictures of good doggos/i);
  expect(divElement).toBeInTheDocument();
});

test("does not render image container if no breeds are selected when page loads", async () => {
  const { queryByTestId } = render(<App />);
  expect(queryByTestId("doggo-image-container")).toBeNull();
});
