import React from "react";
import ReactDOM from "react-dom";
import ImageViewerComponent from "./components/ImageViewerComponent";
const renderDOM = () => {
  ReactDOM.render(<ImageViewerComponent />, document.getElementById("root"));
};
window.addEventListener("DOMContentLoaded", renderDOM);
