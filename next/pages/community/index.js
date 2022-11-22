import Head from 'next/head'

// Components
import DefaultLayout from '../../components/layouts/DefaultLayout'

// Styles
import styles from './../../styles/Pages.module.scss'

export default function Community({ data }) {
  console.log(data)
  
  return (
    <div className={`${styles.community} push-nav def-x bg-coral`}>
      <Head>
        <title>SLUMBR PARTY | Community</title>
        <meta name="description" content="Slumbr Party" />
      </Head>

      <div className={styles.hero}>
        <h1 className='level-1'>Community</h1>
      </div>
    </div>
  )
}

Community.getLayout = function getLayout(page) {
  return (
    <DefaultLayout>
      {page}
    </DefaultLayout>
  )
}

export async function getStaticProps() {
  const communityData = await fetch(process.env.API_HOST, {
      method: "POST",
      headers: {
        Authorization: `Basic ${process.env.AUTH}`,
      },
      body: JSON.stringify({
        query: "page('Community')",
      }),
  })

  const jsonData = await communityData.json()
  const { result } = jsonData

  return {
    props: {data: result},
  }
}