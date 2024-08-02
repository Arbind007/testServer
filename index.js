const express = require('express');
const app = express();


app.use(express.urlencoded());
app.use(express.json());

var data;
app.post("/", function (req, res) {
  data = req.body;
  console.log(data);
  res.end();
});


app.get("/", function (req, res) {
    res.send("Hi");
    res.send(`Data received:\Data: ${data}`);
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
