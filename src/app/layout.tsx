import * as React from 'react'
import {AppRouterCacheProvider} from '@mui/material-nextjs/v14-appRouter'
import {ThemeProvider} from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import theme from '@/theme'
import {Toaster} from 'sonner'
import '@/styles/globals.css'
import SessionProvider from '@/contexts/SessionProvider'
import {SiteProvider} from '@/contexts/SiteContext'

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <SiteProvider>
      <html lang='en'>
        <body>
          <SessionProvider>
            <AppRouterCacheProvider options={{enableCssLayer: true}}>
              <ThemeProvider theme={theme}>
                <CssBaseline/>
                {props.children}
              </ThemeProvider>
            </AppRouterCacheProvider>
          </SessionProvider>
          <Toaster
            closeButton
            richColors
          />
        </body>
      </html>
    </SiteProvider>
  )
}
