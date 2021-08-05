const request = require('request')

const getForecast = (latitude, longitude, callback) => {
    const url = 'http://api.weatherstack.com/current?access_key=' + process.env.WEATHERSTACK_ACCESSKEY + '&query=' + latitude + ',' + longitude + '&units=f'

    request({ url, json: true }, (error, response) => {
        if (error) {
            callback('Unable to connect to Weatherstack API.', undefined)
        } else if (response.body.error) {
            callback('Unable to find location.', undefined)
        } else {
            const current = response.body.current
            callback(undefined, {
                location: response.body.location.name,
                description: current.weather_descriptions[0],
                temperature: current.temperature,
                feelslike: current.feelslike,
                precip: current.precip,
                humidity: current.humidity
            })
        }
    })
}

module.exports = getForecast