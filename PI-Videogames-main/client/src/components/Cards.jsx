import React from 'react'

export default function VgCard({ name, image, genre }) {
  return(
    <div>
      <h3>{name}</h3>
      <h3>{genre}</h3>
      <img src={image} alt='Videogame'  width='200px' height='250px' />
    </div>
  )
}
