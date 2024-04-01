'use client'
import { Box, Button, Grid, Paper, Switch, Tooltip } from '@mui/material'
import React, { useEffect, useState } from 'react'
import Table from '@mui/material/Table'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TablePagination from '@mui/material/TablePagination'
import TableRow from '@mui/material/TableRow'
import { BlogItem } from '@/components/interfaces'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { SearchOutlined, DriveFileRenameOutline, DeleteOutlineOutlined } from '@mui/icons-material'
import { toast } from 'sonner'
import Loading from '@/components/Loading'
import { ApiResponse } from '@/types/types'

export default function Page() {
  const [page, setPage] = React.useState(0)
  const [rowsPerPage, setRowsPerPage] = React.useState(5)
  const [data, setData] = useState<BlogItem[]>([])
  const [loading, setLoading] = React.useState(true);
  const router = useRouter()

  const handleItemClick = (id: any) => {
    // navigate to the update page with the id as a URL parameter
    router.push(`/app/news-management/update/${id}`)
  }

  const handleDelete = async (id: any) => {
    const loadingId = toast.loading("Loading...");
    const response = await fetch(`/api/news-management/${id}`, {
      method: 'DELETE',
    })
    const payload = await response.json() as ApiResponse;
    if (payload.ok) {
      setData(pre => pre.filter(item => item.id !== id));
      toast.success(payload.message)
    } else {
      toast.error(payload.message)
    }
    toast.dismiss(loadingId);
  }


  // Avoid a layout jump when reaching the last page with empty rows.

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
      const response = await fetch('/api/news-management')
      const data = await response.json()
      setData(data.data)
    }
    fetchData()
    setLoading(false);
  }, [])

  //delete news
  useEffect(() => {
    //fetch data into table
    const fetchData = async () => {
      const response = await fetch('/api/news-management');
      const data = await response.json();
      setData(data.data);
    }
    fetchData()
  }, [])

  return (
    <>
      {loading ? (<Loading />)
        :
        (<>
          <Paper
            elevation={6}
            sx={{ borderRadius: "10px", boxSizing: "border-box" }}>
            <Grid container>
              <Grid item xs={12} sm={6} className="flex justify-between items-center p-3">
                <Link href="/app/news-management/create">
                  <Button variant="contained" color="primary">+ Add News</Button>
                </Link>
              </Grid>
              <Grid item xs={12} sm={6}>
                <form method="post" className="flex justify-end items-center my-3 relative">
                  <input type="text" name="search" id="searchInput"
                    className="mr-3 px-2 text-[14px] rounded-md min-w-[300px] min-h-[40px] cursor-pointer"
                    placeholder="Enter name to search" />
                  <div className="absolute inset-y-0 right-0 flex items-center">
                    <Button color="success" variant="text" size="small" className="rounded-full">
                      <SearchOutlined fontSize="small" />
                    </Button>
                  </div>
                </form>
              </Grid>
            </Grid>
          </Paper>

          <Paper
            elevation={6}
            sx={{ my: 3, borderRadius: "10px", boxSizing: "border-box" }}>
            <TableContainer sx={{ width: "100%", overflow: "hidden" }}>
              <Table className="mt-3" sx={{ minWidth: 650 }} size="small">
                <TableHead >
                  <TableRow>
                    <TableCell align="center" className="text-white text-sm">Title</TableCell>
                    <TableCell align="center" className="text-white text-sm">Slug</TableCell>
                    <TableCell align="center" className="text-white text-sm">Content</TableCell>
                    <TableCell align="center" className="text-white text-sm">Author</TableCell>
                    <TableCell align="center" className="text-white text-sm">Category</TableCell>
                    <TableCell align="center" className="text-white text-sm">Status</TableCell>
                    <TableCell align="center" className="text-white text-sm">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.length == null && (
                    <TableRow>
                      <TableCell colSpan={7} align="center" className="text-sm">
                        No Data
                      </TableCell>
                    </TableRow>
                  )}
                  {data
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map(item => (
                      <TableRow key={item.id} sx={{ "&:last-child td, &:last-child th": { border: 0 }, }}>
                        <TableCell align="center">
                          {item?.title.length > 30 ? item?.title.substring(0, 30) + ' ...' : item?.title}
                        </TableCell>
                        <TableCell align="center">{item?.slug} </TableCell>
                        <TableCell align="center">
                          {item?.content.length > 30 ? item?.content.substring(0, 30) + ' ...' : item?.content}
                        </TableCell>
                        <TableCell align="center">{item?.author}</TableCell>
                        <TableCell align="center">{item?.category ? 'Guide' : 'Promotion'}</TableCell>
                        <TableCell align="center">
                          <Switch size="small" color="success" className="cursor-pointer"
                            checked={item.status == 1 ? true : false}
                          />
                        </TableCell>

                        <TableCell align="center">
                          <Tooltip title="Edit">
                            <Button type="button" size='small' variant="text" color="success"
                              onClick={() => handleItemClick(item.id)}>
                              <DriveFileRenameOutline fontSize="small" />
                            </Button>
                          </Tooltip>

                          <Tooltip title="Remove">
                            <Button type="button" size='small' variant="text" color="error"
                              onClick={() => handleDelete(item.id)}>
                              <DeleteOutlineOutlined fontSize="small" />
                            </Button>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              component="div"
              count={data.length || 0}
              page={page}
              onPageChange={handleChangePage}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Paper>
        </>
        )
      }
    </>
  )
}

