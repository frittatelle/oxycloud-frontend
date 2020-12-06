
import React from "react";
import { render, unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";

import FileRow from "./FileRow.js"

let container = null;
beforeEach(() => {
  // setup a DOM element as a render target
  container = document.createElement("tbody");
  document.body.appendChild(container);
});

afterEach(() => {
  // cleanup on exiting
  unmountComponentAtNode(container);
  container.remove();
  container = null;
});

it("check text", () => {
  act(() => {
    render(
      <FileRow
        Key="FAKE"
        Name="file.txt"
        Size={1024}
        Owner={{ DisplayName: "Giovanni Mucciaccia" }}
      />, container)
    expect(container.querySelector("[title='file name']").textContent).toBe("file.txt")
    expect(container.querySelector("[title='file owner']").textContent).toBe("Giovanni Mucciaccia")
    expect(container.querySelector("[title='file size']").textContent).toBe("1 kB")
  });
})

it("check size formatting", () => {
  act(() => {
    render(
      <FileRow
        Key="FAKE"
        Name="file.txt"
        Size={1024 ** 2}
        Owner={{ DisplayName: "Giovanni Mucciaccia" }}
      />, container)
    expect(container.querySelector("[title='file size']").textContent).toBe("1 MB")
  });

  act(() => {
    render(
      <FileRow
        Key="FAKE"
        Name="file.txt"
        Size={1024 ** 3}
        Owner={{ DisplayName: "Giovanni Mucciaccia" }}
      />, container)
    expect(container.querySelector("[title='file size']").textContent).toBe("1 GB")
  });

  act(() => {
    render(
      <FileRow
        Key="FAKE"
        Name="file.txt"
        Size={1024 ** 4}
        Owner={{ DisplayName: "Giovanni Mucciaccia" }}
      />, container)
    expect(container.querySelector("[title='file size']").textContent).toBe("1 TB")
  });
})