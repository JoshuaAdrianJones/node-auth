const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');

const app = express();

// EJS html templates
app.use(expressLayouts);
app.set('view engine', 'ejs');

// Routes - tell the app where things are
app.use('/',require('./routes/index'));
app.use('/users',require('./routes/users'));


const PORT = process.env.PORT || 5000;

app.listen(PORT,console.log(`Server started on port ${PORT} Josh`));