'use client'
import { Box, Button, Grid, Paper, TextField, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import { Employee } from '@/components/interfaces'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { CKEditor } from '@ckeditor/ckeditor5-react'
import ClassicEditor from '@ckeditor/ckeditor5-build-classic'

function Page() {
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
  // fetch employees
  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch('/api/employees')
      const data = await response.json()
      console.log(data.data) // log the response data
      SetEmployees(data.data)
    }
    fetchData()
  }, [])

  //submit form
  const handleSubmit = async () => {
    if (!title || title.length < 5 || title.length > 100) {
      toast.error('Title must be between 5 and 100 characters')
      return
    }
    if (!slug || !/^[\w-]+$/.test(slug)) {
      toast.error('Slug must only contain letters, numbers, underscores and hyphens')
      return
    }
    if (!content || content.length < 20) {
      toast.error('Content must be at least 20 characters')
      return
    }
    if (!author || author.length < 3 || author.length > 50) {
      toast.error('Author name must be between 3 and 50 characters')
      return
    }
    if (!employeeId) {
      toast.error('Please select an employee')
      return
    }

    const news = {
      title,
      slug,
      content,
      author,
      employeeId,
      category: 0,
      status: 0
    }
    const res = await fetch('/api/news-management/create-update', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(news)
    })

    if (res.ok) {
      toast.success('Add news successfully')
      router.push('/app/news-management')
    } else {
      toast.error('Fail to add news')
    }
  }

  return (
    <>
      <Box>
        <Paper elevation={1} sx={{ my: 3, p: 1, borderRadius: '6px', boxSizing: 'border-box' }}>
          <Box sx={{ m: 2, display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
            <Typography sx={{ fontSize: '24px', fontWeight: 550 }}>Create News</Typography>
            <Link href="/app/news-management">
              <Button variant="contained">Back</Button>
            </Link>
          </Box>
          <Box sx={{ m: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  sx={{ my: 1 }}
                  required
                  id='title'
                  name='title'
                  label='Title'
                  fullWidth
                  placeholder='Enter title'
                  onChange={(e) => setTitle(e.target.value)}
                />

                <FormControl fullWidth sx={{ my: 1 }}>
                  <InputLabel id="demo-simple-select-label">Employee</InputLabel>
                  <Select
                    required
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={employeeId}
                    label="Employee"
                    onChange={handleChange}
                  >
                    {employees.map((employee) => (
                      <MenuItem key={employee.id} value={employee.id}>
                        {employee.fullname}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <FormControl fullWidth sx={{ my: 1 }}>
                  <InputLabel id="demo-simple-select-label">Status</InputLabel>
                  <Select
                    required
                    labelId="demo-simple-select-label"
                    value={status}
                    id="demo-simple-select"
                    label="Status"
                    onChange={(e) => setStatus(e.target.value as number)}
                  >
                    {[0, 1].map((value) => (
                      <MenuItem key={value} value={value}>
                        {value ? 'Active' : 'Deactive'}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  sx={{ my: 1 }}
                  required
                  id='slug'
                  name='slug'
                  label='slug'
                  fullWidth
                  placeholder='Enter slug'
                  onChange={(e) => setSlug(e.target.value)}
                />
                <TextField
                  sx={{ my: 1 }}
                  required
                  id='author'
                  name='author'
                  label='author'
                  fullWidth
                  placeholder='Enter author'
                  onChange={(e) => setAuthor(e.target.value)}
                />
                <FormControl fullWidth sx={{ my: 1 }}>
                  <InputLabel id="demo-simple-select-label">Category</InputLabel>
                  <Select
                    required
                    labelId="demo-simple-select-label"
                    value={category}
                    id="demo-simple-select"
                    label="Category"
                    onChange={(e) => setCategory(e.target.value as number)}
                  >
                    {[0, 1].map((value) => (
                      <MenuItem key={value} value={value}>
                        {value ? 'Guide' : 'Promotion'}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <CKEditor
                  editor={ClassicEditor}
                  onReady={editor => {
                    // You can store the "editor" and use when it is needed.
                    console.log('Editor is ready to use!', editor)
                  }}
                  onChange={(event, editor) => {
                    const data = editor.getData()
                    console.log('Data:', data)
                    setContent(data) // set the content state with the current data from the editor
                  }}
                  onBlur={(event, editor) => {
                    console.log('Blur.', editor)
                  }}
                  onFocus={(event, editor) => {
                    console.log('Focus.', editor)
                  }}
                >
                </CKEditor>
              </Grid>
            </Grid>
            <Button sx={{ my: 1 }} variant="contained" onClick={handleSubmit}>CREATE</Button>
          </Box>
        </Paper>
      </Box>
    </>
  )
}

export default Page