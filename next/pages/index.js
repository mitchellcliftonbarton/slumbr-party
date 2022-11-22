import Head from 'next/head'

// Components
import DefaultLayout from '../components/layouts/DefaultLayout'

// Styles
import styles from './../styles/Pages.module.scss'

export default function Home({ data }) {
  console.log(data)
  
  return (
    <div className={`${styles.home} push-nav def-x`}>
      <Head>
        <title>SLUMBR PARTY | Home</title>
        <meta name="description" content="Slumbr Party" />
      </Head>

      <div className={styles.hero}>
        <h1 className='level-1'>Home</h1>
      </div>
    </div>
  )
}

Home.getLayout = function getLayout(page) {
  return (
    <DefaultLayout>
      {page}
    </DefaultLayout>
  )
}

export async function getStaticProps() {
  const homeData = await fetch(process.env.API_HOST, {
      method: "POST",
      headers: {
        Authorization: `Basic ${process.env.AUTH}`,
      },
      body: JSON.stringify({
        query: "page('Home')",
      }),
  })

  const jsonData = await homeData.json()
  const { result } = jsonData

  return {
    props: {data: result},
  }
}