import React from 'react'
import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { getNameVideogames } from '../actions'

export default function SearchBar() {
  const dispatch = useDispatch()
  const [name, setName] = useState('')

  function handleInputChange(e) {
    e.preventDefault()
    setName(e.target.value)
  }

  function handleSubmit(e) {
    e.preventDefault()
    dispatch(getNameVideogames(name))
  }

  return (
    <div>
      <input
        type='text'
        placeholder='Buscar...'
        onChange={e => handleInputChange(e)}
      />
      <button type='sumbit' onClick={e => {
        handleSubmit(e)
        setName('')
        }}>
        Search videogames
      </button>
    </div>
  )
}
