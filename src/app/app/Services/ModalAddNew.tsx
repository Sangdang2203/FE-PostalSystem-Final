import * as React from 'react';
import Backdrop from '@mui/material/Backdrop';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { FormControlLabel, InputLabel, MenuItem, FormControl, FormGroup, Switch, Grid, Alert, Tooltip, IconButton } from '@mui/material';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { DataServiceType, DataTypeService } from '@/helper/interface';
import { useEffect } from 'react';
import TipsAndUpdatesOutlinedIcon from '@mui/icons-material/TipsAndUpdatesOutlined';

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
    data: DataServiceType[],
    setData: any
}) {
    const handleOpen = () => {
        setOpen(true)
        setEditItemId(null);
    };
    const handleClose = () => setOpen(false);

    const [editService, SetEditService] = React.useState<DataServiceType | null>(null);

    const [serviceTypeId, setServiceTypeId] = React.useState<number | null>(null);
    const [weighFrom, setWeighFrom] = React.useState(0);
    const [weighTo, setWeighTo] = React.useState(0);
    const [status, setStatus] = React.useState(1);

    const [errors, setErrors] = React.useState<string[]>([]);
    const [serviceTypes, setServiceTypes] = React.useState([]);
    const [serviceTypeSelect, SetServiceTypeSelect] = React.useState<number | null>(null);
    const [weightAllowRange, setWeightAllowRange] = React.useState<any[]>([]);

    const handleSelectChange = (event: SelectChangeEvent) => {
        const { name, value } = event.target;
        if (name == 'serviceType') {
            SetServiceTypeSelect(+value);
            if(value !=null){
                setErrors([]);
                setWeightAllowRange([]);
            }
        }
    };

    const handleOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        const newValue = status === 1 ? 0 : 1;
        if (name == 'status') {
            setStatus(newValue);
        }
    }

    const handleChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        if (name === 'weighFrom') {
            setWeighFrom(Number(value));
        }
        if (name === 'weighTo') {
            if (+value > 0) {
                setWeighTo(Number(value));
            } else {
                setWeighTo(999999999);
            }
        }
    }
    const getAlowWeightRange = async (id: number) => {
        const res = await fetch(`/api/services/AllowRange/${id}`);
        const resJson = await res.json();
        const data = resJson.data;
        console.log(data);
        setWeightAllowRange(data);
    }

    const handelSubmit = async () => {
        if (editItemId != null) {
            try {
                const requestBody = {
                    id: editItemId,
                    serviceTypeId: serviceTypeSelect,
                    weighFrom: weighFrom,
                    weighTo: weighTo,
                    status: status
                };

                console.log("updateR: ", requestBody);

                if (weighTo === 0) {
                    requestBody.weighTo = 999999999;
                }

                let checkValidate = validateService(requestBody.serviceTypeId, weighFrom, requestBody.weighTo, status);

                if (checkValidate.length > 0) {
                    setErrors(checkValidate);
                    return;
                }

                if (requestBody.serviceTypeId != null) {
                    const res = await validateWeight(requestBody.serviceTypeId, requestBody.weighFrom, requestBody.weighTo, +editItemId);
                    if (res.check == false) {
                        if (res.check == false) {
                            setErrors(['Weight range already exists']);
                            console.log('ValidateWeight: ', res.data);
                            console.log('lenght: ', res.data.length);
                            let newErrors = [`Weight range already exists [${res.data[0].weighFrom} - ${res.data[0].weighTo}]`];
                            if(res.data.length > 1){
                                newErrors.push(`Weight range already exists [${res.data[1].weighFrom} - ${res.data[1].weighTo}]`);
                            }
                            setErrors(newErrors);
                            return;
                        }
                    }
                    setErrors([]);
                }

                const response = await fetch(`/api/services`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(requestBody)
                });

                console.log('updated service:', response);

                if (response.ok) {
                    setOpen(false);
                    SetEditService(null);
                    setErrors([]);
                    setEditItemId(null);
                    console.log('Update Service successfully!');
                    reset();
                } else {
                    if (response.status === 400) {
                        const error = await response.text();
                        if (error == 'Postal code already exists') {
                            setErrors([...errors, 'Postal code already exists']);
                        }
                        console.error('Bad Request Error:', error);
                    } else {
                        console.error('Create Service Error', response.status);
                    }
                }
            } catch (error) {
                console.error('Error', error);
            }
        } else {
            try {
                const requestBody = {
                    serviceTypeId: serviceTypeSelect,
                    weighFrom: weighFrom,
                    weighTo: weighTo,
                    status: status
                };

                console.log("CreateR: ", requestBody);

                if (weighTo === 0) {
                    requestBody.weighTo = 999999999;
                }

                let checkValidate = validateService(requestBody.serviceTypeId, weighFrom, requestBody.weighTo, status);

                if (checkValidate.length > 0) {
                    setErrors(checkValidate);
                    return;
                }

                if (requestBody.serviceTypeId != null) {
                    const res = await validateWeight(requestBody.serviceTypeId, requestBody.weighFrom, requestBody.weighTo, 0);
                    console.log("CreateR: ", res);
                    if (res.check == false) {
                        setErrors(['Weight range already exists']);
                        let newErrors = [`Weight range already exists [${res.data[0].weighFrom} - ${res.data[0].weighTo}]`];
                        if(res.data.length > 1){
                            newErrors.push(`Weight range already exists [${res.data[1].weighFrom} - ${res.data[1].weighTo}]`);
                        }   
                        await getAlowWeightRange(requestBody.serviceTypeId);

                        setErrors(newErrors);
                        return;
                    }
                    setErrors([]);
                }
                const response = await fetch(`/api/services`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(requestBody)
                });

                if (response.ok) {
                    setOpen(false);
                    SetEditService(null);
                    setErrors([]);
                    setEditItemId(null);
                    console.log('Create a new Service successfully!');
                    reset();
                } else {
                    if (response.status === 400) {
                        const error = await response.text();
                        if (error == 'Postal code already exists') {
                            setErrors([...errors, 'Postal code already exists']);
                        }
                        console.error('Bad Request Error:', error);
                    } else {
                        console.error('Create Service Error', response.status);
                    }
                }
            } catch (error) {
                console.error('Error', error);
            }
        }
    }
    const reset = () => {
        setServiceTypeId(null);
        setWeighFrom(0);
        setWeighTo(0);
        setStatus(1);
        SetServiceTypeSelect(null);
        setErrors([]);
    }
    const validateWeight = async (serviceTypeId: number, weightFrom: number, weightTo: number, serviceId: number) => {
        const res = await fetch(`/api/services/ValidateServiceWeight/${serviceTypeId}/${weightFrom}/${weightTo}/${serviceId}`);
        const resJson = await res.json();
        console.log(resJson);
        return resJson;
    }

    const getService = async () => {
        const res = await fetch(`/api/services/getService/${editItemId}`);
        const resJson = await res.json();
        const data = resJson.data;
        SetEditService(data);
        setEditItemId(data.id);
        setWeighFrom(data.weighFrom);
        setWeighTo(data.weighTo);
        setStatus(data.status);
        SetServiceTypeSelect(data.serviceTypeId);
    }
    useEffect(() => {
        if (editItemId !== null) {
            getService();
        } else {
            setServiceTypeId(null);
            setWeighFrom(0);
            setWeighTo(0);
            setStatus(1);
            SetServiceTypeSelect(null);
        }
    }, [editItemId])

    useEffect(() => {
        if (editItemId !== null) {
            getService();
        } else {
            setServiceTypeId(null);
            setWeighFrom(0);
            setWeighTo(0);
            setStatus(1);
            SetServiceTypeSelect(null);
        }
        fetchServiceType();
        console.log("listTYPe", serviceTypes);
    }, [])

    const fetchServiceType = async () => {
        const res = await fetch(`/api/ServiceType`);
        const resJson = await res.json();
        const data = await resJson.data;
        setServiceTypes(data);
        console.log("resJson", data);
    }
    return (
        <div>
            <Button
                variant="contained"
                onClick={handleOpen}
            > Add Service</Button>
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
                    {editItemId == null? 'Add Service':'Edit Service'}
                    {weightAllowRange && weightAllowRange.length>0 && (
                        <Tooltip title={
                            <React.Fragment>
                                Allow Range:
                            {weightAllowRange && weightAllowRange.map((item, index) => (
                                <div key={index}>{item.from} - {item.to}</div>
                            ))}
                            </React.Fragment>
                        }>
                            <TipsAndUpdatesOutlinedIcon style={{ marginLeft: 8, verticalAlign: 'middle' }} />
                        </Tooltip>
                    )}
                    </Typography>
                        <hr style={{ margin: '20px 50px' }} />
                        <Box>
                            {errors && errors.length > 0 && (
                                <Grid item xs={12}>
                                    <div className="error-message">
                                        {errors.map((msg, i) => (
                                            <Alert severity="success" color="warning" key={i} sx={{marginBottom:'5px'}}>
                                                {msg}
                                            </Alert>
                                        ))}
                                    </div>
                                </Grid>
                            )}
                        </Box>
                        <Grid sx={{ marginBottom: '10px', marginTop: '10px' }}>
                            <Select
                                value={serviceTypeSelect !== null ? serviceTypeSelect.toString() : ""}
                                displayEmpty
                                name="serviceType"
                                onChange={handleSelectChange}
                                fullWidth
                            >
                                <MenuItem value="" disabled>Choice Type Service</MenuItem>
                                {serviceTypes && serviceTypes.length > 0 && serviceTypes.map((item: any, index: number) => {
                                    return (
                                        <MenuItem key={index} value={item.id}>{item.serviceName}</MenuItem>
                                    )
                                })}
                            </Select>
                        </Grid>
                        <Grid container spacing={2}>
                            <Grid item xs={6}>
                                <TextField
                                    fullWidth
                                    label="weighFrom"
                                    variant="standard"
                                    name='weighFrom'
                                    value={weighFrom ? weighFrom : 0}
                                    onChange={handleChangeInput}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    fullWidth
                                    label="weighTo"
                                    variant="standard"
                                    name='weighTo'
                                    value={weighTo ? weighTo : 0}
                                    onChange={handleChangeInput}
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
                        <Grid container spacing={2}>
                            <Grid item xs={6}>
                            <Button variant="contained" onClick={handelSubmit}>Submit</Button>
                            </Grid>
                        </Grid>
                        
                    </Box>
                </Fade>
            </Modal>
        </div >
    );
}

function validateService(serviceTypeId: number | null, weighFrom: number, weighTo: number, status: number) {
    let errorList = [];
    if (serviceTypeId == null) {
        errorList.push("Please choices Service Type");
    }
    if (weighFrom < 0) {
        errorList.push("Please Enter one weigh From");
    }
    if (weighTo <= weighFrom) {
        errorList.push("Weigh To must be greater than weigh From");
    }
    return errorList;
}