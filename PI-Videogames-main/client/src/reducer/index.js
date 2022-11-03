const initialState = {
  videogames: [],
  allVideogames: [],
  genres: []
}

function rootReducer(state = initialState, action) {
  switch (action.type) {
    case 'GET_VIDEOGAMES':
      return {
        ...state,
        videogames: action.payload,
        allVideogames: action.payload,
      }
    case 'GET_GENRES_VIDEOGAMES':
      return{
        ...state,
        genres: action.payload
      }  
    case 'GET_PLATFORMS_VIDEOGAMES':
      return{
        ...state,
        platforms: action.payload
      }  
    case 'POST_VIDEOGAMES':
      return{
        ...state
      }  
    case 'FILTER_BY_GENRE':
      const allVideogames = state.allVideogames
      console.log(allVideogames)
      const genreFilter =
        action.payload === 'All'
          ? allVideogames
          : allVideogames.filter(e => {
              for (let i = 0; i < e.genres.length; i++) {
                if (e.genres[i].name === action.payload) return true
              }
              return false
            })
      return {
        ...state,
        videogames: genreFilter,
      }
    case 'GET_NAME_VIDEOGAMES': 
      return {
        ...state,
        videogames: action.payload
      }
    
    case 'FILTER_CREATED':
      const todosLosJuegos = state.allVideogames
      const createdFilter =
        action.payload === 'Created'
          ? todosLosJuegos.filter(e => e.createdInDb)
          : todosLosJuegos.filter(e => !e.createdInDb)
      //console.log( todosLosJuegos)
      //console.log( createdFilter)
      //console.log(action.payload)
      return {
        ...state,
        videogames: action.payload === 'All' ? todosLosJuegos : createdFilter,
      }
    case 'ORDER_BY_NAME':
      let sortedName =
        action.payload === 'asc'
          ? state.videogames.sort(function (a, b) {
              if (a.name > b.name) {
                return 1
              }
              if (b.name > a.name) {
                return -1
              }
              return 0
            })
          : state.videogames.sort(function (a, b) {
              if (a.name > b.name) {
                return -1
              }
              if (b.name > a.name) {
                return 1
              }
              return 0
            })
      return {
        ...state,
        videogames: sortedName,
      }
    case 'ORDER_BY_RATING':
      let sortedRate =
        action.payload === 'worst'
          ? state.videogames.sort(function (a, b) {
              if (a.rating > b.rating) {
                return 1
              }
              if (b.rating > a.rating) {
                 return -1
              }
              return 0
            })
          : state.videogames.sort(function (a, b) {
              if (a.rating > b.rating) {
                return -1
              }
              if (b.rating > a.rating) {
                return 1
              }
              return 0
            })
      console.log(sortedRate)
      return {
        ...state,
        videogames: sortedRate,
      }

    default:
      return state
  }
}
export default rootReducer
