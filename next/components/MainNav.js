// Components
import Link from 'next/link'
import { WordMark } from './icons/Icons'
import { Diamond } from './icons/Icons'

// Styles
import styles from './../styles/Globals.module.scss'

// React
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { useAppUpdate, useAppState } from '../context'

const MainNav = ({ links, setMenuOpen }) => {
  const router = useRouter()
  const [hovered, setHovered] = useState(false)
  const state = useAppState()
  const update = useAppUpdate()
  const [isLargeQuery, setIsLargeQuery] = useState(false)

  useEffect(() => {
    if (window !== undefined) {
      setIsLargeQuery(window.matchMedia('(min-width: 992px)').matches)
    }
  }, [])

  useEffect(() => {
    setHovered(false)

    if (router.pathname === '/') {
      update.setNavClass('transparent-parchment')
    } else if (router.pathname === '/directors/film/[slug]') {
      update.setNavClass('merlot')
    } else if (router.pathname === '/films/[slug]') {
      update.setNavClass('periwinkle')
    } else if (router.pathname === '/community') {
      update.setNavClass('coral')
    } else {
      update.setNavClass('transparent-merlot')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.pathname])

  const menuOn = () => {
    setMenuOpen(true)
    if (document !== undefined) {
      document.body.style.overflow = 'hidden'
    }
  }

  const handleMouseEnter = () => {
    if (isLargeQuery) {
      setHovered(true)
    }
  }

  const handleMouseLeave = () => {
    if (isLargeQuery) {
      setHovered(false)
    }
  }

  return (
    <header
      id={styles['main-nav']}
      onMouseEnter={() => handleMouseEnter()}
      onMouseLeave={() => handleMouseLeave()}
      className={`${styles[state.navClass]} ${hovered ? styles.hovered : null} fixed top-0 left-0 w-full flex justify-between items-center def-x`}
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
