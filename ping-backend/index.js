const axios = require("axios");

setInterval(() => {
  axios
    .get("http://backend:3000/json")
    .then((response) => {
      console.log("RES FROM backend:3000");
      console.log(response.data);
    })
    .catch((error) => {
      console.log("ERROR FROM backend:3000");
      console.error(`Error making the request: ${error.message}`);
    });
}, 5000);

// Keep the program running by using a Promise that never resolves
new Promise(() => {});
