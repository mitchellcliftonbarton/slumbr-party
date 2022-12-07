import Head from 'next/head'
import { Swiper, SwiperSlide } from 'swiper/react'

// Components
import DefaultLayout from '../../components/layouts/DefaultLayout'
import DefImage from '../../components/DefImage'

// Styles
import styles from './../../styles/Pages.module.scss'
import 'swiper/css'

export default function CommunityArchive({ data }) {
  return (
    <div className={`push-nav bg-parchment`}>
      <Head>
        <title>SLUMBR PARTY | Community Archive</title>
        <meta name="description" content="Slumbr Party" />
      </Head>

      <h1 className='wcag-hidden'>Community Archive</h1>

      <div className="pt-32 pb-def">
        {data.archiveDescription && data.archiveDescription !== '' && (
          <div 
            className="enter-in-1 level-body text-merlot w-full lg:w-5/12 pb-def def-x" 
            dangerouslySetInnerHTML={{ __html: data.archiveDescription }}
          ></div>
        )}

        {data.items.length > 0 && (
          <div className="events">
            {data.items.map((item, index) => (
              <div 
                className={`${styles['event-detail-item']} w-full grid grid-cols-12 gap-def py-def`} 
                key={index}
              >
                <div className={`${styles['event-border']} col-span-12 def-x`}>
                  <div className='w-full'></div>
                </div>

                <div
                  className="enter-in-1 col-span-12 lg:col-span-5 px-def-mobile lg:pl-def lg:pr-20"
                  style={{
                    animationDelay: `${(index + 1) * 100}ms`
                  }}
                >
                  <h2 className="level-3 text-merlot mb-12">{item.title}</h2>

                  {item.description && (
                    <div 
                      className="text-merlot level-body mb-12" 
                      dangerouslySetInnerHTML={{ __html: item.description }}
                    ></div>
                  )}
                </div>

                <div
                  className={`${styles['event-slider']} enter-in-1 col-span-12 lg:col-span-7 h-full`}
                  style={{
                    animationDelay: `${(index + 2) * 100}ms`
                  }}
                >
                  <Swiper
                    className={`${styles['community-slider']} h-full`}
                    spaceBetween={10}
                    slidesPerView={"auto"}
                    loop
                    slideToClickedSlide
                  >
                    {item.galleryImages.map((image, index) => (
                      <SwiperSlide
                        key={index}
                        className={styles['community-slide']}
                      >
                        <DefImage
                          src={image.url}
                          alt={image.alt}
                          width={image.width}
                          height={image.height}
                        />
                      </SwiperSlide>
                    ))}
                  </Swiper>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

CommunityArchive.getLayout = function getLayout(page) {
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
        select: {
          archiveDescription: "page.archive_description.markdown",
          items: {
            query: "page.children",
            select: {
              title: true,
              eventType: "page.event_type",
              description: "page.description.markdown",
              galleryImages: {
                query: "page.gallery_images.toFiles",
                select: {
                  url: true,
                  alt: true,
                  width: true,
                  height: true
                }
              }
            }
          }
        }
      }),
  })

  const jsonData = await communityData.json()
  const { result } = jsonData

  return {
    props: {data: result},
  }
}