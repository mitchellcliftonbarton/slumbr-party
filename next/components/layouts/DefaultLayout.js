import Cookies from 'js-cookie'

// React
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { AppWrapper } from '../../context'

// Styles
import styles from './../../styles/Globals.module.scss'

// Components
import MainNav from '../MainNav'
import MainFooter from '../MainFooter'
import MobileMenu from '../MobileMenu'
import { Logo } from '../icons/Icons'
import ContactModal from '../ContactModal'

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
]

const Layout = ({ children }) => {
  const router = useRouter()

  const [cursorX, setCursorX] = useState(0)
  const [cursorY, setCursorY] = useState(0)
  const [showCursor, setShowCursor] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [contactModalOpen, setContactModalOpen] = useState(false)
  const [cursorFill, setCursorFill] = useState('#6944FF')
  const [bodyClass, setBodyClass] = useState(false)

  useEffect(() => {
    document.addEventListener('mousemove', e => {
      setCursorX(e.clientX + 40)
      setCursorY(e.clientY + 40)
    })

    document.addEventListener('mouseenter', () => {
      if (!showCursor && router.pathname !== '/films/[slug]' && router.pathname !== '/directors/film/[slug]') {
        setShowCursor(true)
      }
    })

    document.addEventListener('mouseleave', () => {
      setShowCursor(false)
    })
  }, [])

  useEffect(() => {
    if (router.query.contact && router.query.contact === 'true') {
      setContactModalOpen(true)

      if (document !== undefined) {
        document.body.style.overflow = 'hidden'
      }
    } else {
      if (contactModalOpen) {
        setContactModalOpen(false)

        if (document !== undefined) {
          document.body.style.overflow = 'initial'
        }
      }
    }

    if (router.pathname === '/films/[slug]' || router.pathname === '/directors/film/[slug]') {
      console.log('on film page')
      if (showCursor) setShowCursor(false)
    } else {
      if (!showCursor) setShowCursor(true)
    }

    // close mobile menu on route change
    setMenuOpen(false)
    if (Cookies.get('slumbr-party-splash') && router.pathname !== '/') {
      if (document !== undefined) {
        document.body.style.overflow = 'initial'
      }
    }
    
    if (router.pathname === '/films/[slug]' || router.query.contact) {
      setCursorFill('#FF4E00')
    } else {
      setCursorFill('#6944FF')
    } 
  }, [router.asPath])

  return (
    <AppWrapper>
      <div>
        <MainNav 
          links={links} 
          menuOpen={menuOpen}
          setMenuOpen={setMenuOpen}
          setContactModalOpen={setContactModalOpen}
        />

        <main role="main">{children}</main>

        <MainFooter 
          data={children.props.footerData} 
          directors={children.props.directorsData}
        />

        <MobileMenu
          links={links}
          menuOpen={menuOpen}
          setMenuOpen={setMenuOpen}
        />

        <ContactModal
          data={children.props.contactData}
          contactModalOpen={contactModalOpen}
          setContactModalOpen={setContactModalOpen}
        />

        <div
          className={`${styles['main-cursor']} hidden lg:block`}
          style={{
            transform: `translate3d(${cursorX}px, ${cursorY}px, 0px)`,
            opacity: showCursor ? 1 : 0
          }}
        >
          <Logo fill={cursorFill} />
        </div>
      </div>
    </AppWrapper>
  )
}

export default Layout