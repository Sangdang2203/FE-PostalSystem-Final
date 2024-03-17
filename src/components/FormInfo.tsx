'use client'
import React, {useContext, useEffect, useState} from "react";
import {PackageCreateContext} from "@/context/PackageCreateContext";
import {Autocomplete, Box, Grid, TextField} from "@mui/material";
import {Controller} from "react-hook-form";

const FormInfo = (props: any) => {
    const {type} = props;
    // @ts-ignore
    const {
        register,
        errors,
        handleFormChange,
        control,
        handleMultipleFormChange,
        resetField
    } = useContext(PackageCreateContext);
    const [provinces, setProvinces] = useState<{ locationName: string, id: number }[]>([]);
    const [districts, setDistricts] = useState<{ locationName: string, id: number }[]>([]);
    const [wards, setWards] = useState<{ locationName: string, id: number }[]>([]);

    const fetchProvinces = async () => {
        const res = await fetch(`/api/locations/getlistprovince`);
        const data = await res.json();
        return data.data;
    }
    const fetchDistricts = async (provinceId: number) => {
        const res = await fetch(`/api/Location/${provinceId}`);
        const data = await res.json();
        return data.data.childLocations;
    }
    const fetchWards = async (districtId: number) => {
        const res = await fetch(`/api/Location/${districtId}`);
        const data = await res.json();
        return data.data.childLocations;
    }


    useEffect(() => {
        fetchProvinces().then(r => setProvinces(r));
    }, []);

    return (
        <>
            <Box>
                <TextField
                    margin="dense"
                    label="Phone Number"
                    type="text"
                    name="phoneNumber"
                    required={true}
                    {...register(`phoneNumber_${type}`, {
                        required: "Phone Number is required",
                        pattern: {
                            value: /^[0-9]{10}$/,
                            message: "Phone Number must be 10 digits"
                        }
                    })}
                    onChange={handleFormChange}
                    error={!!(errors[`phoneNumber_${type}`])}
                    helperText={errors[`phoneNumber_${type}`]?.message}
                    size={"small"}
                    fullWidth={true}
                    autoComplete={'new-value'}
                />
                <TextField
                    margin="dense"
                    label="Full Name"
                    type="text"
                    name="fullName"
                    required={true}
                    {...register(`fullName_${type}`, {
                        required: "Full Name is required",
                        pattern: {
                            value: /^[a-zA-Z\s]+$/gu,
                            message: "Full Name must be alphabet"
                        }
                    })}
                    onChange={handleFormChange}
                    error={!!(errors[`fullName_${type}`])}
                    helperText={errors[`fullName_${type}`]?.message}
                    size={"small"}
                    fullWidth={true}
                    autoComplete={'new-value'}
                />
                <TextField
                    margin="dense"
                    label="Address"
                    type="text"
                    name="address"
                    required={true}
                    {...register(`address_${type}`, {
                        required: "Address is required",
                    })}
                    onChange={(e) => {
                        e.target.value = e.target.value.replace(/[^0-9a-zA-Z//\s,+-]/g, '');
                        handleFormChange(e);
                    }}
                    error={!!(errors[`address_${type}`])}
                    helperText={errors[`address_${type}`]?.message}
                    size={"small"}
                    fullWidth={true}
                    autoComplete={'new-value'}
                />
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={4}>
                        <Controller
                            name={`province_${type}`}
                            control={control}
                            defaultValue={null}
                            rules={{required: "Province is required"}}
                            render={({field}) => (
                                <Autocomplete
                                    {...field}
                                    options={provinces}
                                    getOptionLabel={(option) => option.locationName}
                                    disableClearable={true}
                                    onChange={(event, value) => {
                                        field.onChange(value);
                                        if (value) {
                                            fetchDistricts(value.id).then(r => setDistricts(r));
                                            handleFormChange({
                                                target: {
                                                    name: `province_${type}`,
                                                    value: value.locationName
                                                }
                                            });
                                            setWards([]);
                                            resetField(`district_${type}`);
                                            resetField(`ward_${type}`);
                                        }
                                    }}
                                    renderInput={(params) =>
                                        <TextField
                                            {...params}
                                            autoComplete={'none'}
                                            label="Province"
                                            margin="dense"
                                            size={"small"}
                                            helperText={errors[`province_${type}`]?.message}
                                            error={!!(errors[`province_${type}`])}
                                        />
                                    }
                                />
                            )}
                        />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <Controller
                            name={`district_${type}`}
                            control={control}
                            defaultValue={null}
                            rules={{required: "District is required"}}
                            render={({field}) => (
                                <Autocomplete
                                    {...field}
                                    disableClearable={true}
                                    isOptionEqualToValue={(option, value) => option.id === value.id}
                                    options={districts}
                                    getOptionLabel={(option) => option.locationName}
                                    onChange={(event, value) => {
                                        field.onChange(value);
                                        if (value) {
                                            fetchWards(value.id).then(r => setWards(r));
                                            handleMultipleFormChange([
                                                {name: `district_${type}`, value: value.locationName},
                                                {name: `postalCode_${type}`, value: value.postalCode}
                                            ]);
                                            resetField(`ward_${type}`);
                                        }
                                    }}
                                    renderInput={(params) =>
                                        <TextField
                                            {...params}
                                            label="District"
                                            margin="dense"
                                            size={"small"}
                                            helperText={errors[`district_${type}`]?.message}
                                            error={!!(errors[`district_${type}`])}
                                            autoComplete={'none'}
                                        />
                                    }
                                />
                            )}
                        />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <Controller
                            name={`ward_${type}`}
                            control={control}
                            defaultValue={null}
                            rules={{required: "Ward is required"}}
                            render={({field}) => (
                                <Autocomplete
                                    {...field}
                                    disableClearable={true}
                                    isOptionEqualToValue={(option, value) => option.id === value.id}
                                    options={wards}
                                    getOptionLabel={(option) => option.locationName}
                                    onChange={(event, value) => {
                                        field.onChange(value);
                                        handleFormChange({target: {name: `ward_${type}`, value: value.locationName}});
                                    }}
                                    renderInput={(params) =>
                                        <TextField
                                            {...params}
                                            label="Ward"
                                            margin="dense"
                                            size={"small"}
                                            helperText={errors[`ward_${type}`]?.message}
                                            error={!!(errors[`ward_${type}`])}
                                            autoComplete={'none'}
                                        />
                                    }
                                />
                            )}
                        />
                    </Grid>
                </Grid>
            </Box>
        </>
    );
}
export default FormInfo;