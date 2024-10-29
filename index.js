const express = require('express'),
 morgan = require('morgan'),
 fs = require('fs'),
 path = require('path');

const app = express();
const accessLogStream = fs.createWriteStream(path.join(__dirname, 'log.txt'), {flags: 'a'})

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

app.use(morgan('combined', {stream: accessLogStream}));
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

//GET Requests
app.get('/', (req, res) => {
  res.send('Welcome to my movie club!');
});

app.get('/documentation', (req, res) => {
  res.sendFile('public/documentation.html', {root: __dirname});
});

app.get('/movies', (req, res) => {
  res.json(topMovies);
});

//listen for requests
app.listen(8080, () => {
  console.log('Your app is listening on port 8080.');
});