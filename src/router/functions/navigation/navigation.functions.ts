// External Dependencies
import { CommonActions, StackActions } from '@react-navigation/routers'

// Internal Dependencies
import { navigationReference } from '../../router/scenes'

const navigation = {
  'push': (screenName: string, parameters?: object) => {
    navigationReference.dispatch({
      ...StackActions.push(screenName, parameters),
      source: screenName,
    })
  },
  
  'replace': (screenName: string, parameters?: object) => {
    navigationReference.dispatch({
      ...StackActions.replace(screenName, parameters),
      source: screenName,
    })
  },
  
  'reset': (screenName: string) => {
    navigationReference.dispatch(CommonActions.reset({
      index: 0,
      routes: [{ name: screenName }],
    }))
  },
  
  'pop': () => {
    navigationReference.dispatch(StackActions.pop(1))
  },
  
  'popToTop': () => {
    navigationReference.dispatch(StackActions.popToTop())
  },
  
  'popToIndex': (index: number) => {
    navigationReference.dispatch(StackActions.pop(index))
  },
  
  'popTo': (screenName: string, alternativeScreenName?: string) => {
    const state = navigationReference.current?.getState()
    const currentIndex = state.index
    let popCount = 0

    const index = state?.routes.findIndex((route, index) => {
      if (route.name === alternativeScreenName || route.name === screenName) {
        popCount = currentIndex - index
      }
  
      if (route.name === alternativeScreenName) return true
      else if (route.name === screenName) return true
    })

    if (index !== -1) {
      navigationReference.current?.dispatch(StackActions.pop(popCount))
    }
  },
  
  'getPreviousRoute': (position = 1) => {
    return navigationReference?.current?.getState()?.routes[navigationReference?.current?.getState()?.index - position]?.name
  },
  
  'getCurrentRoute': () => {
    return navigationReference?.current?.getCurrentRoute()?.name
  },
  
  /**
   * Determine whether or not props were passed as parameters to the component in the push, replace, or reset functions. 
   * @param props All the props that are available to the component.
   */
  'hasPassedProps': (props: any) => {
    return props?.route?.params !== undefined
  },

  /**
   * Returns the props that were passed as parameters to the component in the push, replace, or reset functions. 
   * @param props All the props that are available to the component.
   * @returns The parameters that were passed specifically as parameters to the component in the push, replace, or reset functions or an empty object.
   */
  'getPassedProps': (props: any) => {
    return props?.route?.params ?? props
  }
}

export default navigation
