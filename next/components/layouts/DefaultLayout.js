// React
import { useEffect, useState } from 'react'
// import { useRouter } from 'next/router'

// Styles
import styles from './../../styles/Globals.module.scss'

// Components
import MainNav from '../MainNav'
import MainFooter from '../MainFooter'
import MobileMenu from '../MobileMenu'
import { Logo } from '../icons/Icons'

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

const Layout = ({ children }) => {
  const [cursorX, setCursorX] = useState(0)
  const [cursorY, setCursorY] = useState(0)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    document.addEventListener('mousemove', e => {
      setCursorX(e.clientX + 20)
      setCursorY(e.clientY + 20)
    })
  }, [])

  return (
    <>
      <MainNav 
        links={links} 
        menuOpen={menuOpen}
        setMenuOpen={setMenuOpen}
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

      <div
        className={`${styles['main-cursor']} hidden lg:block`}
        style={{
          transform: `translate3d(${cursorX}px, ${cursorY}px, 0px)`
        }}
      >
        <Logo />
      </div>
    </>
  )
}

export default Layout