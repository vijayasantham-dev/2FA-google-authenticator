const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.send("Hi");
});

app.listen(8080, () => console.log("PORT 8080 is running!"));
