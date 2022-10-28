require('dotenv').config()
const { Router } = require('express')
const axios = require('axios')
const { Op } = require('sequelize')
const { API_KEY } = process.env
const router = Router()
const { Videogame, Genre, Platforms } = require('../db')

// Funciones para traer info de API y DB
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
        platforms: e.platforms.map(e => e.platform.name),
      })
    })
  }
  return videojuegos
}

const getDbInfo = async () => {
  let myVideogames = []

  myVideogames = Videogame.findAll({
    include: [
      {
        model: Genre,
        attributes: ['name'],
        through: {
          attributes: [],
        },
      },
      {
        model: Platforms,
        attributes: ['name'],
        through: {
          attributes: [],
        },
      },
    ],
  })
  return myVideogames
}

const getAllGames = async name => {
  const apiInfo = await getApiInfo(name)
  const dbInfo = await getDbInfo()
  //console.log(dbInfo)
  const infoTotal = apiInfo.concat(dbInfo)

  return infoTotal
}

//Función para pushear plataformas a DB
const platsToDb = async () => {
  const platsApi = await getApiInfo()
  const plats = platsApi.map(e => e.platforms)
  //console.log('Plataformas: ' + platsApi)
  const platEach = []
  plats.map(e => {
    for (let i = 0; i < e.length; i++) platEach.push(e[i])
  })

  platEach.forEach(e => {
    Platforms.findOrCreate({
      where: { name: e },
    })
  })
}

//Función para pushear géneros a DB
const genreToDb = async () => {
  const genresApi = await getApiInfo()
  const genres = genresApi.map(e => e.genres)
  //console.log('Géneros: ' + genresApi)
  const genreEach = []
  genres.map(e => {
    for (let i = 0; i < e.length; i++) genreEach.push(e[i])
  })

  genreEach.forEach(e => {
    Genre.findOrCreate({
      where: { name: e },
    })
  })
}

//Ruta GET/ videogames + ?name=...
router.get('/videogames', async (req, res) => {
  const name = req.query.name
  let videogamesTotal = await getAllGames(name)

  if (name) {
    let videogameName = await videogamesTotal
      .filter(e => e.slug.toLowerCase().includes(name.toLowerCase()))
      .slice(0, 15)
    videogameName.length
      ? res.status(200).send(videogameName)
      : res.status(404).send('Videogame not found')
  } else {
    res.status(200).send(videogamesTotal)
  }
})

//Ruta GET/ genre
router.get('/genre', async (req, res) => {
  //Por ahora voy a poner las fucniones que cargan la DB acá
  genreToDb()
  platsToDb()

  const allGenres = await Genre.findAll()
  res.send(allGenres)
})
//
//Ruta GET/ videogame/{idVideogame}
router.get('/videogame/:id', async (req, res) => {
  const id = req.params.id

  const getApiId = async name => {
    const apiId = await axios.get(
      `https://api.rawg.io/api/games/${name}?key=${API_KEY}`
    )

    let returnObj = {
      id: apiId.data.id,
      slug: apiId.data.slug,
      name: apiId.data.name,
      image: apiId.data.background_image,
      genres: apiId.data.genres.map(e => e.name),
      rating: apiId.data.rating,
      platforms: apiId.data.platforms.map(e => e.platform.name),
      description: apiId.data.description,
    }
    return returnObj
  }

  const getAllId = async id => {
    let infoTotal = {}
    if (id.length > 8) {
      infoTotal = await getDbInfo()
    } else {
      infoTotal = await getApiId(id)
    }
    return infoTotal
  }

  const videogamesTotal = await getAllId(id)
  if (id.length < 8) {
    //console.log('VideogamesTotal: ' + videogamesTotal)
    Object.keys(videogamesTotal).length !== 1 //REVISAR ACA
      ? res.status(200).json(videogamesTotal)
      : res.status(404).send('Videogame not found 1')
  } else {
    console.log('VideogamesTotal: ' + videogamesTotal)
    let videogameId = await videogamesTotal.filter(e => e.id == id)
    videogameId.length
      ? res.status(200).json(videogameId)
      : res.status(404).send('Videogame not found 2')
  }
})

//Ruta POST/ videogames
router.post('/videogames', async (req, res) => {
  let {
    name,
    slug,
    description,
    genre,
    released,
    rating,
    image,
    platforms,
    createdInDb,
  } = req.body

  let videogameCreated = await Videogame.create({
    name,
    slug,
    description,
    released,
    rating,
    image,
    createdInDb,
  })

  let genreDb = await Genre.findAll({
    where: { name: genre },
  })
  videogameCreated.addGenre(genreDb)

  let platformsDb = await Platforms.findAll({
    where: { name: platforms },
  })
  videogameCreated.addPlatforms(platformsDb)

  res.send('Videogame created successfully')
})

module.exports = router
