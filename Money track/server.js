const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 3000;

mongoose.connect('mongodb://localhost:27017/money-tracker', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const Expense = mongoose.model('Expense', {
  expense: String,
  amount: Number
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.post('/expenses', async (req, res) => {
  try {
    const { expense, amount } = req.body;
    const newExpense = new Expense({ expense, amount });
    await newExpense.save();
    res.redirect('/');
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.get('/expenses', async (req, res) => {
  try {
    const expenses = await Expense.find();
    res.json(expenses);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
