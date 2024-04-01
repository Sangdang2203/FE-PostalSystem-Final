import { Box, Grid, Paper, Tab, Tabs, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import NewspaperIcon from '@mui/icons-material/Newspaper'
import HomeIcon from '@mui/icons-material/Home'
import WatchLaterIcon from '@mui/icons-material/WatchLater'
import { BlogItem } from './interfaces'
import moment from 'moment'
import Link from 'next/link'
import './NewsHomepage.css'

interface TabPanelProps {
  children?: React.ReactNode
  index: number
  value: number
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
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
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`
  }
}
function NewsHomepage() {
  const [value, setValue] = React.useState(0)
  const [blogs, setBlogs] = useState<BlogItem[]>([])

  useEffect(() => {
    fetch('/api/Blog/all')
      .then(response => response.json())
      .then((data: BlogItem[]) => {
        data.sort((a: BlogItem, b: BlogItem) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()) // sort by date
        setBlogs(data.slice(0, 10)) // get the first 4 items
      })
  }, [])

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue)
  }

  return (
    <Box sx={{ my: 4 }}>
      <Box sx={{ my: 3 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider', display: 'flex', flexDirection: 'row' }}>
          <Typography sx={{ fontWeight: '550', fontSize: { xs: '20px', md: '25px' }, flexGrow: 0.9 }}>TARS News</Typography>
          <Tabs value={value} onChange={handleChange} aria-label="basic tabs example" variant="fullWidth">
            <Tab sx={{ fontWeight: '550', fontSize: '20px' }} label="Promotion" {...a11yProps(0)} />
            <Tab sx={{ fontWeight: '550', fontSize: '20px' }} label="Guide" {...a11yProps(1)} />
          </Tabs>
        </Box>
        <CustomTabPanel value={value} index={0}>
          {blogs.filter(blog => blog.category === 0 && blog.status !== 0).map((blog) => (
            <Box sx={{ my: 1 }} key={blog.id}>
              <Paper elevation={1}>
                <Box sx={{ mt: 2 }}>
                  <Grid container>
                    <Grid item xs={1}>
                      <NewspaperIcon sx={{ fontSize: { xs: '30px', md: '45px' }, display: 'flex', marginLeft: 'auto', marginRight: 'auto', marginTop: 'auto', marginBottom: 'auto' }} />
                    </Grid>
                    <Grid item xs={11} sx={{ borderLeft: 1, borderColor: '#eeeeee' }}>
                      <Box sx={{ mx: 2, my: 1 }}>
                        <Box sx={{ display: 'flex', flexDirection: 'row' }}>
                          <Box>
                            <HomeIcon sx={{ display: 'flex', marginRight: 1, marginTop: 0.5, color: '#ec1e32' }} />
                          </Box>
                          <Box>
                            <Link href={`/news/${blog.id}`}>
                              <Typography sx={{ textDecoration: 'none', fontWeight: '550', fontSize: '20px', '&:hover': { color: 'red' } }}>{blog.title}</Typography>
                            </Link>
                          </Box>
                        </Box>
                        <Box>
                          <Box sx={{ display: 'flex', flexDirection: 'row', ml: 4 }}>
                            <WatchLaterIcon sx={{ fontSize: '18px', color: '#aeaeae', mt: 0.4 }} />
                            <Typography>{moment(new Date(blog.createdAt)).format('DD-MM-YYYY')}</Typography>
                          </Box>
                        </Box>
                        <Box sx={{ ml: 4 }}>
                          <Link href={`/news/${blog.id}`} >
                            <div className="ckeditor" dangerouslySetInnerHTML={{ __html: blog.content.length > 50 ? blog.content.substring(0, 50) + ' ...' : blog.content }} />
                          </Link>
                        </Box>
                      </Box>
                    </Grid>
                  </Grid>
                </Box>
              </Paper>
            </Box>
          ))}
        </CustomTabPanel>
        <CustomTabPanel value={value} index={1}>
          {blogs.filter(blog => blog.category === 1).map((blog) => (
            <Box sx={{ my: 1 }} key={blog.id}>
              <Paper elevation={1}>
                <Box sx={{ mt: 2 }}>
                  <Grid container>
                    <Grid item xs={1}>
                      <NewspaperIcon sx={{ fontSize: { xs: '30px', md: '45px' }, display: 'flex', marginLeft: 'auto', marginRight: 'auto', marginTop: 'auto', marginBottom: 'auto' }} />
                    </Grid>
                    <Grid item xs={11} sx={{ borderLeft: 1, borderColor: '#eeeeee' }}>
                      <Box sx={{ mx: 2, my: 1 }}>
                        <Box sx={{ display: 'flex', flexDirection: 'row' }}>
                          <Box>
                            <HomeIcon sx={{ display: 'flex', marginRight: 1, marginTop: 0.5, color: '#ec1e32' }} />
                          </Box>
                          <Box>
                            <Link href={`/news/${blog.id}`}>
                              <Typography sx={{ textDecoration: 'none', fontWeight: '550', fontSize: '20px', '&:hover': { color: 'red' } }}>{blog.title}</Typography>
                            </Link>
                          </Box>
                        </Box>
                        <Box>
                          <Box sx={{ display: 'flex', flexDirection: 'row', ml: 4 }}>
                            <WatchLaterIcon sx={{ fontSize: '18px', color: '#aeaeae', mt: 0.4 }} />
                            <Typography>{moment(new Date(blog.createdAt)).format('DD-MM-YYYY')}</Typography>
                          </Box>
                        </Box>
                        <Box>
                          <Link href={`/news/${blog.id}`}>
                            <Typography sx={{ fontSize: '16px', ml: 4 }}>
                              {blog.content.length > 100 ? blog.content.substring(0, 100) + '...' : blog.content}
                            </Typography>
                          </Link>
                        </Box>
                      </Box>
                    </Grid>
                  </Grid>
                </Box>
              </Paper>
            </Box>
          ))}
        </CustomTabPanel>
      </Box>
      <Box></Box>
    </Box>
  )
}

export default NewsHomepage