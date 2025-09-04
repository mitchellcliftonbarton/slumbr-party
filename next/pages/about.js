import Head from 'next/head'
import { gsap } from 'gsap/dist/gsap'
import { ScrollToPlugin } from 'gsap/dist/ScrollToPlugin'
gsap.registerPlugin(ScrollToPlugin)

// React
import { useState, useRef, useEffect } from 'react'

// Components
import DefaultLayout from '../components/layouts/DefaultLayout'
import DefImage from '../components/DefImage'
import Marquee from 'react-fast-marquee'

// Styles
import styles from './../styles/Pages.module.scss'

export default function About({ data }) {
  const showInfo = data.text || data.clientTitle || data.clients.length > 0

  const [videoLoaded, setVideoLoaded] = useState(false)
  const [hideVid, setHideVid] = useState(false)
  const video = useRef(null)
  const aboutContainer = useRef(null)
  const aboutText = useRef(null)

  return (
    <div
      ref={aboutContainer}
      className={`bg-parchment relative min-h-screen flex flex-col`}
    >
      <Head>
        <title>SLMBR PRTY | About</title>
        <meta
          name="description"
          content="SLMBR PRTY is a women-founded and led production company devoted to craft and intent on transcending tradition."
        />
      </Head>

      <h1 className="wcag-hidden">About</h1>

      {data.mainText && data.mainText !== '' && (
        <div
          className="enter-in-1 def-x level-body text-merlot rich-text w-full lg:w-1/2 lg:max-w-[800px] mx-auto my-auto py-32"
          dangerouslySetInnerHTML={{ __html: data.mainText }}
        ></div>
      )}

      {data.marqueeImages.length > 0 && (
        <div className={`${styles['about-marquee']} relative py-def`}>
          <Marquee gradient={false}>
            {data.marqueeImages.map((image, index) => (
              <div
                className="film-image w-1/3 lg:w-1/6 flex-0-0"
                key={index}
              >
                <div className="px-2 lg:px-def-1/2">
                  <div className="relative overflow-hidden border-radius-def aspect-video">
                    <div className="absolute top-0 left-0 w-full h-full">
                      <DefImage
                        src={image.url}
                        alt={image.alt}
                        className="object-cover w-full h-full"
                        width={image.width}
                        height={image.height}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {data.marqueeImages.map((image, index) => (
              <div
                className="film-image w-1/3 lg:w-1/6 flex-0-0"
                key={index}
              >
                <div className="px-2 lg:px-def-1/2">
                  <div className="relative overflow-hidden border-radius-def aspect-video">
                    <div className="absolute top-0 left-0 w-full h-full">
                      <DefImage
                        src={image.url}
                        alt={image.alt}
                        className="object-cover w-full h-full"
                        width={image.width}
                        height={image.height}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </Marquee>
        </div>
      )}
    </div>
  )
}

About.getLayout = function getLayout(page) {
  return <DefaultLayout>{page}</DefaultLayout>
}

export async function getStaticProps() {
  const aboutData = await fetch(process.env.API_HOST, {
    cache: 'no-store',
    method: 'POST',
    headers: {
      Authorization: `Basic ${process.env.AUTH}`,
    },
    body: JSON.stringify({
      query: "page('About')",
      select: {
        mainText: 'page.main_text.kirbytext',
        backgroundVimeoId: 'page.background_vimeo_id',
        marqueeImages: {
          query: 'page.marquee_images.toFiles',
          select: {
            url: true,
            width: true,
            height: true,
            alt: true,
            type: true,
          },
        },
        backgroundVideo: {
          query: 'page.background_video.toFiles.first',
          select: {
            url: true,
          },
        },
        backgroundVideoPoster: {
          query: 'page.background_video_poster.toFiles.first',
          select: {
            url: true,
          },
        },
        backgroundImage: {
          query: 'page.background_image.toFiles.first',
          select: {
            url: true,
            width: true,
            height: true,
            alt: true,
            type: true,
          },
        },
        largeText: 'page.large_text.markdown',
        text: 'page.text.markdown',
        clientTitle: 'page.client_title',
        clients: {
          query: 'page.clients.toStructure',
          select: {
            title: true,
          },
        },
      },
    }),
  })

  const jsonData = await aboutData.json()
  const { result } = jsonData

  return {
    props: { data: result },
  }
}
