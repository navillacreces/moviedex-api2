require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const app = express()

const cors = require('cors')
const helmet = require('helmet')

const MOVIES = require('./movies.json')

const PORT = process.env.PORT || 8000

const morganSetting = process.env.NODE_ENV === 'production' ? 'tiny' : 'common'
app.use(morgan(morganSetting))



app.use(helmet())
app.use(cors())



app.use(function validateBearerToken(req, res, next) {
    
    
    const apiToken = process.env.API_TOKEN
    const authToken = req.get('Authorization')

    if (!authToken || authToken.split(' ')[1] !== apiToken){
      return res.status(401).json({error:"unauthorized request"})
    }

    next()

  })

app.use((error, req, res, next) => {
    
    let response
    if (process.env.NODE_ENV === 'production') {
      response = { error: { message: 'server error' }}
    } else {
      response = { error }
    }
    res.status(500).json(response)
  })
  


app.get('/movie', function handleGetMovie(req,res){

    let movieList = MOVIES
    let x = MOVIES.length
    let results = [];

    if(req.query.genre){
        for (y=0; y < x; y++){
            if (movieList[y].genre === req.query.genre){
                results.push(movieList[y])
            }
        }
    }
    
    if (req.query.avg_vote){

     let r = parseInt(req.query.avg_vote)

        for (y=0; y < x; y++){
            if (movieList[y].avg_vote >= r){
                results.push(movieList[y])
            }
        }
    }

    if (req.query.country){
        let theCountry = req.query.country
        for (y=0; y < x; y++){
            if (movieList[y].country.includes(theCountry)){
                results.push(movieList[y])
            }
        }
    }

    if (!req.query.genre && !req.query.avg_vote && !req.query.country){
      res.json(movieList)
    }
    
    res.json(results)

  })

app.listen(PORT)

