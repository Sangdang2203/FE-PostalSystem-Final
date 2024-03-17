'use client'
import React, { FormEventHandler, useEffect, useState } from 'react';
// import { makeStyles } from '@mui/styles';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { Alert, AlertTitle, Autocomplete, Divider, Grid, InputLabel, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import ViewInArIcon from '@mui/icons-material/ViewInAr';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import SearchIcon from '@mui/icons-material/Search';
import { DataFeeCustomType, DataLocationType } from '@/helper/interface';



const EstimatePage: React.FC = () => {
    const [listProvinces, setListProvinces] = useState<DataLocationType[]>([]);
    const [listDistricts, setListDistricts] = useState<DataLocationType[]>([]);

    const [listDistrictsSender, setListDistrictsSender] = useState<DataLocationType[]>([]);
    const [listDistrictsReceiver, setListDistrictsReceiver] = useState<DataLocationType[]>([]);

    const [isLoading, SetIsLoading] = useState(true)
    const [getingFee, setGetingFee] = useState(false);

    const [senderProvince, setSenderProvince] = useState<number>(0);
    const [senderDistrict, setSenderDistrict] = useState<number>(0);
    const [receiverProvince, setReceiverProvince] = useState<number>(0);
    const [receiverDistrict, setReceiverDistrict] = useState<number>(0);
    const [senderDistrictSelected, setSenderDistrictSelected] = useState<DataLocationType | null>(null);
    const [receiverDistrictSelected, setReceiverDistrictSelected] = useState<DataLocationType | null>(null);

    const [weight, setWeight] = useState('');
    const [data, setData] = useState({ postalCodeFrom: '', postalCodeTo: '', weight: 0 });
    const [listFee, setListFee] = useState<DataFeeCustomType[]>([]);
    const [errors, setErrors] = useState<string[]>([]);

    const validate = () => {
        let errors = [];
        if (data.postalCodeFrom == '') {
            errors.push('Please choice Sender Location');
        }
        if (data.postalCodeTo == '') {
            errors.push('Please choice Receiver Location');
        }
        return errors;
    }

    const handleOnchange = (e: SelectChangeEvent<string>) => {
        e.preventDefault();
        const { name, value } = e.target;
        if (+value != 0) {
            if (name == "senderProvince") {
                setSenderProvince(+value);
            }
            if (name == "receiverProvince") {
                setReceiverProvince(+value);
            }
        }
    }
    const handleSubmit: FormEventHandler<HTMLFormElement> = (e) => {
        e.preventDefault();
        setData({ ...data, weight: +weight });
        getFeeByPostalCodeWeight();
        setGetingFee(true);
    }
    const getFeeByPostalCodeWeight = async () => {
        const errors = validate();
        if (errors.length > 0) {
            setErrors(errors);
            return;
        }
        const url = `/api/FeeCustom/GetFeeByPostalCodeWeight/${data.postalCodeFrom}/${data.postalCodeTo}/${data.weight}`;
        const res = await fetch(url);
        const payload = await res.json();
        const fetchData: DataFeeCustomType[] = payload.data;
        if (res.ok) {
            setListFee(fetchData);
            setErrors([]);
        } else {
            console.log("api backend error");
        }
        console.log("fetchData", fetchData);
    }
    useEffect(() => {
        getFeeByPostalCodeWeight();
    }, [getingFee])

    useEffect(() => {
        if (isLoading) {
            const fetchProvince = async () => {
                const level = 'province';
                const res = await fetch(`/api/Location/GetListLocationByLevel/${level}`);
                const resData = await res.json();
                const data: DataLocationType[] = resData.data;
                setListProvinces(data);
                SetIsLoading(false);
            }
            fetchProvince();
            console.log("listDistricts:", listDistricts);
            setErrors([]);
        }
    }, [isLoading]);


    useEffect(() => {
        const fetchDistrict = async () => {
            if (senderProvince !== 0) {
                const res = await fetch('/api/Location/GetChildLocation/' + senderProvince.toString());
                const resData = await res.json();
                const data = resData.data;
                setListDistrictsSender(data.districs);
            }
        }
        fetchDistrict();
        setSenderDistrictSelected(null);
        console.log("listDistricts:", listDistricts);
        setData({ ...data, postalCodeFrom: '' });
        setListFee([]);
    }, [senderProvince]);

    useEffect(() => {
        const fetchDistrict = async () => {
            if (receiverProvince !== 0) {
                const res = await fetch('/api/Location/GetChildLocation/' + receiverProvince.toString());
                const resData = await res.json();
                const data = resData.data;
                setListDistrictsReceiver(data.districs);
            }
        }
        fetchDistrict();
        setReceiverDistrictSelected(null);
        console.log("setListDistrictsReceiver:", listDistricts);
        setData({ ...data, postalCodeTo: '' });
        setListFee([]);
    }, [receiverProvince]);

    const handleAutocompleteOnchange = (e: any, value: DataLocationType | null, id: string) => {
        e.preventDefault();
        console.log(id, value);
        if (id === "listDistrictsSender" && value != null) {
            setSenderDistrict(value.id);
            setData({ ...data, postalCodeFrom: value.postalCode });
        }
        if (id === "listDistrictsReceiver" && value != null) {
            setReceiverDistrict(value.id);
            setData({ ...data, postalCodeTo: value.postalCode });
        }
    }
    const renderListFee = (data: any) => {
        return (
            <Table>
                <TableHead>
                    <TableRow sx={{ bgcolor: 'primary.main' }}>
                        <TableCell className='font-bold bg-gray-100'>Service Name</TableCell>
                        <TableCell className='font-bold bg-gray-100'>Over Weight Charge</TableCell>
                        <TableCell className='font-bold bg-gray-100'>Fee Charge</TableCell>
                        <TableCell className='font-bold bg-gray-100'>Time Process</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {data.map((row:any, index:number) => {
                        return (
                            <TableRow key={index}>
                                <TableCell>{row.serviceName}</TableCell>
                                <TableCell>{row.overWeightCharge}$</TableCell>
                                <TableCell>{row.feeCharge}$</TableCell>
                                <TableCell>{row.timeProcess}</TableCell>
                            </TableRow>
                        )
                    })}
                </TableBody>
            </Table>
        );
    }
    return (
        <div style={{ marginLeft: '50px', marginRight: '50px' }}>
            <Typography className="mt-5 mb-5" variant="h4">Ước tính cước phí</Typography>
            <div className="border-2 border-slate-200 rounded-lg">
                <form className=" p-5 pr-0" onSubmit={handleSubmit}>
                    <Grid item container rowSpacing={2} columnSpacing={{ xs: 1, sm: 20, md: 3 }}>
                        <Grid item xs={12}>
                            <InputLabel className='mt-4 mb-4'>
                                <span><ViewInArIcon /></span>PACKAGE INFORMATION
                            </InputLabel>
                            {errors && errors.length > 0 && (
                                <Alert severity="error">
                                    <AlertTitle>Error</AlertTitle>
                                    {errors.map((err, index) => (
                                        <div key={index}> {err} </div>
                                    ))}
                                </Alert>
                            )}
                            <InputLabel sx={{ marginBottom: '10px', marginTop: '10px' }}>
                                Package Weight
                            </InputLabel>
                            <TextField
                                label="Trọng lượng (kg)"
                                type="number"
                                value={weight}
                                onChange={(e) => setWeight(e.target.value)}
                                fullWidth
                            />
                        </Grid>
                        <Grid item className="pr-2" xs={6}>
                            <InputLabel className='mt-4 mb-4'>
                                <span><PersonOutlineIcon /></span>SENDER
                            </InputLabel>
                            <Select
                                label="Province (sender)"
                                value={senderProvince !== 0 ? senderProvince.toString() : "99"}
                                onChange={handleOnchange}
                                name="senderProvince"
                                fullWidth
                            >
                                <MenuItem value="99">Select Province</MenuItem>
                                {listProvinces&&listProvinces.length > 0 && listProvinces.map((province, index) => {
                                    return (
                                        <MenuItem key={index} value={province.id}>{province.locationName}</MenuItem>
                                    )
                                })}
                            </Select>
                        </Grid>
                        <Grid item className="pl-2" xs={6}>
                            <InputLabel className='mt-4 mb-4'>
                                <span><PersonOutlineIcon /></span>RECEIVER
                            </InputLabel>
                            <Select
                                label="Province (receiver)"
                                value={receiverProvince !== 0 ? receiverProvince.toString() : "99"}
                                onChange={handleOnchange}
                                name="receiverProvince"
                                fullWidth
                            >
                                <MenuItem value="99">Select Province</MenuItem>
                                {listProvinces&& listProvinces.length > 0 && listProvinces.map((province, index) => {
                                    return (
                                        <MenuItem key={index} value={province.id}>{province.locationName}</MenuItem>
                                    )
                                })}
                            </Select>
                        </Grid>
                        <Grid item className="pr-2" xs={6}>
                            <InputLabel className='mt-4 mb-4'>
                                Districts
                            </InputLabel>
                            <Autocomplete
                                style={{ width: '100%', marginTop: '10px' }}
                                disablePortal
                                id="listDistrictsSender"
                                options={listDistrictsSender}
                                getOptionLabel={(listDistrictsSender) => listDistrictsSender.locationName}
                                getOptionKey={(listDistrictsSender) => listDistrictsSender.id}
                                sx={{ width: 300 }}
                                value={senderDistrictSelected}
                                onChange={(event, value) => {
                                    setSenderDistrictSelected(value);
                                    handleAutocompleteOnchange(event, value, "listDistrictsSender")
                                }}
                                renderInput={(params) => <TextField {...params} label="Districts" />}
                            />
                        </Grid>
                        <Grid item className="pl-2" xs={6}>
                            <InputLabel className='mt-4 mb-4'>
                                Districts
                            </InputLabel>
                            <Autocomplete
                                style={{ width: '100%', marginTop: '10px' }}
                                disablePortal
                                id="listDistrictsReceiver"
                                options={listDistrictsReceiver}
                                getOptionLabel={(listDistrictsReceiver) => listDistrictsReceiver.locationName}
                                getOptionKey={(listDistrictsReceiver) => listDistrictsReceiver.id}
                                sx={{ width: 300 }}
                                value={receiverDistrictSelected}
                                onChange={(event, value) => {
                                    setReceiverDistrictSelected(value);
                                    handleAutocompleteOnchange(event, value, "listDistrictsReceiver")
                                }}
                                renderInput={(params) => <TextField {...params} label="Districts" />}
                            />
                        </Grid>
                        <Button type="submit" style={{ marginLeft: '24px', marginTop: '12px' }} variant="outlined" startIcon={<SearchIcon />}>
                            Tra Cứu
                        </Button>

                    </Grid>
                </form>
            </div>
            <div className="m-5 border-2 rounded-lg">
                <Grid className='bg-zinc-200 pt-4 pb-4 p-5'>
                    <Divider sx={{ marginBottom:'15px', marginTop:'15px' }}><InputLabel>MY SERVICES</InputLabel></Divider>
                </Grid>
                <Grid className="mt-5 mb-5 p-5">
                    {listFee.length === 0 && (
                        <Alert variant="outlined" severity="warning" sx={{ display: 'flex', justifyContent: 'center' }}>
                            Not Found!!!
                        </Alert>
                    )}
                    {listFee && listFee.length > 0 && renderListFee(listFee)}
                </Grid>
            </div>
        </div>
    );
};

export default EstimatePage;
