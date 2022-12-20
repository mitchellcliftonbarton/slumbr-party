// Styles
import styles from './../styles/Globals.module.scss'

import { useEffect, useState } from 'react'
import Cookies from 'js-cookie'
import { Logo } from './icons/Icons'

const LoadOverlay = () => {
  const [showLoadOverlay, setShowLoadOverlay] = useState(false)

  useEffect(() => {
    if (!Cookies.get('slumbr-party-splash')) {
      setShowLoadOverlay(true)
      if (document !== undefined) {
        document.body.style.overflow = 'hidden'
      }

      setTimeout(() => {
        toggleOff()
      }, 3000)
    }
  }, [])

  const toggleOff = () => {
    setShowLoadOverlay(false)
    if (document !== undefined) {
      document.body.style.overflow = 'initial'
    }

    Cookies.set('slumbr-party-splash', 'true', { expires: .5 })
  }

  return (
    <div className={`${styles['load-overlay']} ${showLoadOverlay ? styles.open : null} fixed top-0 left-0 w-full h-full flex justify-center items-start bg-periwinkle`}>
      <Logo fill="#460223" />
    </div>
  )
}

export default LoadOverlay