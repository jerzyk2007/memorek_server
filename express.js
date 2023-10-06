const express = require('express');
const app = express();
const PORT = 5000;

app.get('/', (req, res) => {
    res.send({ message: "Działamy" });
});

app.listen(5000, '192.168.1.182', () => {
    console.log(`Server is listening on http://192.168.1.182:5000`);
});
