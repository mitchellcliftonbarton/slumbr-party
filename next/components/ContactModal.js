// Styles
import Link from 'next/link'
import styles from './../styles/Globals.module.scss'
import pageStyles from './../styles/Pages.module.scss'
import { XIcon, Diamond, Logo } from './icons/Icons'
import { useRouter } from 'next/router'

const ContactModal = ({ data, contactModalOpen }) => {
  const router = useRouter()

  const getBackPath = () => {
    return router.asPath.replace('?contact=true', '')
  }

  return (
    <div className={`${styles['contact-modal-container']} ${contactModalOpen ? styles.open : null} fixed top-0 left-0 w-full h-full p-4`}>
      <Link
        href={{
          pathname: getBackPath()
        }}
        scroll={false}
        className={`absolute top-0 left-0 w-full h-full`}
      ></Link>

      <div className={`${styles['contact-modal']} bg-periwinkle border-radius-def relative overflow-hidden`}>
        <Link
          className={styles['contact-modal-x']}
          scroll={false}
          href={{
            pathname: getBackPath()
          }}
        >
          <XIcon />
        </Link>

        <div className="inner relative def-x">
          <div className="grid grid-cols-6 gap-def">
            <div className='col-span-1'>
              <h1 className={`${styles['contact-modal-title']} level-subhead text-merlot upright pb-def`}>Contact</h1>
            </div>

            <div className="col-span-4 pt-40 pb-20 lg:py-48">
              {data.contactPeopleItems.length > 0 && (
                <div className="people">
                  {data.contactPeopleItems.map((item, index) => (
                    <div className="item level-subhead text-merlot text-center mb-6 lg:mb-10" key={index}>
                      <h2 className='uppercase'>{item.name}</h2>
                      <p>{item.title}</p>
                      <Link href={`mailto:${item.email}`}>{item.email}</Link>
                    </div>
                  ))}
                </div>
              )}

              {data.contactPeopleItems.length > 0 && data.contactLocationItems.length > 0 && (
                <div className={`${pageStyles['contact-diamond']} flex justify-center pt-4 lg:pt-6 pb-8 lg:pb-12`}>
                  <Diamond />
                </div>
              )}

              {data.contactLocationItems.length > 0 && (
                <div className="people">
                  {data.contactLocationItems.map((item, index) => (
                    <div className="item level-subhead text-merlot text-center mb-6 lg:mb-10" key={index}>
                      <h2 className='uppercase'>{item.name}</h2>
                      <p>{item.title}</p>
                      <Link href={`mailto:${item.email}`}>{item.email}</Link>
                    </div>
                  ))}
                </div>
              )}

              <div className={`${pageStyles['contact-logo']} flex lg:hidden justify-center mt-32`}>
                <Logo fill="#460223" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ContactModal