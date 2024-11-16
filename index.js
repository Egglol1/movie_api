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

mongoose.connect('mongodb://localhost:27017/cfBD', { useNewUrlParser: true, useUnifiedTopology: true });

app.use(morgan('common'));
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());
app.use(methodOverride());
app.use(express.static('public'));

let topMovies = [
  {
    title: 'Bullet Train',
    director: 'David Leitch'
  },
  {
    title: 'Lord of the Rings: The Fellowship of the Ring',
    director: 'Peter Jackson'
  },
  {
    title: 'Godzilla VS Kong',
    director: 'Adam Wingard'
  },
  {
    title: 'Godzilla: King of the Monsters',
    director: 'Michael Doughtery'
  },
  {
    title: 'John Wick',
    director: 'David Leitch'
  },
  {
    title: 'Evil Dead II',
    director: 'Sam Raimi'
  },
  {
    title: 'Army of Darkness',
    director: 'Sam Raimi'
  },
  {
    title: 'The Thing',
    director: 'John Carpenter'
  },
  {
    title: 'The Avengers',
    director: 'Joss Whedon'
  },
  {
    title: 'The Lord of the Rings: Return of the King',
    director: 'Peter Jackson'
  }
];

let genresList = [
  {name: 'Action'},
  {name: 'Mystery'},
  {name: 'Thriller'},
  {name: 'Comedy'},
  {name: 'Family'},
  {name: 'Horror'},
  {name: 'Animation'},
  {name: 'Crime'},
  {name: 'Drama'},
  {name: 'Fantasy'},
  {name: 'Historical'},
  {name: 'Romance'},
  {name: 'Sci-Fi'}
]

//GET Requests
app.get('/', (req, res) => {
  res.send('Welcome to my movie club!');
});

app.get('/documentation', (req, res) => {
  res.sendFile('public/documentation.html', {root: __dirname});
});

app.get('/movies', async (req, res) => {
  await Movies.find()
    .then((movies) => {
      res.status(201).json(movies);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

app.get('/movies/:Title', async (req, res) => {
  await Movies.findOne({ Title: req.params.Title })
    .then((movie) => {
      res.json(movie);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

app.get('/genres', (req, res) => {
  //res.json('Successful GET request showing a list of all movie genres');
  res.json(genresList)
});

app.get('/movies/:Title/genres', async (req, res) => {
  await Movies.findOne({ Title: req.params.Title })
    .then((genre) => {
      res.json(genre).Genre;
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

app.get('/directors', (req, res) => {
  //res.json('Successful GET request showing a list of all directors');
  res.json(topMovies);
});

app.get('/movies/:Title/directors', async (req, res) => {
  await Movies.findOne({ Title: req.params.Title })
    .then((director) => {
      res.json(director).Director;
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

// Get all users
app.get('/user', async (req, res) => {
  await Users.find()
    .then((users) => {
      res.status(201).json(users);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

// Get a user by username
app.get('/user/:Username', async (req, res) => {
  await Users.findOne({ Username: req.params.Username })
    .then((user) => {
      res.json(user);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

//Add a user
/* We’ll expect JSON in this format
{
  ID: Integer,
  Username: String,
  Password: String,
  Email: String,
  Birthday: Date
}*/
app.post('/user', async (req, res) => {
  await Users.findOne({ Username: req.body.Username })
    .then((user) => {
      if (user) {
        return res.status(400).send(req.body.Username + 'already exists');
      } else {
        Users
          .create({
            Username: req.body.Username,
            Password: req.body.Password,
            Email: req.body.Email,
            Birthday: req.body.Birthday
          })
          .then((user) =>{res.status(201).json(user) })
        .catch((error) => {
          console.error(error);
          res.status(500).send('Error: ' + error);
        })
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send('Error: ' + error);
    });
});

// Update a user's info, by username
/* We’ll expect JSON in this format
{
  Username: String,
  (required)
  Password: String,
  (required)
  Email: String,
  (required)
  Birthday: Date
}*/
app.put('/user/:Username', async (req, res) => {
  await Users.findOneAndUpdate({ Username: req.params.Username }, { $set:
    {
      Username: req.body.Username,
      Password: req.body.Password,
      Email: req.body.Email,
      Birthday: req.body.Birthday
    }
  },
  { new: true }) // This line makes sure that the updated document is returned
  .then((updatedUser) => {
    res.json(updatedUser);
  })
  .catch((err) => {
    console.error(err);
    res.status(500).send('Error: ' + err);
  })

});

app.get('/user/:Username/movies', async (req, res) => {
  await Users.findOne({ Username: req.params.Username })
    .then((user) => {
      res.json(user).Favorites;
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

// Add a movie to a user's list of favorites
app.post('/user/:Username/movies/:MovieID', async (req, res) => {
  await Users.findOneAndUpdate({ Username: req.params.Username }, {
     $push: { Favorites: req.params.MovieID }
   },
   { new: true }) // This line makes sure that the updated document is returned
  .then((updatedUser) => {
    res.json(updatedUser);
  })
  .catch((err) => {
    console.error(err);
    res.status(500).send('Error: ' + err);
  });
});

// Removes a movie from a user's list of favorites
app.delete('/user/:Username/movies/:MovieID', async (req, res) => {
  await Users.findOneAndUpdate({ Username: req.params.Username }, {
     $pull: { Favorites: req.params.MovieID }
   },
   { new: true }) // This line makes sure that the updated document is returned
  .then((updatedUser) => {
    res.json(updatedUser);
  })
  .catch((err) => {
    console.error(err);
    res.status(500).send('Error: ' + err);
  });
});

// Delete a user by username
app.delete('/user/:Username', async (req, res) => {
  await Users.findOneAndDelete({ Username: req.params.Username })
    .then((user) => {
      if (!user) {
        res.status(400).send(req.params.Username + ' was not found');
      } else {
        res.status(200).send(req.params.Username + ' was deleted.');
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

//listen for requests
app.listen(8080, () => {
  console.log('Your app is listening on port 8080.');
});