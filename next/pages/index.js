import Head from 'next/head'
import Vimeo from '@u-wave/react-vimeo'
// import Cookies from 'js-cookie'

// Components
import DefaultLayout from '../components/layouts/DefaultLayout'
import Link from 'next/link'
import DefImage from '../components/DefImage'

// React
import { useEffect, useState } from 'react'
import Cookies from 'js-cookie'

// Styles
import styles from './../styles/Pages.module.scss'

// Components
import LoadOverlay from '../components/LoadOverlay'

export default function Home({ data }) {
  const [videoLoaded, setVideoLoaded] = useState(false)
  const [showLoadOverlay, setShowLoadOverlay] = useState(false)

  useEffect(() => {
    if (!Cookies.get('slumbr-party-splash')) {
      setShowLoadOverlay(true)
      
      if (document !== undefined) {
        document.body.style.overflow = 'hidden'
      }
    }
  }, [])
  
  return (
    <div className={`${styles.home}`}>
      <Head>
        <title>SLUMBR PARTY | Home</title>
        <meta name="description" content="Slumbr Party" />
      </Head>

      <h1 className="wcag-hidden">Slumbr Party | Home</h1>

      {data.reelVimeoId && (
        <div className={`${styles.hero} ${videoLoaded ? styles.loaded : null}`}>
          <Vimeo
            video={data.reelVimeoId}
            background
            autoplay
            loop
            className="vimeo-player"
            onReady={() => {
              setTimeout(() => {
                setVideoLoaded(true)
              }, 500)
            }}
            style={{
              position: 'absolute',
              top: '0px',
              left: '0px',
              width: '100%',
              height: '100%'
            }}
          />

          <LoadOverlay 
            showLoadOverlay={showLoadOverlay} 
            setShowLoadOverlay={setShowLoadOverlay}
          />
        </div>
      )}

      <div className="directors bg-parchment def-x py-12 grid grid-cols-12 gap-def pb-40">
        <h2 className={`${styles['directors-title']} enter-in-1 upright level-subhead text-merlot hidden lg:block`}>Directors</h2>

        <div className="col-span-12 lg:col-span-11 lg:col-start-2 mb-24 lg:mb-20">
          {data.directorHeadline && (
            <div 
              className="enter-in-1 delay-100 level-2 text-merlot mb-12 lg:mb-16" 
              dangerouslySetInnerHTML={{ __html: data.directorHeadline }}
            ></div>
          )}

          <p className='enter-in-1 delay-200 level-subhead text-merlot'>
            <Link href="/directors">View All Directors →</Link>
          </p>
        </div>

        {data.directorFilms.map((film, index) => {
          let title = ''

          film.directors.forEach((director, idx) => {
            if (idx === film.directors.length - 1) {
              title += director.title.toUpperCase()
            } else {
              title += `${director.title.toUpperCase()}, `
            }
          })

          title += ` ${film.title}`

          return (
            <Link 
              href={`/films/${film.slug}`} 
              className={`${styles['director-film']} col-span-12 lg:col-span-11 lg:col-start-2 mb-20`}
              key={index}
            >
              <div className={`${styles['director-film-image']} relative mb-def-mobile lg:mb-def`}>
                <div className="absolute top-0 left-0 w-full h-full">
                  <DefImage
                    src={film.featuredImage[0].url}
                    layout="fill"
                    objectFit="cover"
                    alt={film.featuredImage[0].alt}
                  />
                </div>
              </div>

              <h3 className='level-subhead text-merlot'>{title}</h3>
            </Link>
          )
        })}
      </div>
    </div>
  )
}

Home.getLayout = function getLayout(page) {
  return (
    <DefaultLayout>
      {page}
    </DefaultLayout>
  )
}

export async function getStaticProps() {
  const homeData = await fetch(process.env.API_HOST, {
      method: "POST",
      headers: {
        Authorization: `Basic ${process.env.AUTH}`,
      },
      body: JSON.stringify({
        query: "page('Home')",
        select: {
          reelVimeoId: "page.reel_vimeo_id",
          directorHeadline: "page.headline.markdown",
          directorFilms: {
            query: "page.films.toPages",
            select: {
              title: true,
              slug: true,
              featuredImage: {
                query: "page.featured_image.toFiles",
                select: {
                  url: true,
                  width: true,
                  height: true,
                  alt: true
                }
              },
              directors: {
                query: "page.directors.toPages",
                select: {
                  title: true,
                  slug: true
                }
              }
            }
          }
        }
      }),
  })

  const jsonData = await homeData.json()
  const { result } = jsonData

  return {
    props: {data: result},
  }
}