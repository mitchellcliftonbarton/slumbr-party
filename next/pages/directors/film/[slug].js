import Head from 'next/head'
import Vimeo from '@u-wave/react-vimeo'

// Components
import DefaultLayout from '../../../components/layouts/DefaultLayout'
import Link from 'next/link'
import DefImage from '../../../components/DefImage'
import { Play } from '../../../components/icons/Icons'
import FilmSlider from '../../../components/FilmSlider'

// Styles
import styles from './../../../styles/Pages.module.scss'

// React
import { useRef, useState, useEffect, useMemo } from 'react'

export default function DirectorFilmDetail({ data, films }) {
  const [filmData, setFilmData] = useState(data)
  const pageTitle = `SLMBR PARTY | ${filmData.title}`
  const video = useRef(null)
  const [videoStarted, setVideoStarted] = useState(false)

  const playVideo = () => {
    setVideoStarted(true)
    video.current.player.play()
  }

  useEffect(() => {
    setFilmData(data)
  }, [data])

  const [poster] = useMemo(() => {
    let value = data.videoPoster || data.featuredImage

    return [
      value
    ]
  }, [data])

  const titleString = `${filmData.director ? `${filmData.director.title.toUpperCase()} ` : ''}${filmData.title}${filmData.videoTitle ? filmData.videoTitle : ''}`

  return (
    <div className={`push-nav bg-merlot min-h-screen`}>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content="Slmbr Party" />
      </Head>

      <div className="pt-40 lg:pt-32 lg:pt-12 pb-4 lg:pb-def">
        {filmData.vimeoId && (
          <div className='def-x mb-60 lg:mb-32'>
            <div
              className={`${styles['main-video']} enter-in-1 relative mb-4 lg:mb-def`}
              style={{
                paddingBottom: '56.25%'
              }}
            >
              <Vimeo
                video={filmData.vimeoId}
                ref={video}
                className='w-full h-full absolute top-0 left-0'
              />

              {poster && (
                <div
                  key={filmData.slug}
                  className={`${styles['video-poster']} ${videoStarted ? styles.started : null} featured-image absolute top-0 left-0 w-full h-full`}
                >
                  <DefImage
                    src={poster.url}
                    alt={poster.alt}
                    className="object-cover w-full h-full"
                    width={poster.width}
                    height={poster.height}
                  />

                  <button 
                    onClick={() => playVideo()} 
                    className="absolute top-0 left-0 w-full h-full flex justify-center items-center"
                  >
                    <p className={`${styles.play} level-1 text-parchment flex items-center`}>
                      <span className='pr-5 lg:pr-10'>Play</span>
                      <Play />
                    </p>
                  </button>
                </div>
              )}
            </div>

            <h1 className='level-subhead text-parchment'>{titleString}</h1>
          </div>
        )}

        <FilmSlider
          title={`More Films${filmData.director ? ` by ${filmData.director.title}` : ''}`}
          films={films}
          textColor="parchment"
          prefix="/directors/film/"
        />

        <div className="def-x mt-24">
          <Link href="/directors" className='level-subhead text-parchment'>← Back to Directors</Link>
        </div>
      </div>
    </div>
  )
}

DirectorFilmDetail.getLayout = function getLayout(page) {
  return (
    <DefaultLayout>
      {page}
    </DefaultLayout>
  )
}

export async function getStaticPaths() {
  const filmData = await fetch(process.env.API_HOST, {
    method: "POST",
    headers: {
      Authorization: `Basic ${process.env.AUTH}`,
    },
    body: JSON.stringify({
      query: `page('Films').children.filterBy('film_type', 'commercial')`,
      select: {
        slug: true
      },
    }),
  });

  const jsonData = await filmData.json();
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

  const filmData = await fetch(process.env.API_HOST, {
      method: "POST",
      headers: {
        Authorization: `Basic ${process.env.AUTH}`,
      },
      body: JSON.stringify({
        query: `page('Films').children.find('${slug}')`,
        select: {
          title: true,
          slug: true,
          vimeoId: "page.vimeo_id",
          videoTitle: "page.video_title",
          featuredImage: {
            query: "page.featured_image.toFiles.first",
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
          },
          director: {
            query: "page.director.toPage",
            select: {
              title: true,
              slug: true
            }
          }
        }
      }),
  })

  const jsonData = await filmData.json()
  const { result } = jsonData

  /* GET ALL FILMS with this director */
  const filmsData = await fetch(process.env.API_HOST, {
      method: "POST",
      headers: {
        Authorization: `Basic ${process.env.AUTH}`,
      },
      body: JSON.stringify({
        query: `page('Films').children.filterBy('director', 'Directors/${result.director.slug}', ',')`,
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
  const filmsJsonDataResult = filmsJsonData.result
  let filmsArray = null

  if (filmsJsonData.result.length < 4) {
    filmsArray = filmsJsonDataResult.concat(filmsJsonDataResult).concat(filmsJsonDataResult)
  } else {
    filmsArray = filmsJsonDataResult
  }

  result.key = `${result.slug}`

  return {
    props: {
      data: result,
      films: filmsArray
    },
  }
}