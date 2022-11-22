import Head from 'next/head'
import Vimeo from '@u-wave/react-vimeo'

// React
import { useState } from 'react'

// Components
import DefaultLayout from '../components/layouts/DefaultLayout'
// import Image from 'next/image'
import DefImage from '../components/DefImage'

// Styles
import styles from './../styles/Pages.module.scss'

export default function About({ data }) {
  console.log(data)

  const showInfo = data.text || data.clientTitle || data.clients.length > 0

  const [videoLoaded, setVideoLoaded] = useState(false)
  
  return (
    <div className='push-nav def-x relative'>
      <Head>
        <title>SLUMBR PARTY | About</title>
        <meta name="description" content="Slumbr Party" />
      </Head>

      <h1 className="wcag-hidden">About</h1>

      {(() => {
        if (data.backgroundVimeoId && data.backgroundVimeoId !== '') {
          return (
            <div className={`${styles['bg-vid']} ${videoLoaded ? styles.loaded : null} fixed top-0 left-0 w-full h-full pointer-events-none`}>
              <Vimeo
                video={data.backgroundVimeoId}
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
            </div>
          )
        } else if (data.backgroundImage.length > 0) {
          return (
            <div className={`${styles['bg-image']} fixed top-0 left-0 w-full h-full pointer-events-none`}>
              <DefImage
                src={data.backgroundImage[0].url}
                layout="fill"
                objectFit="cover"
                alt={data.backgroundImage[0].alt}
              />
            </div>
          )
        }
      })()}
      
      {data.largeText && (
        <div 
          className="large-text level-1 text-center w-full lg:w-3/4 mx-auto py-60" 
          dangerouslySetInnerHTML={{ __html: data.largeText }}
        ></div>
      )}

      {showInfo && (
        <div className="info w-full lg:w-5/12 mb-60">
          {data.text && (
            <div 
              className="level-body rich-text" 
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
                  <p className='level-body'>{client.title}</p>
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
          backgroundImage: {
            query: "page.background_image.toFiles",
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