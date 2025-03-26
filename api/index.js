require('dotenv').config()

const express = require('express')
const app = express()
const cors = require('cors')
const startgg = require('../server_modules/startgg')
const challonge = require('../server_modules/challonge')
const port = process.env.PORT || 3015

app.use(cors())
app.use(express.json())

app.get("/", (req, res) => res.send("Express on Vercel"));

app.options('*', cors())
app.post('/obf', async (req, res) => {
  console.log(req.body.bracket.search('start.gg') != -1)
  let obf
  if (req.body.bracket.search('start.gg') != -1){
    try {
      obf = await startgg.startGGBracket(req.body.bracket.trim())
    }
    catch(e) {
      obf = {
        error : "ERROR WITH BRACKET"
      }
    }
  } else if (req.body.bracket.search('challonge.com') != -1) {
    try {
      obf = await challonge.getTournamentInfo(req.body.bracket.trim())
    }
    catch(e) {
      obf = {
        error : "ERROR WITH BRACKET"
      }
    }
  } else {
    obf = {
      error : "UNSUPPORTED SITE"
    }
  }
  res.json(obf)
})

app.listen(port, () => {console.log("LISTENING ON PORT:", port)})

module.exports = app
