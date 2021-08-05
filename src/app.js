require('dotenv').config()
const path = require('path')
const express = require('express')
const hbs = require('hbs')

const getGeocode = require('./utils/getGeocode')
const getForecast = require('./utils/getForecast')

const app = express()
const port = process.env.PORT || 3000

// DEFINE PATHS FOR EXPRESS CONFIG
const publicDirectory = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')

// SETUP HANDLEBARS ENGINE AND VIEWS LOCATION
app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)

// SETUP STATIC DIRECTORY TO SERVE
app.use(express.static(publicDirectory))


app.get('', (req, res) => {
    res.render('index', {
        title: 'Weather',
        name: 'Erich Kopp'
    })
})

app.get('/about', (req, res) => {
    res.render('about', {
        title: 'About',
        name: 'Erich Kopp'
    })
})

app.get('/weather', (req, res) => {
    if (!req.query.address) {
        return res.send({
            error: 'You must provide an address.'
        })
    }

    const searchLocation = req.query.address

    getGeocode(searchLocation, (error, geocodeData) => {
        if (error) {
            return res.send({ error })
        }
    
        getForecast(geocodeData.latitude, geocodeData.longitude, (error, forecastData) => {
            if (error) {
                return res.send({ error })
            }

            res.send({
                location: geocodeData.location,
                forecast: forecastData.description,
                temp: forecastData.temperature,
                precip: forecastData.precip,
                address: req.query.address
            })
        })
    })
})

app.get('/help', (req, res) => {
    res.render('help', {
        helpMessage: 'This is a help message.',
        title: 'Help',
        name: 'Erich Kopp'
    })
})

app.get('/help/*', (req, res) => {
    res.render('404', {
        errorMessage: 'Help article not found.',
        title: '404',
        name: 'Erich Kopp'
    })
})

app.get('*', (req, res) => {
    res.render('404', {
        errorMessage: 'Page not found.',
        title: '404',
        name: 'Erich Kopp'
    })
})

app.listen(port, () => {
    console.log(`Server up on PORT ${port}`)
})
