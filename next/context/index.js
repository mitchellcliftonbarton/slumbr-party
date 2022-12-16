import { createContext, useContext, useState } from 'react'

// GLOBAL STATE
const AppStateContext = createContext()
const AppUpdateContext = createContext()

export function AppWrapper({ children }) {
  const [sharedState, setSharedState] = useState({
    navClass: 'transparent-parchment'
  })

  const updateFns = {
    setNavClass: (val) => {
      const newObj = {
        navClass: val
      }

      setSharedState(newObj)
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