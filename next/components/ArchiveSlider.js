import { Swiper, SwiperSlide } from 'swiper/react'
import DefImage from './DefImage'
import styles from './../styles/Pages.module.scss'
import 'swiper/css'
import { useRef, useCallback } from "react"

const ArchiveSlider = ({ item, index }) => {
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
    <div
      className={`${styles['event-slider']} enter-in-1 col-span-12 lg:col-span-7 h-full relative`}
      style={{
        animationDelay: `${(index + 2) * 100}ms`
      }}
    >
      <div className={`${styles['event-slider-buttons']} z-10 absolute top-0 left-0 w-full h-full hidden lg:flex`}>
        <button
          onClick={handlePrev}
          className='w-1/2 h-full flex justify-start items-center pl-def'
        >
          <span className='text-coral level-2'>←</span>
        </button>
        <button
          onClick={handleNext}
          className='w-1/2 h-full flex justify-end items-center pr-def'
        >
          <span className='text-coral level-2'>→</span>
        </button>
      </div>

      <Swiper
        ref={swiperRef}
        className={`${styles['community-slider']} h-full`}
        spaceBetween={10}
        slidesPerView={"auto"}
        loop
        allowTouchMove={true}
      >
        {item.galleryImages.map((image, idx) => (
          <SwiperSlide
            key={idx}
            className={styles['community-slide']}
          >
            <DefImage
              src={image.url}
              alt={image.alt}
              width={image.width}
              height={image.height}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  )
}

export default ArchiveSlider