import React, { useState, useEffect } from 'react'
import { Link, useHistory } from 'react-router-dom'
import { postVideogames, getGenres, getPlatforms } from '../actions/index'
import { useDispatch, useSelector } from 'react-redux'

function validate(input){
  let errors = {}

  if(!input.name){
    errors.name = 'Name is required'
  }else if(!input.description){
    errors.description = 'Description is required'
  }
  else if(0 > input.rating || input.rating > 5){
    errors.rating = 'Rating must be a number between 0 and 5'
  }
  // else if(input.genre.length === 0){
  //   errors.genre = 'Genre is required'}
  //else if(input.platforms.length === 0){
  //  errors.platforms = 'Platforms is required'}

  return errors
}

export default function VideogameCreate() {
  const dispatch = useDispatch()
  const history = useHistory()
  const genres = useSelector(state => state.genres)
  const platforms = useSelector(state => state.platforms)

  const [errors, setErrors] = useState({})

  const [input, setInput] = useState({
    name: '',
    description: '',
    genre: [],
    released: '',
    rating: '',
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
    setErrors(validate({
      ...input,
      [e.target.name] : e.target.value
    })) 
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

  function handleSubmit(e){
  
    e.preventDefault()
    dispatch(postVideogames(input))
    alert('Videogame created succesfully!')
    
    setInput({
      name: '',
    description: '',
    genre: [],
    released: '',
    rating: '',
    image: '',
    developer: '',
    platforms: [],
    slug: ''
    })

    history.push('/home')
  }

  function handleDelete(e){
    setInput({
      ...input,
      genre: input.genre.filter(gen => gen !== e),
      platforms: input.platforms.filter(plat=>plat!==e)
    })
  }

  return (
    <div>
      <Link to='/home'>
        <button>Back</button>
      </Link>
      <h1>Create your Videogame!</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name:</label>
          <input
            type='text'
            value={input.name}
            name='name'
            onChange={handleChange}
          />
          {errors.name && (<p className='error'>{errors.name}</p>)}
        </div>
        <div>
          <label>Description:</label>
          <input
            type='text'
            value={input.description}
            name='description'
            onChange={handleChange}
          />
          {errors.description && (<p className='error'>{errors.description}</p>)}
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
            type='text'
            value={input.rating}
            name='rating'
            onChange={handleChange}
          />
          {errors.rating && (<p className='error'>{errors.rating}</p>)}
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
        {errors.genre && (<p className='error'>{errors.genre}</p>)}
        <ul>
          <li>{input.genre.map(e => e + ' ,')}</li>
        </ul>


        <h4>Platforms: </h4>
        <select onChange={e => handleSelectPlatform(e)}>
          {platforms?.map(platforms => (
            <option value={platforms.name}>{platforms.name}</option>
          ))}
        </select>
        {errors.platforms && (<p className='error'>{errors.platforms}</p>)}
        <ul>
          <li>{input.platforms.map(e => e + ' ,')}</li>
        </ul>


        <button type='submit' disabled = {Object.entries(errors).length !== 0}>Create Videogame!</button>
      </form>

      {input.genre.map(e=>
        <div className='divGenre'>
          <p>{e}</p>
          <button className = 'botonX' onClick={() => handleDelete(e)}>X</button>
        </div>
      )}

        {input.platforms.map(e=>
          <div className='divPlatforms'>
            <p>{e}</p>
            <button className = 'botonX' onClick={() => handleDelete(e)}>X</button>
          </div>
        )}
    </div>
  )
}
