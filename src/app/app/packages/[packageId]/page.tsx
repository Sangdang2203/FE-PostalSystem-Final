'use client'
import {Autocomplete, Box, Button, Card, CardContent, Grid, TextField, Typography} from '@mui/material'
import React, {useEffect, useMemo, useState} from 'react'
import TextSnippetIcon from '@mui/icons-material/TextSnippet';
import {toast} from "sonner";
import {useSession} from "next-auth/react";
import Image from "next/image";
import useS3 from "@/hooks/useS3";
import {useRouter} from "next/navigation";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import CircularProgress from "@mui/material/CircularProgress";
import Backdrop from "@mui/material/Backdrop";
import ChecklistIcon from '@mui/icons-material/Checklist';
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import TableItems from "@/components/TableItems";

// @ts-ignore
const PackageView = ({params}: { params: { packageId: string } }) => {
    const {packageId} = params;

    //Hook
    const {handleFileUpload, ButtonUpload, preview} = useS3();
    const router = useRouter();
    const {data: session, status} = useSession();

    //State
    const [isDataLoaded, setIsDataLoaded] = useState(false);
    const [dataPackage, setDataPackage] = useState({});
    const [historyNote, setHistoryNote] = useState("");
    const [nextEmployee, setNextEmployee] = useState(null);
    const [listBranch, setListBranch] = useState([]);
    const [listEmployee, setListEmployee] = useState([]);
    const [nextBranch, setNextBranch] = useState(null);
    const [isCheckPermission, setIsCheckPermission] = useState(false);
    const step = {
        1: "Create Package",
        2: "Warehouse From",
        3: "InTransit",
        4: "WarehouseTo",
        5: "Shipping",
        6: "Delivered",
        7: "Cancelled",
        8: "Returned",
        9: "Lost"
    }


    const fetchListBranch = async () => {
        const response = await fetch("/api/branches");
        const data = await response.json();
        if (data.status === 404) {
            toast.error(data.message);
        }
        if (data.error) {
            toast.error(data.error);
            router.push('/app')
        }
        return data.branchs;
    };

    const fetchEmployees = async (id: number) => {

        const response = await fetch(`/api/branches/getbyid/${id}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });
        const data = await response.json();
        return data.data.employees;
    }

    const previewUrl = useMemo(() => {
        if (preview) {
            return URL.createObjectURL(preview);
        }
    }, [preview]);

    const stepProcess = useMemo(() => {
        if ([6, 7, 8, 9].includes(dataPackage?.step)) {
            return dataPackage?.step;
        }
        return dataPackage?.step + 1;
    }, [dataPackage?.step])

    const fetchPackageById = async () => {
        try {
            const response = await fetch(`/api/packages/getbyid/${packageId}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            const data = await response.json();
            console.log("Data", data)
            if (data.error) {
                toast.error(data.error);
                router.push('/app')
            }
            return data.data;
        } catch (e) {
            toast.error("Fetch package error");
            router.push('/app')
        }
    }

    const updatePackage = async (action?: string) => {
        try {
            const response = await fetch(`/api/packages/update/${packageId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    employeeProcess: (session?.user?.employeeCode) ? await employeeProcess() : null,
                    userId: session?.user?.id,
                    action: action || null,
                }),
            });
            const data = await response.json();
            if (!data.ok) {
                toast.error(data.message);
                // router.push('/app')
            }
            toast.success(data.message);
            router.push('/app/packages')
        } catch (e) {
            toast.error("Fetch package error");
            router.push('/app')
        }
    }

    const employeeProcess = async () => {
        if (session?.user?.employeeCode) {
            return {
                employeeCode: session?.user?.employeeCode,
                step: dataPackage?.step,
                historyNote: historyNote || null,
                photo: await handleFileUpload(),
                employeeNext: nextEmployee || null,
            }
        }
    }

    /* UseEffect */


    useEffect(() => {
        if (status !== "loading") {
            fetchPackageById()
                .then(r => {
                    setDataPackage(r);
                    setIsDataLoaded(true);
                });
        }
    }, [status]);

    // useEffect listBranch if package.Step = 0 , 3 ( Wait for pickup or Transit) or listEmployee if nowStep = 1, 2, 4, 5, 6
    useEffect(() => {
        if (isDataLoaded) {
            const checkPermission = () => {
                if (session?.user?.role?.permissions.includes("packages.view")) {
                    return true;
                }
                if (session?.user?.role?.name == "Admin") {
                    return true;
                }
                if (!session?.user?.employeeCode && session?.user?.id == dataPackage?.userId) {
                    return true;
                }
                return !!(session?.user?.employeeCode && session?.user?.id == dataPackage?.historyLogs[dataPackage?.historyLogs.length - 1]?.employeeId);
            }
            if (!checkPermission()) {
                toast.error("You don't have permission to view this package");
                router.push('/app/packages')
            }
            setIsCheckPermission(checkPermission());
            if (checkPermission() && ![6, 7, 8, 9].includes(dataPackage?.step)) {
                // @ts-ignore
                if ([0, 3].includes(dataPackage?.step) && session?.user?.employeeCode) {
                    fetchListBranch().then(r => setListBranch(r));
                } else {
                    fetchEmployees(session?.user?.branchId).then(r => setListEmployee(r));
                }
            }
        }
    }, [isDataLoaded]);

    useEffect(() => {
        if (nextBranch) {
            // @ts-ignore
            fetchEmployees(nextBranch.id).then(r => setListEmployee(r));
        }
    }, [nextBranch]);

    // @ts-ignore
    return (
        <>
            {isCheckPermission && <>
                {/*Information Package*/}
                <Grid container spacing={3} columns={12}>
                    <Grid item lg={6} xs={12}>
                        <Card sx={{
                            my: 3,
                            borderRadius: "10px",
                            boxShadow: 'rgba(76, 78, 100, 0.2) 0px 3px 13px 3px',
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
                                <Typography variant="h6" sx={{p: 1, display: 'fit-content', color: "#fff"}}>
                                    Address Information
                                </Typography>
                            </Box>
                            <CardContent>
                                <Box sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    my: 2,
                                    backgroundColor: "#fff3e6",
                                    p: 2,
                                    borderRadius: "10px",
                                }}>
                                    <Typography variant={"h6"} fontWeight={550}>Sender:</Typography>
                                    <Box sx={{display: 'flex', mb: 1}}>
                                        <Typography variant='subtitle2' sx={{mr: 2, color: 'text.primary'}}>
                                            Name:
                                        </Typography>
                                        <Typography variant='body2'>{dataPackage?.nameFrom}</Typography>
                                    </Box>
                                    <Box sx={{display: 'flex', mb: 1}}>
                                        <Typography variant='subtitle2' sx={{mr: 2, color: 'text.primary'}}>
                                            Address:
                                        </Typography>
                                        <Typography variant='body2'>{dataPackage?.addressFrom}</Typography>
                                    </Box>
                                    <Box sx={{display: 'flex', mb: 1}}>
                                        <Typography variant='subtitle2' sx={{mr: 2, color: 'text.primary'}}>
                                            Postal Code:
                                        </Typography>
                                        <Typography variant='body2'>{dataPackage?.postalCodeFrom}</Typography>
                                    </Box>
                                    <Box sx={{display: 'flex', mb: 1}}>
                                        <Typography variant='subtitle2' sx={{mr: 2, color: 'text.primary'}}>
                                            Phone Number:
                                        </Typography>
                                        <Typography variant='body2'>{dataPackage?.phoneFrom}</Typography>
                                    </Box>
                                </Box>
                                <Box sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    my: 2,
                                    backgroundColor: "#fff3e6",
                                    p: 2,
                                    borderRadius: "10px",
                                }}>
                                    <Typography variant={"h6"} fontWeight={550}>Receiver:</Typography>
                                    <Box sx={{display: 'flex', mb: 1}}>
                                        <Typography variant='subtitle2' sx={{mr: 2, color: 'text.primary'}}>
                                            Name:
                                        </Typography>
                                        <Typography variant='body2'>{dataPackage?.nameTo}</Typography>
                                    </Box>
                                    <Box sx={{display: 'flex', mb: 1}}>
                                        <Typography variant='subtitle2' sx={{mr: 2, color: 'text.primary'}}>
                                            Address:
                                        </Typography>
                                        <Typography variant='body2'>{dataPackage?.addressTo}</Typography>
                                    </Box>
                                    <Box sx={{display: 'flex', mb: 1}}>
                                        <Typography variant='subtitle2' sx={{mr: 2, color: 'text.primary'}}>
                                            Postal Code:
                                        </Typography>
                                        <Typography variant='body2'>{dataPackage?.postalCodeTo}</Typography>
                                    </Box>
                                    <Box sx={{display: 'flex', mb: 1}}>
                                        <Typography variant='subtitle2' sx={{mr: 2, color: 'text.primary'}}>
                                            Phone Number:
                                        </Typography>
                                        <Typography variant='body2'>{dataPackage?.phoneTo}</Typography>
                                    </Box>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item lg={6} xs={12}>
                        <Card sx={{
                            my: 3,
                            borderRadius: "10px",
                            boxShadow: 'rgba(76, 78, 100, 0.2) 0px 3px 13px 3px',
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
                                <Typography variant="h6" sx={{p: 1, display: 'fit-content', color: "#fff"}}>
                                    Package Options
                                </Typography>
                            </Box>
                            <CardContent>
                                <Box sx={{display: 'flex', mb: 1}}>
                                    <Typography variant='subtitle2' sx={{mr: 2, color: 'text.primary'}}>
                                        COD:
                                    </Typography>
                                    <Typography variant='body2'>{// @ts-ignore
                                        dataPackage?.cod ? "$" + Number(dataPackage?.cod).toLocaleString() : "$0"}</Typography>
                                </Box>
                                <Box sx={{display: 'flex', mb: 1, flex: 'column'}}>
                                    <Typography variant='subtitle2' sx={{mr: 2, color: 'text.primary'}}>
                                        Note:
                                    </Typography>
                                    <Typography variant='body2'>{// @ts-ignore
                                        dataPackage?.packageNote}
                                    </Typography>
                                </Box>
                            </CardContent>
                        </Card>
                        <Card sx={{
                            my: 3,
                            borderRadius: "10px",
                            boxShadow: 'rgba(76, 78, 100, 0.2) 0px 3px 13px 3px',
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
                                <Typography variant="h6" sx={{p: 1, display: 'fit-content', color: "#fff"}}>
                                    Package Service
                                </Typography>
                            </Box>
                            <CardContent>
                                <Box sx={{
                                    display: 'flex',
                                    flexDirection: 'row',
                                    my: 2,
                                    p: 1,
                                    borderRadius: "10px",
                                    border: 1,
                                    borderColor: 'primary.light',
                                }}>
                                    <Box sx={{
                                        flex: '0 1 30%',
                                        maxWidth: '150px',
                                        minWidth: '75px',
                                        padding: '5px',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                    }}>
                                        <LocalShippingIcon
                                            sx={{fontSize: 75, color: 'primary.light'}}></LocalShippingIcon>
                                    </Box>
                                    <Box sx={{
                                        flex: 1,
                                        display: 'flex',
                                        flexDirection: 'column',
                                        justifyContent: 'center',
                                    }}>
                                        <Typography variant='h6' fontWeight={550}>
                                            {dataPackage?.feeCustom?.service?.serviceType.serviceName}
                                        </Typography>
                                        <Typography variant='body2' sx={{my: 1}}>
                                            {dataPackage?.feeCustom?.service?.serviceType.serviceDescription}
                                        </Typography>
                                        <Typography variant='body2' sx={{my: 1}}>
                                            For
                                            weight: {dataPackage?.feeCustom?.service?.weighFrom} {dataPackage?.feeCustom?.service?.weighTo == 999999999 ? "to over." : "- " + dataPackage?.feeCustom?.service?.weighTo + " gram"}
                                        </Typography>
                                        <Typography variant='body2' sx={{my: 1}}>
                                            Fee:
                                            ${dataPackage?.feeCustom?.feeCharge}. {dataPackage?.feeCustom?.service?.weighTo == 999999999 ? "And $" + dataPackage?.feeCustom?.overWeightCharge + " /1Kg over " : ""}
                                        </Typography>
                                    </Box>
                                </Box>
                            </CardContent>
                        </Card>

                    </Grid>
                </Grid>
                {/*Package Service*/}
                <Grid container spacing={3} columns={12}>
                    <Grid item xs={12}>
                        <Card sx={{
                            my: 3,
                            borderRadius: "10px",
                            boxShadow: 'rgba(76, 78, 100, 0.2) 0px 3px 13px 3px',
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
                                <Typography variant="h6" sx={{p: 1, display: 'fit-content', color: "#fff"}}>
                                    List Items
                                </Typography>
                            </Box>
                            <CardContent>
                                {isDataLoaded ? <TableItems data={dataPackage?.items} size={dataPackage?.packageSize}
                                                            fee={dataPackage?.totalFee}/> : null}
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
                {/*Employee Process */}
                {session?.user?.employeeCode ? (
                    <Grid container spacing={3} columns={12}>
                        <Grid item xs={12}>
                            <Card sx={{
                                my: 3,
                                borderRadius: "10px",
                                boxShadow: 'rgba(76, 78, 100, 0.2) 0px 3px 13px 3px',
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
                                    <Typography variant="h6" sx={{p: 1, display: 'fit-content', color: "#fff"}}>
                                        Employee Process
                                    </Typography>
                                </Box>
                                <CardContent>
                                    <Grid container spacing={2} columns={12}>
                                        <Grid item xs={12} lg={4}>
                                            <Box sx={{
                                                display: 'flex',
                                                flexDirection: 'column',
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                                my: 2,
                                            }}>
                                                <ButtonUpload/>
                                                {preview ?
                                                    <Image src={`${previewUrl}`}
                                                           width={0}
                                                           height={0}
                                                           objectFit='contain'
                                                           alt={"preview"}
                                                           title={"preview"}
                                                           style={{
                                                               width: 'clamp(100px, 100%, 200px)',
                                                               height: 'auto',
                                                               margin: '20px'
                                                           }}
                                                    /> :
                                                    <img
                                                        src={'https://dummyimage.com/500x500/c3c3c3/FFF.png&text=Upload Image'}
                                                        alt={"preview"} title={"preview"} width={200} height={200}
                                                        style={{margin: '20px'}}
                                                    />
                                                }
                                            </Box>
                                        </Grid>
                                        <Grid item xs={12} lg={8}
                                        >
                                            <Grid container spacing={1} columns={12}>

                                                <Grid item xs={12} lg={6}>
                                                    <TextField
                                                        margin="dense"
                                                        label="Employee"
                                                        type="text"
                                                        InputProps={{
                                                            startAdornment: <PersonOutlineIcon
                                                                fontSize={"small"}></PersonOutlineIcon>,
                                                        }}
                                                        value={session?.user?.employeeCode}
                                                        disabled
                                                        size={"small"}
                                                        autoComplete={"off"}
                                                        sx={{my: 2}}
                                                        fullWidth={true}
                                                    />
                                                </Grid>
                                                <Grid item xs={12} lg={6}>
                                                    <TextField
                                                        margin="dense"
                                                        label="Next Step Process"
                                                        type="text"
                                                        InputProps={{
                                                            startAdornment: <ChecklistIcon
                                                                fontSize={"small"}></ChecklistIcon>,
                                                        }}
                                                        value={
                                                            // @ts-ignore
                                                            step[stepProcess]}
                                                        disabled
                                                        size={"small"}
                                                        autoComplete={"off"}
                                                        fullWidth={true}
                                                        sx={{my: 2}}
                                                    /></Grid>
                                                <Grid item xs={12} lg={6}>
                                                    {   // @ts-ignore
                                                        [0, 3].includes(dataPackage?.step) ? (
                                                            <Autocomplete
                                                                disableClearable={true}
                                                                options={listBranch}
                                                                getOptionLabel={(option) =>
                                                                    // @ts-ignore
                                                                    option.branchName}
                                                                onChange={(event, value) => {
                                                                    setNextBranch(value);
                                                                }}
                                                                renderInput={(params) =>
                                                                    <TextField
                                                                        {...params}
                                                                        label="Next Branch Process"
                                                                        margin="dense"
                                                                        size={"small"}
                                                                        autoComplete={'none'}
                                                                        fullWidth={true}
                                                                        sx={{my: 2}}
                                                                    />
                                                                }
                                                            />
                                                        ) : (
                                                            <TextField
                                                                margin="dense"
                                                                label="Next Branch Process"
                                                                type="text"
                                                                value={
                                                                    // @ts-ignore
                                                                    session?.user?.branchName}
                                                                disabled
                                                                size={"small"}
                                                                autoComplete={"off"}
                                                                fullWidth={true}
                                                                sx={{my: 2}}
                                                            />
                                                        )}
                                                </Grid>
                                                <Grid item xs={12} lg={6}>
                                                    <Autocomplete
                                                        disableClearable={true}
                                                        options={listEmployee}
                                                        getOptionLabel={(option) =>
                                                            // @ts-ignore
                                                            option.employeeCode + " - " + option.fullname}
                                                        onChange={(event, value) => {
                                                            // @ts-ignore
                                                            setNextEmployee(value.id);
                                                        }}
                                                        renderInput={(params) =>
                                                            <TextField
                                                                {...params}
                                                                label="Next Employee Process"
                                                                margin="dense"
                                                                size={"small"}
                                                                autoComplete={'none'}
                                                                fullWidth={true}
                                                                sx={{my: 2}}
                                                                disabled={[6, 7, 8, 9].includes(dataPackage?.step)}
                                                            />
                                                        }
                                                    />
                                                </Grid>
                                                <Grid item xs={12}>
                                                    <TextField
                                                        label="Employee Note"
                                                        multiline
                                                        rows={4}
                                                        onChange={(e) => {
                                                            e.target.value = e.target.value.replace(/[^0-9a-zA-Z//\s,+-]/g, '');
                                                            // @ts-ignore
                                                            setHistoryNote(e.target.value);
                                                        }}
                                                        fullWidth={true}
                                                        autoComplete={"off"}
                                                        sx={{my: 2}}
                                                    />
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>) : null}

                {/*Action Confirm*/}
                <Grid container columns={12} spacing={2}
                      sx={{
                          position: 'sticky',
                          bottom: 10,
                          zIndex: 100,
                          backgroundColor: {xs: '#fff', lg: 'transparent'},
                      }}>
                    <Grid item xs={6} lg={2}>
                        <Box
                            sx={{
                                backgroundColor: 'white',
                                borderRadius: '5px',
                                boxShadow: {lg: 'rgba(76, 78, 100, 0.2) 0px 3px 13px 3px', xs: 'none'},
                                p: 1,
                            }}>
                            <Typography
                                sx={{my: 1, fontSize: '16px', fontWeight: 550}}>
                                COD
                            </Typography>
                            <Typography sx={{
                                textAlign: 'center',
                                justifyContent: 'center',
                                my: 1,
                                fontSize: '15px'
                            }}>{// @ts-ignore
                                dataPackage?.cod ? "$" + Number(dataPackage?.cod).toLocaleString() : "$0"}
                            </Typography>
                        </Box>
                    </Grid>

                    <Grid item xs={6} lg={2}>
                        <Box
                            sx={{
                                backgroundColor: 'white',
                                borderRadius: '5px',
                                boxShadow: {lg: 'rgba(76, 78, 100, 0.2) 0px 3px 13px 3px', xs: 'none'},
                                p: 1,
                            }}>
                            <Typography
                                sx={{my: 1, fontSize: '16px', fontWeight: 550}}>
                                Fee
                            </Typography>
                            <Typography sx={{
                                textAlign: 'center',
                                justifyContent: 'center',
                                my: 1,
                                fontSize: '15px'
                            }}>{// @ts-ignore
                                dataPackage?.totalFee ? "$" + Number(dataPackage?.totalFee).toLocaleString() : "$0"}
                            </Typography>
                        </Box>
                    </Grid>

                    <Grid item xs={6} lg={2}>
                        <Box
                            sx={{
                                backgroundColor: 'white',
                                borderRadius: '5px',
                                boxShadow: {lg: 'rgba(76, 78, 100, 0.2) 0px 3px 13px 3px', xs: 'none'},
                                p: 1,
                            }}>
                            <Typography
                                sx={{my: 1, fontSize: '16px', fontWeight: 550}}>
                                Time Process
                            </Typography>
                            <Typography sx={{
                                textAlign: 'center',
                                justifyContent: 'center',
                                my: 1,
                                fontSize: '15px'
                            }}>{
                                // @ts-ignore
                                dataPackage?.timeProcess ? (dataPackage?.timeProcess > 24 ? (dataPackage?.timeProcess / 24).toFixed(1) + " days" : dataPackage?.timeProcess + " hours"
                                ) : "... hours"
                            }
                            </Typography>
                        </Box>
                    </Grid>

                    <Grid item lg={6} xs={12}>
                        {[6, 7, 8, 9].includes(dataPackage?.step) ?
                            <Box sx={{
                                display: 'flex',
                                flexDirection: 'row',
                                justifyContent: 'space-evenly',
                                alignItems: 'center',
                                height: '100%',
                                backgroundColor: 'white',
                                borderRadius: '5px',
                                boxShadow: {lg: 'rgba(76, 78, 100, 0.2) 0px 3px 13px 3px', xs: 'none'},
                                p: 1,
                            }}>
                                <Typography variant={"h6"}>The package has completed the process!</Typography>
                            </Box>
                            :
                            <Box sx={{
                                display: 'flex',
                                flexDirection: 'row',
                                justifyContent: 'space-evenly',
                                alignItems: 'center',
                                height: '100%',
                                backgroundColor: 'white',
                                borderRadius: '5px',
                                boxShadow: {lg: 'rgba(76, 78, 100, 0.2) 0px 3px 13px 3px', xs: 'none'},
                                p: 1,
                            }}>
                                {
                                    session?.user?.role?.name !== "Admin" &&
                                    <Button
                                        startIcon={<TextSnippetIcon/>}
                                        variant="contained"
                                        color={"success"}
                                    >
                                        Print Label
                                    </Button>
                                }
                                {   // @ts-ignore
                                    dataPackage?.step === 0 &&
                                    dataPackage?.historyLogs[dataPackage?.historyLogs.length - 1]?.step == 0 &&
                                    dataPackage?.historyLogs[dataPackage?.historyLogs.length - 1]?.processStep == 2 &&
                                    <Button
                                        variant="contained"
                                        color={"primary"}
                                        onClick={() => {
                                            updatePackage("addPickup")
                                        }}
                                    >
                                        Add Pickup
                                    </Button>
                                }
                                {   // @ts-ignore
                                    dataPackage?.step === 0 &&
                                    <Button
                                        variant="outlined"
                                        onClick={() => {
                                            updatePackage("cancel")
                                        }}
                                    >
                                        Cancel
                                    </Button>
                                }
                            </Box>
                        }
                    </Grid>
                </Grid>
                <Backdrop
                    sx={{color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1}}
                    open={false}
                >
                    <CircularProgress color="inherit"/>
                </Backdrop>
            </>}
        </>
    )
}

export default PackageView