import MainNav from '../MainNav'
import MainFooter from '../MainFooter'
import { Logo } from '../icons/Icons'

// React
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

// Styles
import styles from './../../styles/Globals.module.scss'

const Layout = ({ children }) => {
  const router = useRouter()
  const [cursorX, setCursorX] = useState(0)
  const [cursorY, setCursorY] = useState(0)

  useEffect(() => {
    document.addEventListener('mousemove', e => {
      setCursorX(e.clientX + 20)
      setCursorY(e.clientY + 20)
    })
  }, [])

  return (
    <>
      <MainNav />

      <main role="main">{children}</main>

      <MainFooter 
        data={children.props.footerData} 
        directors={children.props.directorsData}
      />

      <div
        className={styles['main-cursor']}
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