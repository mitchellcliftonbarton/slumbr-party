// Styles
import styles from './../styles/Globals.module.scss'

import { useEffect, useState } from 'react'
import Cookies from 'js-cookie'
import { useAppState, useAppUpdate } from '../context'

const LoadOverlay = () => {
  const state = useAppState()
  const update = useAppUpdate()

  const [hasTransition, setHasTransition] = useState(false)
  const [isLargeQuery, setIsLargeQuery] = useState(false)

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsLargeQuery(window.matchMedia( '(min-width: 992px)' ).matches)
    }

    if (!Cookies.get('slumbr-party-splash')) {
      update.setShowLoadOverlay(true)
    }
  }, [])

  const toggleOff = () => {
    setHasTransition(true)
    update.setShowLoadOverlay(false)
    update.setShowNav(true)

    console.log(state)
    Cookies.set('slumbr-party-splash', 'true', { expires: .5 })
  }

  if (state.showLoadOverlay) {
    // document.body.addEventListener('click', () => {
    //   if (state.showLoadOverlay) {
    //     toggleOff()
    //   }
    // })

    // window.addEventListener('scroll', () => {
    //   if (state.showLoadOverlay) {
    //     toggleOff()
    //   }
    // })

    setTimeout(() => {
      toggleOff()
    }, 4000)
  }

  return (
    <div
      className={`${styles['load-overlay']} ${state.showLoadOverlay ? styles.open : null} absolute top-0 left-0 w-full h-full flex justify-center items-start`}
      style={{
        transition: hasTransition ? 'opacity .6s' : 'none'
      }}
    >
      <svg 
        className='hidden lg:block'
        viewBox="0 0 1418 865" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        <g filter="url(#filter0_b_231_2731)">
          <path fillRule="evenodd" clipRule="evenodd" d="M0 20C0 8.95433 8.9543 0 20 0H1398C1409.05 0 1418 8.9543 1418 20V845C1418 856.046 1409.05 865 1398 865H20C8.9543 865 0 856.046 0 845V20ZM9.7166 585.76H9.48619V517.307C9.48619 498.155 16.7903 493.551 26.3641 493.551C37.6151 493.551 58.6623 499.429 81.8443 505.904L81.8447 505.904C110.031 513.776 141.373 522.53 162.101 522.671H163.357C198.104 522.671 219.267 508.368 219.267 480.521C219.267 460.598 202.643 448.854 181.744 448.854C170.915 448.854 159.336 452.944 147.24 460.095L125.834 472.61C113.495 479.762 96.871 484.611 81.0069 484.611C35.6728 484.611 8.23043 456.508 8.23043 408.75C8.23043 360.991 44.7397 332.888 87.5507 332.888C111.479 332.888 135.396 339.268 156.548 348.219L180.465 358.175C183.25 359.306 185.984 360.453 188.651 361.573C200.462 366.531 210.984 370.947 218.991 370.947C230.581 370.947 236.364 363.282 236.364 353.069C236.364 345.917 234.348 341.068 230.316 333.145L230.823 332.888C246.433 354.857 256.26 372.478 256.26 389.34V392.402C254.498 412.84 240.396 427.142 221.756 427.142C213.634 427.142 197.579 422.052 179.525 416.328L179.525 416.327C156.141 408.913 129.406 400.436 112.217 400.582C78.7258 400.839 58.5761 413.868 58.5761 440.686C58.5761 463.169 75.6959 476.7 95.3387 476.7C105.166 476.7 115.489 473.639 125.558 467.761L152.505 451.927C169.878 441.714 184.486 438.384 197.078 438.384C232.585 438.384 257.516 462.14 257.516 502.747C257.516 554.338 217.47 585.76 166.099 585.76C145.793 585.76 119.741 576.829 95.6446 568.569C74.9141 561.462 55.6313 554.852 42.7005 554.852C20.788 554.852 11.7212 567.367 9.7166 585.76ZM143.035 778.581C140.27 778.581 135.235 776.793 128.691 773.731V773.72C140.016 754.065 147.562 728.041 147.562 699.447C147.562 643.042 112.078 600.413 63.7604 600.413C42.8733 600.413 20.9839 608.067 9.15207 618.28V707.615H9.65899C25.765 683.625 51.9286 672.138 79.6129 672.138C115.097 672.138 134.728 697.414 134.728 732.634C134.728 744.378 131.456 758.926 124.659 771.686C112.632 765.875 96.8165 757.003 81.0632 748.165C54.6241 733.333 28.3604 718.599 20.477 718.599C12.1705 718.599 9.15207 723.192 9.15207 731.862V822.226C9.15207 839.333 15.4424 850.563 29.5323 850.563C50.9263 850.563 79.1175 833.467 95.9724 814.829C113.588 824.528 133.472 837.031 155.869 851.836H156.376V749.998C165.442 779.597 187.332 796.448 209.728 796.448C238.161 796.448 255.777 776.793 255.777 726.253V694.095C255.777 643.556 193.369 613.174 153.104 599.14H152.597V764.546C152.597 773.731 150.834 778.581 143.035 778.581ZM92.1936 812.784C80.1198 819.924 61.7442 824.013 41.1106 824.013V824.002C24.2558 824.002 12.9309 817.364 12.9309 805.118C12.9309 796.19 20.2235 790.827 30.2926 790.827C44.6359 790.827 65.2696 798.493 92.1936 812.784ZM251.986 726.253C251.986 738.254 243.438 745.908 215.5 745.908C186.56 745.908 156.364 730.086 156.364 692.822V675.971C195.869 683.882 251.986 699.202 251.986 726.253Z" fill="#6944FF"/>
        </g>
        <defs>
          <filter id="filter0_b_231_2731" x="-20" y="-20" width="1458" height="905" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
          <feFlood floodOpacity="0" result="BackgroundImageFix"/>
          <feGaussianBlur in="BackgroundImageFix" stdDeviation="10"/>
          <feComposite in2="SourceAlpha" operator="in" result="effect1_backgroundBlur_231_2731"/>
          <feBlend mode="normal" in="SourceGraphic" in2="effect1_backgroundBlur_231_2731" result="shape"/>
          </filter>
        </defs>
      </svg>

      <svg className="lg:hidden" viewBox="0 0 370 783" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g>
          <path fillRule="evenodd" clipRule="evenodd" d="M0 20C0 8.95431 8.9543 0 20 0H350C361.046 0 370 8.95431 370 20V763C370 774.046 361.046 783 350 783H20C8.95432 783 0 774.046 0 763V20ZM11.1604 594.336H11.0047V548.657C11.0047 535.876 15.9423 532.804 22.4141 532.804C30.0198 532.804 44.2477 536.727 59.9188 541.047C78.9727 546.3 100.16 552.142 114.173 552.236H115.021C138.51 552.236 152.817 542.691 152.817 524.109C152.817 510.814 141.579 502.978 127.451 502.978C120.13 502.978 112.303 505.707 104.126 510.479L89.6559 518.83C81.3149 523.603 70.0768 526.839 59.3527 526.839C28.7068 526.839 10.1558 508.085 10.1558 476.216C10.1558 444.346 34.836 425.593 63.7763 425.593C79.952 425.593 96.1199 429.85 110.419 435.823L126.587 442.467C128.468 443.221 130.315 443.986 132.117 444.733L132.12 444.734L132.121 444.734C140.105 448.043 147.217 450.99 152.63 450.99C160.465 450.99 164.374 445.875 164.374 439.059C164.374 434.287 163.011 431.051 160.285 425.764L160.628 425.593C171.181 440.252 177.824 452.011 177.824 463.264V465.307C176.632 478.945 167.1 488.489 154.499 488.489C149.009 488.489 138.156 485.092 125.952 481.273L125.951 481.272C110.144 476.325 92.0705 470.668 80.4504 470.765C57.8107 470.937 44.1894 479.631 44.1894 497.527C44.1894 512.53 55.7624 521.56 69.041 521.56C75.6842 521.56 82.6622 519.517 89.4689 515.594L107.685 505.028C119.429 498.213 129.305 495.991 137.817 495.991C161.82 495.991 178.673 511.844 178.673 538.941C178.673 573.368 151.602 594.336 116.875 594.336C103.148 594.336 85.5367 588.376 69.2477 582.864C55.2339 578.122 42.1987 573.711 33.4575 573.711C18.6447 573.711 12.5155 582.062 11.1604 594.336ZM101.283 723.007C99.4142 723.007 96.0109 721.814 91.5873 719.771V719.763C99.2429 706.647 104.344 689.281 104.344 670.2C104.344 632.561 80.357 604.114 47.694 604.114C33.5743 604.114 18.7771 609.222 10.7788 616.037V675.651H11.1215C22.0091 659.642 39.6957 651.977 58.4103 651.977C82.3974 651.977 95.6682 668.844 95.6682 692.346C95.6682 700.183 93.4564 709.891 88.8615 718.406C80.7313 714.528 70.04 708.607 59.3907 702.71C41.5179 692.813 23.7636 682.981 18.4344 682.981C12.8193 682.981 10.7788 686.045 10.7788 691.831V752.131C10.7788 763.547 15.0311 771.041 24.5558 771.041C39.0182 771.041 58.0754 759.633 69.4693 747.195C81.3772 753.667 94.8193 762.011 109.959 771.891H110.302V703.933C116.431 723.685 131.228 734.929 146.368 734.929C165.589 734.929 177.497 721.814 177.497 688.088V666.629C177.497 632.904 135.309 612.63 108.09 603.264H107.747V713.642C107.747 719.771 106.556 723.007 101.283 723.007ZM66.9148 745.831C58.753 750.595 46.3311 753.324 32.3828 753.324V753.317C20.9889 753.317 13.3333 748.887 13.3333 740.715C13.3333 734.758 18.2631 731.179 25.0698 731.179C34.7659 731.179 48.7142 736.294 66.9148 745.831ZM174.935 688.088C174.935 696.097 169.156 701.204 150.27 701.204C130.706 701.204 110.294 690.646 110.294 665.779V654.535C136.999 659.814 174.935 670.037 174.935 688.088Z" fill="#6944FF"/>
        </g>
      </svg>
    </div>
  )
}

export default LoadOverlay