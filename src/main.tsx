import React from 'react'
import ReactDOM from 'react-dom/client'
import { defaultTheme, Provider } from '@adobe/react-spectrum'

import App from '@/pages/app/app.tsx'

import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider
      // force light mode. dark mode is stretch goal
      colorScheme="light"
      // we'll just use the default theme for now, can customize later
      theme={defaultTheme}
    >
      <App />
    </Provider>
  </React.StrictMode>,
)
