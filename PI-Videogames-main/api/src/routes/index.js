require('dotenv').config()
const { Router } = require('express')
const axios = require('axios')
const { Op } = require('sequelize')
const { API_KEY } = process.env
const router = Router()
const { Videogame, Genre } = require('../db')

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

// const getDbInfo = async () => {
//   return await Videogame.findAll({
//     include: {
//       model: Genre,
//       attributes: ['name'],
//       through: {
//         attributes: [],
//       },
//     },
//   })
// }

const getDbInfo = async name => {
  let myVideogames = []

  if (!name) {
    myVideogames = Videogame.findAll({
      include: {
        model: Genre,
        attributes: ['name'],
        through: {
          attributes: [],
        },
      },
    })
    return myVideogames
  } else {
    myVideogames = Videogame.findAll({
      include: {
        model: Genre,
        attributes: ['name'],
        through: {
          attributes: [],
        },
      },
      where: {
        name: { [Op.iLike]: `%${name}%` },
      },
    })
    return myVideogames
  }
}

const getAllGames = async name => {
  const apiInfo = await getApiInfo(name)
  const dbInfo = await getDbInfo()
  console.log(dbInfo)
  const infoTotal = apiInfo.concat(dbInfo)

  return infoTotal
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

// Ruta /genre
router.get('/genre', async (req, res) => {
  const genresApi = await getApiInfo()
  const genres = genresApi.map(e => e.genres)
  console.log(genres)
  const genreEach = []
  genres.map(e => {
    for (let i = 0; i < e.length; i++) genreEach.push(e[i])
  })

  genreEach.forEach(e => {
    Genre.findOrCreate({
      where: { name: e },
    })
  })
  const allGenres = await Genre.findAll()
  res.send(allGenres)
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
    platforms,
    createdInDb,
  })

  let genreDb = await Genre.findAll({
    where: { name: genre },
  })

  videogameCreated.addGenre(genreDb)
  res.send('Videogame created successfully')
})

module.exports = router
