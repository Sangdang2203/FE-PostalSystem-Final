import * as React from 'react';
import Backdrop from '@mui/material/Backdrop';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { FormControlLabel, InputLabel, MenuItem, FormControl, FormGroup, Switch, Grid } from '@mui/material';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { DataLocationType } from '@/helper/interface';
import { Check } from '@mui/icons-material';

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
    open, setOpen, isEditing, setIsEditing, editItem, setEditItem
}: {
    open: boolean,
    setOpen: any,
    isEditing: boolean,
    setIsEditing: any,
    editItem: DataLocationType,
    setEditItem: any
}) {
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const [listProvince, setListProvince] = React.useState<DataLocationType[]>([]);
    const [listDistricts, setListDistricts] = React.useState<DataLocationType[]>([]);
    const [provinceOfSelect, setProvinceOfSelect] = React.useState(0);
    const [districtOfSelect, setdistrictOfSelect] = React.useState(0);

    const [locationName, setLocationName] = React.useState('');
    const [postalCode, setPostalCode] = React.useState('');
    const [locationLevel, setLocationLevel] = React.useState(0);
    const [locationOf, setLocationOf] = React.useState<number | null>();
    const [status, setStatus] = React.useState(1);

    const [errors, setErrors] = React.useState<string[]>([]);

    const handleSelectChange = (event: SelectChangeEvent) => {
        const { name, value } = event.target;
        console.log(name, value);
        if (name == 'locationLevel') {
            setLocationLevel(+value);
            if (+value == 0) {
                setLocationOf(null);
                setProvinceOfSelect(0);
                setdistrictOfSelect(0);
            }
            if (+value == 1) {
                setdistrictOfSelect(0);
            }
            if (+value == 2) {
                setProvinceOfSelect(0);
                setdistrictOfSelect(0);
                setPostalCode('');
            }
        }
        if (name == 'locationOfProvince') {
            if (locationLevel == 1) {
                setProvinceOfSelect(+value);
                setLocationOf(+value);
                console.log(locationLevel, districtOfSelect);
            } else {
                setProvinceOfSelect(+value);
            }
        }
        if (name == 'locationOfDistrict') {
            setdistrictOfSelect(+value);
            setLocationOf(+value);
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

        if (name == 'locationName') {
            setLocationName(value);
        }
        if (name == 'postalCode') {
            setPostalCode(value);
        }
    }

    const handelSubmit = async () => {
        
        if (isEditing) {
            console.log('id:',editItem.id, 'locationName:', locationName, 'postalCode:', postalCode, 'locationLevel:', locationLevel, 'locationOf:', locationOf, 'status:', status);
            try{
                const requestBody = {
                    id: editItem.id,
                    locationName: locationName,
                    postalCode: +locationLevel==2? null: postalCode,
                    locationLevel: locationLevel,
                    locationOf: locationOf,
                    status: status
                };
                const response = await fetch(`/api/Location`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(requestBody)
                });
                const decode = await response.json();
                console.log('response:',decode)
                if (decode.ok) {
                    setIsEditing(false);
                    setEditItem({});
                    setErrors([]);
                    setOpen(false);
                } 
                if (decode.status === 400) {
                        setErrors([...errors, 'Postal code already exists']);
                } else {
                    console.error('Update Location Error', response.status);
                }
            }catch(error){
                console.error('Error', error);
            }
        }else{
            console.log('locationName:', locationName, 'postalCode:', postalCode, 'locationLevel:', locationLevel, 'locationOf:', locationOf, 'status:', status);
            try {
                const requestBody = {
                    locationName: locationName,
                    postalCode: locationLevel==2?null:postalCode,
                    locationLevel: locationLevel,
                    locationOf: locationOf,
                    status: status
                };
                let checkValidate = validateLocation(locationName, postalCode,locationLevel,locationOf);
                if(checkValidate.length > 0){
                    setErrors(checkValidate);
                    return;
                }
               
                const response = await fetch(`/api/Location`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(requestBody)
                });
                const decode = await response.json();
    
                if (decode.ok) {
                    setIsEditing(false);
                    setEditItem({});
                    setErrors([]);
                    setOpen(false);
                } 
                if (decode.status === 400) {
                    setErrors([...errors, 'Postal code already exists']);
                } else {
                    console.error('Create Location Error', response.status);
                }
            } catch (error) {
                console.error('Error', error);
            }
        }
    }

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

    React.useEffect(() => {
        fetchProvince();
        if(!isEditing){
            setLocationName('');
            setPostalCode('');
            setLocationLevel(0);
            setProvinceOfSelect(0);
            setdistrictOfSelect(0);
            setStatus(1);
        }
    }, []);

    const fetchDistrict = async () => {
        const res = await fetch(`/api/Location/GetChildLocation/${provinceOfSelect}`);
        const resData = await res.json();
        const data = resData.data;
        setListDistricts(data.districs);
    }

    React.useEffect(() => {
        if (locationLevel == 2) {
            fetchDistrict();
        }
    }, [provinceOfSelect])

    const EditData = async () => {
        console.log('editItem', editItem);
        
        if(editItem.locationLevel == 0){
            setLocationName(editItem.locationName);
            setPostalCode(editItem.postalCode);
            setLocationLevel(editItem.locationLevel);
            setLocationOf(editItem.locationOf);
            setStatus(editItem.status);
        }
        if(editItem.locationLevel == 1){
            setLocationName(editItem.locationName);
            setPostalCode(editItem.postalCode);
            setLocationLevel(editItem.locationLevel);
            setLocationOf(editItem.locationOf);
            setProvinceOfSelect(editItem.locationOf);
            setStatus(editItem.status);
        }
        if(editItem.locationLevel == 2){
            setLocationName(editItem.locationName);
            setPostalCode(editItem.postalCode);
            setLocationLevel(editItem.locationLevel);
            setLocationOf(editItem.locationOf);
            
            setStatus(editItem.status);
            if(editItem.locationOf != null ){
                const getParentItem = await getLocation(editItem.locationOf);
                setdistrictOfSelect(getParentItem.parentLocation.id);
                setProvinceOfSelect(getParentItem.parentLocation.locationOf);
            }
        }
    }
    const getLocation = async (id: number) => {
        const res = await fetch(`/api/Location/${editItem.id}`);
        const resData = await res.json();
        const data = resData.data;
        return data;
    }
    React.useEffect(() => {
        if(isEditing){
            EditData();
        }else{
            setLocationName('');
            setPostalCode('');
            setLocationLevel(0);
            setProvinceOfSelect(0);
            setdistrictOfSelect(0);
            setStatus(1);
        }
        setErrors([])
    }, [isEditing])

    return (
        <div>
            <Button
                className="mt-2 mb-2 bg-blue-200 text-black hover:bg-blue-500 hover:text-black"
                variant="contained"
                onClick={handleOpen}
            > Add Location</Button>
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
                        <Typography id="transition-modal-title" variant="h6" component="h2">
                            {!isEditing?'Add Locations':'Edit Location'}
                        </Typography>
                        <hr />
                        <Box>
                            {errors && errors.length > 0 && (
                                <div>
                                    {errors.map((error, index) => {
                                        return (
                                            <p key={index} style={{ color: 'red' }}>{error}</p>
                                        )
                                    })}
                                    <hr />
                                </div>
                            )}
                        </Box>
                        
                        <Grid container spacing={2}>
                            <Grid item xs={6}>
                                <TextField
                                    fullWidth
                                    label="locationName"
                                    variant="standard"
                                    name='locationName'
                                    value={locationName.length > 0 ? locationName : ''}
                                    onChange={handleChangeInput}
                                />
                            </Grid>
                            {locationLevel !=2 &&(
                                <Grid item xs={6}>
                                <TextField
                                    fullWidth
                                    label="postalCode"
                                    variant="standard"
                                    name='postalCode'
                                    value={postalCode ? postalCode : ''}
                                    onChange={handleChangeInput}
                                />
                            </Grid>
                            )}
                        </Grid>
                        <FormControl variant="standard" sx={{ width: '100%' }}>
                            <InputLabel id="demo-simple-select-standard-label">Location Level</InputLabel>
                            <Select
                                labelId="demo-simple-select-standard-label"
                                id="demo-simple-select-standard"
                                value={locationLevel ? locationLevel.toString() : '0'}
                                onChange={handleSelectChange}
                                label="locationLevel"
                                name='locationLevel'
                            >
                                <MenuItem value={'0'}>Provice</MenuItem>
                                <MenuItem value={'1'}>District</MenuItem>
                                <MenuItem value={'2'}>Ward</MenuItem>
                            </Select>
                            <Grid container spacing={2}>
                                {locationLevel > 0 && (
                                    <Grid item xs={6}>
                                        <FormControl variant="standard" sx={{ width: '100%' }}>
                                            <InputLabel id="demo-simple-select-standard-label">Select Province</InputLabel>
                                            <Select
                                                labelId="demo-simple-select-standard-label"
                                                id="demo-simple-select-standard"
                                                value={provinceOfSelect ? provinceOfSelect.toString() : '0'}
                                                onChange={handleSelectChange}
                                                label="locationOfProvince"
                                                name='locationOfProvince'
                                            >
                                                <MenuItem value='0'>None</MenuItem>
                                                {listProvince && listProvince.length > 0 && listProvince.map((item, index) => {
                                                    return (
                                                        <MenuItem key={index} value={item.id}>{item.locationName}</MenuItem>
                                                    )
                                                })}
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                )}
                                {locationLevel > 1 && (
                                    <Grid item xs={6}>
                                        <FormControl variant="standard" sx={{ width: '100%' }}>
                                            <InputLabel id="demo-simple-select-standard-label">Select District</InputLabel>
                                            <Select
                                                labelId="demo-simple-select-standard-label"
                                                id="demo-simple-select-standard"
                                                value={districtOfSelect ? districtOfSelect.toString() : '0'}
                                                onChange={handleSelectChange}
                                                label="locationOfDistrict"
                                                name='locationOfDistrict'
                                            >
                                                <MenuItem value='0'>None</MenuItem>
                                                {listDistricts && listDistricts.length > 0 && listDistricts.map((item, index) => {
                                                    return (
                                                        <MenuItem key={index} value={item.id}>{item.locationName}</MenuItem>
                                                    )
                                                })}
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                )}
                            </Grid>
                        </FormControl>
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
                        <Button variant="contained" onClick={handelSubmit}>Submit</Button>
                    </Box>
                </Fade>
            </Modal>
        </div >
    );
}

function validateLocation (locationName:string, postalCode:string, locationLevel:number, locationOf:number | null | undefined){
    const errors = [];
    if(locationName.length === 0){
        errors.push('Location Name is required');
    }
    if(locationLevel < 2){
        if(postalCode.length === 0){
            errors.push('Postal Code is required');
        }
    }
    if(locationLevel != 0){
        if(locationOf == null){
            errors.push('Location Of is required');
        }
    }
    return errors;
}