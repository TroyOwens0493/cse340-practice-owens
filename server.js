import express from 'express';

const app = express();

const name = process.env.NAME;
const otherName = process.env.OTHERNAME;

app.get('/', (req, res) => {
    res.send(`Hello, ${name}!`);
});

app.get('/new-route', (req, res) => {
    res.send(`Hello, ${otherName}`);
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://127.0.0.1:${PORT}`);
});
