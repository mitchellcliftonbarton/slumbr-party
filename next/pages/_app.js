import '../styles/index.scss'

// MyApp
function MyApp({ Component, pageProps, footerData, directorsData, contactData }) {
  const getLayout = Component.getLayout || ((page) => page)

  return getLayout(
    <Component
      {...pageProps}
      footerData={footerData}
      directorsData={directorsData}
      contactData={contactData}
    />
  )
}

MyApp.getInitialProps = async () => {
  /* GET FOOTER DATA */
  const footerData = await fetch(process.env.API_HOST, {
    cache: 'no-store',
    method: 'POST',
    headers: {
      Authorization: `Basic ${process.env.AUTH}`,
    },
    body: JSON.stringify({
      query: 'site',
      select: {
        contactEmail: 'site.contact_email',
        footerIntroText: 'site.footer_intro_text.markdown',
        footerCommunityLinks: {
          query: 'site.footer_community_links.toStructure',
          select: {
            title: true,
            link: true,
          },
        },
      },
    }),
  })

  const footerJson = await footerData.json()

  /* GET DIRECTORS */

  const directorsData = await fetch(process.env.API_HOST, {
    cache: 'no-store',
    method: 'POST',
    headers: {
      Authorization: `Basic ${process.env.AUTH}`,
    },
    body: JSON.stringify({
      query: "page('Directors').children.listed",
      select: {
        slug: true,
        title: true,
      },
    }),
  })

  const directorsJson = await directorsData.json()

  /* GET CONTACT DATA */

  const contactData = await fetch(process.env.API_HOST, {
    cache: 'no-store',
    method: 'POST',
    headers: {
      Authorization: `Basic ${process.env.AUTH}`,
    },
    body: JSON.stringify({
      query: "page('Contact')",
      select: {
        contactText: 'page.contact_text.kirbyText',
        contactPeopleItems: {
          query: 'page.contact_people_items.toStructure',
          select: {
            name: true,
            title: true,
            email: true,
          },
        },
        contactLocationItems: {
          query: 'page.contact_location_items.toStructure',
          select: {
            name: true,
            people: {
              query: 'structureItem.people.toStructure',
              select: {
                title: true,
                email: true,
                phone: true,
              },
            },
          },
        },
      },
    }),
  })

  const contactJson = await contactData.json()

  return {
    footerData: footerJson.result,
    directorsData: directorsJson.result,
    contactData: contactJson.result,
  }
}

export default MyApp
