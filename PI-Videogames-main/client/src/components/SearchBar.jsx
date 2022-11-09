import React from 'react'
import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { getNameVideogames } from '../actions'
import styles from './SearchBar.module.css'

export default function SearchBar() {
  const dispatch = useDispatch()
  const [name, setName] = useState('')

  function handleInputChange(e) {
    e.preventDefault()
    setName(e.target.value.replaceAll(' ','-')) 
  }

  function handleSubmit(e) {
    e.preventDefault()
    dispatch(getNameVideogames(name))
  }

  return (
    <div>
      <input
        type='text'
        placeholder='Search videogames'
        onChange={e => handleInputChange(e)}
        className={styles.inputSearch}
      />
      <button
        type='sumbit'
        onClick={e => {
          handleSubmit(e)
          setName('')
        }}
        className={styles.btnSearch}
      >
        Search
      </button>
    </div>
  )
}
