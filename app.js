require('dotenv').config();
const express = require('express');
const config = require('config');
const cookieParser = require("cookie-parser");
const errorMiddleware = require('./middleware/error.middleware');

const app = express();
app.use(express.static(path.join(__dirname, "/client")));
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '/client/build', 'index.html'));
});
app.use(express.json({ extended: true }));
app.use(cookieParser());
//add cors

app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/user', require('./routes/user.routes'));
app.use('/api/teach', require('./routes/teach.routes'));
app.use('/api/admin', require('./routes/admin.routes'));
app.use(errorMiddleware);
const PORT = process.env.PORT || 5000;

async function start() {
    try{
        app.listen(5000, () => console.log(`App has been started on port ${PORT}...`));
    } catch (e) {
        console.log('Server Error', e.message);
        process.exit(1);
    }
}

start();
