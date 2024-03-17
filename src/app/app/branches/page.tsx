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

interface Column {
    id: String;
    label: string;
    minWidth?: number;
    align?: "center";
}

const columns: readonly Column[] = [
    {id: "id", label: "ID"},
    {id: "branchName", label: "Branch Name"},
    {id: "phoneNumber", label: "Phone Number"},
    {id: "address", label: "Address"},
    {id: "status", label: "Status"},
    {id: "action", label: "Action"},
];


const App = () => {
    const [branchs, setBranchs] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [reloadBranchs, setReloadBranchs] = useState(true);
    const [isOpenCreateBranch, setIsOpenCreateBranch] = useState(false);
    const [selectedBranch, setSelectedBranch] = useState({} as Branch);

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const fetchBranches = async () => {
        const response = await fetch("/api/branches");
        const data = await response.json();
        setReloadBranchs(false);
        return data;
    };

    const openDialog = (branch? : any) => {
        if (branch) {
            setSelectedBranch({...branch, address: splitAddressAndWard(branch.address).address , ward: splitAddressAndWard(branch.address).ward});
        }
        setIsOpenCreateBranch(true);
    }

    const closeCreateBranch = ( event?: any, reason?: string) => {
        if(reason === "backdropClick"){
            return;
        }
        setIsOpenCreateBranch(false);
        setSelectedBranch({} as Branch);
    };

    const submitCreater = () => {
        closeCreateBranch();
        console.log("submitCreater");
    };

    useEffect(() => {
        if (reloadBranchs) {
            fetchBranches().then((data) => {
                console.log(data);
                setBranchs(data.branchs);
            });
        }
    }, [reloadBranchs]);

    const formatData = ({id, branchName, phoneNumber, address, province, district, postalCode, status,}: any): any => {
        return {
            id,
            branchName,
            phoneNumber,
            address:
                address +
                ", District: " +
                district +
                ", Province: " +
                province +
                ", Postal Code: " +
                postalCode,
            status,
        };
    };

    const toggleStatus = async (id: number) => {
        try {
            const response = await fetch(`/api/branches/togglestatus`, {
                cache: "no-store",
                method: "POST",
                body: JSON.stringify({id}),
            });
            if (response.status === 200) {
                const data = await response.json();
                switch (data.status) {
                    case 200:
                        toast.success("Branch status updated successfully");
                        break;
                    case 404:
                        toast.error("Branch not found");
                        setReloadBranchs(true);
                        break;
                    default:
                        toast.error("Something wrong!!!");
                        setReloadBranchs(true);
                        break;
                }
                return data.data;
            }
            return null;
        } catch (error) {
            console.log(error);
            toast.error("Something wrong!!!");
        }
    };

    const handleSwitch = async (id: number, newValue: boolean) => {
        try {
            const newBranches: any[] = [...branchs];
            newBranches[id] = {...newBranches[id], status: newValue};
            setBranchs(newBranches as []);
            let isError = await toggleStatus(newBranches[id].id);
            if (!isError) {
                throw new Error("Something wrong!!!");
            }
        } catch (error) {
            console.log(error);
            setBranchs(branchs);
        }
    };

    return (
        <>
            <Paper elevation={6} sx={{my: 3, borderRadius: "10px", boxSizing: "border-box"}}>
                <Grid container>
                    <Grid item xs={12} sm={6} sx={{display: "flex", alignItems: "center", padding: "20px"}}>
                        <Button variant="contained" color="primary" onClick={()=>{openDialog()}}>
                            Create Branch
                        </Button>
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
                            {!branchs || branchs.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6}>No data found</TableCell>
                                </TableRow>
                            ) : null}
                            {branchs &&
                                branchs.map((row, x) => {
                                    return (
                                        <TableRow hover role="checkbox" tabIndex={-1} key={x}>
                                            {columns.map((column, y) => {
                                                let value: any;
                                                value = formatData(row)[column.id as keyof typeof row];
                                                if (column.id === "status") {
                                                    return (
                                                        <TableCell key={y}>
                                                            <Switch
                                                                checked={!!value}
                                                                onChange={() => {
                                                                    handleSwitch(x, !value);
                                                                }}
                                                                inputProps={{"aria-label": "controlled"}}
                                                            />
                                                        </TableCell>
                                                    );
                                                }
                                                if (column.id === "action") {
                                                    return (
                                                        <TableCell key={y}>
                                                            <Button variant="contained" color="primary" onClick={()=>{openDialog(row)}}>
                                                                View/Edit
                                                            </Button>
                                                        </TableCell>
                                                    );
                                                }
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
                    count={branchs?.length || 0}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Paper>
            <Dialog
                open={isOpenCreateBranch}
                TransitionComponent={Slide}
                maxWidth={"sm"}
                onClose={closeCreateBranch}
                disableEscapeKeyDown={true}
                aria-describedby="alert-dialog-slide-description"
            >
                <DialogTitle>{"Create new Branch"}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-slide-description">
                        <TextField
                            margin="dense"
                            id="branchName"
                            label="Branch Name"
                            type="text"
                            fullWidth
                            value={selectedBranch.branchName}
                            placeholder={"Branch Name"}
                        />
                        <TextField
                            margin="dense"
                            id="phoneNumber"
                            label="Phone Number"
                            type="text"
                            fullWidth
                            value={selectedBranch.phoneNumber}
                            placeholder={"Phone Number"}
                        />
                        <TextField
                            margin="dense"
                            id="address"
                            label="Address"
                            type="text"
                            fullWidth
                            value={selectedBranch.address}
                            placeholder={"Address"}
                        />
                        <TextField
                            margin="dense"
                            id="ward"
                            label="Ward"
                            type="text"
                            fullWidth
                            value={selectedBranch.ward}
                            placeholder={"Ward"}
                        />
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={submitCreater}>Create</Button>
                    <Button onClick={closeCreateBranch}>Cancel</Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default App;
