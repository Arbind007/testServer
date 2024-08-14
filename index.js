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
        console.log(req.data);
        const data = new Data({ content: req.body });
        await data.save();
        console.log('Data saved:', data);
        res.status(201).send('Data saved');
    } catch (error) {
        console.error('Error saving data:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.delete("/delete/:id", async (req, res) => {
  try {
      await Data.findByIdAndDelete(req.params.id);
      console.log(`Data with ID ${req.params.id} deleted`);
      res.status(200).send('Data deleted');
  } catch (error) {
      console.error('Error deleting data:', error);
      res.status(500).send('Internal Server Error');
  }
});

app.delete("/deleteAll", async (req, res) => {
  try {
      await Data.deleteMany({});
      console.log('All data deleted');
      res.status(200).send('All data deleted');
  } catch (error) {
      console.error('Error deleting all data:', error);
      res.status(500).send('Internal Server Error');
  }
});

app.get("/", async (req, res) => {
  try {
      const allData = await Data.find();
      res.send(`
          <h1>All Data</h1>
          <table border="1" cellpadding="10" cellspacing="0">
              <thead>
                  <tr>
                      <th>ID</th>
                      <th>Content</th>
                      <th>Created At</th>
                      <th>Actions</th>
                  </tr>
              </thead>
              <tbody>
                  ${allData.map(item => `
                      <tr>
                          <td>${item._id}</td>
                          <td>${item.content}</td>
                          <td>${item.createdAt.toLocaleString()}</td>
                          <td>
                              <form action="/delete/${item._id}" method="POST" onsubmit="return confirm('Are you sure you want to delete this data?');">
                                  <button type="submit">Delete</button>
                              </form>
                          </td>
                      </tr>`).join('')}
              </tbody>
          </table>
          <form action="/deleteAll" method="POST" onsubmit="return confirm('Are you sure you want to delete all data?');">
              <button type="submit" style="margin-top: 20px; background-color: red; color: white;">Delete All Data</button>
          </form>
      `);
  } catch (error) {
      console.error('Error retrieving data:', error);
      res.status(500).send('Internal Server Error');
  }
});

app.use((req, res, next) => {
  if (req.method === 'POST' && req.url.startsWith('/delete')) {
      req.method = 'DELETE';
  }
  next();
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
