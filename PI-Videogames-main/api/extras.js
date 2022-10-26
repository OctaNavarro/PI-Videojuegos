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
  