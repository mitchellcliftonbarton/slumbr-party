import Head from 'next/head'
import Vimeo from '@u-wave/react-vimeo'
import { horizontalLoop } from '../../lib/consts'

// Components
import DefaultLayout from '../../components/layouts/DefaultLayout'
import Link from 'next/link'
import DefImage from '../../components/DefImage'
import { Play } from '../../components/icons/Icons'

// Styles
import styles from './../../styles/Pages.module.scss'

// React
import { useRef, useState, useEffect } from 'react'

export default function FilmDetail({ data, films }) {
  const video = useRef(null)
  const marquee = useRef(null)
  const loop = useRef(null)
  const [videoStarted, setVideoStarted] = useState(false)
  const [marqueePaused, setMarqueePaused] = useState(false)

  const playVideo = () => {
    setVideoStarted(true)
    video.current.player.play()
  }

  const handleMarqueeEnter = () => {
    setMarqueePaused(true)
  }

  const handleMarqueeLeave = () => {
    setMarqueePaused(false)
  }

  useEffect(() => {
    const items = Array.from(marquee.current.querySelectorAll('.item'))

    loop.current = horizontalLoop(items, {
      paused: false,
      draggable: true,
      repeat: -1,
      speed: 0.3
    })

    return () => {
      loop.current.kill()
    };
  }, [])

  useEffect(() => {
    if (marqueePaused) {
      // console.log('pause it')
      loop.current.pause()
    } else {
      // console.log('play it')
      loop.current.play()
    }
  }, [marqueePaused])

  return (
    <div className={`push-nav bg-periwinkle`}>
      <Head>
        <title>SLUMBR PARTY | {data.title}</title>
        <meta name="description" content="Slumbr Party" />
      </Head>

      <div className="pt-32 lg:pt-12 pb-60">
        {data.vimeoId && (
          <div className='def-x mb-32'>
            <div
              className={`${styles['main-video']} enter-in-1 relative mb-def`}
              style={{
                paddingBottom: '56.25%'
              }}
            >
              <Vimeo
                video={data.vimeoId}
                ref={video}
                className='w-full h-full absolute top-0 left-0'
              />

              {data.videoPoster && (
                <div className={`${styles['video-poster']} ${videoStarted ? styles.started : null} featured-image absolute top-0 left-0 w-full h-full`}>
                  <DefImage
                    src={data.videoPoster.url}
                    alt={data.videoPoster.alt}
                    className="object-cover w-full h-full"
                    width={data.videoPoster.width}
                    height={data.videoPoster.height}
                  />

                  <button 
                    onClick={() => playVideo()} 
                    className="absolute top-0 left-0 w-full h-full flex justify-center items-center"
                  >
                    <p className={`${styles.play} level-1 text-parchment flex items-center`}>
                      <span className='pr-10'>Play</span>
                      <Play />
                    </p>
                  </button>
                </div>
              )}
            </div>

            <h1 className='level-subhead text-merlot'>{data.title}{data.videoTitle ? data.videoTitle : ''}</h1>
          </div>
        )}

        <div className="more-films fade-in delay-100">
          <h2 className='level-3 text-merlot text-left def-x mb-8'>More Films</h2>

          <div 
            ref={marquee}
            onMouseEnter={() => handleMarqueeEnter()}
            onMouseLeave={() => handleMarqueeLeave()}
            className="wrapper flex overflow-hidden"
          >
            {films.map((film, index) => (
              <div 
                className="item w-3/4 lg:w-1/4 flex-0-0 whitespace-nowrap px-def-1/2" 
                key={index}
              >
                <Link 
                  href={`/films/${film.slug}`}
                  className="w-full" 
                >
                  <div
                    className="inner relative overflow-hidden border-radius-def mb-def"
                    style={{
                      paddingBottom: '56.25%',
                      backgroundColor: 'rgba(255, 255, 255, .1)'
                    }}
                  >
                    <div className="absolute top-0 left-0 w-full h-full">
                      <DefImage
                        src={film.image.url}
                        alt={film.image.alt}
                        className="object-cover w-full h-full"
                        width={film.image.width}
                        height={film.image.height}
                      />
                    </div>
                  </div>

                  <h3 className='level-subhead text-merlot'>{film.title}</h3>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

FilmDetail.getLayout = function getLayout(page) {
  return (
    <DefaultLayout>
      {page}
    </DefaultLayout>
  )
}

export async function getStaticPaths() {
  const directorsData = await fetch(process.env.API_HOST, {
    method: "POST",
    headers: {
      Authorization: `Basic ${process.env.AUTH}`,
    },
    body: JSON.stringify({
      query: "page('Films').children",
      select: {
        slug: true
      },
    }),
  });

  const jsonData = await directorsData.json();
  const { result } = jsonData

  const paths = result.map((page) => {
    return {
      params: {
        slug: page.slug
      },
    };
  });

  return {
      paths: paths,
      fallback: false,
  };
}

export async function getStaticProps(context) {
  const { slug = '' } = context.params || {}

  const directorData = await fetch(process.env.API_HOST, {
      method: "POST",
      headers: {
        Authorization: `Basic ${process.env.AUTH}`,
      },
      body: JSON.stringify({
        query: `page('Films').children.find('${slug}')`,
        select: {
          title: true,
          vimeoId: "page.vimeo_id",
          videoTitle: "page.video_title",
          featuredImage: {
            query: "page.featured_image.toFiles",
            select: {
              url: true,
              width: true,
              height: true,
              alt: true,
            }
          },
          videoPoster: {
            query: "page.video_poster.toFiles.first",
            select: {
              url: true,
              width: true,
              height: true,
              alt: true,
            }
          }
        }
      }),
  })

  const jsonData = await directorData.json()
  const { result } = jsonData

  /* GET ALL FILMS */
  const filmsData = await fetch(process.env.API_HOST, {
      method: "POST",
      headers: {
        Authorization: `Basic ${process.env.AUTH}`,
      },
      body: JSON.stringify({
        query: "page('Films').children",
        select: {
          title: true,
          slug: true,
          image: {
            query: "page.featured_image.toFiles.first",
            select: {
              url: true,
              width: true,
              height: true,
              alt: true,
              type: true
            }
          }
        }
      }),
  })

  const filmsJsonData = await filmsData.json()

  return {
    props: {
      data: result,
      films: filmsJsonData.result
    },
  }
}