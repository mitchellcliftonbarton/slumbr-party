import Image from 'next/image'
import { useState } from 'react'

// Styles
import styles from './../styles/Globals.module.scss'

const DefImage = ({src, layout, objectFit, alt, style}) => {
  const [loaded, setLoaded] = useState(false)

  return (
    <Image
      src={src}
      layout={layout}
      objectFit={objectFit}
      alt={alt}
      style={style}
      className={`${styles['def-image']} ${loaded ? styles.loaded : false}`}
      onLoadingComplete={img => {
        // console.log('image loaded', img)
        setLoaded(true)
      }}
    />
  )
}

export default DefImage