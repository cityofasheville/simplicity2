import React from "react";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom";
import MapLegend from "./MapLegend";

test("MapLegend does not group details elements with a shared name", () => {
  render(<MapLegend type="maintenance" data={[]} openState={false} />);

  const details = document.querySelector("details");

  expect(details).not.toHaveAttribute("name");
  expect(details).not.toHaveAttribute("open");
});
