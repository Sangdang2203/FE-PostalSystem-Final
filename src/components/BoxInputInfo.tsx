'use client'
import * as React from 'react';
import { useContext } from 'react';
import {
    Autocomplete,
    Card,
    CardContent,
    FormControlLabel,
    Radio,
    RadioGroup,
    TextField,
    Typography
} from "@mui/material";
import Box from "@mui/material/Box";
import FormInfo from "@/components/FormInfo";
import { PackageCreateContext } from "@/context/PackageCreateContext";
import splitAddressAndWard from "@/helper/splitAddressAndWard";
import { useSession } from "next-auth/react";

const BoxInputInfo = (props: any) => {
    const { data: session, status } = useSession();
    const { typeBox, xs } = props;
    // @ts-ignore
    const { register, errors, handleFormChange } = useContext(PackageCreateContext);
    const [listAddress, setListAddress] = React.useState([]);
    const [chooseAddress, setChooseAddress] = React.useState('true');
    const fetchAddress = async () => {
        // @ts-ignore
        if (session?.user?.role.name === "User") {
            const res = await fetch(`/api/user/address/getlist${typeBox}`);
            const data = await res.json();
            return data.data;
        }
        return [];
    }


    React.useEffect(() => {
        if (status !== "loading") {
            fetchAddress().then(r => setListAddress(r));
        }
    }, [status]);

    // @ts-ignore
    return (
        <Card sx={{
            ...xs
        }}>
            <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                borderBottom: 1,
                backgroundColor: "primary.light",
                borderColor: '#C7C8CC',
                borderTopLeftRadius: 2,
                borderTopRightRadius: 2
            }}
            >
                <Typography variant="h6" sx={{ p: 1, display: 'fit-content', color: "#fff" }}>
                    {typeBox === "sender" ? "Sender Information" : "Receiver Information"}
                </Typography>
            </Box>
            <CardContent>
                {listAddress.length == 0 ?
                    <FormInfo type={typeBox} /> :
                    <>
                        <RadioGroup
                            sx={{ m: 2 }}
                            row
                            aria-labelledby="demo-row-radio-buttons-group-label"
                            name="row-radio-buttons-group"
                            value={chooseAddress}
                            onChange={(e) => { // @ts-ignore
                                setChooseAddress(e.target.value)
                                if (e.target.value === 'true') {
                                    handleFormChange({ target: { name: `type_${typeBox}`, value: "new" } });
                                    return;
                                }
                                handleFormChange({ target: { name: `type_${typeBox}`, value: "select" } });
                            }}
                        >
                            <FormControlLabel value='true' control={<Radio />}
                                label={typeBox === "sender" ? "New Sender" : "New Receiver"} />
                            <FormControlLabel value='false' control={<Radio />}
                                label={typeBox === "sender" ? "List Sender Address" : "List Receiver Address"} />
                        </RadioGroup>
                        {chooseAddress === 'true' ?
                            <FormInfo type={typeBox} />
                            :
                            <>
                                {/*<TextField
                                id="outlined-select"
                                select
                                label="Choose sender address"
                                fullWidth={true}required={true}
                                {...register(`select_${typeBox}`, {
                                    required: "Please select an address",
                                })}
                                onChange={handleFormChange}
                                error={!!(errors[`select_${typeBox}`])}
                                helperText={errors[`select_${typeBox}`]?.message}
                            >
                                {listAddress.map((option:{value:any, label:any},index) => (
                                    // @ts-ignore
                                    <MenuItem
                                        key={index}
                                        value={option}>
                                        {option.label}
                                    </MenuItem>
                                ))}
                            </TextField>*/}
                                <Autocomplete
                                    id="autocomplete-select"
                                    options={listAddress}
                                    disableClearable={true}
                                    getOptionLabel={(option) => {
                                        // @ts-ignore
                                        return `${option.fullName} - ${option.phoneNumber} - ${option.address}, District: ${option.district}, Province: ${option.province}`;
                                    }}
                                    onChange={(event, value) => {
                                        // @ts-ignore
                                        const { address, ward } = splitAddressAndWard(value.address);
                                        // @ts-ignore
                                        handleFormChange({
                                            target: {
                                                name: `select_${typeBox}`,
                                                // @ts-ignore
                                                value: { ...value, address: address, ward: ward }
                                            }
                                        });
                                    }}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label="Choose sender address"
                                            required={true}
                                            {...register(`select_${typeBox}`, {
                                                required: "Please select an address",
                                            })}
                                            error={!!(errors[`select_${typeBox}`])}
                                            helperText={errors[`select_${typeBox}`]?.message}
                                            fullWidth={true}
                                        />
                                    )}
                                />
                            </>
                        }
                    </>
                }
            </CardContent>
        </Card>
    );
}
export default BoxInputInfo;