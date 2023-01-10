import axios from 'axios'
import dotenv from "dotenv"
dotenv.config()

axios.defaults.baseURL = 'pi-videojuegos-production.up.railway.app' || process.env.URL_BACK || "http://localhost:3001/"

export function getVideogames() {
  return async function (dispatch) {
    let json = await axios.get('/videogames')
    return dispatch({
      type: 'GET_VIDEOGAMES',
      payload: json.data,
    })
  }
}

export function getDetail(id) {
  return async function (dispatch) {
    console.log('detail')
    try {
      let json = await axios.get('/videogame/' + id)
      return dispatch({
        type: 'GET_DETAIL',
        payload: json.data,
      })
    } catch (error) {
      console.log(error)
    }
  }
}

export function getNameVideogames(name) {
  return async function (dispatch) {
    console.log('name')
    try {
      let json = await axios.get(
        '/videogames?name=' + name
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
      let json = await axios.get('/genre')
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
      let json = await axios.get('/platforms')
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
      '/videogames',
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
