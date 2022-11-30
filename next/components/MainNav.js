// Components
import Link from 'next/link'
import { WordMark } from './icons/Icons'
import { Diamond } from './icons/Icons'

// Styles
import styles from './../styles/Globals.module.scss'

// React
import { useRouter } from 'next/router'

const MainNav = ({links, menuOpen, setMenuOpen}) => {
  const router = useRouter()

  let navClass = styles.merlot

  if (router.pathname === '/about') {
    navClass = styles.default
  }

  const menuOn = () => {
    setMenuOpen(true)
    if (document !== undefined) {
      document.body.style.overflow = 'hidden'
    }
  }

  return (
    <header 
      id={styles['main-nav']} 
      className={`${navClass} fixed top-0 left-0 w-full flex justify-between items-center def-x`}
    >
      <Link 
        href="/" 
        className={styles['home-link']}
      >
        <WordMark />
      </Link>

      <div className={`${styles.links} hidden lg:flex items-center`}>
        {links.map((link, index) => (
          <Link 
            href={link.link} 
            className={`${router.asPath === link.link ? styles.active : null} level-subhead`} 
            key={index}
          >
            <Diamond />
            <span>{link.text}</span>
          </Link>
        ))}
      </div>

      <button
        onClick={() => menuOn()}
        className={`${styles['mobile-button']} lg:hidden`}
      >
        <Diamond />
      </button>
    </header>
  )
}

export default MainNav