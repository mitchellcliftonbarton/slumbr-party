import Head from 'next/head'

// Components
import DefaultLayout from '../components/layouts/DefaultLayout'

// Styles
import styles from './../styles/Pages.module.scss'

export default function Contact({ data }) {
  console.log(data)
  
  return (
    <div className={`${styles.contact} push-nav def-x`}>
      <Head>
        <title>SLUMBR PARTY | Contact</title>
        <meta name="description" content="Slumbr Party" />
      </Head>

      <div className={styles.hero}>
        <h1 className='level-1'>Contact</h1>
      </div>
    </div>
  )
}

Contact.getLayout = function getLayout(page) {
  return (
    <DefaultLayout>
      {page}
    </DefaultLayout>
  )
}

export async function getStaticProps() {
  const contactData = await fetch(process.env.API_HOST, {
      method: "POST",
      headers: {
        Authorization: `Basic ${process.env.AUTH}`,
      },
      body: JSON.stringify({
        query: "page('Contact')",
        select: {
          contactPeopleItems: {
            query: "page.contact_people_items.toStructure",
            select: {
              name: true,
              title: true,
              email: true
            }
          },
          contactLocationItems: {
            query: "page.contact_location_items.toStructure",
            select: {
              name: true,
              title: true,
              email: true
            }
          }
        }
      }),
  })

  const jsonData = await contactData.json()
  const { result } = jsonData

  return {
    props: {data: result},
  }
}