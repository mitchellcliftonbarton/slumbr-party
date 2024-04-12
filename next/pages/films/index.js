import Head from 'next/head'

// Styles
import styles from './../../styles/Pages.module.scss'

// Components
import DefaultLayout from '../../components/layouts/DefaultLayout'
import DefImage from '../../components/DefImage'
import Link from 'next/link'

export default function Films({ data }) {
  return (
    <div className={`push-nav def-x bg-parchment`}>
      <Head>
        <title>SLMBR PRTY | Films</title>
        <meta name="description" content="SLMBR PRTY is a women-founded and led production company devoted to craft and intent on transcending tradition." />
      </Head>

      <h1 className='wcag-hidden'>Films</h1>

      <div className="pt-32 pb-def">
        {data.introText && data.introText !== '' && (
          <div 
            className="enter-in-1 level-body text-merlot w-full lg:w-5/12 pb-def rich-text" 
            dangerouslySetInnerHTML={{ __html: data.introText }}
          ></div>
        )}

        {data.films && data.films.length > 0 && (
          <div className='film'>
            {data.films.map((film, index) => (
              <div 
                className={`${styles['film-detail-item']} w-full grid grid-cols-12 gap-4 lg:gap-def py-def`} 
                key={index}
              >
                <div
                  className="enter-in-1 col-span-12 lg:col-span-5"
                  style={{
                    animationDelay: `${(index + 1) * 100}ms`
                  }}
                >
                  <Link href={`/films/${film.slug}`}>
                    <h2 className="level-3 text-merlot lg:mb-12">{film.title}</h2>
                  </Link>

                  {film.description && (
                    <div 
                      className="hidden lg:block text-merlot level-body mb-12" 
                      dangerouslySetInnerHTML={{ __html: film.description }}
                    ></div>
                  )}

                  {film.awards.length > 0 && (
                    <div className="hidden lg:block awards">
                      <h3 className="level-body text-merlot">Accolades</h3>
                      <ul className="grid grid-cols-4 gap-def">
                        {film.awards.map((award, index) => (
                          <li 
                            className='col-span-2 text-merlot level-body' 
                            key={index}
                          >
                            {award.link
                              ? <Link 
                                  href={award.link}
                                  target="_blank" 
                                  rel="noreferrer"
                              >○ {award.title}</Link>
                              : <p>○ {award.title}</p>
                            }
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                <Link
                  href={`/films/${film.slug}`}
                  className="enter-in-1 col-span-12 lg:col-span-7 inline-block"
                  style={{
                    animationDelay: `${(index + 2) * 100}ms`
                  }}
                >
                  <div className={`${styles['film-image']} relative`}>
                    <div className="absolute top-0 left-0 w-full h-full">
                      <DefImage
                        src={film.image.url}
                        alt={film.image.alt}
                        className="object-cover w-full h-full"
                        width={film.image.width}
                        height={film.image.height}
                        priority={index < 2 ? true : false}
                      />
                    </div>

                    {film.awardsImage && (
                      <div className={`${styles['film-awards-image']} absolute top-0 left-0 w-full h-full`}>
                        <DefImage
                          src={film.awardsImage.url}
                          alt={film.awardsImage.alt}
                          className="object-cover w-full h-full"
                          width={film.awardsImage.width}
                          height={film.awardsImage.height}
                        />
                      </div>
                    )}
                  </div>
                </Link>

                <div className="col-span-12 lg:hidden">
                  {film.description && (
                    <div 
                      className="text-merlot level-body mb-6 lg:mb-12" 
                      dangerouslySetInnerHTML={{ __html: film.description }}
                    ></div>
                  )}

                  {film.awards.length > 0 && (
                    <div className="awards">
                      <h3 className="level-body text-merlot">Accolades</h3>
                      <ul className="grid grid-cols-4 gap-def">
                        {film.awards.map((award, index) => (
                          <li 
                            className='col-span-2 text-merlot level-body' 
                            key={index}
                          >
                            {award.link
                              ? <Link 
                                  href={award.link}
                                  target="_blank" 
                                  rel="noreferrer"
                              >○ {award.title}</Link>
                              : <p>○ {award.title}</p>
                            }
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
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
      cache: 'no-store',
      method: "POST",
      headers: {
        Authorization: `Basic ${process.env.AUTH}`,
      },
      body: JSON.stringify({
        query: "page('Films')",
        select: {
          introText: "page.intro_text.markdown",
          films: {
            query: "page.children.filterBy('film_type', 'narrative')",
            select: {
              title: true,
              slug: true,
              type: "page.film_type",
              image: {
                query: "page.featured_image.toFiles.first",
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
              },
              awardsImage: {
                query: "page.awards_image.toFiles.first",
                select: {
                  url: true,
                  width: true,
                  height: true,
                  alt: true
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