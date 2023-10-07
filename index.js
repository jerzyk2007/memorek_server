const express = require('express');
const app = express();
const PORT = 5000;

app.get('/', (req, res) => {
    res.send({ message: "Działamy" });
});

app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});
