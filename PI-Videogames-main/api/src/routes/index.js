require('dotenv').config()
const { Router } = require('express')
const axios = require('axios')
const { API_KEY } = process.env
const router = Router()
const { Videogame, Genre } = require('../db')

//Ruta GET/ videogames

const getApiInfo = async name => {
  let videojuegos = []
  let url = `https://api.rawg.io/api/games?key=${API_KEY}&page_size=40`

  if (!name) {
    for (let i = 0; i < 3; i++) {
      const apiInfo = await axios.get(url)
      apiInfo.data.results.map(e => {
        videojuegos.push({
          id: e.id,
          name: e.name,
          image: e.background_image,
          genres: e.genres.map(e => e.name),
          rating: e.rating,
        })
      })
      url = apiInfo.data.next
    }
  } else {
    const apiInfo = await axios.get(
      `https://api.rawg.io/api/games?key=${API_KEY}&search=${name}&page_size=15`
    )
    apiInfo.data.results.map(e => {
      videojuegos.push({
        id: e.id,
        slug: e.slug,
        name: e.name,
        image: e.background_image,
        genres: e.genres.map(e => e.name),
        rating: e.rating,
      })
    })
  }
  return videojuegos
}

const getDbInfo = async () => {
  return await Videogame.findAll({
    include: {
      model: Genre,
      attributes: ['name'],
      through: {
        attributes: [],
      },
    },
  })
}

const getAllCharacters = async name => {
  const apiInfo = await getApiInfo(name)
  const dbInfo = await getDbInfo()
  const infoTotal = apiInfo.concat(dbInfo)

  return infoTotal
}

router.get('/videogames', async (req, res) => {
  const name = req.query.name
  let videogamesTotal = await getAllCharacters(name)

  if (name) {
    let videogameName = await videogamesTotal.filter(e =>
      e.slug.toLowerCase().includes(name.toLowerCase())
    )
    videogameName.length
      ? res.status(200).send(videogameName)
      : res.status(404).send('Videogame not found')
  } else {
    res.status(200).send(videogamesTotal)
  }
})

module.exports = router
