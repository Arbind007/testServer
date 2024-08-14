const express = require('express');
const mongoose = require('mongoose');
require("dotenv").config();
const app = express();


app.use(express.urlencoded({ extended: true }));
app.use(express.json());

console.log(process.env.MONGODB_CONNECTION_STRING)

mongoose.connect(process.env.MONGODB_CONNECTION_STRING)
.then(() => console.log('Connected to MongoDB'))
.catch((err) => console.error('Could not connect to MongoDB...', err));

const dataSchema = new mongoose.Schema({
    content: String,
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Data = mongoose.model('Data', dataSchema);

app.post("/", async (req, res) => {
    try {
        const data = new Data({ content: req.body });
        await data.save();
        console.log('Data saved:', data);
        res.status(201).send('Data saved');
    } catch (error) {
        console.error('Error saving data:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.get("/", async (req, res) => {
  try {
      const allData = await Data.find();
      res.send(`
          <h1>Data received from Okta Workflow Endpoint</h1>
          <table border="1" cellpadding="10" cellspacing="0">
              <thead>
                  <tr>
                      <th>ID</th>
                      <th>Content</th>
                      <th>Created At</th>
                  </tr>
              </thead>
              <tbody>
                  ${allData.map(item => `
                      <tr>
                          <td>${item._id}</td>
                          <td>${item.content}</td>
                          <td>${item.createdAt.toLocaleString()}</td>
                      </tr>`).join('')}
              </tbody>
          </table>
      `);
  } catch (error) {
      console.error('Error retrieving data:', error);
      res.status(500).send('Internal Server Error');
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
