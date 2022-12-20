import Link from "next/link"
import DefImage from "./DefImage"
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import { useRef, useCallback } from "react"
import styles from './../styles/Pages.module.scss'

const FilmSlider = ({ title, films, textColor = 'merlot' }) => {
  const swiperRef = useRef(null)

  const handlePrev = useCallback(() => {
    if (!swiperRef.current) return

    swiperRef.current.swiper.slidePrev()
  }, [])

  const handleNext = useCallback(() => {
    if (!swiperRef.current) return

    swiperRef.current.swiper.slideNext()
  }, [])

  return (
    <div className={`${styles['film-slider']} ${styles[textColor]} fade-in delay-100`}>
      <div className="flex justify-between items-center def-x">
        <h2 className='level-subhead lg:level-3 text-left'>{title}</h2>

        <div className="flex items-center">
          <button 
            onClick={handlePrev} 
            className="level-3 mr-8"
          >←</button>
          <button 
            onClick={handleNext} 
            className="level-3"
          >→</button>
        </div>
      </div>

      {films && (
        <Swiper
          ref={swiperRef}
          className={styles['film-swiper']}
          slidesPerView={1.3}
          spaceBetween={10}
          centeredSlides={true}
          loop
          breakpoints={{
            1280: {
              slidesPerView: 4,
              spaceBetween: 20,
            }
          }}
        >
          {films.map((film, index) => (
            <SwiperSlide key={index}>
              <Link 
                href={`/films/${film.slug}`}
                className={`${styles['slide-link']} w-full`} 
              >
                <div
                  className={`${styles.inner} relative mb-4 lg:mb-def`}
                  style={{
                    paddingBottom: '56.25%'
                  }}
                >
                  <div className="absolute top-0 left-0 w-full h-full overflow-hidden border-radius-def">
                    <DefImage
                      src={film.image.url}
                      alt={film.image.alt}
                      className="object-cover w-full h-full"
                      width={film.image.width}
                      height={film.image.height}
                    />
                  </div>

                  <div className={`${styles.plus} absolute top-0 left-0 w-full h-full flex justify-center items-center`}>
                    <span className="text-coral level-2">+</span>
                  </div>
                </div>

                {film.title && (
                  <h3 className='level-subhead'>{film.title}</h3>
                )}
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
      )}
    </div>
  )
}

export default FilmSlider