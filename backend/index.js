const express = require("express");
const cors = require("cors");

const app = express();
const port = 3000;

// Enable CORS for all routes
app.use(cors());

// Define a route
app.get("/", (req, res) => {
  res.send("Hello, this is your Express server!");
});

// Define a route that returns a JSON object
app.get("/json", (req, res) => {
  const responseObject = {
    message: "This is a JSON response",
    timestamp: new Date(),
  };

  res.json(responseObject);
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
