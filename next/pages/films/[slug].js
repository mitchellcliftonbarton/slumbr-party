import Head from 'next/head'

// Components
import DefaultLayout from '../../components/layouts/DefaultLayout'
import Link from 'next/link'
import DefImage from '../../components/DefImage'

// Styles
// import styles from './../../styles/Pages.module.scss'

export default function FilmDetail({ data }) {
  
  return (
    <div className={`push-nav def-x bg-periwinkle`}>
      <Head>
        <title>SLUMBR PARTY | Film - {data.title}</title>
        <meta name="description" content="Slumbr Party" />
      </Head>

      <div className="pt-12 pb-60">
        <h1 className='level-1 text-merlot'>{data.title}</h1>
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
          title: true
        }
      }),
  })

  const jsonData = await directorData.json()
  const { result } = jsonData

  return {
    props: {
      data: result
    },
  }
}