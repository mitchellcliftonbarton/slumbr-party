import Cookies from 'js-cookie'

// React
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

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
  const [showCursor, setShowCursor] = useState(true)
  const [menuOpen, setMenuOpen] = useState(false)
  const [showLoadOverlay, setShowLoadOverlay] = useState(false)
  const [contactModalOpen, setContactModalOpen] = useState(false)

  useEffect(() => {
    if (!Cookies.get('slumbr-party-splash')) {
      setShowLoadOverlay(true)
    }

    document.addEventListener('mousemove', e => {
      setCursorX(e.clientX + 20)
      setCursorY(e.clientY + 20)
    })

    document.addEventListener('mouseenter', e => {
      setShowCursor(true)
    })

    document.addEventListener('mouseleave', e => {
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

    // close mobile menu on route change
    setMenuOpen(false)
  }, [router.asPath])

  return (
    <>
      <MainNav 
        links={links} 
        menuOpen={menuOpen}
        setMenuOpen={setMenuOpen}
        showLoadOverlay={showLoadOverlay}
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
          opacity: showCursor ? '1' : 0
        }}
      >
        <Logo fill="#6944FF" />
      </div>
    </>
  )
}

export default Layout