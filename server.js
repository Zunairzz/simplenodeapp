const express = require('express');
const app = express();
const port = process.env.PORT || 2403;

app.get('/', (req, res) => {
    res.json({ message: 'Welcome to my Node.js app!' });
});

app.get('/health', (req, res) => {
    res.json({ status: 'healthy' });
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});