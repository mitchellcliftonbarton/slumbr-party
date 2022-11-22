import '../styles/index.scss'

// MyApp
function MyApp({ Component, pageProps, footerData, directorsData }) {
  const getLayout = Component.getLayout || ((page) => page)

  return getLayout(<Component {...pageProps} footerData={footerData} directorsData={directorsData} />)
}

MyApp.getInitialProps = async () => {
  /* GET FOOTER DATA */

  const footerData = await fetch(process.env.API_HOST, {
    method: "POST",
    headers: {
      Authorization: `Basic ${process.env.AUTH}`,
    },
    body: JSON.stringify({
      query: "site",
      select: {
        contactEmail: "site.contact_email",
        footerIntroText: "site.footer_intro_text.markdown",
        footerCommunityLinks: {
          query: "site.footer_community_links.toStructure",
          select: {
            title: true,
            link: true
          }
        }
      }
    }),
  })

  const footerJson = await footerData.json()


  /* GET DIRECTORS */

  const directorsData = await fetch(process.env.API_HOST, {
    method: "POST",
    headers: {
      Authorization: `Basic ${process.env.AUTH}`,
    },
    body: JSON.stringify({
      query: "page('Directors').children",
      select: {
        slug: true,
        title: true
      }
    }),
  })

  const directorsJson = await directorsData.json()
  
  return {
    footerData: footerJson.result,
    directorsData: directorsJson.result,
  }
}

export default MyApp
