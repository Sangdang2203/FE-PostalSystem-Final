'use client'
import { useEffect, useState } from "react"
import * as React from 'react';
import { Alert, Button, Chip, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow } from "@mui/material";
import { useRouter } from 'next/navigation'
import Paper from '@mui/material/Paper';


export default function FeeCustomPage({
    searchParams,
}: {
    searchParams?: {
        query?: string;
        page?: string;
    };
}) {
    const router = useRouter();
    const [data, setData] = useState<any>([]);

    const fetchData = async () => {
        try {
            const res = await fetch('/api/FeeCustom/GetAllFeesCustom');
            const resData = await res.json();
            const data = resData.data;
            setData(data);
        } catch (error) {
            return { error: "api backend error" };
        }
    }
    useEffect(() => {
        fetchData();
    }, []);

    const [isError, setIsError] = useState(false);
    const [errorMessages, setErrorMessages] = useState<string[]>([]);

    const [currentPage, setCurrentPage] = useState(Number(searchParams?.page) || 0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    const [changeStatusId, setChangeStatusId] = useState(0);
    const [openDialog, setOpenDialog] = React.useState(false);

    const handleChangePage = (event: unknown, newPage: number) => {
        setCurrentPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setCurrentPage(0);
    };

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
            const response = await fetch(`/api/FeeCustom/changeStatus/${changeStatusId}`);
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
                            Changing the status will hide related FeeCustom information..
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
                <TableCell align="center">{row.id}</TableCell>
                <TableCell align="center">
                    {row.serviceName}
                    <br />
                    <span style={{ display: 'block', fontSize: 'smaller', fontStyle: 'italic' }}>
                        {row.serviceDescription}
                    </span>
                </TableCell>
                <TableCell align="center">{row.locationFromName}</TableCell>
                <TableCell align="center">{row.locationToName}</TableCell>
                <TableCell align="center">{row.weighFrom}g - {row.weighTo}g</TableCell>
                <TableCell align="center">{row.overWeightCharge}</TableCell>
                <TableCell align="center">{row.feeCharge}</TableCell>
                <TableCell align="center">{row.timeProcess}</TableCell>
                <TableCell align="center">
                    <span>
                        <Chip onClick={() => handleChangeStatus(row.id)} label={row.status === 1 ? 'Active' : 'Inactive'} color={row.status === 1 ? 'success' : 'error'} />
                    </span>
                </TableCell>
            </TableRow>
        )
    }
    return (
        <div className="App">
            <Paper sx={{ width: "100%", overflow: "hidden", borderRadius: "10px", padding: "15px" }}>
                <ChangeStatus />

                <h1 className="text-4xl text-center antialiased font-semibold mt-5 mb-5"> Fees Managerment</h1>
                <hr />
                <Button
                    variant="contained"
                    onClick={() => router.push('/app/Feecustom/Manager')}
                > Create/Update</Button>
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
                                    <TableRow>
                                        <TableCell align="center" className="text-white">ID</TableCell>
                                        <TableCell align="center" className="text-white">Service</TableCell>
                                        <TableCell align="center" className="text-white">From</TableCell>
                                        <TableCell align="center" className="text-white">To</TableCell>
                                        <TableCell align="center" className="text-white">Weight (kg)</TableCell>
                                        <TableCell align="center" className="text-white">Over Weight {'($/Kg)'}</TableCell>
                                        <TableCell align="center" className="text-white">Fee Charge ($)</TableCell>
                                        <TableCell align="center" className="text-white">Time Process (h)</TableCell>
                                        <TableCell align="center" className="text-white">Status</TableCell>
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