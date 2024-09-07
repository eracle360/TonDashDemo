const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URI
    }),
    cookie: { maxAge: 180 * 60 * 1000 } // 3 hours
}));

// Static files
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // Serve uploads directory

// Set views and view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => console.error('Could not connect to MongoDB:', error));

// Routes
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const appsRouter = require('./routes/apps');
const adminRouter = require('./routes/admin');
const jettonsRouter = require('./routes/jettons');
const promoteappRouter = require('./routes/promoteapp'); // Correct the path to promoteapp.js

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/apps', appsRouter);
app.use('/admin', adminRouter);
app.use('/jettons', jettonsRouter);
app.use('/promoteapp', promoteappRouter); // Use promoteappsRouter correctly

// Error handling
app.use((req, res, next) => {
  res.status(404).render('404', { title: 'Page Not Found' });
});

app.use((err, req, res, next) => {
  console.error('Error stack:', err.stack);
  res.status(500).send('Something broke!');
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
