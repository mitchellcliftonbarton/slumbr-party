// Components
import Link from 'next/link'
import { Diamond, Logo } from './icons/Icons'

// Styles
import styles from './../styles/Globals.module.scss'

const MainFooter = ({ data, directors }) => {
  return (
    <footer
      id={styles.footer}
      className="main-footer pt-24 def-x pb-def-mobile lg:pb-def bg-merlot flex flex-col justify-between"
    >
      <div className={`${styles.top} flex flex-wrap lg:flex-nowrap justify-between items-start`}>
        {data.footerIntroText && (
          <div
            className="w-full lg:w-1/2 level-3 mb-40 lg:mb-0 rich-text"
            dangerouslySetInnerHTML={{ __html: data.footerIntroText }}
          ></div>
        )}

        <div className="w-full lg:w-1/3">
          {data.footerCommunityLinks.length > 0 && (
            <div className="flex items-start mb-12">
              <h3 className="level-subhead uppercase w-1/3 lg:w-1/4">Archives</h3>
              <nav className="w-2/3 lg:w-3/4">
                <ul>
                  {data.footerCommunityLinks.map((link, index) => (
                    <li key={index}>
                      <Link
                        href={link.link}
                        className={`${styles['footer-link']} level-subhead pb-1`}
                        target="_blank"
                        rel="noreferrer"
                      >
                        <Diamond />
                        <span>{link.title}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
          )}
        </div>
      </div>

      <div className="bottom flex justify-between items-end">
        <div className="w-1/3 lg:w-auto">
          <Link
            href="/"
            className={`${styles.logo}`}
          >
            <Logo />
          </Link>
        </div>

        <p className="level-subhead w-2/3 lg:w-auto">
          {new Date().getFullYear()} SLMBR PRTY, All Rights Reserved. Terms.
        </p>
      </div>
    </footer>
  )
}

export default MainFooter
