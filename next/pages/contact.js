import Head from 'next/head'

// Components
import DefaultLayout from '../components/layouts/DefaultLayout'
import Link from 'next/link'

// Styles
import styles from './../styles/Pages.module.scss'
import { Diamond, Logo } from '../components/icons/Icons'

export default function Contact({ data }) {
  return (
    <div className={`${styles.contact} push-nav def-x bg-periwinkle min-h-screen relative`}>
      <Head>
        <title>SLUMBR PARTY | Contact</title>
        <meta name="description" content="Slumbr Party" />
      </Head>

      <div className="relative py-40 grid grid-cols-6 gap-def">
        <div className='col-span-1'>
          <h1 className={`${styles['contact-h1']} level-subhead text-merlot upright pb-def`}>Contact</h1>
        </div>

        <div className="col-span-4">
          {data.contactPeopleItems.length > 0 && (
            <div className="people">
              {data.contactPeopleItems.map((item, index) => (
                <div className="item level-subhead text-merlot text-center mb-10" key={index}>
                  <h2 className='uppercase'>{item.name}</h2>
                  <p>{item.title}</p>
                  <Link href={`mailto:${item.email}`}>{item.email}</Link>
                </div>
              ))}
            </div>
          )}

          {data.contactPeopleItems.length > 0 && data.contactLocationItems.length > 0 && (
            <div className={`${styles['contact-diamond']} flex justify-center pt-6 pb-12`}>
              <Diamond />
            </div>
          )}

          {data.contactLocationItems.length > 0 && (
            <div className="people">
              {data.contactLocationItems.map((item, index) => (
                <div className="item level-subhead text-merlot text-center mb-10" key={index}>
                  <h2 className='uppercase'>{item.name}</h2>
                  <p>{item.title}</p>
                  <Link href={`mailto:${item.email}`}>{item.email}</Link>
                </div>
              ))}
            </div>
          )}

          <div className={`${styles['contact-logo']} flex justify-center mt-32`}>
            <Logo fill="#460223" />
          </div>
        </div>
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