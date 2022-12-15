// Styles
import styles from './../styles/Pages.module.scss'

import Link from "next/link"
import DefImage from './DefImage'
import { useState, useRef } from 'react'

const VideoBlock = ({ film, title, classes, style, href, showTitleOnHover = false }) => {
  const [showVideo, setShowVideo] = useState(false)
  const [hideImage, setHideImage] = useState(false)
  const hoverVideo = useRef(null)
  let showVideoTimeout = null

  const handleMouseEnter = () => {
    console.log('entered')
    // clearTimeout(showVideoTimeout)

    if (film.hoverVideo) {
      if (!showVideo) {
        setShowVideo(true)
        setHideImage(true)
      } else {
        console.log('already true')
        clearTimeout(showVideoTimeout)
        setShowVideo(true)
        setHideImage(true)
      }
    }
  }

  const handleMouseLeave = () => {
    if (film.hoverVideo) {
      setHideImage(false)
      // setShowVideo(false)
      showVideoTimeout = setTimeout(() => {
        setShowVideo(false)
      }, 400)
    }
  }

  return (
    <Link 
      href={href} 
      onMouseEnter={() => handleMouseEnter()}
      onMouseLeave={() => handleMouseLeave()}
      className={`${styles['director-film']} ${hideImage ? styles['show-video'] : null} ${classes} relative`}
      style={style}
    >
      <div className={`${styles['director-film-image']} relative mb-4 lg:mb-def`}>
        <div className='overflow-hidden absolute top-0 left-0 w-full h-full'>
          {film.hoverVideo && showVideo && (
            <div className={`${styles['hover-video']} absolute top-0 left-0 w-full h-full`}>
              <video
                ref={hoverVideo}
                src={film.hoverVideo.url}
                className="object-cover w-full h-full"
                autoPlay
                playsInline
                muted
                loop
              ></video>
            </div>
          )}

          <div className={`${styles['director-film-image-inner']} absolute top-0 left-0 w-full h-full`}>
            <DefImage
              src={film.featuredImage.url}
              alt={film.featuredImage.alt}
              className="object-cover w-full h-full"
              width={film.featuredImage.width}
              height={film.featuredImage.height}
            />
          </div>

          <div className={`${styles.plus} flex absolute top-0 left-0 w-full h-full justify-center items-center`}>
            <span className='text-coral font-secondary hidden lg:inline-block'>+</span>

            {showTitleOnHover && (
              <span className='text-white level-3 absolute bottom-4 lg:bottom-def left-4 lg:left-def'>{film.title}</span>
            )}
          </div>
        </div>
      </div>

      {title && (
        <h3 className='level-subhead text-merlot'>{title}</h3>
      )}
    </Link>
  )
}

export default VideoBlock