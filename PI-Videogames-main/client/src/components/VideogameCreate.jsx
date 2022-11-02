import React, { useState, useEffect } from 'react'
import { Link, useHistory } from 'react-router-dom'
import { postVideogame, getGenres, getPlatforms } from '../actions/index'
import { useDispatch, useSelector } from 'react-redux'

export default function VideogameCreate() {
  const dispatch = useDispatch()
  const genres = useSelector(state => state.genres)
  const platforms = useSelector(state => state.platforms)

  const [input, setInput] = useState({
    name: '',
    description: '',
    genre: [],
    released: '',
    rating: 0,
    image: '',
    developer: '',
    platforms: [],
    slug: '',
  })

  useEffect(() => {
    dispatch(getGenres())
    dispatch(getPlatforms())
  }, [])

  function handleChange(e) {
    setInput({
      ...input,
      [e.target.name]: e.target.value,
    })
  }

  function handleSelectGenre(e) {
    setInput({
      ...input,
      genre: [...input.genre, e.target.value],
    })
  }

  function handleSelectPlatform(e) {
    setInput({
      ...input,
      platforms: [...input.platforms, e.target.value],
    })
  }

  return (
    <div>
      <Link to='/home'>
        <button>Back</button>
      </Link>
      <h1>Create your Videogame!</h1>
      <form>
        <div>
          <label>Name:</label>
          <input
            type='text'
            value={input.name}
            name='name'
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Description:</label>
          <input
            type='text'
            value={input.description}
            name='description'
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Released:</label>
          <input
            type='text'
            value={input.released}
            name='released'
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Rating:</label>
          <input
            type='number'
            value={input.rating}
            name='rating'
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Image:</label>
          <input
            type='text'
            value={input.image}
            name='image'
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Developer:</label>
          <input
            type='text'
            value={input.developer}
            name='developer'
            onChange={handleChange}
          />
        </div>

        <h4>Genres: </h4>
        <select onChange={e => handleSelectGenre(e)}>
          {genres?.map(genre => (
            <option value={genre.name}>{genre.name}</option>
          ))}
        </select>
        <ul>
          <li>{input.genre.map(e => e + ' ,')}</li>
        </ul>

        <h4>Platforms: </h4>
        <select onChange={e => handleSelectPlatform(e)}>
          {console.log(platforms)}
          {platforms?.map(platforms => (
            <option value={platforms.name}>{platforms.name}</option>
          ))}
        </select>
        <ul>
          <li>{input.platforms.map(e => e + ' ,')}</li>
        </ul>

        <button type='submit'>Create Videogame!</button>
      </form>
    </div>
  )
}
