const express = require('express')
const axios = require('axios')
const cheerio = require('cheerio')

const app = express()
const port = 8000

const url = 'https://klarcheats.statuspage.io/'

app.get('/v1/status', (req, res) => {
    axios.get(url)
     .then(response => {
        const $ = cheerio.load(response.data)
        const componentElements = $('.component-inner-container');
        const gameStatus = [];

        componentElements.each((index, element) => {
            let gameName = $(element).find('.name').text().trim()
            let status = $(element).find('.component-status').text().trim()

            if (gameName === "Rainbow Six Siege Lite" || gameName === "Rainbow Six Siege Full" || gameName === "Lite") {
                if (gameName === "Lite") {
                    gameName = "Lite Spoofer";
                }

                switch (status) {
                    case 'Under Maintenance':
                        status = 'Updating';
                        break;
                    case 'Operational':
                        status = 'Undetected';
                        break;
                    case 'Major Outage':
                        status = "Detected";
                        break;
                    default:
                        break;
                }

                gameStatus.push({ gameName, status })
            }
        })

        res.json(gameStatus);
     })

     .catch(error => {
        res.status(500).json({ error: 'Internal Server Error' })
     })
})

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
})