const express = require('express'),
  morgan = require('morgan'),
  fs = require('fs'),
  bodyParser = require('body-parser'),
  methodOverride = require('method-override'),
  path = require('path');
const app = express();

const mongoose = require('mongoose');
const Models = require('./models.js');
const Movies = Models.Movie;
const Users = Models.User;
const Directors = Models.Director;
const Genres = Models.Genre;
//mongoose.connect('mongodb://localhost:27017/cfBD', { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.connect(process.env.CONNECTION_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const cors = require('cors');
const bcrypt = require('bcrypt');
const { check, validationResult } = require('express-validator');

app.use(morgan('common'));
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(bodyParser.json());
app.use(methodOverride());
app.use(express.static('public'));

let allowedOrigins = [
  'http://localhost:8080',
  'http://testsite.com',
  'http://localhost:1234',
  'https://egglol1-myflix-85b3e5.netlify.app',
  'http://localhost:4200',
];

app.use(
  cors({
    origin: (origin, callback) => {
      console.log('Origin:', origin); // Add this line to debug which origin is being checked
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        return callback(new Error('Not allowed by CORS'), false);
      }
    },
  })
);

let auth = require('./auth')(app);
const passport = require('passport');
require('./passport');

let topMovies = [
  {
    title: 'Bullet Train',
    director: 'David Leitch',
  },
  {
    title: 'Lord of the Rings: The Fellowship of the Ring',
    director: 'Peter Jackson',
  },
  {
    title: 'Godzilla VS Kong',
    director: 'Adam Wingard',
  },
  {
    title: 'Godzilla: King of the Monsters',
    director: 'Michael Doughtery',
  },
  {
    title: 'John Wick',
    director: 'David Leitch',
  },
  {
    title: 'Evil Dead II',
    director: 'Sam Raimi',
  },
  {
    title: 'Army of Darkness',
    director: 'Sam Raimi',
  },
  {
    title: 'The Thing',
    director: 'John Carpenter',
  },
  {
    title: 'The Avengers',
    director: 'Joss Whedon',
  },
  {
    title: 'The Lord of the Rings: Return of the King',
    director: 'Peter Jackson',
  },
];

let genresList = [
  { name: 'Action' },
  { name: 'Mystery' },
  { name: 'Thriller' },
  { name: 'Comedy' },
  { name: 'Family' },
  { name: 'Horror' },
  { name: 'Animation' },
  { name: 'Crime' },
  { name: 'Drama' },
  { name: 'Fantasy' },
  { name: 'Historical' },
  { name: 'Romance' },
  { name: 'Sci-Fi' },
];

/**
 * The welcome page
 * @returns a welcome page
 */
app.get('/', (req, res) => {
  res.send('Welcome to my movie club!');
});

/**
 * This endpoint gives a list of all movies
 * @returns a JSON of the movies list within the database
 */
app.get(
  '/movies',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    await Movies.find()
      .then((movies) => {
        res.status(201).json(movies);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
      });
  }
);

/**
 * This endpoint finds a movie by title
 * @param Title - the title of a movie to get specific data for
 * @returns data pertaining to the movie in the URL
 */
app.get(
  '/movies/:Title',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    await Movies.findOne({ Title: req.params.Title })
      .then((movie) => {
        res.json(movie);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
      });
  }
);

/**
 * This endpoint gives a list of all genres
 * @returns a JSON of every genre in the database
 */
app.get(
  '/genres',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    //res.json('Successful GET request showing a list of all movie genres');
    res.json(genresList);
  }
);

/**
 * This endpoint finds a genre by name
 * @param Name - the name of a specific genre to get data for
 * @returns information about the selected genre
 */
app.get(
  '/genres/:Name',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    await Genres.findOne({ Name: req.params.Name })
      .then((genre) => {
        res.json(genre);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
      });
  }
);

/**
 * This endpoint finds the genre of one movie by title
 * @param Title - the title of the movie to find the genre for
 * @returns the genres that a movie qualify for
 */
app.get(
  '/movies/:Title/genres',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    await Movies.findOne({ Title: req.params.Title })
      .then((genre) => {
        res.json(genre).Genre;
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
      });
  }
);

/**
 * This endpoint gives a list of all directors
 * @returns a JSON list of all directors in the database
 */
app.get(
  '/directors',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    //res.json('Successful GET request showing a list of all directors');
    res.json(topMovies);
  }
);

/**
 * This endpoint finds a director by name
 * @param Name - the name of a specific director
 * @returns the data about the selected director
 */
app.get(
  '.directors/:Name',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    await Directors.findOne({ Name: req.params.Name })
      .then((director) => {
        res.json(director);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
      });
  }
);

/**
 * This endpoint returns the director of a movie by name
 * @param Title - the title of the movie to get the director for
 * @returns information about the director of a movie
 */
app.get(
  '/movies/:Title/directors',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    await Movies.findOne({ Title: req.params.Title })
      .then((director) => {
        res.json(director).Director;
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
      });
  }
);

/**
 * This endpoint gets all users
 * @returns a JSON list of all user information, hashed passwords!
 */
app.get(
  '/user',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    await Users.find()
      .then((users) => {
        res.status(201).json(users);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
      });
  }
);

/**
 * This endpoint gets a user by username
 * @param Username - the username of the user we're looking for
 * @returns a JSON of the user's information, username, email, birthday
 */
app.get(
  '/user/:Username',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    await Users.findOne({ Username: req.params.Username })
      .then((user) => {
        res.json(user);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
      });
  }
);

/**
 * This endpoint adds a user
 * @param {string} userData -  We’ll expect JSON in this format
  {
    ID: Integer,
    Username: String,
    Password: String,
    Email: String,
    Birthday: Date
  }
 */
app.post(
  '/user',
  [
    check('Username', 'Username must be longer than five characters.').isLength(
      { min: 5 }
    ),
    check(
      'Username',
      'Username contains non alphanumeric characters - not allowed.'
    ).isAlphanumeric(),
    check('Password', 'Password is required').not().isEmpty(),
    check('Email', 'Email does not appear to be valid').isEmail(),
  ],
  async (req, res) => {
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    let hashedPassword = Users.hashPassword(req.body.Password);
    await Users.findOne({ Username: req.body.Username })
      .then((user) => {
        if (user) {
          return res.status(400).send(req.body.Username + ' already exists');
        } else {
          Users.create({
            Username: req.body.Username,
            Password: hashedPassword,
            Email: req.body.Email,
            Birthday: req.body.Birthday,
          })
            .then((user) => {
              res.status(201).json(user);
            })
            .catch((error) => {
              console.error(error);
              res.status(500).send('Error: ' + error);
            });
        }
      })
      .catch((error) => {
        console.error(error);
        res.status(500).send('Error: ' + error);
      });
  }
);

/**
 * This endpoint updates a user's data
 * @param {string} updatedData - We’ll expect JSON in this format
  {
    Username: String,
    Password: String,
    Email: String,
    Birthday: Date
  }
 */
app.put(
  '/user',
  [
    check('Username', 'Username must be at least five characters.').isLength({
      min: 5,
    }),
    check(
      'Username',
      'Username contains non alphanumeric characters - not allowed.'
    ).isAlphanumeric(),
    check('Password', 'Password is required').not().isEmpty(),
    check('Email', 'Email does not appear to be valid').isEmail(),
  ],
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    await Users.findOneAndUpdate(
      { Username: req.user.Username },
      {
        $set: {
          Username: req.body.Username,
          Password: req.body.Password,
          Email: req.body.Email,
          Birthday: req.body.Birthday,
        },
      },
      { new: true }
    ) // This line makes sure that the updated document is returned
      .then((updatedUser) => {
        res.json(updatedUser);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
      });
  }
);

/**
 * This endpoint gets a user's favorite movies
 * @param Username - the username of the user to get
 * @returns a JSON of the user's favorite movies
 */
app.get(
  '/user/:Username/movies',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    await Users.findOne({ Username: req.params.Username })
      .then((user) => {
        res.json(user).Favorites;
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
      });
  }
);

/**
 * This endpoint adds a movie to a user's list of movies
 * @param Username - The username of the user adding the movie
 * @param MovieID - The ID of the movie to be added
 */
app.post(
  '/user/:Username/movies/:MovieID',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    await Users.findOneAndUpdate(
      { Username: req.user.Username },
      {
        $push: { Favorites: req.params.MovieID },
      },
      { new: true }
    ) // This line makes sure that the updated document is returned
      .then((updatedUser) => {
        res.json(updatedUser);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
      });
  }
);

/**
 * This endpoint removes a movie from a user's favorites
 * @param Username - the username of the user removing the movie
 * @param MovieID - the id of the movie to be removed
 */
app.delete(
  '/user/:Username/movies/:MovieID',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    await Users.findOneAndUpdate(
      { Username: req.user.Username },
      {
        $pull: { Favorites: req.params.MovieID },
      },
      { new: true }
    ) // This line makes sure that the updated document is returned
      .then((updatedUser) => {
        res.json(updatedUser);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
      });
  }
);

/**
 * This endpoint removes a user
 */
app.delete(
  '/user',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    await Users.findOneAndDelete({ Username: req.user.Username })
      .then((user) => {
        if (!user) {
          res.status(400).send(req.user.Username + ' was not found');
        } else {
          res.status(200).send(req.user.Username + ' was deleted.');
        }
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
      });
  }
);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

//listen for requests
const port = process.env.PORT || 8080;
app.listen(port, '0.0.0.0', () => {
  console.log('Listening on Port ' + port);
});
