'use client'
import { Box, Button, Grid, Paper, TextField, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import { Employee } from '@/components/interfaces'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { CKEditor } from '@ckeditor/ckeditor5-react'
import ClassicEditor from '@ckeditor/ckeditor5-build-classic'
import Link from 'next/link'

function Page({ params }: { params: { id: string } }) {
  const id = params.id
  const [newsId, setNewsId] = useState('')
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [employeeId, setEmployeeId] = useState('')
  const [slug, setSlug] = useState('')
  const [author, setAuthor] = useState('')
  const [category, setCategory] = useState(0)
  const [status, setStatus] = useState(0)
  const [employees, SetEmployees] = useState<Employee[]>([])
  const router = useRouter()

  const handleChange = (event: SelectChangeEvent) => {
    setEmployeeId(event.target.value as string)
  }

  // Fetch employees
  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch('/api/employees')
      const data = await response.json()
      SetEmployees(data.data)
      // console.log('employee:', data)
    }
    fetchData()
  }, [])

  const [loading, setLoading] = useState(!id)

  useEffect(() => {
    console.log('status', status)
    const fetchData = async () => {

      try {
        const response = await fetch(`/api/news/${id}`)
        // console.log('response:', response)
        if (!response.ok) {
          throw new Error('Network response was not ok')
        }
        const data = await response.json()
        // console.log('data:', data)
        // Fill the form fields with the data
        setNewsId(data.data.id)
        setTitle(data.data.title)
        setContent(data.data.content)
        setEmployeeId(data.data.employeeId)
        setSlug(data.data.slug)
        setAuthor(data.data.author)
        setCategory(data.data.category)
        setStatus(data.data.status)
      } catch (error) {
        // console.error('Fetch error:', error)
        toast.error('Failed to fetch news data')
      } finally {
        // Set loading to false after the data has been fetched or if an error occurred
        setLoading(false)
      }
    }

    if (id) {
      fetchData()
    }
  }, [id]) // Depend on id to refetch data when id changes

  // In your render method
  if (loading) {
    return <div>Loading...</div>
  }


  // Update the handleSubmit function
  const handleSubmit = async () => {
    const news = {
      id: newsId,
      title,
      slug,
      content,
      author,
      employeeId,
      category,
      status
    }
    if (!title || !slug || !content || !author || !employeeId) {
      toast.error('Please fill all the fields')
      return
    }

    const res = await fetch(`/api/news-management/create-update/${newsId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(news)
    })

    if (res.ok) {
      toast.success('Edit news successfully')
      router.push('/app/news-management')
    } else {
      toast.error('Fail to edit news')
    }
  }

  return (
    <>
      <Box>
        <Paper elevation={1} sx={{ my: 3, p:1, borderRadius: '6px', boxSizing: 'border-box' }}>
          <Box sx={{ display:'flex', flexDirection:'row', justifyContent:'space-between' }}>
            <Typography sx={{ m:2, fontSize:'24px', fontWeight:550 }}>Update News</Typography>
            <Link href="/app/news-management">
              <Button variant="contained" sx={{ m:2 }}>Back</Button>
            </Link>
          </Box>
          <Box sx={{ m:2 }}>
            <Grid container spacing={2} sx={{ mb:2 }}>
              <Grid item xs={12} sm={6}>
                <Box>
                  <Typography sx={{ color:'red' }}>Title *</Typography>
                  <TextField
                    sx={{ my:1 }}
                    required
                    id='title'
                    name='title'
                    fullWidth
                    placeholder='Enter title'
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </Box>
                <Box>
                  <Typography sx={{ color:'red' }}>Category *</Typography>
                  <FormControl fullWidth sx={{ my:1 }}>
                    <Select
                      required
                      labelId="demo-simple-select-label"
                      value={category}
                      id="demo-simple-select"
                      onChange={(e) => setCategory(e.target.value as number)}
                    >
                      {[0, 1].map((value) => (
                        <MenuItem key={value} value={value}>
                          {value? 'Guide': 'Promotion'}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>
                <Box>
                  <Typography sx={{ color:'red' }}>Employee *</Typography>
                  <FormControl fullWidth sx={{ my:1 }}>
                    <Select
                      required
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={employeeId}
                      onChange={handleChange}
                    >
                      {employees.map((employee) => (
                        <MenuItem key={employee.id} value={employee.id}>
                          {employee.fullname}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Box>
                  <Typography sx={{ color:'red' }}>Slug *</Typography>
                  <TextField
                    sx={{ my:1 }}
                    required
                    id='slug'
                    name='slug'
                    fullWidth
                    placeholder='Enter slug'
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                  />
                </Box>
                <Box>
                  <Typography sx={{ color:'red' }}>Author *</Typography>
                  <TextField
                    sx={{ my:1 }}
                    required
                    id='author'
                    name='author'
                    fullWidth
                    placeholder='Enter author'
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                  />
                </Box>
                <Box>
                  <Typography sx={{ color:'red' }}>Status *</Typography>
                  <FormControl fullWidth sx={{ my:1 }}>
                    <Select
                      required
                      labelId="demo-simple-select-label"
                      value={status}
                      id="demo-simple-select"
                      onChange={(e) => {setStatus(parseInt(e.target.value as string))
                      }}
                    >
                      {[0, 1].map((value) => (
                        <MenuItem key={value} value={value}>
                          {value? 'Active': 'Deactive'}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>
              </Grid>
              <Grid item xs={12}>
                <CKEditor
                  data={content}
                  editor={ ClassicEditor }
                  // onReady={ editor => {
                  //   // You can store the "editor" and use when it is needed.
                  //   console.log( 'Editor is ready to use!', editor )
                  // } }
                  onChange={ ( event, editor ) => {
                    const data = editor.getData()
                    // console.log( 'Data:', data )
                    setContent(data) // set the content state with the current data from the editor
                  } }
                  // onBlur={ ( event, editor ) => {
                  //   console.log( 'Blur.', editor )
                  // } }
                  // onFocus={ ( event, editor ) => {
                  //   console.log( 'Focus.', editor )
                  // } }
                >
                </CKEditor>
              </Grid>
            </Grid>
            <Button variant="contained" onClick={handleSubmit}>Update</Button>

          </Box>
        </Paper>
      </Box>
    </>
  )
}

export default Page