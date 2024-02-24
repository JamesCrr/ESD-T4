import axios from "axios";
import { useEffect, useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";

function App() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    axios
      .get("http://localhost:3000/json")
      .then((response) => {
        console.log("RES FROM localhost:3000");
        console.log(response.data);
      })
      .catch((err) => {
        console.log("ERROR FROM localhost:3000");
        console.error(err);
      });
    axios
      .get("http://backend:3000/json")
      .then((response) => {
        console.log("RES FROM backend:3000");
        console.log(response.data);
      })
      .catch((err) => {
        console.log("ERROR FROM backend:3000");
        console.error(err);
      });
  }, []);

  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>count is {count}</button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">Click on the Vite and React logos to learn more</p>
    </>
  );
}

export default App;
