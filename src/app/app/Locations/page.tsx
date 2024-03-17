'use client'
import * as React from 'react';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { DataLocationType } from '@/helper/interface';
import { useEffect, useState } from 'react';
import { Button, Chip } from '@mui/material';
import formatDate from '@/helper/FormatData';
import ModalAddNew from './ModalAddNew';
import ModeEditIcon from '@mui/icons-material/ModeEdit';

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

const LocationsPage = () => {
    const [listProvince, setListProvince] = useState<DataLocationType[]>([]);
    const [isEditing, setIsEditing] = useState(false);
    const [editItem, setEditItem] = useState<DataLocationType>({} as DataLocationType);
    const [openModalNew, setOpenModalNew] = React.useState(false);
    const [openDialog, setOpenDialog] = React.useState(false);
    const [changeStatusId, setChangeStatusId] = useState(0);
  
    const handleClickOpen = () => {
        setOpenDialog(true);
    };
  
    const handleClose = () => {
        setOpenDialog(false);
    };

    const fetchProvince = async () => {
        try {
            const level = 'province';
            const res = await fetch(`/api/Location/GetListLocationByLevel/${level}`);
            const resData = await res.json();
            const data = resData.data;
            setListProvince(data);
        } catch (error) {
            console.error("Error fetching provinces:", error);
        }
    }

    useEffect(() => {
        fetchProvince();
    }, []);

    useEffect(() => {
        fetchProvince();
    }, [openModalNew]);

    const handleEdit = (item: DataLocationType) => {
        setOpenModalNew(true);
        setIsEditing(true);
        setEditItem(item);
        console.log(item);
    }
    useEffect(() => {
        if(!openModalNew){
            setIsEditing(false);
            setEditItem({} as DataLocationType); 
        }
    },[openModalNew])

    const handleChangeStatus =(id:number)=>{
        setChangeStatusId(id);
        handleClickOpen();
    }
    const fetchStatus = async () => {
        try {
            console.log("changeStatusId",changeStatusId);
            const res = await fetch(`/api/Location/ChangeStatus/${changeStatusId.toString()}`);
            if (res.ok) {
                const updatedListProvince = listProvince.map((item)=>{
                    if(item.id === changeStatusId){
                        item.status = item.status === 1 ? 0 : 1;
                    }
                    return item;
                });
                setListProvince(updatedListProvince);
              } else {
                console.error("Error:");
              }
        } catch (error) {
            console.error("Error fetching provinces:", error);
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
                  Changing the status will hide related location information..
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

    const Row = ({ row }: { row: DataLocationType }) => {
        const [open, setOpen] = React.useState(false);
        const [openWard, setOpenWard] = React.useState(false);
        const [childLocations, setChildLocations] = React.useState<DataLocationType[]>([]);
        const [childWards, setChildWards] = React.useState<DataLocationType[]>([]);
        const [openingWardId, setOpeningWardId] = React.useState(0);

        const handleGetChild = async (id: number) => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/Location/GetChildLocation/${id.toString()}`);
                const data = await res.json();
                setChildLocations(data.districs);
                setOpen(!open);
            } catch (error) {
                console.error("Error fetching Districs locations:", error);
            }
        }
        const handleGetWardChild = async (id: number) => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/Location/GetChildLocation/${id.toString()}`);
                const data = await res.json();
                setChildWards(data.wards);
                setOpenWard(!openWard);
                setOpeningWardId(id);
            } catch (error) {
                console.error("Error fetching Wards locations:", error);
            }
        }

        return (
            <React.Fragment>
                <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
                    <TableCell>
                        <IconButton
                            aria-label="expand row"
                            size="small"
                            onClick={() => handleGetChild(row.id)}
                        >
                            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                        </IconButton>
                    </TableCell>
                    <TableCell component="th" scope="row">{row.id}</TableCell>
                    <TableCell align="right">{row.locationName}</TableCell>
                    <TableCell align="right">{row.postalCode}</TableCell>
                    <TableCell align="right">{row.locationLevel == 0 ? 'Province' : ''}</TableCell>
                    <TableCell align="right">{formatDate(row.createdAt)}</TableCell>
                    <TableCell align="right">{formatDate(row.updatedAt)}</TableCell>
                    <TableCell align="right">
                        <span>
                            <Chip label={row.status === 1 ? 'Active' : 'Inactive'} color={row.status === 1 ? 'success' : 'error'} onClick={()=>handleChangeStatus(row.id)} />
                        </span>
                    </TableCell>
                    <TableCell>
                        <IconButton aria-label="delete" size="large" onClick={() => handleEdit(row)}>
                            <ModeEditIcon fontSize="inherit" />
                        </IconButton>
                    </TableCell>
                </TableRow>
                <TableRow>
                    <TableCell style={{ padding: 0 }} colSpan={9}>
                        <Collapse in={open} timeout="auto" unmountOnExit>
                            <Box>
                                <Table aria-label="purchases">
                                    <TableHead>
                                        <TableRow sx={{ bgcolor: 'warning.main' }}>
                                            <TableCell />
                                            <TableCell >Districts Id</TableCell>
                                            <TableCell align="right">Districts Name</TableCell>
                                            <TableCell align="right">Zip Code</TableCell>
                                            <TableCell align="right">Level</TableCell>
                                            <TableCell align="right">Status</TableCell>
                                            <TableCell align="right">Action</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {childLocations && childLocations.map((child) => (
                                            <React.Fragment key={child.id}>
                                                <TableRow>
                                                    <TableCell>
                                                        <IconButton
                                                            aria-label="expand row"
                                                            size="small"
                                                            onClick={() => handleGetWardChild(child.id)}
                                                        >
                                                            {openWard && child.id === openingWardId ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                                                        </IconButton>
                                                    </TableCell>
                                                    <TableCell component="th" scope="row">{child.id}</TableCell>
                                                    <TableCell align="right">{child.locationName}</TableCell>
                                                    <TableCell align="right">{child.postalCode}</TableCell>
                                                    <TableCell align="right">{child.locationLevel == 1 ? 'District' : ''}</TableCell>
                                                    <TableCell align="right">
                                                        <span>
                                                            <Chip label={child.status === 1 ? 'Active' : 'Inactive'} color={child.status === 1 ? 'success' : 'error'} onClick={()=>handleChangeStatus(child.id)} />
                                                        </span>
                                                    </TableCell>
                                                    <TableCell>
                                                        <IconButton aria-label="delete" size="large" onClick={() => handleEdit(child)}>
                                                            <ModeEditIcon fontSize="inherit" />
                                                        </IconButton>
                                                    </TableCell>
                                                </TableRow>
                                                {child.id === openingWardId && childWards && childWards.length > 0 && (
                                                    <TableRow key={child.id}>
                                                        <TableCell style={{ padding: 0 }} colSpan={9}>
                                                            <Collapse in={openWard} timeout="auto" unmountOnExit>
                                                                <Box >
                                                                    <Table aria-label="purchases">
                                                                        <TableHead>
                                                                            <TableRow sx={{ bgcolor: 'text.disabled' }}>
                                                                                <TableCell />
                                                                                <TableCell >Ward Id</TableCell>
                                                                                <TableCell align="right">Ward Name</TableCell>
                                                                                <TableCell align="right">Ward Zip Code</TableCell>
                                                                                <TableCell align="right">Level</TableCell>
                                                                                <TableCell align="right">Status</TableCell>
                                                                                <TableCell align="right">Action</TableCell>
                                                                            </TableRow>
                                                                        </TableHead>
                                                                        <TableBody>
                                                                            {childWards.map((ward) => (
                                                                                <TableRow key={ward.id}>
                                                                                    <TableCell />
                                                                                    <TableCell component="th" scope="row">{ward.id}</TableCell>
                                                                                    <TableCell align="right">{ward.locationName}</TableCell>
                                                                                    <TableCell align="right">{ward.postalCode}</TableCell>
                                                                                    <TableCell align="right">{ward.locationLevel == 2 ? 'Ward' : ''}</TableCell>
                                                                                    <TableCell align="right">
                                                                                        <span>
                                                                                            <Chip label={ward.status === 1 ? 'Active' : 'Inactive'} color={ward.status === 1 ? 'success' : 'error'} onClick={()=>handleChangeStatus(ward.id)} />
                                                                                        </span>
                                                                                    </TableCell>
                                                                                    <TableCell>
                                                                                        <IconButton aria-label="delete" size="large" onClick={() => handleEdit(ward)}>
                                                                                            <ModeEditIcon fontSize="inherit" />
                                                                                        </IconButton>
                                                                                    </TableCell>
                                                                                </TableRow>
                                                                            ))}
                                                                        </TableBody>
                                                                    </Table>
                                                                </Box>
                                                            </Collapse>
                                                        </TableCell>
                                                    </TableRow>
                                                )}
                                            </React.Fragment>
                                        ))}
                                    </TableBody>
                                </Table>
                            </Box>
                        </Collapse>
                    </TableCell>
                </TableRow>
            </React.Fragment>
        );
    }

    return (
        <div>
            <Paper sx={{ width: "100%", overflow: "hidden", borderRadius: "10px", padding: "15px" }}>
            <h1 className="text-4xl text-center antialiased font-semibold mt-5 mb-5">Locations Management</h1>
            <ModalAddNew open={openModalNew} setOpen={setOpenModalNew} isEditing={isEditing} setIsEditing={setIsEditing} editItem={editItem} setEditItem={setEditItem} />
            <ChangeStatus />
            <TableContainer sx={{ marginTop: '10px' }}>
                <Table aria-label="collapsible table">
                    <TableHead>
                        <TableRow >
                            <TableCell />
                            <TableCell>Location Id</TableCell>
                            <TableCell align="right">Location Name</TableCell>
                            <TableCell align="right">Zip Code</TableCell>
                            <TableCell align="right">Location Level</TableCell>
                            <TableCell align="right">Created At</TableCell>
                            <TableCell align="right">Updated At</TableCell>
                            <TableCell align="right">Status</TableCell>
                            <TableCell align="right">Action</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {listProvince && listProvince.map((row) => (
                            <Row key={row.id} row={row} />
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            </Paper>
        </div>
    );
}

export default LocationsPage;