import * as React from 'react';
import Backdrop from '@mui/material/Backdrop';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { FormControlLabel, FormGroup, Switch, Grid, Alert } from '@mui/material';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 500,
    bgcolor: 'background.paper',
    border: '1px solid lightblue',
    borderRadius: 2,
    boxShadow: 24,
    p: 4,
};
export default function ModalAddNew({
    open, setOpen, editItemId, setEditItemId
}: {
    open: boolean,
    setOpen: any,
    editItemId: Number | null,
    setEditItemId: any,
}) {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const handleOpen = () => {
        setOpen(true)
        setEditItemId(null);
    };
    const handleClose = () => setOpen(false);

    const [editItem, SetEditItem] = React.useState<any>(null);

    const [serviceName, setServiceName] = React.useState('');
    const [serviceDescription, setServiceDescription] = React.useState('');
    const [status, setStatus] = React.useState(1);

    const [serviceTypes, setServiceTypes] = React.useState([]);

    const handleOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        const newValue = status === 1 ? 0 : 1;
        if (name == 'status') {
            setStatus(newValue);
        }
    }

    const handleChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        if (name === 'serviceName') {
            setServiceName(value);
        }
        if (name === 'serviceDescription') {
            setServiceDescription(value);
        }
    }

    const onSubmit  = async () => {
        if (editItemId != null) {
            try {
                const requestBody = {
                    id: editItemId,
                    serviceName: serviceName,
                    serviceDescription: serviceDescription,
                    status: status
                };

                console.log("updateR: ", requestBody);

                const response = await fetch(`/api/ServiceType`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(requestBody)
                });

                console.log('updated ServiceType:', response);

                if (response.ok) {
                    setOpen(false);
                    setEditItemId(null);
                    SetEditItem(null);
                    console.log('Update ServiceType successfully!');
                } else {
                    console.error('Create ServiceType Error', response.status);
                }
            } catch (error) {
                console.error('Error', error);
            }
        } else {
            try {
                const requestBody = {
                    serviceName: serviceName,
                    serviceDescription: serviceDescription,
                    status: status
                };

                console.log("CreateR: ", requestBody);

                const response = await fetch(`/api/ServiceType`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(requestBody)
                });

                if (response.ok) {
                    setEditItemId(null);
                    setOpen(false);
                    console.log('Create a new ServiceType successfully!');
                } else {
                    console.error('Create ServiceType Error', response.status);
                }
            } catch (error) {
                console.error('Error', error);
            }
        }
    }

    const getService = async () => {
        const res = await fetch(`/api/ServiceType/getServiceType/${editItemId}`);
        const resJson = await res.json();
        const data = resJson.data;
        SetEditItem(data);
        setEditItemId(data.id);
        setServiceName(data.serviceName);
        setServiceDescription(data.serviceDescription);
        setStatus(data.status);
    }
    useEffect(() => {
        if (editItemId !== null) {
            getService();
        } else {
            setServiceName('');
            setServiceDescription('');
            setStatus(1);
        }
    }, [editItemId])

    useEffect(() => {
        if (editItemId !== null) {
            getService();
        }
        fetchServiceType();
    }, [])

    const fetchServiceType = async () => {
        const res = await fetch(`/api/ServiceType`);
        const resJson = await res.json();
        const data = await resJson.data;
        setServiceTypes(data);
    }
    return (
        <div>
            <Button
                variant="contained"
                onClick={handleOpen}
            > Add Service Type</Button>
            <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                open={open}
                onClose={handleClose}
                closeAfterTransition
                slots={{ backdrop: Backdrop }}
                slotProps={{
                    backdrop: {
                        timeout: 500,
                    },
                }}
            >
                <Fade in={open}>
                    <Box sx={style}>
                        <Typography id="transition-modal-title" variant="h6" component="h2" style={{ textAlign: 'center' }}>
                            {editItemId == null? 'Add Service Type' : 'Edit Service Type'}
                        </Typography>
                        <hr style={{ margin: '20px 50px' }} />
                    
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Service Name"
                                        variant="standard"
                                        {...register('serviceName', { required: 'Service Name is required' })}
                                        error={!!errors.serviceName}
                                        helperText={errors.serviceName?.message as string}
                                        onChange={handleChangeInput}
                                        value={serviceName}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Service Description"
                                        variant="standard"
                                        {...register('serviceDescription', { required: 'Service Description is required' })}
                                        error={!!errors.serviceDescription}
                                        helperText={errors.serviceDescription?.message as string}
                                        onChange={handleChangeInput}
                                        value={serviceDescription}
                                    />
                                </Grid>
                            </Grid>
                        
                        <FormGroup style={{ marginTop: '20px' }}>
                            <FormControlLabel
                                required
                                control={
                                    <Switch
                                        name='status'
                                        value={status}
                                        checked={status === 1}
                                        onChange={handleOnChange}
                                    />
                                }
                                label={status === 1 ? 'Active' : 'Inactive'}
                            />
                        </FormGroup>
                        
                        <Button variant="contained" type="submit">Submit</Button>
                        </form>
                    </Box>
                </Fade>
            </Modal>
        </div >
    );
}