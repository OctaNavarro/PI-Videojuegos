async function get120() {
    let pageOne = []
    let pageTwo = []
    let pageThree = []
  
    pageOne = await axios.get(
      `https://api.rawg.io/api/games?key=${API_KEY}&page_size=40`
    )
    let url = pageOne.data.next
    pageOne = [...pageOne.data.results]
  
    pageTwo = await axios.get(url)
    url = pageTwo.data.next
    pageTwo = [...pageTwo.data.results]
  
    pageThree = await axios.get(url)
    url = pageThree.data.next
    pageThree = [...pageThree.data.results]
  
    //console.log([...pageOne, ...pageTwo, ...pageThree])
    return [...pageOne, ...pageTwo, ...pageThree]
  }
  
  async function fetching120() {
    return await get120()
  }
  
  let instanceApi = fetching120()

  //Otra manera de traer info de la API
  const getApiInfo = async () => {
    let videojuegos = []
    let url = `https://api.rawg.io/api/games?key=${API_KEY}&page_size=40`
  
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

  //rutas videojuegos y name juntas
  router.get('/videogames', async (req, res) => {
    const name = req.query.name
    let videogamesTotal = await getAllCharacters()
  
    if (name) {
      let videogameName = await videogamesTotal.filter(e =>
        e.name.toLowerCase().includes(name.toLowerCase())
      )
      videogameName.length
        ? res.status(200).send(videogameName)
        : res.status(404).send('Videogame not found')
    } else {
      res.status(200).send(videogamesTotal)
    }
  })
  

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
      Object.keys(videogamesTotal).length < 9 //REVISAR ACA
        ? res.status(200).json(videogamesTotal)
        : res.status(404).send('Videogame not found 1')
      console.log('VideogamesTotal: ' + videogamesTotal)
    } else {
      let videogameId = await videogamesTotal.filter(e => e.id == id)
      videogameId.length
        ? res.status(200).json(videogameId)
        : res.status(404).send('Videogame not found 2')
      console.log('VideogamesTotal: ' + videogamesTotal)
    }
  })
  
  //Función para pushear géneros a DB
const genreToDb = async () => {
  const genresApi = await getApiInfo()
  const genres = genresApi.map(e => e.genres)
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

if(action.payload === NONE){
  return {
    ...state,
    filteredVideogames : [...state.videogames]
  }
}else{ 
  let filterByGenre = state.videogames.filter((x) => {
    
    // Revisamos el array.
    for(let i = 0; i < x.genres.length; i++) {
      if(x.genres[i].name === action.payload){
        return true;
      }
    }
    
    return false; 
    
  });
  
  return {
    ...state,
    filteredVideogames: [...filterByGenre]
  }
}



export const genreFilter =
        action.payload === 'All'
          ? allVideogames
          : allVideogames.filter(e => {
              for (let i = 0; i < e.genres.length; i++) {
                if (e.genres[i].name === action.payload) {
                  return true
                }
              }
              return false
            })
      return {
        ...state,
        videogames: [...genreFilter]
      }
    default:
      return state
  }

   export const getDbInfo = async () => {
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