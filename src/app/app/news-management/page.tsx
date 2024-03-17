'use client'
import { Box, Button, Chip, Paper } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useTheme } from '@mui/material/styles'
import Table from '@mui/material/Table'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableFooter from '@mui/material/TableFooter'
import TablePagination from '@mui/material/TablePagination'
import TableRow from '@mui/material/TableRow'
import IconButton from '@mui/material/IconButton'
import FirstPageIcon from '@mui/icons-material/FirstPage'
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft'
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight'
import LastPageIcon from '@mui/icons-material/LastPage'
import { BlogItem } from '@/components/interfaces'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface TablePaginationActionsProps {
  count: number
  page: number
  rowsPerPage: number
  onPageChange: (
    event: React.MouseEvent<HTMLButtonElement>,
    newPage: number,
  ) => void
}

function TablePaginationActions(props: TablePaginationActionsProps) {
  const theme = useTheme()
  const { count, page, rowsPerPage, onPageChange } = props

  const handleFirstPageButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    onPageChange(event, 0)
  }

  const handleBackButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    onPageChange(event, page - 1)
  }

  const handleNextButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    onPageChange(event, page + 1)
  }

  const handleLastPageButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1))
  }

  return (
    <Box sx={{ flexShrink: 0, ml: 2.5 }}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label="first page"
      >
        {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton
        onClick={handleBackButtonClick}
        disabled={page === 0}
        aria-label="previous page"
      >
        {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
      >
        {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
      >
        {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
      </IconButton>
    </Box>
  )
}


export default function Page() {
  const [page, setPage] = React.useState(0)
  const [rowsPerPage, setRowsPerPage] = React.useState(5)
  const [data, setData] = useState<BlogItem[]>([])
  const router = useRouter()

  const handleItemClick = (id:any) => {
    // navigate to the update page with the id as a URL parameter
    router.push(`/app/news-management/update/${id}`)
  }

  const handleDelete = async (id:any) => {
    const response = await fetch(`/api/news-management/delete/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    const data = await response.json()
    if (data.ok) {
      const response = await fetch('/api/news')
      const data = await response.json()
      setData(data.data)
    }
  }

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
  page > 0 ? Math.max(0, (1 + page) * rowsPerPage - data.length) : 0

  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  //fetch data into table
  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch('/api/news')
      const data = await response.json()
      setData(data.data)
    }
    fetchData()
  }, [])

  //delete news
  useEffect(() => {
    //fetch data into table
    const fetchData = async () => {
      const response = await fetch('/api/news')
      const data = await response.json()
      setData(data.data)
    }
    fetchData()
  }, [])

  return (
    <>
      <Paper elevation={1} sx={{ my: 3, borderRadius: '10px', boxSizing: 'border-box' }}>
        <Box>
          <Box sx={{ p: 3, display:'flex', flexDirection:'row', justifyContent:'space-between' }}>
            <h2>News Management</h2>
            <Link href="/app/news-management/create">
              <Button sx={{ p:0, fontWeight:'550', fontSize:'16px' }}>Create News</Button>
            </Link>
          </Box>
          <Box>
            <TableContainer component={Paper} sx={{ px:2 }} >
              <Table aria-label="simple table">
                <TableHead >
                  <TableRow sx={{ backgroundColor:'white' }}>
                    <TableCell align="center" style={{ fontSize: '16px', fontWeight:'550' }}>Title</TableCell>
                    <TableCell align="center" style={{ fontSize: '16px', fontWeight:'550' }}>Slug</TableCell>
                    <TableCell align="center" style={{ fontSize: '16px', fontWeight:'550' }}>Content</TableCell>
                    <TableCell align="center" style={{ fontSize: '16px', fontWeight:'550' }}>Author</TableCell>
                    <TableCell align="center" style={{ fontSize: '16px', fontWeight:'550' }}>Category</TableCell>
                    <TableCell align="center" style={{ fontSize: '16px', fontWeight:'550' }}>Status</TableCell>
                    <TableCell align="center" style={{ fontSize: '16px', fontWeight:'550' }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((item, index) => (
                    <TableRow key={index}>
                      <TableCell align="center" style={{ fontSize: '16px' }}>{item?.title.length > 30 ? item?.title.substring(0, 30) + ' ...' : item?.title}</TableCell>
                      <TableCell align="center" style={{ fontSize: '16px' }}>{item?.slug}</TableCell>
                      <TableCell align="center" style={{ fontSize: '16px' }}>{item?.content.length > 30 ? item?.content.substring(0, 30) + ' ...': item?.content}</TableCell>
                      <TableCell align="center" style={{ fontSize: '16px' }}>{item?.author}</TableCell>
                      <TableCell align="center" style={{ fontSize: '16px' }}>
                        {item?.category ? 'Guide': 'Promotion'}
                      </TableCell>
                      <TableCell align="center" style={{ fontSize: '16px' }}>
                        {item?.status ?
                          <Chip label='Active' color="success"/>:
                          <Chip label='Deactive' color="secondary"/>
                        }
                      </TableCell>
                      <TableCell align="center" style={{ fontSize: '16px' }}>
                        <Button sx={{ mr: 0.5 }} size="small" variant="contained" color="info"
                          onClick={() => handleItemClick(item.id)}
                        >Edit</Button>
                        <Button size="small" variant="contained" color="error"
                          onClick={() => handleDelete(item.id)}
                        >Delete</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
                <TableFooter>
                  <TableRow>
                    <TablePagination
                      rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
                      colSpan={6}
                      count={data.length}
                      rowsPerPage={rowsPerPage}
                      page={page}
                      slotProps={{
                        select: {
                          inputProps: {
                            'aria-label': 'rows per page'
                          },
                          native: true
                        }
                      }}
                      onPageChange={handleChangePage}
                      onRowsPerPageChange={handleChangeRowsPerPage}
                      ActionsComponent={TablePaginationActions}
                    />
                  </TableRow>
                </TableFooter>
              </Table>
            </TableContainer>
          </Box>
        </Box>
      </Paper>
    </>
  )
}
