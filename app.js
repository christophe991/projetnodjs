const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const { urlencoded } = require('body-parser');

//Enlever les chevrons inferieur et superieur autour du mot de passe
mongoose.connect('mongodb+srv://chris:erim12team@expressmovies.6s06n.mongodb.net/expressmovies?retryWrites=true&w=majority')
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error: cannot connect to my db'));
db.once('open', ()=>{
    console.log('connected to the db:)')
})

const movieSchema = mongoose.Schema({
    movietitle: String,
    movieyear: Number
})

const Movie = mongoose.model('Movie', movieSchema)


app.use('/public', express.static('public'));
//app.use(bodyParser.urlencoded({extended: false}));

var urlencodedParser =(bodyParser.urlencoded({extended: false}));

app.set('views', './views')
app.set('view engine', 'ejs')

app.get('/movie', (req, res) =>{
    const title = 'Films sortie les trente derniére années';
    sortieMovie =[]
    Movie.find((err, movies) => {
        if(err){
            console.log('could not retrieve from db')
            res.sendStatus(500)
        }
        else{
            listMovies = movies
        }
        res.render('movies', {movies: sortieMovie, title: title})
    })
    
})
app.get('/login', (req, res) =>{
    
    res.render('login', {title: 'Connexion utilisateur'})
})
const fakeUser = {email: 'chris@gmail.com', password: '123'}
const secret = 'qsdjS12ozehdoIJ123DJOZJLDSCqsdeffdg123ER56SDFZedhWXojqshduzaohduihqsDAqsdq';

app.post('/login', urlencodedParser, (req, res) =>{
    console.log('login post', req.body)
    if(!req.body){
        res.sendStatus(500)
    }
    else{
        if(fakeUser.email === req.body.email && fakeUser.password === req.body.password){
            const myToken = jwt.sign({iss: 'http://expressmovies.fr', user: 'sam', role: 'moderator'}, secret);
            res.json(myToken)
        }
        else{
            res.sendStatus(401);
        }

    }
    
})

app.post('/movie', urlencodedParser, (req, res) =>{
    if(!req.body){
        return res.sendStatus(500)
    }
    else{
        const formData = req.body
        console.log('formData', formData)
        const title = req.body.movietitle
        const year = req.body.movieyear
        const myMovie = new Movie({movietitle: title, movieyear: year})
        myMovie.save((err, savedMovie) => {
            if(err){
                console.log(err)
            }
            else{
                console.log(savedMovie)
                res.sendStatus(201)
            }
        })
    }
})

app.get('/', (req,res) =>{
    res.render('index', {title: 'Bienvenue sur le site du cinéphile'})
    
    
})
app.listen(3000, function(){
    console.log('listen on port 3000')
})