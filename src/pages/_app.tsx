import '@fortawesome/fontawesome-svg-core/styles.css'
import React from 'react'
import { AppProps } from 'next/app'
import { ThemeProvider } from 'styled-components'

import { config } from '@fortawesome/fontawesome-svg-core'

import GlobalStyle from '../styles/global'
import theme from '../styles/theme'

config.autoAddCss = false

const MyApp: React.FC<AppProps> = ({ Component, pageProps }) => {
  return (
    <ThemeProvider theme={theme}>
      <Component {...pageProps} />
      <GlobalStyle />
    </ThemeProvider>
  )
}

export default MyApp
