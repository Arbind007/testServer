const express = require('express');
const app = express();


app.use(express.urlencoded());
app.use(express.json());


app.post("/", function (req, res) {
  console.log(req.body);
  res.end();
});


app.get("/", function (req, res) {
    res.send("Hi");
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
