"use client";
import {useEffect, useState} from "react";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Grid,
    Paper,
    Slide,
    Switch,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow,
    TextField
} from "@mui/material";
import {toast} from "sonner";
import {Branch} from "@/models/Branch";
import splitAddressAndWard from "@/helper/splitAddressAndWard";
import PackegesById from "@/components/PackagesById";

interface Column {
    id: String;
    label: string;
    minWidth?: number;
    align?: "center";
}

const columns: readonly Column[] = [
    {id: "trackingCode", label: "Tracking Code"},
    {id: "from", label: "From"},
    {id: "to", label: "To"},
    {id: "totalFee", label:"Total Fee"},
    {id: "stepProgress", label:"Step Progress"},
    {id: "action", label: "Action"},
];


const App = () => {
    // const [packages , setPackages] = useState([] as any[]);
    // const [page, setPage] = useState(0);
    // const [rowsPerPage, setRowsPerPage] = useState(10);
    // const [reloadPackages, setReloadPackages] = useState(true);

    // const handleChangePage = (event: unknown, newPage: number) => {
    //     setPage(newPage);
    // };

    // const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    //     setRowsPerPage(+event.target.value);
    //     setPage(0);
    // };

    // const fetchBranches = async () => {
    //     const response = await fetch("/api/packages/getall");
    //     const data = await response.json();
    //     setReloadPackages(false);
    //     return data;
    // };


    // useEffect(() => {
    //     if (reloadPackages) {
    //         fetchBranches().then((data) => {
    //             console.log(data.packages);
    //             setPackages(data.packages);
    //         });
    //     }
    // }, [reloadPackages]);

    // const formatData = ({trackingCode, nameFrom, nameTo, addressFrom, addressTo, postalCodeFrom , postalCodeTo, service, totalFee}: any): any => {
    //     return {
    //         trackingCode,
    //     };
    // };


    return (
        < >
            {/* <Paper elevation={6} sx={{my: 3, borderRadius: "10px", boxSizing: "border-box"}}>
                <Grid container>
                    <Grid item xs={12} sm={6} sx={{display: "flex", alignItems: "center", padding: "20px"}}>
                    </Grid>
                    <Grid item xs={12} sm={6}
                          sx={{display: "flex", alignItems: "center", padding: "20px", textAlign: "right"}}>
                        <TextField id="outlined-basic" label="Search" variant="outlined" size={"small"}
                                   fullWidth={true}/>
                    </Grid>
                </Grid>
            </Paper>
            <Paper sx={{width: "100%", overflow: "hidden", borderRadius: "10px"}}>
                <TableContainer sx={{maxHeight: 440}}>
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
                                        <TableRow hover role="checkbox" tabIndex={-1} key={x}>
                                            {columns.map((column, y) => {
                                                let value: any;
                                                value = formatData(row)[column.id as keyof typeof row];
                                                return <TableCell key={y}>{value}</TableCell>;
                                            })}
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
            </Paper> */}
            <PackegesById id={1} />
        </>
    );
};

export default App;
