import * as React from 'react'
import { PaletteMode } from '@mui/material'
import Box from '@mui/material/Box'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Button from '@mui/material/Button'
import Container from '@mui/material/Container'
import Divider from '@mui/material/Divider'
import Typography from '@mui/material/Typography'
import MenuItem from '@mui/material/MenuItem'
import Drawer from '@mui/material/Drawer'
import MenuIcon from '@mui/icons-material/Menu'
import ToggleColorMode from './ToggleColorMode'
import Link from 'next/link'
import { signIn, signOut, useSession } from 'next-auth/react'
import { PersonAddAlt, Login } from '@mui/icons-material'
import LinkBehaviour from '@/components/LinkBehaviour'
import { useSiteSetting } from '@/contexts/SiteContext'

interface AppAppBarProps {
  mode: PaletteMode
  toggleColorMode: () => void
}

function AppAppBar({ mode, toggleColorMode }: AppAppBarProps) {
  const { data: session, status } = useSession()
  const { siteSetting } = useSiteSetting()
  // Find the setting with settingName equal to 'site_name'
  // const siteNameSetting = siteSetting.find(setting => setting.settingName === 'site_name');
  
  // If siteNameSetting exists, use its settingValue, otherwise use a default value
  const siteName = siteSetting ? siteSetting.site_name : 'Default Site Name';
  const [open, setOpen] = React.useState(false)

  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen)
  }

  const scrollToSection = (sectionId: string) => {
    const sectionElement = document.getElementById(sectionId)
    const offset = 128
    if (sectionElement) {
      const targetScroll = sectionElement.offsetTop - offset
      sectionElement.scrollIntoView({ behavior: 'smooth' })
      window.scrollTo({
        top: targetScroll,
        behavior: 'smooth'
      })
      setOpen(false)
    }
  }

  return (
    <div>
      <AppBar
        position='fixed'
        sx={{
          boxShadow: 0,
          backgroundColor: 'transparent',
          backgroundImage: 'none',
          mt: 2
        }}
      >
        <Container maxWidth='xl'>
          <Toolbar
            variant='regular'
            sx={(theme) => ({
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexShrink: 0,
              borderRadius: '999px',
              backgroundColor:
                theme.palette.mode === 'light'
                  ? 'rgba(255, 255, 255, 0.4)'
                  : 'rgba(0, 0, 0, 0.4)',
              backdropFilter: 'blur(24px)',
              maxHeight: 40,
              border: '1px solid',
              borderColor: 'divider',
              boxShadow:
                theme.palette.mode === 'light'
                  ? '0 0 1px rgba(85, 166, 246, 0.1), 1px 1.5px 2px -1px rgba(85, 166, 246, 0.15), 4px 4px 12px -2.5px rgba(85, 166, 246, 0.15)'
                  : '0 0 1px rgba(2, 31, 59, 0.7), 1px 1.5px 2px -1px rgba(2, 31, 59, 0.65), 4px 4px 12px -2.5px rgba(2, 31, 59, 0.65)'
            })}
          >
            <Box
              sx={{
                flexGrow: 1,
                display: 'flex',
                alignItems: 'center',
                ml: '-18px',
                px: 0
              }}
            >
              <Link href='/' style={{ textDecoration:'none' }}>
                <Typography sx={{ fontWeight:550, fontSize:24, px:2, color:'#ee0033' }}>{siteName}</Typography>
              </Link>
              {/* <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
                <MenuItem
                  onClick={() => scrollToSection('features')}
                  sx={{ py: '6px', px: '12px' }}
                >
                  <Typography variant='body2' color='text.primary'>
                    Features
                  </Typography>
                </MenuItem>
                <MenuItem
                  onClick={() => scrollToSection('testimonials')}
                  sx={{ py: '6px', px: '12px' }}
                >
                  <Typography variant='body2' color='text.primary'>
                    Testimonials
                  </Typography>
                </MenuItem>
                <MenuItem
                  onClick={() => scrollToSection('highlights')}
                  sx={{ py: '6px', px: '12px' }}
                >
                  <Typography variant='body2' color='text.primary'>
                    Highlights
                  </Typography>
                </MenuItem>
                <MenuItem
                  onClick={() => scrollToSection('pricing')}
                  sx={{ py: '6px', px: '12px' }}
                >
                  <Typography variant='body2' color='text.primary'>
                    Pricing
                  </Typography>
                </MenuItem>
                <MenuItem
                  onClick={() => scrollToSection('faq')}
                  sx={{ py: '6px', px: '12px' }}
                >
                  <Typography variant='body2' color='text.primary'>
                    FAQ
                  </Typography>
                </MenuItem>
              </Box> */}
            </Box>
            <Box
              sx={{
                display: { xs: 'none', md: 'flex' },
                gap: 0.5,
                alignItems: 'center'
              }}
            >
              <div>
                {session ? (
                  <Button
                    startIcon={<Login fontSize='small' />}
                    variant='text'
                    color='primary'
                    className='mr-2 hover:shadow-lg'
                    onClick={() => signOut()}
                  >
                    Logout
                  </Button>
                ) : (
                  <Link
                    component={LinkBehaviour}
                    color="primary"
                    className="uppercase text-decoration-none"
                    href="/login"
                  >
                    <Button
                      startIcon={<Login fontSize="small" />}
                      variant="text"
                      color="primary"
                      className="mr-2 hover:shadow-lg"
                    >
                      Login
                    </Button>
                  </Link>
                )}
              </div>
              <div>
                <Button
                  startIcon={<PersonAddAlt fontSize='small' />}
                  variant='text'
                  color='primary'
                  className='uppercase mr-2 hover:shadow-lg'
                  href='/register'
                >
                  Register
                </Button>
              </div>
              <div>
                <Button
                  variant='text'
                  href='/app'
                  color='primary'
                >
                  To App
                </Button>
              </div>
              {/* <Link href={'/app'} style={{ textDecoration:'none', color:'white' }}>To App</Link> */}
            </Box>
            <Box sx={{ display: { sm: '', md: 'none' } }}>
              <Button
                variant='text'
                color='primary'
                aria-label='menu'
                onClick={toggleDrawer(true)}
                sx={{ minWidth: '30px', p: '4px' }}
              >
                <MenuIcon />
              </Button>
              <Drawer anchor='right' open={open} onClose={toggleDrawer(false)}>
                <Box
                  sx={{
                    minWidth: '60dvw',
                    p: 2,
                    backgroundColor: 'background.paper',
                    flexGrow: 1
                  }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'end',
                      flexGrow: 1
                    }}
                  >
                    {/* <ToggleColorMode mode={mode} toggleColorMode={toggleColorMode} /> */}
                  </Box>
                  {/* <MenuItem onClick={() => scrollToSection('features')}>
                    Features
                  </MenuItem>
                  <MenuItem onClick={() => scrollToSection('testimonials')}>
                    Testimonials
                  </MenuItem>
                  <MenuItem onClick={() => scrollToSection('highlights')}>
                    Highlights
                  </MenuItem>
                  <MenuItem onClick={() => scrollToSection('pricing')}>
                    Pricing
                  </MenuItem>
                  <MenuItem onClick={() => scrollToSection('faq')}>FAQ</MenuItem> */}
                  <Divider />
                  <MenuItem>
                    <Button
                      color='primary'
                      variant='contained'
                      sx={{ width: '100%' }}
                    >
                      <Link href={'/app'} style={{ textDecoration:'none', color:'white' }}>To App</Link>
                    </Button>
                  </MenuItem>
                  <MenuItem>
                    <Button
                      color='primary'
                      variant='contained'
                      sx={{ width: '100%' }}
                    >
                      <Link href={'/login'} style={{ textDecoration:'none', color:'white' }}>Login</Link>
                    </Button>
                  </MenuItem>
                  <MenuItem>
                    <Button
                      color='primary'
                      variant='contained'
                      sx={{ width: '100%' }}
                    >
                      <Link href={'/register'} style={{ textDecoration:'none', color:'white' }}>Register</Link>
                    </Button>
                  </MenuItem>
                </Box>
              </Drawer>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
    </div>
  )
}

export default AppAppBar
