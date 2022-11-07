import React from 'react' 
import styles from './Paginado.module.css'


export default function Paginado({ vgPerPage, allVideogames, paginado}) {
  const pageNumbers = []

  for (let i = 0; i < Math.ceil(allVideogames.length / vgPerPage); i++) {
    pageNumbers.push(i+1)
  }

  

  return (
    <nav>
      <ul >
        { pageNumbers?.map(number => (
           <li key={number} className={styles.pages}>
            <button className={styles.pagesNumbers} onClick = {() => paginado(number)}>{number}</button>
          </li>
        ))}
      </ul>
    </nav>
  )
}
