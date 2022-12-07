import Head from 'next/head'

// Components
import DefaultLayout from '../../../components/layouts/DefaultLayout'
import Link from 'next/link'
import VideoBlock from '../../../components/VideoBlock'

// Styles
import styles from './../../../styles/Pages.module.scss'

export default function DirectorsDetail({ data, filmsData }) {
  return (
    <div className={`${styles['director-detail']} push-nav def-x bg-parchment`}>
      <Head>
        <title>SLUMBR PARTY | {data.title}</title>
        <meta name="description" content="Slumbr Party" />
      </Head>

      <div
        className={`${styles['director-title']} fixed top-0 left-0 w-full h-full pointer-events-none flex justify-center items-center`}
      >
        <h1 className={`enter-in-1 text-merlot level-1`}>{data.title}</h1>
      </div>

      <div className="pt-12 pb-40">
        {filmsData.length > 0 && (
          <div className='films grid grid-cols-12 gap-def mb-def'>
            {filmsData.map((film, index) => (
              <VideoBlock
                film={film}
                classes="enter-in-1 col-span-12 lg:col-span-6 relative"
                key={index}
                href={`/directors/${data.slug}/film/${film.slug}`}
                style={{
                  animationDelay: `${2000 + (100 * (index + 1))}ms`
                }}
              />
            ))}
          </div>
        )}

        <div className="info">
          {data.bio && (
            <div 
              className="w-full lg:w-5/12 level-body text-merlot mb-60" 
              dangerouslySetInnerHTML={{ __html: data.bio }}
            ></div>
          )}

          {data.instagramLink && data.instagramLinkTitle && (
            <Link 
              href={data.instagramLink} 
              className="level-subhead text-merlot"
            >{data.instagramLinkTitle}&nbsp;↗</Link>
          )}
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
        query: `page('Films').children.filterBy('directors', 'Directors/${slug}', ',')`,
        select: {
          title: true,
          slug: true,
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
      filmsData: filmsJsonData.result
    },
  }
}