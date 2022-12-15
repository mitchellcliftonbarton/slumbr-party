import { createContext, useContext } from 'react'

// GLOBAL STATE
const AppStateContext = createContext()
const AppUpdateContext = createContext()

export function AppWrapper({ children }) {
  const sharedState = {
    showLoadOverlay: false,
    showNav: false
  }

  const updateFns = {
    setShowLoadOverlay: (val) => {
      console.log('set', val)
      sharedState.showLoadOverlay = val
    },
    setShowNav: (val) => {
      sharedState.showNav = val
    }
  }

  return (
    <AppStateContext.Provider
      value={sharedState}
    >
      <AppUpdateContext.Provider
        value={updateFns}
      >
        {children}
      </AppUpdateContext.Provider>
    </AppStateContext.Provider>
  )
}

export function useAppState() {
  const state = useContext(AppStateContext)

  if (state === undefined) {
    throw new Error('useAppState must be used within a SiteContextProvider')
  }

  return state
}

export function useAppUpdate() {
  const state = useContext(AppUpdateContext)

  if (state === undefined) {
    throw new Error('useAppUpdate must be used within a SiteContextProvider')
  }

  return state
}