'use client'
import { Box, Button, Grid, Paper, TextField, Typography } from '@mui/material'
import React, { useEffect } from 'react'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import { useTheme } from '@mui/material/styles'
import AppBar from '@mui/material/AppBar'
import { SiteSetting } from '@/components/interfaces'
import { toast } from 'sonner'


interface TabPanelProps {
  children?: React.ReactNode
  dir?: string
  index: number
  value: number
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <>{children}</>
        </Box>
      )}
    </div>
  )
}

function a11yProps(index: number) {
  return {
    id: `full-width-tab-${index}`,
    'aria-controls': `full-width-tabpanel-${index}`
  }
}
function Page() {
  const theme = useTheme()
  const [loading, setLoading] = React.useState(true)
  const [value, setValue] = React.useState(0)
  const [settings, setSettings] = React.useState({
    site_name: '',
    site_title: '',
    site_description: '',
    site_keywords: '',
    site_author: '',
    site_email: '',
    site_phone: '',
    site_address: ''
  })

  const [additionalSettings, setAdditionalSettings] = React.useState({
    site_logo: '',
    site_favicon: '',
    site_logo_bg: '',
    site_language: '',
    site_favicon_bg: '',
    rateConvert: '',
    limitSize: '',
    limitWeight: ''
  })

  const handleGeneralSettingsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSettings({
      ...settings,
      [event.target.name]: event.target.value
    })
  }

  const handleAdditionalSettingsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAdditionalSettings({
      ...additionalSettings,
      [event.target.name]: event.target.value
    })
  }

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue)
  }

  const handleChangeIndex = (index: number) => {
    setValue(index)
  }

  useEffect(() => {
    const fetchData = async () => {
        const response = await fetch('/api/general-setting')
        if (response.ok) {
            const data = await response.json()
            console.log('data', data) // Log the data to the console

            // Directly assign the returned data to your state
            setSettings({
                site_name: data.data.site_name || '',
                site_title: data.data.site_title || '',
                site_description: data.data.site_description || '',
                site_keywords: data.data.site_keywords || '',
                site_author: data.data.site_author || '',
                site_email: data.data.site_email || '',
                site_phone: data.data.site_phone || '',
                site_address: data.data.site_address || ''
            })

            setAdditionalSettings({
                site_logo: data.data.site_logo || '',
                site_favicon: data.data.site_favicon || '',
                site_logo_bg: data.data.site_logo_bg || '',
                site_language: data.data.site_language || '',
                site_favicon_bg: data.data.site_favicon_bg || '',
                rateConvert: data.data.rateConvert || '',
                limitSize: data.data.limitSize || '',
                limitWeight: data.data.limitWeight || ''
            })
        } else {
            console.error('Failed to fetch settings')
        }
        setLoading(false)
    }
    fetchData()
}, [])

  if (loading) {
    return <div>Loading...</div> // Or return a spinner
  }
  return (
    <>
      <Paper elevation={1} sx={{ my: 3, borderRadius: '10px', boxSizing: 'border-box' }}>
        <Box sx={{ bgcolor: 'background.paper' }}>
          <AppBar position="static">
            <Tabs
              value={value}
              onChange={handleChange}
              indicatorColor="secondary"
              textColor="inherit"
              variant="fullWidth"
              aria-label="full width tabs example"
            >
              <Tab label="General Settings" {...a11yProps(0)} />
              <Tab label="Additional Settings" {...a11yProps(1)} />
            </Tabs>
          </AppBar>
          <TabPanel value={value} index={0} dir={theme.direction}>
            <Box>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Box sx={{ my: 1 }}>
                    <Typography>Site name :</Typography>
                    <TextField
                      name="site_name"
                      fullWidth
                      placeholder='Enter site name'
                      id="filled-required"
                      onChange={handleGeneralSettingsChange}
                      value={settings.site_name}
                    />
                  </Box>
                  <Box sx={{ my: 1 }}>
                    <Typography>Site title :</Typography>
                    <TextField
                      name='site_title'
                      fullWidth
                      placeholder='Enter site title'
                      id="filled-required"
                      onChange={handleGeneralSettingsChange}
                      value={settings.site_title}
                    />
                  </Box>
                  <Box sx={{ my: 1 }}>
                    <Typography>Site description :</Typography>
                    <TextField
                      name='site_description'
                      fullWidth
                      placeholder='Enter site description'
                      id="filled-required"
                      onChange={handleGeneralSettingsChange}
                      value={settings.site_description}
                    />
                  </Box>
                  <Box sx={{ my: 1 }}>
                    <Typography>Site keywords :</Typography>
                    <TextField
                      name='site_keywords'
                      fullWidth
                      placeholder='Enter site keywords'
                      id="filled-required"
                      onChange={handleGeneralSettingsChange}
                      value={settings.site_keywords}
                    />
                  </Box>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Box sx={{ my: 1 }}>
                    <Typography>Site author :</Typography>
                    <TextField
                      name='site_author'
                      fullWidth
                      placeholder='Enter site author'
                      id="filled-required"
                      onChange={handleGeneralSettingsChange}
                      value={settings.site_author}
                    />
                  </Box>
                  <Box sx={{ my: 1 }}>
                    <Typography>Site email :</Typography>
                    <TextField
                      name='site_email'
                      fullWidth
                      placeholder='Enter site email'
                      id="filled-required"
                      onChange={handleGeneralSettingsChange}
                      value={settings.site_email}
                    />
                  </Box>
                  <Box sx={{ my: 1 }}>
                    <Typography>Site phone :</Typography>
                    <TextField
                      name='site_phone'
                      fullWidth
                      placeholder='Enter site email'
                      id="filled-required"
                      onChange={handleGeneralSettingsChange}
                      value={settings.site_phone}
                    />
                  </Box>
                  <Box sx={{ my: 1 }}>
                    <Typography>Site address :</Typography>
                    <TextField
                      name='site_address'
                      fullWidth
                      placeholder='Enter site address'
                      id="filled-required"
                      onChange={handleGeneralSettingsChange}
                      value={settings.site_address}
                    />
                  </Box>
                </Grid>
              </Grid>
            </Box>
            <Button variant='contained' onClick={async () => {
              fetch('/api/general-setting/update', {
                method: 'PUT',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify(settings)
              })
            // Show a success toast
              toast.success('Settings updated successfully')
            }}>Save</Button>
          </TabPanel>
          <TabPanel value={value} index={1} dir={theme.direction}>
            <Box>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Box sx={{ my: 1 }}>
                    <Typography>Site logo :</Typography>
                    <TextField
                      name='site_logo'
                      required
                      fullWidth
                      placeholder='Enter logo'
                      id="filled-required"
                      onChange={handleAdditionalSettingsChange}
                      value={additionalSettings.site_logo}
                    />
                  </Box>
                  <Box sx={{ my: 1 }}>
                    <Typography>Site favicon :</Typography>
                    <TextField
                      name='site_favicon'
                      required
                      fullWidth
                      placeholder='Enter site favicon'
                      id="filled-required"
                      onChange={handleAdditionalSettingsChange}
                      value={additionalSettings.site_favicon}
                    />
                  </Box>
                  <Box sx={{ my: 1 }}>
                    <Typography>Site logo bg :</Typography>
                    <TextField
                      name='site_logo_bg'
                      required
                      fullWidth
                      placeholder='Enter site logo_bg'
                      id="filled-required"
                      onChange={handleAdditionalSettingsChange}
                      value={additionalSettings.site_logo_bg}
                    />
                  </Box>
                  <Box sx={{ my: 1 }}>
                    <Typography>Site language :</Typography>
                    <TextField
                      name='site_language'
                      required
                      fullWidth
                      placeholder='Enter site language'
                      id="filled-required"
                      onChange={handleAdditionalSettingsChange}
                      value={additionalSettings.site_language}
                    />
                  </Box>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Box sx={{ my: 1 }}>
                    <Typography>Site faviocn_bg :</Typography>
                    <TextField
                      name='site_favicon_bg'
                      required
                      fullWidth
                      placeholder='Enter site facion bg'
                      id="filled-required"
                      onChange={handleAdditionalSettingsChange}
                      value={additionalSettings.site_favicon_bg}
                    />
                  </Box>
                  <Box sx={{ my: 1 }}>
                    <Typography>Rate convert :</Typography>
                    <TextField
                      name='rateConvert'
                      required
                      fullWidth
                      placeholder='Enter rate convert'
                      id="filled-required"
                      onChange={handleAdditionalSettingsChange}
                      value={additionalSettings.rateConvert}
                    />
                  </Box>
                  <Box sx={{ my: 1 }}>
                    <Typography>Limit Size :</Typography>
                    <TextField
                      name='limitSize'
                      required
                      fullWidth
                      placeholder='Enter limit size'
                      id="filled-required"
                      onChange={handleAdditionalSettingsChange}
                      value={additionalSettings.limitSize}
                    />
                  </Box>
                  <Box sx={{ my: 1 }}>
                    <Typography>Limit Weight :</Typography>
                    <TextField
                      name='limitWeight'
                      required
                      fullWidth
                      placeholder='Enter limit weight'
                      id="filled-required"
                      onChange={handleAdditionalSettingsChange}
                      value={additionalSettings.limitWeight}
                    />
                  </Box>
                </Grid>
              </Grid>
            </Box>
            <Button variant='contained' onClick={async () => {
              fetch('/api/general-setting/update', {
                method: 'PUT',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify(additionalSettings)
              })
            }}>Save</Button>
          </TabPanel>
        </Box>
      </Paper>
    </>
  )
}

export default Page