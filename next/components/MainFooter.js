// Components
import Link from 'next/link'
import { Logo } from './icons/Icons'

// Styles
import styles from './../styles/Globals.module.scss'

const MainFooter = ({ data, directors }) => {
  return (
    <footer 
      id={styles.footer} 
      className="def-padding bg-merlot"
    >
      <div className={`${styles.top} flex justify-between items-start`}>
        {data.footerIntroText && (
          <div 
            className="w-full lg:w-1/2 level-3" 
            dangerouslySetInnerHTML={{ __html: data.footerIntroText }}
          ></div>
        )}

        <div className="w-full lg:w-1/3">
          {directors.length > 0 && (
            <div className="flex items-start mb-12">
              <h3 className="level-subhead uppercase w-1/4">Directors</h3>
              <nav className="w-3/4">
                <ul>
                  {directors.map((director, index) => (
                    <li key={index} className="mb-1">
                      <Link 
                        href={`/directors/${director.slug}`} 
                        className="level-subhead"
                      >◊ {director.title}</Link>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
          )}

          {data.footerCommunityLinks.length > 0 && (
            <div className="flex items-start mb-12">
              <h3 className="level-subhead uppercase w-1/4">Community</h3>
              <nav className="w-3/4">
                <ul>
                  {data.footerCommunityLinks.map((link, index) => (
                    <li key={index} className="mb-1">
                      <Link 
                        href={link.link} 
                        className="level-subhead"
                        target="_blank"
                        rel="noreferrer"
                      >◊ {link.title}</Link>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
          )}

          {data.contactEmail && (
            <div className="flex items-start">
              <h3 className="level-subhead uppercase w-1/4">Inquiries</h3>
              <nav className="w-3/4">
                <ul>
                  <li className="mb-1">
                    <Link 
                      href={`mailto:${data.contactEmail}`} 
                      className="level-subhead"
                    >◊ {data.contactEmail}</Link>
                  </li>
                </ul>
              </nav>
            </div>
          )}
        </div>
      </div>

      <div className="bottom flex justify-between items-end">
        <Link 
          href="/" 
          className={styles.logo}
        >
          <Logo />
        </Link>

        <p className="level-subhead">{new Date().getFullYear()} SLMBR PRTY, All Rights Reserved. Terms.</p>
      </div>
    </footer>
  )
}

export default MainFooter