"use client";
import { useEffect, useState } from "react";
import {
    Button,
    Chip,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Grid,
    Paper,
    Slide,
    Stack,
    Switch,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow,
    TextField,
    Tooltip
} from "@mui/material";
import { toast } from "sonner";
import { Branch } from "@/models/Branch";
import getWardFromAddress from "@/helper/getWardFromAddress";


enum Step {
    WaitingForPickup = 0,
    Created = 1,
    WarehouseFrom = 2,
    InTransit = 3,
    WarehouseTo = 4,
    Shipping = 5,
    Delivered = 6,
    Cancelled = 7,
    Returned = 8,
    Lost = 9,
}

interface Column {
    id: String;
    label: string;
    minWidth?: number;
    align?: "center";
}

const columns: readonly Column[] = [
    { id: "trackingCode", label: "Tracking Code" },
    { id: "from", label: "From" },
    { id: "to", label: "To" },
    { id: "totalFee", label: "Total Fee" },
    { id: "stepProgress", label: "Step Progress" },
    { id: "action", label: "Action" },
];

const PackegesById = (Props: any) => {
    const { id } = Props;

    const [packages, setPackages] = useState([] as any[]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [reloadPackages, setReloadPackages] = useState(true);

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const fetchBranches = async () => {
        const response = await fetch(`/api/branches/packages/${id}`);
        const data = await response.json();
        setReloadPackages(false);
        return data.data;
    };

    useEffect(() => {
        if (reloadPackages) {
            fetchBranches().then((data) => {
                setPackages(data);
            });
        }
        console.log('packages: ', packages);
    }, [reloadPackages]);

    const formatData = ({ trackingCode, nameFrom, nameTo, addressFrom, addressTo, postalCodeFrom, postalCodeTo, service, totalFee }: any): any => {
        return {
            trackingCode,
        };
    };


    return (
        < >
            <Paper elevation={6} sx={{ my: 3, borderRadius: "10px", boxSizing: "border-box" }}>
                <Grid container>
                    <Grid item xs={12} sm={6} sx={{ display: "flex", alignItems: "center", padding: "20px" }}>
                    </Grid>
                    <Grid item xs={12} sm={6}
                        sx={{ display: "flex", alignItems: "center", padding: "20px", textAlign: "right" }}>
                        <TextField id="outlined-basic" label="Search" variant="outlined" size={"small"}
                            fullWidth={true} />
                    </Grid>
                </Grid>
            </Paper>
            <Paper sx={{ width: "100%", overflow: "hidden", borderRadius: "10px" }}>
                <TableContainer sx={{ maxHeight: 440 }}>
                    <Table stickyHeader aria-label="sticky table">
                        <TableHead>
                            <TableRow>
                                {columns.map((column, index) => (
                                    <TableCell key={index} align={column.align}>
                                        {column.label}
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {!packages || packages.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6}>No data found</TableCell>
                                </TableRow>
                            ) : null}
                            {packages &&
                                packages.map((row, x) => {
                                    return (
                                        <TableRow key={x}>
                                            <TableCell>
                                                <Stack direction="row" spacing={1}>
                                                    <Chip label={row.trackingCode} color="success" />
                                                </Stack>
                                            </TableCell>
                                            <Tooltip title={row.addressFrom}>
                                                <TableCell>
                                                    {getWardFromAddress(row.addressFrom)}
                                                </TableCell>
                                            </Tooltip>
                                            <Tooltip title={row.addressTo}>
                                                <TableCell>
                                                    {getWardFromAddress(row.addressTo)}
                                                </TableCell>
                                            </Tooltip>
                                            <TableCell>{row.totalFee}$</TableCell>
                                            <TableCell>
                                                <Stack direction="row" spacing={1}>
                                                    <Chip label={Step[row.step]} color="success" variant="outlined" />
                                                </Stack>
                                            </TableCell>
                                            <TableCell>
                                                <Button variant="contained" color="primary">Detail</Button>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[10, 25, 100]}
                    component="div"
                    count={packages?.length || 0}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Paper>
        </>
    );
};

export default PackegesById;