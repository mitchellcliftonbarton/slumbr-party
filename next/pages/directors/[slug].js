import Head from 'next/head'

// Components
import DefaultLayout from '../../components/layouts/DefaultLayout'
import Link from 'next/link'
import VideoBlock from '../../components/VideoBlock'

// Styles
import styles from './../../styles/Pages.module.scss'

export default function DirectorsDetail({ data, filmsData }) {
  const pageTitle = `SLMBR PRTY | ${data.title}`

  return (
    <div className={`${styles['director-detail']} push-nav def-x bg-parchment`}>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content="SLMBR PRTY is a women-founded and led production company devoted to craft and intent on transcending tradition." />
      </Head>

      <div
        className={`${styles['director-title']} fixed top-0 left-0 w-full h-full pointer-events-none flex justify-center items-center`}
      >
        <h1 className={`enter-in-1 text-merlot level-1`}>{data.title}</h1>
      </div>

      <div className="pt-20 lg:pt-4 pb-4 lg:pb-def">
        {filmsData.length > 0 && (
          <div className='films grid grid-cols-12 gap-4 lg:gap-def mb-4 lg:mb-def'>
            {filmsData.map((film, index) => (
              <VideoBlock
                film={film}
                classes="fade-in col-span-12 lg:col-span-6 relative"
                key={index}
                href={`/directors/film/${film.slug}`}
                showTitleOnHover
                style={{
                  animationDelay: `${2000 + (100 * (index + 1))}ms`
                }}
                priority={index < 4 ? true : false}
              />
            ))}
          </div>
        )}

        <div
          className={`${styles['director-info']} fade-in grid grid-cols-12 gap-def`}
          style={{
            animationDelay: `2500ms`
          }}
        >
          <div className="col-span-12 lg:col-span-6 relative">
            <div className="relative lg:absolute top-0 left-0 w-full h-full flex flex-col justify-between items-start">
              {data.bio && (
                <div 
                  className="w-full level-body text-merlot mb-60 lg:mb-0 rich-text" 
                  dangerouslySetInnerHTML={{ __html: data.bio }}
                ></div>
              )}

              {data.instagramLink && data.instagramLinkTitle && (
                <Link 
                  href={data.instagramLink} 
                  className="level-subhead text-merlot link-with-arrow"
                >{data.instagramLinkTitle}</Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

DirectorsDetail.getLayout = function getLayout(page) {
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
      query: "page('Directors').children",
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
        query: `page('Directors').children.find('${slug}')`,
        select: {
          title: true,
          slug: true,
          bio: "page.bio.markdown",
          instagramLinkTitle: "page.instagram_link_title",
          instagramLink: "page.instagram_link"
        }
      }),
  })

  const jsonData = await directorData.json()
  const { result } = jsonData

  const filmsData = await fetch(process.env.API_HOST, {
      method: "POST",
      headers: {
        Authorization: `Basic ${process.env.AUTH}`,
      },
      body: JSON.stringify({
        query: `page('Films').children.filterBy('film_type', 'commercial').filterBy('director', 'Directors/${slug}', ',')`,
        select: {
          title: true,
          slug: true,
          disableOnDirectorPage: "page.disable_on_director_page.toBool",
          featuredImage: {
            query: "page.featured_image.toFiles.first",
            select: {
              url: true,
              width: true,
              height: true,
              alt: true,
              type: true
            }
          },
          hoverVideo: {
            query: "page.hover_video.toFiles.first",
            select: {
              url: true
            }
          }
        }
      }),
  })

  const filmsJsonData = await filmsData.json()

  return {
    props: {
      data: result,
      filmsData: filmsJsonData.result.filter(film => film.disableOnDirectorPage !== true)
    },
  }
}