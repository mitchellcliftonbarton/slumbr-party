// React
import { useRouter } from 'next/router'

// Styles
import styles from './../styles/Globals.module.scss'

// Components
import Link from 'next/link'
import { XIcon } from './icons/Icons'

const MobileMenu = ({ links, menuOpen, setMenuOpen }) => {
  const router = useRouter()

  const closeMenu = () => {
    setMenuOpen(false)
    if (document !== undefined) {
      document.body.style.overflow = 'initial'
    }
  }

  return (
    <div 
      id={styles['mobile-menu']} 
      className={`${menuOpen ? styles.open : null} fixed top-0 left-0 w-full h-full p-def-mobile`}
    >
      <div className='relative w-full h-full flex flex-col items-center justify-center'>
        <button
          onClick={() => closeMenu()}
          className={`${styles.x} absolute top-5 right-5`}
        >
          <XIcon />
        </button>

        {links.map((link, index) => (
          <Link 
            href={link.link} 
            className={`${router.asPath === link.link ? styles.active : null} level-1 text-merlot`} 
            key={index}
          >{link.text}</Link>
        ))}

        <Link
          href={{
            pathname: router.pathname,
            query: {
              contact: true
            }
          }}
          scroll={false}
          className={`${router.asPath === '/contact' ? styles.active : null} level-1 text-merlot`}
        >Contact</Link>
      </div>
    </div>
  )
}

export default MobileMenu