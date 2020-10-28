import React from "react";
import { Route } from "react-router-dom";
import EventTableComponent from "./components/EventTableComponent";
import SensorGraphComponent from "./components/SensorGraphComponent";

function App() {
  return (
    <div className="App">
      <Route path="/" exact component={EventTableComponent} />
      <Route path="/sensor" component={SensorGraphComponent} />
    </div>
  );
}

export default App;
