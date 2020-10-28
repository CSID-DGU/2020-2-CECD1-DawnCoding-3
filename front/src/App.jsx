import React from "react";
import { Route } from "react-router-dom";
import EventTableComponent from "./components/EventTableComponent";

function App() {
  return (
    <div className="App">
      <Route path="/" exact component={EventTableComponent} />
    </div>
  );
}

export default App;
