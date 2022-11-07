import React, { useState, useEffect } from 'react'
import { Link, useHistory } from 'react-router-dom'
import { postVideogames, getGenres, getPlatforms } from '../actions/index'
import { useDispatch, useSelector } from 'react-redux'
import styles from './VideogameCreate.module.css'
import bgImg from '../Imagenes/jonathan-borba-ipmc5-Z-uwQ-unsplashLQ.jpg'

function validate(input) {
  let errors = {}
  errors.button = false

  if (!input.name || input.name === '') {
    errors.name = 'Name is required'
    errors.button = true
  } else if (!input.description || input.description === '') {
    errors.description = 'Description is required'
    errors.button = true
  } else if (
    0 > input.rating ||
    input.rating > 5 ||
    typeof Number(input.rating) !== 'number'
  ) {
    errors.rating = 'Rating must be a number between 0 and 5'
    errors.button = true
  } 
  // else if (input.genre.length === 0) {
  //   errors.genre = 'Genre is required'
  //   errors.button = true
  // }
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
    setErrors(
      validate({
        ...input,
        [e.target.name]: e.target.value,
      })
    )
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

  function handleSubmit(e) {
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
      slug: '',
    })

    history.push('/home')
  }

  function handleDelete(e) {
    setInput({
      ...input,
      genre: input.genre.filter(gen => gen !== e),
      platforms: input.platforms.filter(plat => plat !== e),
    })
  }

  return (
    <div className={styles.bg}>
      <div className={styles.nav}>
        <Link to='/home'>
          <button className={styles.botonBack}>
            <img src={bgImg} className={styles.bgImg} alt='bg' />
          </button>
        </Link>
      </div>
      <h1 className={styles.title}>Create your own Videogame!</h1>
      <div className={styles.container}>
        <form onSubmit={handleSubmit}>
          <div>
            <label>Name:</label>
            <input
              type='text'
              value={input.name}
              name='name'
              onChange={handleChange}
            />
            {errors.name && <p className={styles.error}>{errors.name}</p>}
          </div>
          <div>
            <label>Description:</label>
            <input
              type='text'
              value={input.description}
              name='description'
              onChange={handleChange}
            />
            {errors.description && (
              <p className={styles.error}>{errors.description}</p>
            )}
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
            {errors.rating && <p className={styles.error}>{errors.rating}</p>}
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
          {errors.genre && <p className={styles.error}>{errors.genre}</p>}
          <ul>
            <li>{input.genre.map(e => e + ' ,')}</li>
          </ul>

          <h4>Platforms: </h4>
          <select onChange={e => handleSelectPlatform(e)}>
            {platforms?.map(platforms => (
              <option value={platforms.name}>{platforms.name}</option>
            ))}
          </select>
          {errors.platforms && (
            <p className={styles.error}>{errors.platforms}</p>
          )}
          <ul>
            <li>{input.platforms.map(e => e + ' ,')}</li>
          </ul>

          <button
            type='submit'
            className={styles.submitBtn}
            disabled={errors.button !== false}
          >
            Create Videogame!
          </button>
        </form>

      </div>
      <div className={styles.listaCont}>
      <p className={styles.lista}>Genres selected:</p>
        {input.genre.map(e => (
          <div>
            <p>{e}</p>
            <button className={styles.botonX} onClick={() => handleDelete(e)}>
              X
            </button>
          </div>
        ))}
        <p className='stlyles.lista'>Platforms selected:</p>
        {input.platforms.map(e => (
          <div >
            <p>{e}</p>
            <button className={styles.botonX} onClick={() => handleDelete(e)}>
              X
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
