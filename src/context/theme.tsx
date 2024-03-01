import { type PropsWithChildren } from "react"
import { defaultTheme } from "@adobe/react-spectrum"
import { Provider } from "@react-spectrum/provider"
import { useNavigate } from "react-router-dom"

// eslint-disable-next-line @typescript-eslint/ban-types
type ThemeProviderProps = PropsWithChildren<{}>

export function ThemeProvider({ children }: ThemeProviderProps) {
  const navigate = useNavigate()

  return (
    <Provider
      // force light mode. dark mode is stretch goal
      colorScheme="light"
      // we'll just use the default theme for now, can customize later
      theme={defaultTheme}
      // use react-router client-side navigation: see https://react-spectrum.adobe.com/react-spectrum/routing.html
      router={{ navigate }}
    >
      {children}
    </Provider>
  )
}