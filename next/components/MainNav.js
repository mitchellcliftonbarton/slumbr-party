// Components
import Link from 'next/link'
import { WordMark } from './icons/Icons'

// Styles
import styles from './../styles/Globals.module.scss'

// React
import { useRouter } from 'next/router'

const links = [
  {
    text: 'Directors',
    link: '/directors'
  },
  {
    text: 'Films',
    link: '/films'
  },
  {
    text: 'Community',
    link: '/community'
  },
  {
    text: 'About',
    link: '/about'
  },
  {
    text: 'Contact',
    link: '/contact'
  },
]

const MainNav = () => {
  const router = useRouter()

  let navClass = styles.default

  if (router.pathname === '/directors' || router.pathname === '/directors/[slug]' || router.pathname === '/films' || router.pathname === '/films/[slug]' || router.pathname === '/') {
    navClass = styles.merlot
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

      <div className={`${styles.links} flex items-center`}>
        {links.map((link, index) => (
          <Link 
            href={link.link} 
            className="level-subhead" 
            key={index}
          >◊ {link.text}</Link>
        ))}
      </div>
    </header>
  )
}

export default MainNav