const express = require('express'),
 morgan = require('morgan'),
 fs = require('fs'),
 bodyParser = require('body-parser'),
 methodOverride = require('method-override'),
 path = require('path');

const app = express();

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

//GET Requests
app.get('/', (req, res) => {
  res.send('Welcome to my movie club!');
});

app.get('/documentation', (req, res) => {
  res.sendFile('public/documentation.html', {root: __dirname});
});

app.get('/movies', (req, res) => {
  res.json('Successful GET request showing a list of all movies');
});

app.get('/movies/:title', (req, res) => {
  res.json('Successful GET request showing information about a movie by title');
});

app.get('/movies/genres/:name', (req, res) => {
  res.json('Successful GET request showing a list of all movies within a genre');
});

app.get('/movies/directors/:name', (req, res) => {
  res.json('Successful GET request showing information about a director by name');
});

app.post('/user/register', (req, res) => {
  res.json('Successful POST request showing that a user has registered');
});

app.put('/user/info', (req, res) => {
  res.json('Successful PUT request showing a user has updated their info');
});

app.put('/user/favorites/add', (req, res) => {
  res.json('Successful PUT request showing a movie has been added to favorites');
});

app.put('/user/favorites/remove', (req, res) => {
  res.json('Successful PUT request showing a movie has been removed from favorites');
});

app.delete('/user/deregister', (req, res) => {
  res.json('Successful DELETE request showing a user has been deregistered');
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

//listen for requests
app.listen(8080, () => {
  console.log('Your app is listening on port 8080.');
});