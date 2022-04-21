import React from "react";
import logo from "./logo.svg";
import "./App.css";
const axios = require('axios');

function App() {
  const [data, setData] = React.useState(null);
  const [data2, setData2] = React.useState(null);

  React.useEffect(() => {
    fetch("/api")
      .then((res) => res.json())
      .then((data) => setData(data.message));
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p><a href="https://www.youtube.com/watch?v=dQw4w9WgXcQ" target="_blank">Learn more</a></p>
        <img src={!data ? "" : data} alt="meme" width="250" />
        <p>{!data2 ? "" : data2}</p>
      </header>
    </div>
  );
}

export default App;