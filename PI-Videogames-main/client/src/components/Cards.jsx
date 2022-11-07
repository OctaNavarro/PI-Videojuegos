import React from 'react'
import styles from './Cards.module.css'

export default function VgCard({ name, image, genre }) {
  return(
    <div className={styles.container}>
      <img src={image} alt='Videogame' className={styles.img}/>
      <h3 className={styles.title}>{name}</h3>
      <h3>{genre}</h3>
    </div>
  )
}
 