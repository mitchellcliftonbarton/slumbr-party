import Head from 'next/head'
import { useAppUpdate } from '../context'
import { gsap } from 'gsap/dist/gsap'
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger'
gsap.registerPlugin(ScrollTrigger)

// Components
import DefaultLayout from '../components/layouts/DefaultLayout'
import Link from 'next/link'

// React
import { useState, useRef, useEffect } from 'react'
import Cookies from 'js-cookie'

// Styles
import styles from './../styles/Pages.module.scss'

// Components
// import LoadOverlay from '../components/LoadOverlay'
import VideoBlock from '../components/VideoBlock'
import { Play, XIcon } from '../components/icons/Icons'

export default function Home({ data }) {
  const [videoLoaded, setVideoLoaded] = useState(false)
  const [showPlay, setShowPlay] = useState(false)
  const [popupOpen, setPopupOpen] = useState(false)
  const comp = useRef(null)
  const video = useRef(null)
  const directorsSection = useRef(null)
  const update = useAppUpdate()

  useEffect(() => {
    const trigger = ScrollTrigger.create({
      trigger: directorsSection.current,
      start: 'top top',
      end: 'top top',
      onEnter: () => {
        update.setNavClass('transparent-merlot')
      },
      onLeaveBack: () => {
        update.setNavClass('transparent-parchment')
      },
    })

    return () => trigger.kill()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    video.current.currentTime = 0
    const playPromise = video.current.play()

    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          // console.log('autoplay worked')
        })
        .catch((error) => {
          if (error.name === 'NotAllowedError' && video.current) {
            // console.log('autoplay not allowed')
            video.current.pause()

            setShowPlay(true)
          } else if (video.current) {
            // console.log('autoplay not working for another reason')
            video.current.pause()

            setShowPlay(true)
          }
        })
    }
  }, [video])

  // on load, show the popup if there is no cookie
  useEffect(() => {
    if (!Cookies.get('slumbr-party-popup')) {
      setPopupOpen(true)
    }
  }, [])

  const handlePlay = () => {
    if (video) {
      video.current.play()
      setShowPlay(false)
    }
  }

  const closePopup = () => {
    setPopupOpen(false)
    Cookies.set('slumbr-party-popup', 'true', { expires: 1 })
  }

  return (
    <>
      <div
        ref={comp}
        className={`${styles.home}`}
      >
        <Head>
          <title>SLMBR PRTY | Home</title>
          <meta
            name="description"
            content="SLMBR PRTY is a women-founded and led production company devoted to craft and intent on transcending tradition."
          />
        </Head>

        <h1 className="wcag-hidden">Home</h1>

        {/* <LoadOverlay /> */}

        {data.reelVideo && data.reelVideoPoster && (
          <div className={`${styles.hero} ${videoLoaded ? styles.loaded : null}`}>
            <div className="absolute top-0 left-0 w-full h-full">
              <video
                ref={video}
                src={data.reelVideo.url}
                poster={data.reelVideoPoster.url}
                muted
                loop
                preload="true"
                playsInline
                className="object-cover w-full h-full"
                onLoadedData={() => {
                  setTimeout(() => {
                    setVideoLoaded(true)
                  }, 200)
                }}
              ></video>

              {showPlay && (
                <div
                  onClick={handlePlay}
                  className={`${styles['play-button']} absolute top-0 left-0 w-full h-full flex justify-center items-center`}
                >
                  <Play />
                </div>
              )}
            </div>
          </div>
        )}

        <div
          ref={directorsSection}
          className="directors bg-parchment def-x py-12 grid grid-cols-12 gap-def pb-40"
        >
          {data.directorsTitle && (
            <h2 className={`${styles['directors-title']} enter-in-1 upright level-subhead text-merlot hidden lg:block`}>
              {data.directorsTitle}
            </h2>
          )}

          <div className="col-span-12 lg:col-span-11 lg:col-start-2 mb-24 lg:mb-20">
            {data.directorHeadline && (
              <div
                className="enter-in-1 delay-100 level-2 text-merlot mb-12 lg:mb-16 rich-text"
                dangerouslySetInnerHTML={{ __html: data.directorHeadline }}
              ></div>
            )}
          </div>

          {data.directorFilms.map((film, index) => {
            let title = `${film.director ? `${film.director.title.toUpperCase()} ` : ''}${film.title}`

            return (
              <VideoBlock
                film={film}
                title={title}
                classes="col-span-12 lg:col-span-11 lg:col-start-2 mb-4 lg:mb-20"
                key={index}
                href={`/directors/film/${film.slug}`}
              />
            )
          })}
        </div>
      </div>

      {data.popupTitle && data.popupText && (
        <div className={`${styles.popup} flex justify-center items-center ${popupOpen ? styles.open : null}`}>
          <button
            className={`${styles.closer}`}
            onClick={closePopup}
          ></button>

          <div className="popup-content z-10 bg-periwinkle border-radius-def lg:max-w-[400px] max-w-[95%] max-h-[600px] p-8 text-center flex flex-col justify-center items-center">
            <div className="flex justify-end w-full">
              <button
                className={`${styles['x-closer']}`}
                onClick={closePopup}
              >
                <XIcon />
              </button>
            </div>

            <div className="flex flex-col justify-center items-center gap-16 py-32 px-8">
              <h2 className="level-2 lg:level-3 !leading-none text-parchment">{data.popupTitle}</h2>

              <div
                className="rich-text level-3 lg:level-body text-parchment"
                dangerouslySetInnerHTML={{ __html: data.popupText }}
              ></div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

Home.getLayout = function getLayout(page) {
  return <DefaultLayout>{page}</DefaultLayout>
}

export async function getStaticProps() {
  const homeData = await fetch(process.env.API_HOST, {
    cache: 'no-store',
    method: 'POST',
    headers: {
      Authorization: `Basic ${process.env.AUTH}`,
    },
    body: JSON.stringify({
      query: "page('Home')",
      select: {
        popupTitle: 'page.popup_title',
        popupText: 'page.popup_text.kirbytext',
        reelVimeoId: 'page.reel_vimeo_id',
        reelVideo: {
          query: 'page.reel_video.toFiles.first',
          select: {
            url: true,
          },
        },
        reelVideoPoster: {
          query: 'page.reel_video_poster.toFiles.first',
          select: {
            url: true,
          },
        },
        directorsTitle: 'page.directors_title',
        directorHeadline: 'page.headline.markdown',
        directorFilms: {
          query: 'page.films.toPages',
          select: {
            title: true,
            slug: true,
            featuredImage: {
              query: 'page.featured_image.toFiles.first',
              select: {
                url: true,
                width: true,
                height: true,
                alt: true,
              },
            },
            hoverVideo: {
              query: 'page.hover_video.toFiles.first',
              select: {
                url: true,
              },
            },
            director: {
              query: 'page.director.toPage',
              select: {
                title: true,
                slug: true,
              },
            },
          },
        },
      },
    }),
  })

  const jsonData = await homeData.json()
  const { result } = jsonData

  return {
    props: { data: result },
  }
}
