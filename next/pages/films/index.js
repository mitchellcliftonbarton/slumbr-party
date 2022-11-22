import Head from 'next/head'

// Components
import DefaultLayout from '../../components/layouts/DefaultLayout'
import DefImage from '../../components/DefImage'

// Styles
import styles from './../../styles/Pages.module.scss'
import Link from 'next/link'

export default function Films({ data }) {
  console.log(data)
  
  return (
    <div className={`push-nav def-x bg-parchment`}>
      <Head>
        <title>SLUMBR PARTY | Films</title>
        <meta name="description" content="Slumbr Party" />
      </Head>

      <h1 className='wcag-hidden'>Films</h1>

      <div className="pt-32 pb-def">
        {data.introText && data.introText !== '' && (
          <div 
            className="level-body text-merlot w-full lg:w-5/12 pb-def" 
            dangerouslySetInnerHTML={{ __html: data.introText }}
          ></div>
        )}

        {data.films.length > 0 && (
          <div className='film'>
            {data.films.map((film, index) => (
              <div 
                className={`${styles['film-detail-item']} w-full grid grid-cols-12 gap-def py-def`} 
                key={index}
              >
                <div className="col-span-5">
                  <Link href={`/films/${film.slug}`}>
                    <h2 className="level-3 text-merlot mb-12">{film.title}</h2>
                  </Link>

                  {film.description && (
                    <div 
                      className="text-merlot level-body mb-12" 
                      dangerouslySetInnerHTML={{ __html: film.description }}
                    ></div>
                  )}

                  {film.awards.length > 0 && (
                    <div className="awards">
                      <h3 className="level-body text-merlot">Accolades</h3>
                      <div className="grid grid-cols-5 gap-def"></div>
                    </div>
                  )}
                </div>

                <div className="col-span-7">
                  <div className={`${styles['film-image']} relative`}>
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
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

Films.getLayout = function getLayout(page) {
  return (
    <DefaultLayout>
      {page}
    </DefaultLayout>
  )
}

export async function getStaticProps() {
  const filmsData = await fetch(process.env.API_HOST, {
      method: "POST",
      headers: {
        Authorization: `Basic ${process.env.AUTH}`,
      },
      body: JSON.stringify({
        query: "page('Films')",
        select: {
          introText: "page.intro_text.markdown",
          films: {
            query: "page.children",
            select: {
              title: true,
              slug: true,
              image: {
                query: "page.featured_image.toFiles",
                select: {
                  url: true,
                  width: true,
                  height: true,
                  alt: true,
                  type: true
                }
              },
              description: "page.description.markdown",
              awards: {
                query: "page.awards.toStructure",
                select: {
                  title: true,
                  link: true
                }
              }
            }
          }
        }
      }),
  })

  const jsonData = await filmsData.json()
  const { result } = jsonData

  return {
    props: {data: result},
  }
}