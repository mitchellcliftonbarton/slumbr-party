import Head from 'next/head'
import { useAppState, useAppUpdate } from '../context'

// Components
import DefaultLayout from '../components/layouts/DefaultLayout'
import Link from 'next/link'

// React
import { useState, useRef, useEffect } from 'react'

// Styles
import styles from './../styles/Pages.module.scss'

// Components
import LoadOverlay from '../components/LoadOverlay'
import VideoBlock from '../components/VideoBlock'

export default function Home({ data }) {
  const [videoLoaded, setVideoLoaded] = useState(false)
  const video = useRef(null)

  useEffect(() => {
    setTimeout(() => {
      setVideoLoaded(true)
    }, 100)
  }, [])
  
  return (
    <div className={`${styles.home}`}>
      <Head>
        <title>SLUMBR PARTY | Home</title>
        <meta name="description" content="Slumbr Party" />
      </Head>

      <h1 className="wcag-hidden">Slumbr Party | Home</h1>

      {data.reelVideo && data.reelVideoPoster && (
        <div className={`${styles.hero} ${videoLoaded ? styles.loaded : null}`}>
          <div className="absolute top-0 left-0 w-full h-full">
            <video 
              ref={video}
              src={data.reelVideo.url} 
              poster={data.reelVideoPoster.url}
              muted 
              autoPlay 
              loop 
              preload="true"
              playsInline
              className='object-cover w-full h-full'
            ></video>
          </div>

          <LoadOverlay/>
        </div>
      )}

      <div className="directors bg-parchment def-x py-12 grid grid-cols-12 gap-def pb-40">
        {data.directorsTitle && (
          <h2 className={`${styles['directors-title']} enter-in-1 upright level-subhead text-merlot hidden lg:block`}>{data.directorsTitle}</h2>
        )}

        <div className="col-span-12 lg:col-span-11 lg:col-start-2 mb-24 lg:mb-20">
          {data.directorHeadline && (
            <div 
              className="enter-in-1 delay-100 level-2 text-merlot mb-12 lg:mb-16" 
              dangerouslySetInnerHTML={{ __html: data.directorHeadline }}
            ></div>
          )}

          <p className='enter-in-1 delay-200 level-subhead text-merlot'>
            <Link href="/directors" className='link-with-arrow'>View All Directors</Link>
          </p>
        </div>

        {data.directorFilms.map((film, index) => {
          let title = `${film.director ? `${film.director.title.toUpperCase()} ` : ''}${film.title}`

          return (
            <VideoBlock
              film={film}
              title={title}
              classes="col-span-12 lg:col-span-11 lg:col-start-2 mb-20"
              key={index}
              href={`/films/${film.slug}`}
            />
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
          reelVideo: {
            query: "page.reel_video.toFiles.first",
            select: {
              url: true
            }
          },  
          reelVideoPoster: {
            query: "page.reel_video_poster.toFiles.first",
            select: {
              url: true
            }
          },  
          directorsTitle: "page.directors_title",
          directorHeadline: "page.headline.markdown",
          directorFilms: {
            query: "page.films.toPages",
            select: {
              title: true,
              slug: true,
              featuredImage: {
                query: "page.featured_image.toFiles.first",
                select: {
                  url: true,
                  width: true,
                  height: true,
                  alt: true
                }
              },
              hoverVideo: {
                query: "page.hover_video.toFiles.first",
                select: {
                  url: true
                }
              },
              director: {
                query: "page.director.toPage",
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