const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');

const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');

// const db = knex({
//     client: 'pg',
//     connection: {
//       host : 'postgresql-opaque-00595',
//       user : 'postgres',
//       password : 'test',
//       database : 'smart-brain'
//     }
//   });
const db = knex({
  client: 'pg',
  connection: {
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
  }
});

const app = express();

app.use(bodyParser.json());
app.use(cors());

app.get('/', (req,res) => {res.send('it is working!')})

app.post('/signin', (req,res)=>{ signin.handleSigin(req,res,db,bcrypt)}); //dependency injection

app.post('/register', register.handleRegister(db, bcrypt)); // advance!!  pass function to function

app.get('/profile/:id', (req,res) => {profile.handleProfileGet(req, res, db)});
  
app.put('/image',(req,res)=>{image.handleImage(req,res,db)});
app.post('/imageurl', (req,res) => image.handleApiCall(req,res));
   
app.listen(process.env.PORT || 3000, ()=>{
    console.log(`app is runnning on port ${process.env.PORT}`);
})


/*
/ --> res = this is working
/ signin --> POST = success/fail  //why POST? becuz we dont want to send pw through a query string , we want to send in the body with https-->secure
/ register --> POST = user
/ profile/:userId --> GET = user
/ image --> PUT --> user

*/