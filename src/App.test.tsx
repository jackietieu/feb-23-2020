import React from "react";
import { render } from "@testing-library/react";
import App from "./App";

test("renders page header", () => {
  const { getByText } = render(<App />);
  const divElement = getByText(/find pictures of good doggos/i);
  expect(divElement).toBeInTheDocument();
});

test("does not render image container if no breeds are selected when app first loads", () => {
  const { getByTestId, queryByTestId } = render(<App />);
  const input = getByTestId("breed-select");
  const inputValue = (input as HTMLInputElement).value;
  expect(inputValue.length).toBe(0);
  expect(queryByTestId("doggo-image-container")).toBeNull();
});
