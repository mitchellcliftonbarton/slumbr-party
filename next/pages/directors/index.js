import Head from 'next/head'
import { useState } from 'react'
import Marquee from "react-fast-marquee"
import { motion, AnimatePresence } from "framer-motion"

// Styles
import styles from './../../styles/Pages.module.scss'

// Components
import DefaultLayout from '../../components/layouts/DefaultLayout'
import Link from 'next/link'
import DefImage from '../../components/DefImage'

export default function Directors({ data }) {
  const [activeDirector, setActiveDirector] = useState(false)

  const handleMouseEnter = (index) => {
    setActiveDirector(index)
  }

  const handleMouseLeave = () => {
    setActiveDirector(false)
  }
  
  return (
    <div className={`push-nav bg-parchment`}>
      <Head>
        <title>SLUMBR PARTY | Directors</title>
        <meta name="description" content="Slumbr Party" />
      </Head>

      <h1 className='wcag-hidden'>Directors</h1>

      <div className="pt-32 min-h-screen">
        <div className="def-x">
          {data.introText && data.introText !== '' && (
            <div 
              className="enter-in-1 level-body text-merlot w-full lg:w-5/12" 
              dangerouslySetInnerHTML={{ __html: data.introText }}
            ></div>
          )}

          {data.directors.length > 0 && (
            <div className='enter-in-1 delay-100 directors py-48 text-center px-def-mobile lg:px-20'>
              <div
                onMouseLeave={() => handleMouseLeave()}
                className="inner"
              >
                {data.directors.map((director, index) => (
                  <Link
                    key={index}
                    href={`/directors/${director.slug}`}
                    className="level-1 text-merlot"
                    onMouseEnter={() => handleMouseEnter(index)}
                  >{director.title}{index !== data.directors.length - 1 ? ', ' : ''}</Link>
                ))}
              </div>
            </div>
          )}
        </div>

        {data.directors.length > 0 && (
          <div className={`${styles['films-marquee']} relative py-def-mobile lg:py-def`}>
            <div className='relative'>
              <div className="spacer w-1/2 lg:w-1/6 pointer-events-none opacity-0">
                <div
                  style={{
                    paddingBottom: '56.25%'
                  }}
                ></div>
              </div>
              
              <AnimatePresence>
                {activeDirector !== false && activeDirector >= 0 && (
                  <motion.div 
                    key={data.directors[activeDirector].slug}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    className="director-film-marquee flex absolute top-0 left-0 w-full h-full"
                  >
                    <Marquee
                      gradient={false}
                    >
                      {data.directors[activeDirector].films.map((film, idx) => (
                        <div 
                          className="film-image w-1/2 lg:w-1/6 mx-2 lg:mx-def-1/2" 
                          key={idx}
                        >
                          <div
                            className='relative overflow-hidden border-radius-def'
                            style={{
                              paddingBottom: '56.25%'
                            }}
                          >
                            <div className="absolute top-0 left-0 w-full h-full">
                              <DefImage
                                src={film.image[0].url}
                                layout="fill"
                                objectFit="cover"
                                alt={film.image[0].alt}
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </Marquee>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

Directors.getLayout = function getLayout(page) {
  return (
    <DefaultLayout>
      {page}
    </DefaultLayout>
  )
}

export async function getStaticProps() {
  /* GET DIRECTOR DATA */
  const directorsData = await fetch(process.env.API_HOST, {
      method: "POST",
      headers: {
        Authorization: `Basic ${process.env.AUTH}`,
      },
      body: JSON.stringify({
        query: "page('Directors')",
        select: {
          introText: "page.intro_text.markdown",
          directors: {
            query: "page.children",
            select: {
              slug: true,
              title: true
            }
          }
        }
      }),
  })

  const jsonData = await directorsData.json()
  const { result } = jsonData

  /* GET FILM DATA */
  const filmsData = await fetch(process.env.API_HOST, {
      method: "POST",
      headers: {
        Authorization: `Basic ${process.env.AUTH}`,
      },
      body: JSON.stringify({
        query: `page('Films').children`,
        select: {
          title: true,
          slug: true,
          directors: "page.directors",
          image: {
            query: "page.featured_image.toFiles",
            select: {
              url: true,
              width: true,
              height: true,
              alt: true
            }
          }
        }
      }),
  })

  const filmsJsonData = await filmsData.json()

  /* PUT DIRECTOR AND FILM DATA TOGETHER */
  result.directors.forEach(director => {
    const slug = director.slug
    const films = []

    filmsJsonData.result.forEach(film => {
      const arr = film.directors.split(/[ ,]+/)

      if (arr.some(item => `Directors/${slug}` === item)) {
        films.push(film)
      }
    })

    director.films = films
  })

  return {
    props: {
      data: result
    },
  }
}