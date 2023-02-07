import Head from 'next/head'
import { useState } from 'react'
import { motion, AnimatePresence } from "framer-motion"
import { format } from 'date-fns'
import { defaultCurve } from '../../lib/consts'

// Styles
import styles from './../../styles/Pages.module.scss'

// Components
import DefaultLayout from '../../components/layouts/DefaultLayout'
import Link from 'next/link'
import { Logo, XIcon } from '../../components/icons/Icons'
import DefImage from '../../components/DefImage'

export default function Community({ data }) {
  const [modalOpen, setModalOpen] = useState(false)

  const toggleModal = () => {
    if (modalOpen) {
      setModalOpen(false)
      
      if (document !== undefined) {
        document.body.style.overflow = 'initial'
      }
    } else {
      setModalOpen(true)
      
      if (document !== undefined) {
        document.body.style.overflow = 'hidden'
      }
    }
  }
  
  return (
    <div className={`${styles.community} bg-coral`}>
      <Head>
        <title>SLMBR PRTY | Community</title>
        <meta name="description" content="SLMBR PRTY is a women-founded and led production company devoted to craft and intent on transcending tradition." />
      </Head>

      <h1 className="wcag-hidden">Community</h1>

      <div className="min-h-screen push-nav def-x">
        {data.mainText && (
          <div 
            className="enter-in-1 level-1 text-merlot text-center pt-32 pb-40 rich-text" 
            dangerouslySetInnerHTML={{ __html: data.mainText }}
          ></div>
        )}

        <div className="links text-center flex flex-col items-center pb-60">
          <button
            onClick={() => toggleModal()}
            className='enter-in-1 delay-100 level-1 text-merlot lg:hover:italic'
          >Upcoming Events →</button>
          <Link 
            href="/community/archive" 
            className='enter-in-1 delay-200 level-1 text-merlot lg:hover:italic'
          >Community Archive →</Link>
        </div>
      </div>

      <AnimatePresence>
        {modalOpen && (
          <motion.div
            key="modal-div"
            initial={{
              opacity: 0,
              y: 20
            }}
            animate={{
              opacity: 1,
              y: 0
            }}
            exit={{
              opacity: 0,
              y: -20
            }}
            transition={{
              duration: 1,
              ease: defaultCurve
            }}
            className={`${styles['modal-container']} fixed top-0 left-0 w-full h-full flex justify-center items-center p-4 lg:p-def`}
          >
            <div
              onClick={() => toggleModal()}
              className="cursor-pointer closer absolute top-0 left-0 w-full h-full"
            ></div>

            <div className="modal relative w-full lg:w-1/2 max-w-6xl bg-merlot border-radius-def h-full z-10 px-4 lg:px-5 py-4 grid grid-cols-6 gap-def">
              <button
                onClick={() => toggleModal()}
                className={`${styles['modal-x']} absolute top-6 right-6 z-10`}
              >
                <XIcon/>
              </button>

              {(() => {
                if (data.upcomingEvent) {
                  return (
                    <div className="col-span-6 h-full flex flex-col justify-between items-center text-center def-x relative overflow-y-auto">
                      <p className="absolute top-3 left-0 upright text-parchment level-subhead">Upcoming Event</p>

                      <div className="top flex flex-col items-center w-full">
                        {data.upcomingEvent.eventType && (
                          <p className="level-3 text-parchment mb-32">{data.upcomingEvent.eventType}</p>
                        )}

                        {data.upcomingEvent.title && (
                          <h2 className="level-2 text-white mb-32">{data.upcomingEvent.title}</h2>
                        )}

                        {data.upcomingEvent.posterImage && data.upcomingEvent.posterImage.url && (
                          <div className="image w-3/4 lg:w-2/3 border-radius-def border-coral border p-def-mobile mb-20">
                            <DefImage
                              src={data.upcomingEvent.posterImage.url}
                              alt={data.upcomingEvent.posterImage.alt}
                              width={data.upcomingEvent.posterImage.width}
                              height={data.upcomingEvent.posterImage.height}
                              className="border-radius-def overflow-hidden w-full"
                            />
                          </div>
                        )}
                      </div>

                      <div className="bottom text-center pb-20">
                        {data.upcomingEvent.date && (
                          <p className="level-3 text-white">{format(new Date(data.upcomingEvent.date), 'LLLL do, y')}</p>
                        )}

                        {data.upcomingEvent.location && (
                          <p className="level-3 text-white">{data.upcomingEvent.location}</p>
                        )}

                        {data.upcomingEvent.time && (
                          <p className="level-3 text-white">{data.upcomingEvent.time}</p>
                        )}

                        {data.upcomingEvent.rsvpLink && (
                          <Link 
                            href={data.upcomingEvent.rsvpLink} 
                            target="_blank"
                            rel="noreferrer"
                            className="level-3 text-white"
                          >RSVP</Link>
                        )}
                      </div>
                    </div>
                  )
                } else {
                  return (
                    <>
                      <div className="col-span-1 h-full display flex flex-col justify-between items-start">
                        <p className='upright text-parchment level-subhead'>Stay tuned</p>
                        
                        <Logo className="w-full" fill="#FFF" />
                      </div>

                      <div className="col-span-5 flex flex-col justify-between">
                        <div 
                          className="level-3 text-white pr-12 lg:pr-16 pb-16 flex-0-0" 
                          dangerouslySetInnerHTML={{ __html: data.noUpcomingEventText }}
                        ></div>

                        <div className={`${styles['no-event-image']} w-full h-full overflow-hidden border-radius-def flex-1 relative`}>
                          <div className="absolute top-0 left-0 w-full h-full">
                            <DefImage
                              src={data.noUpcomingEventImage.url}
                              alt={data.noUpcomingEventImage.alt}
                              className="object-cover w-full h-full"
                              width={data.noUpcomingEventImage.width}
                              height={data.noUpcomingEventImage.height}
                            />
                          </div>
                        </div>
                      </div>
                    </>
                  )
                }
              })()}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
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
        select: {
          mainText: "page.main_text.markdown",
          upcomingEvent: {
            query: "page.upcoming_event.toPage",
            select: {
              title: true,
              eventType: "page.event_type",
              posterImage: {
                query: "page.poster_image.toFiles.first",
                select: {
                  url: true,
                  alt: true,
                  width: true,
                  height: true
                }
              },
              date: true,
              location: true,
              time: true,
              rsvpLink: "page.rsvp_link"
            }
          },
          noUpcomingEventText: "page.no_upcoming_event_text.markdown",
          noUpcomingEventImage: {
            query: "page.no_upcoming_event_image.toFiles.first",
            select: {
              url: true,
              alt: true,
              width: true,
              height: true
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