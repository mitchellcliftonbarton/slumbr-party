// Styles
import styles from './../styles/Pages.module.scss'

import Link from "next/link"
import DefImage from './DefImage'
import { useState, useRef } from 'react'

const VideoBlock = ({ film, title, classes, style }) => {
  const [showVideo, setShowVideo] = useState(false)
  const [hideImage, setHideImage] = useState(false)
  const hoverVideo = useRef(null)

  const handleMouseEnter = () => {
    if (film.hoverVideo) {
      setShowVideo(true)
      setHideImage(true)
    }
  }

  const handleMouseLeave = () => {
    if (film.hoverVideo) {
      setHideImage(false)
      setTimeout(() => {
        setShowVideo(false)
      }, 400)
    }
  }

  return (
    <Link 
      href={`/films/${film.slug}`} 
      onMouseEnter={() => handleMouseEnter()}
      onMouseLeave={() => handleMouseLeave()}
      className={`${styles['director-film']} ${hideImage ? styles['show-video'] : null} ${classes}`}
      style={style}
    >
      <div className={`${styles['director-film-image']} relative mb-def-mobile lg:mb-def`}>
        {film.hoverVideo && showVideo && (
          <div className={`${styles['hover-video']} absolute top-0 left-0 w-full h-full`}>
            <video
              ref={hoverVideo}
              src={film.hoverVideo.url}
              className="object-cover w-full h-full"
              autoPlay
              playsInline
              muted
            ></video>
          </div>
        )}

        <div className={`${styles['director-film-image-inner']} absolute top-0 left-0 w-full h-full`}>
          <DefImage
            src={film.featuredImage.url}
            layout="fill"
            objectFit="cover"
            alt={film.featuredImage.alt}
          />
        </div>
      </div>

      {title && (
        <h3 className='level-subhead text-merlot mt-20'>{title}</h3>
      )}
    </Link>
  )
}

export default VideoBlock