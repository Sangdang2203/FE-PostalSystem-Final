'use client'
import { Box, Breadcrumbs, Divider, Grid, Skeleton, Stack, Typography } from '@mui/material'
import Link from '@mui/material/Link'
import React, { useEffect, useState } from 'react'
import NavigateNextIcon from '@mui/icons-material/NavigateNext'
import { BlogItem } from '@/components/interfaces'
import moment from 'moment'

function Page({ params }: { params: { blogId: string } }) {
  const [blog, setBlog] = useState<BlogItem | null>(null)
  const [relatedNews, setRelatedNews] = useState<BlogItem[]>([])
  const [loading, setLoading] = useState(true)
  const id = params.blogId
  // Fetch 1 news
  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(`/api/news/${id}`)
      const data = await response.json()
      setBlog(data.data)
    }
    fetchData()
  }, [])

  //fetch all news
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      const response = await fetch('/api/news')
      const data = await response.json()
      setRelatedNews(data.data)
      setLoading(false)
    }
    fetchData()
  }, [])

  const breadcrumbs = [
    <Link underline="hover" key="1" color="inherit" href="/">
      Home
    </Link>,
    <Typography key="2" color="inherit">
      {blog ? blog.title.toLocaleLowerCase() : 'Loading...'}
    </Typography>
  ]
  return (
    <Box>
      <Box sx={{ py: 1, px: 2 }}>
        <Stack>
          <Breadcrumbs
            separator={<NavigateNextIcon fontSize="small" />}
            aria-label="breadcrumb"
          >
            {breadcrumbs}
          </Breadcrumbs>
        </Stack>
      </Box>
      <Grid container>
        <Grid item xs={12} md={8.5}>
          <Box sx={{ my: 2 }}>
            {loading ? (
              <Skeleton animation='wave' variant="text" width={900} height={60} />
            ) : (
              <Typography sx={{ fontWeight: '550', fontSize: '30px', ml: 2 }}>
                {blog ? blog.title : 'Loading ...'}
              </Typography>
            )}
            <Box sx={{ ml: 2 }}>
              <Typography>
                {blog && blog.createdAt ? moment(new Date(blog.createdAt)).format('DD-MM-YYYY') : 'Loading...'}
              </Typography>
            </Box>
            <Box sx={{ ml: 2, my: 2 }}>
              <div dangerouslySetInnerHTML={{ __html: blog ? blog.content : 'Loading ...' }} />
            </Box>
          </Box>
        </Grid>
        <Grid item xs={12} md={3.5}>
          <Box sx={{ my: 4, pl: 2, backgroundColor: '#f5f5f5' }}>
            <Box sx={{ my: 2 }}>
              <Typography sx={{ fontWeight: '550', fontSize: '25px' }}>Related News</Typography>
            </Box>
            <Divider variant="middle" />
            {loading ? (
              <Box sx={{ width: 300, height: 50, my: 1 }}>
                <Skeleton animation="wave" variant="text" />
                <Skeleton animation="wave" variant="rectangular" width={300} />
              </Box>
            ) : (
              relatedNews?.map((news, index) => (
                <Box key={index} sx={{ my: 1 }}>
                  <Link href={`/news/${news.id}`} underline="hover" color="inherit">
                    <Typography sx={{ fontWeight: '550', fontSize: '15px' }}>
                      {news.title.length > 50 ? news.title.substring(0, 50) + '...' : news.title}
                    </Typography>
                  </Link>
                  <Typography sx={{ fontSize: '12px', color: '#8d8dac' }}>
                    <Typography>
                      {blog && blog.createdAt ? moment(new Date(blog.createdAt)).format('DD-MM-YYYY') : 'Loading...'}
                    </Typography>
                  </Typography>
                </Box>
              ))
            )}
          </Box>
        </Grid>
      </Grid>
    </Box>
  )
}

export default Page