const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static('public'));
app.use(bodyParser.json());

const pins = [];

app.get('/pins', (req, res) => {
    res.json(pins);
});

app.post('/pins', (req, res) => {
    const newPin = req.body;
    pins.push(newPin);
    res.json(newPin);
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});