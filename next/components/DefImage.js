import Image from 'next/image'
import { useState } from 'react'

// Styles
import styles from './../styles/Globals.module.scss'

const DefImage = ({src, alt, style, width, height, className, priority}) => {
  const [loaded, setLoaded] = useState(false)

  return (
    <Image
      src={src}
      alt={alt}
      style={style}
      className={`${styles['def-image']} ${loaded ? styles.loaded : false} ${className}`}
      onLoadingComplete={() => {
        setLoaded(true)
      }}
      width={width}
      height={height}
      priority={priority}
    />
  )
}

export default DefImage