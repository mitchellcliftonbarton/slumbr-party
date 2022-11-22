import Head from 'next/head'

// Components
import DefaultLayout from '../../components/layouts/DefaultLayout'
import Link from 'next/link'

// Styles
import styles from './../../styles/Pages.module.scss'

export default function Directors({ data }) {
  console.log(data)
  
  return (
    <div className={`push-nav def-x bg-parchment`}>
      <Head>
        <title>SLUMBR PARTY | Directors</title>
        <meta name="description" content="Slumbr Party" />
      </Head>

      <h1 className='wcag-hidden'>Directors</h1>

      <div className="pt-32">
        {data.introText && data.introText !== '' && (
          <div 
            className="level-body text-merlot w-full lg:w-5/12" 
            dangerouslySetInnerHTML={{ __html: data.introText }}
          ></div>
        )}

        {data.directors.length > 0 && (
          <div className='directors py-60 text-center px-20'>
            {data.directors.map((director, index) => (
              <Link
                key={index}
                href={`/directors/${director.slug}`}
                className="level-1 text-merlot lg:hover:italic"
              >{director.title}{index !== data.directors.length - 1 ? ', ' : ''}</Link>
            ))}
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

  return {
    props: {data: result},
  }
}