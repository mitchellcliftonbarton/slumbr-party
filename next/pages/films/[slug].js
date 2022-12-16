import Head from 'next/head'
import Vimeo from '@u-wave/react-vimeo'

// Components
import DefaultLayout from '../../components/layouts/DefaultLayout'
import Link from 'next/link'
import DefImage from '../../components/DefImage'
import { Play } from '../../components/icons/Icons'
import FilmSlider from '../../components/FilmSlider'

// Styles
import styles from './../../styles/Pages.module.scss'

// React
import { useRef, useState } from 'react'

export default function FilmDetail({ data, films }) {
  const video = useRef(null)
  const [videoStarted, setVideoStarted] = useState(false)
  const playVideo = () => {
    setVideoStarted(true)
    video.current.player.play()
  }

  return (
    <div className={`push-nav bg-periwinkle min-h-screen`}>
      <Head>
        <title>SLUMBR PARTY | {data.title}</title>
        <meta name="description" content="Slumbr Party" />
      </Head>

      <div className="pt-40 lg:pt-32 lg:pt-12 pb-60">
        {data.vimeoId && (
          <div className='def-x mb-60 lg:mb-32'>
            <div
              className={`${styles['main-video']} enter-in-1 relative mb-4 lg:mb-def`}
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
                      <span className='pr-5 lg:pr-10'>Play</span>
                      <Play />
                    </p>
                  </button>
                </div>
              )}
            </div>

            <h1 className='level-subhead text-merlot'>{data.title}{data.videoTitle ? data.videoTitle : ''}</h1>
          </div>
        )}

        <FilmSlider
          title="More Films"
          films={films}
        />
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
          director: {
            query: "page.director.toPage",
            select: {
              title: true
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
  const filmsJsonDataResult = filmsJsonData.result
  let filmsArray = null

  if (filmsJsonData.result.length < 4) {
    filmsArray = filmsJsonDataResult.concat(filmsJsonDataResult).concat(filmsJsonDataResult)
  } else {
    filmsArray = filmsJsonDataResult
  }

  return {
    props: {
      data: result,
      films: filmsArray
    },
  }
}