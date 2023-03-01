require('dotenv').config()
const { Router } = require('express')
const axios = require('axios')
const { Op } = require('sequelize')
const { API_KEY } = process.env
const router = Router()
const { Videogame, Genre, Platforms } = require('../db')

// Funciones para traer info de API y DB
//Hi there
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
          genres: e.genres.map(e => {
            return { name: e.name }
          }),
          platforms: e.platforms.map(e => {
            return { name: e.platform.name }
          }),
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
        rating: e.rating,
        genres: e.genres.map(e => {
          return { name: e.name }
        }),
        platforms: e.platforms.map(e => {
          return { name: e.platform.name }
        }),
      })
    })
  }
  return videojuegos
}

const getDbInfo = async () => {
  return await Videogame.findAll({
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
}

//Función para juntar los juegos de DB y de API
const getAllGames = async name => {
  const apiInfo = await getApiInfo(name)
  const dbInfo = await getDbInfo()
  const infoTotal = apiInfo.concat(dbInfo)

  return infoTotal
}

//Función para pushear plataformas a DB
const platsToDb = async () => {
  const platsApi = await getApiInfo()
  const plats = platsApi.map(e => e.platforms)
  const platEach = []

  plats.map(e => {
    for (let i = 0; i < e.length; i++) platEach.push(e[i].name)
  })

  platEach.forEach(e => {
    Platforms.findOrCreate({
      where: { name: e },
    })
  })
}

//Función para pushear géneros a DB
const genreToDb = async () => {
  const genresApi = await axios.get(
    `https://api.rawg.io/api/genres?key=${API_KEY}`
  )
  const genres = genresApi.data.results.map(e => e.name)
  const genreEach = []

  genres.map(e => {
    genreEach.push(e)
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
  try {
    const allGenres = await Genre.findAll()
    res.send(allGenres)
  } catch (error) {
    console.log(error)
  }
})

//Ruta GET/ platforms
router.get('/platforms', async (req, res) => {
  const allPlatforms = await Platforms.findAll()
  res.send(allPlatforms)
})

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
      released: apiId.data.released,
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
  try {
    const videogamesTotal = await getAllId(id)
    if (id.length < 8) {
      //console.log('VideogamesTotal: ' + videogamesTotal)
      res.status(200).json(videogamesTotal)
    } else {
      let videogameId = await videogamesTotal.filter(e => e.id == id)
      videogameId.length
        ? res.status(200).json(videogameId[0])
        : res.status(404).send('Videogame not found')
    }
  } catch (error) {
    res.status(404).send(error.message)
  }
})


//Ruta post de generos
router.post('/createGenre', async(req, res)=>{
  let{
    name
  } =req.body

  let genreCreated = await Genre.create({
    name
  })
  res.send('Genre created successfully')
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
