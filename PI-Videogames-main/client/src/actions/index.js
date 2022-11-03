import axios from 'axios'

export function getVideogames() {
  return async function (dispatch) {
    var json = await axios.get('http://localhost:3001/videogames')
    return dispatch({
      type: 'GET_VIDEOGAMES',
      payload: json.data, 
    })
  }
}

export function getNameVideogames(name) {
  return async function (dispatch) {
    try {
      let json = await axios.get(
        'http://localhost:3001/videogames?name=' + name
      )
      return dispatch({
        type: 'GET_NAME_VIDEOGAMES',
        payload: json.data,
      })
    } catch (error) {
      console.log(error)
    }
  }
}

export function getGenres() {
  return async function (dispatch) {
    try {
      let json = await axios.get('http://localhost:3001/genre')
      return dispatch({
        type: 'GET_GENRES_VIDEOGAMES',
        payload: json.data,
      })
    } catch (error) {
      console.log(error)
    }
  }
}

export function getPlatforms() {
  return async function (dispatch) {
    try {
      let json = await axios.get('http://localhost:3001/platforms')
      return dispatch({
        type: 'GET_PLATFORMS_VIDEOGAMES',
        payload: json.data,
      })
    } catch (error) {
      console.log(error)
    }
  }
}

export function postVideogames(payload) {
  return async function (dispatch) {
    const response = await axios.post(
      'http://localhost:3001/videogames',
      payload
    )
    return response
  }
}

export function filterVideogamesByGenre(payload) {
  //console.log(payload)
  return {
    type: 'FILTER_BY_GENRE',
    payload,
  }
}

export function filterCrated(payload) {
  return {
    type: 'FILTER_CREATED',
    payload,
  }
}

export function orderByName(payload) {
  return {
    type: 'ORDER_BY_NAME',
    payload,
  }
}

export function orderByRating(payload) {
  return {
    type: 'ORDER_BY_RATING',
    payload,
  }
}
