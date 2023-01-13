import Head from 'next/head'
import { gsap } from 'gsap/dist/gsap'
import { ScrollToPlugin } from 'gsap/dist/ScrollToPlugin'
gsap.registerPlugin(ScrollToPlugin)

// React
import { useState, useRef, useEffect } from 'react'

// Components
import DefaultLayout from '../components/layouts/DefaultLayout'
import DefImage from '../components/DefImage'

// Styles
import styles from './../styles/Pages.module.scss'

export default function About({ data }) {
  const showInfo = data.text || data.clientTitle || data.clients.length > 0

  const [videoLoaded, setVideoLoaded] = useState(false)
  const [hideVid, setHideVid] = useState(false)
  const video = useRef(null)
  const aboutContainer = useRef(null)
  const aboutText = useRef(null)

  useEffect(() => {
    if (window !== undefined && document !== undefined) {
      gsap.set(window, {
        scrollTo: {
          y: 0
        }
      })

      gsap.to(window, {
        duration: 10,
        ease: 'none',
        scrollTo: {
          y: aboutText.current,
          autoKill: true,
          offsetY: 100
        }
      })
    }
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
          if (error.name === 'NotAllowedError') {
            // console.log('autoplay not allowed')
            video.current.pause()

            setHideVid(true)
          } else {
            // console.log('autoplay not working for another reason')
            video.current.pause()

            setHideVid(true)
          }
        })
    }
  }, [video])
  
  return (
    <div ref={aboutContainer} className={`${styles.about} ${hideVid ? styles['hide-vid'] : ''} push-nav def-x relative`}>
      <Head>
        <title>SLMBR PRTY | About</title>
        <meta name="description" content="SLMBR PRTY is a women-founded and led production company devoted to craft and intent on transcending tradition." />
      </Head>

      <h1 className="wcag-hidden">About</h1>

      {(() => {
        if (data.backgroundVideo && data.backgroundVideoPoster !== '') {
          return (
            <div className={`${styles['bg-vid']} ${videoLoaded ? styles.loaded : null} fixed top-0 left-0 w-full h-full pointer-events-none`}>
              <div className="absolute top-0 left-0 w-full h-full">
                <video 
                  ref={video}
                  src={data.backgroundVideo.url} 
                  poster={data.backgroundVideoPoster.url}
                  muted
                  loop 
                  preload="true"
                  playsInline
                  className='object-cover w-full h-full'
                  onLoadedData={() => {
                    setTimeout(() => {
                      setVideoLoaded(true)
                    }, 100)
                  }}
                ></video>
              </div>
            </div>
          )
        } else if (data.backgroundImage.length > 0) {
          return (
            <div className={`${styles['bg-image']} fixed top-0 left-0 w-full h-full pointer-events-none`}>
              <DefImage
                src={data.backgroundImage.url}
                alt={data.backgroundImage.alt}
                className="object-cover w-full h-full"
                width={data.backgroundImage.width}
                height={data.backgroundImage.height}
              />
            </div>
          )
        }
      })()}
      
      {data.largeText && (
        <div 
          className="fade-in large-text level-1 text-center w-full lg:w-3/4 mx-auto pb-60 rich-text" 
          dangerouslySetInnerHTML={{ __html: data.largeText }}
          style={{
            paddingTop: '60vh'
          }}
        ></div>
      )}

      {showInfo && (
        <div 
          ref={aboutText} 
          className={`${styles.info} delay-100 info w-full lg:w-5/12`}
        >
          {data.text && (
            <div 
              className="level-body rich-text mb-7" 
              dangerouslySetInnerHTML={{ __html: data.text }}
            ></div>
          )}

          {data.clientTitle && (
            <h2 className='level-body mb-7'>{data.clientTitle}</h2>
          )}

          {data.clients.length > 0 && (
            <ul className={`${styles.clients} flex flex-wrap`}>
              {data.clients.map((client, index) => (
                <li key={index}>
                  <p className='level-body'>○ {client.title}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  )
}

About.getLayout = function getLayout(page) {
  return (
    <DefaultLayout>
      {page}
    </DefaultLayout>
  )
}

export async function getStaticProps() {
  const aboutData = await fetch(process.env.API_HOST, {
      method: "POST",
      headers: {
        Authorization: `Basic ${process.env.AUTH}`,
      },
      body: JSON.stringify({
        query: "page('About')",
        select: {
          backgroundVimeoId: "page.background_vimeo_id",
          backgroundVideo: {
            query: "page.background_video.toFiles.first",
            select: {
              url: true
            }
          },  
          backgroundVideoPoster: {
            query: "page.background_video_poster.toFiles.first",
            select: {
              url: true
            }
          },
          backgroundImage: {
            query: "page.background_image.toFiles.first",
            select: {
              url: true,
              width: true,
              height: true,
              alt: true,
              type: true
            }
          },
          largeText: "page.large_text.markdown",
          text: "page.text.markdown",
          clientTitle: "page.client_title",
          clients: {
            query: "page.clients.toStructure",
            select: {
              title: true
            }
          }
        }
      }),
  })

  const jsonData = await aboutData.json()
  const { result } = jsonData

  return {
    props: {data: result},
  }
}