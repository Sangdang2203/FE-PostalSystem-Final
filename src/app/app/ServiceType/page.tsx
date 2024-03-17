'use client'
import React, { useState, useEffect } from "react";
import { Grid, TablePagination, Chip, Alert, Button, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Paper } from "@mui/material";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import { DataServiceType } from "@/helper/interface";
import ModalAddNew from "./ModalAddNew";

export default function Page({
    searchParams,
}: {
    searchParams?: {
        query?: string;
        page?: string;
    };
}) {
    const [data, setData] = useState<any>([]);
    const [editItemId, setEditItemId] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const [isError, setIsError] = useState(false);
    const [errorMessages, setErrorMessages] = useState<string[]>([]);

    const [currentPage, setCurrentPage] = useState(Number(searchParams?.page) || 0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [openModalNew, setOpenModalNew] = React.useState(false);

    const fetchServiceTypes = async () => {
        try {
            const response = await fetch("/api/ServiceType");
            const responseData = await response.json();
            if (Array.isArray(responseData.data)) {
                setData(responseData.data);
            } else {
                console.error("Data is not an array:", responseData.data);
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    }
    useEffect(() => {
        if (!isLoading) {
            fetchServiceTypes();
            setIsLoading(true);
        }
    }, [isLoading]);

    useEffect(() => {
        fetchServiceTypes();
    }, [openModalNew])

    const handleEdit = (rowData: any) => {
        setEditItemId(rowData.id);
        setOpenModalNew(true);
    };

    const handleChangePage = (event: unknown, newPage: number) => {
        setCurrentPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setCurrentPage(0);
    };

    const handleSearch = (query: string) => {
        if (query.length > 0) {
            const dataFilter = data.filter(
                (item: any) =>
                    item.serviceType.serviceName.toLowerCase().includes(query.toLowerCase()) ||
                    item.serviceType.serviceDescription.toLowerCase().includes(query.toLowerCase())
            );
            setData(dataFilter);
        } else {
            setData(data);
        }
    }

    const [openDialog, setOpenDialog] = React.useState(false);
    const [changeStatusId, setChangeStatusId] = useState(0);

    const handleClickOpen = () => {
        setOpenDialog(true);
    };

    const handleClose = () => {
        setOpenDialog(false);
    };
    const handleChangeStatus = (id: number) => {
        setChangeStatusId(id);
        handleClickOpen();
    }
    const fetchStatus = async () => {
        try {
            const response = await fetch(`/api/ServiceType/changeStatus/${changeStatusId}`);
            console.log('response:', response);
            if (response.ok) {
                if (Array.isArray(data)) {
                    const updatedListServiceType = data.map((item: any) => {
                        if (item.id === changeStatusId) {
                            item.status = item.status === 1 ? 0 : 1;
                        }
                        return item;
                    });
                    setData(updatedListServiceType);
                } else {
                    console.error("Data is not an array:", data);
                }
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    }
    const handleSubmitChangeStatus = () => {
        fetchStatus();
        setOpenDialog(false);
    }
    const ChangeStatus = () => {
        return (
            <React.Fragment>
                <Dialog
                    open={openDialog}
                    onClose={handleClose}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">
                        {"Change this Status?"}
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            Changing the status will hide related Service information..
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleSubmitChangeStatus} autoFocus style={{ border: '2px solid red' }}>
                            Agree
                        </Button>
                        <Button onClick={handleClose}>Cancle</Button>
                    </DialogActions>
                </Dialog>
            </React.Fragment>
        );
    }

    const renderRow = (row: any) => {
        return (
            <TableRow key={row.id} >
                <TableCell>{row.id}</TableCell>
                <TableCell>{row.serviceName}</TableCell>
                <TableCell>{row.serviceDescription}</TableCell>
                <TableCell>
                    <span>
                        <Chip onClick={() => handleChangeStatus(row.id)} label={row.status === 1 ? 'Active' : 'Inactive'} color={row.status === 1 ? 'success' : 'error'} />
                    </span>
                </TableCell>
                <TableCell>
                    <IconButton onClick={() => handleEdit(row)}>
                        <EditIcon />
                    </IconButton>
                </TableCell>
            </TableRow>
        )
    }

    return (
        <div className="App">
            <Paper sx={{ width: "100%", overflow: "hidden", borderRadius: "10px", padding: "15px" }}>
                <ChangeStatus />

                <h1 className="text-4xl text-center antialiased font-semibold mt-5 mb-5"> Service Types Managerment</h1>
                <hr />
                <ModalAddNew open={openModalNew} setOpen={setOpenModalNew} editItemId={editItemId} setEditItemId={setEditItemId} />

                <Grid container spacing={1} sx={{ marginTop: '5px' }} >
                    {isError && (
                        <Grid item xs={12} >
                            <div className="error-message">
                                {errorMessages.map((msg, i) => (
                                    <Alert severity="success" color="warning" key={i}>
                                        {msg}
                                    </Alert>
                                ))}
                            </div>
                        </Grid>
                    )}
                    <Grid item xs={12}>
                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow >
                                        <TableCell align="center" className="text-white">ID</TableCell>
                                        <TableCell align="center" className="text-white">Service Name</TableCell>
                                        <TableCell align="center" className="text-white">Service Description</TableCell>
                                        <TableCell align="center" className="text-white">Status</TableCell>
                                        <TableCell align="center" className="text-white">Acction</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {data
                                        .slice(currentPage * rowsPerPage, currentPage * rowsPerPage + rowsPerPage)
                                        .map((row: any) => renderRow(row) || null)}
                                </TableBody>
                            </Table>
                        </TableContainer>
                        <TablePagination
                            rowsPerPageOptions={[5, 10, 25]}
                            component="div"
                            count={data.length}
                            rowsPerPage={rowsPerPage}
                            page={currentPage}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                        />
                    </Grid>
                </Grid>
            </Paper>
        </div>
    );
}