import React from 'react'

export default function Paginado({ vgPerPage, allVideogames, paginado}) {
  const pageNumbers = []

  for (let i = 0; i < Math.ceil(allVideogames.length / vgPerPage); i++) {
    pageNumbers.push(i+1)
  }

  

  return (
    <nav>
      <ul className='paginado'>
        { pageNumbers?.map(number => (
           <li className='number' key={number}>
            <button onClick = {() => paginado(number)}>{number}</button>
          </li>
        ))}
      </ul>
    </nav>
  )
}
