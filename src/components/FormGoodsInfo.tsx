'use client'
import {Box, Button, Card, Grid, InputAdornment, TextField, Tooltip, Typography} from '@mui/material'
import {useContext, useState} from 'react'
import Divider from '@mui/material/Divider'
import {PackageCreateContext} from "@/context/PackageCreateContext";
import {Item} from "@/models/Item";
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import ClearAllIcon from '@mui/icons-material/ClearAll';
import InfoIcon from '@mui/icons-material/Info';
import BalanceIcon from '@mui/icons-material/Balance';
import LocalAtmIcon from '@mui/icons-material/LocalAtm';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import {toast} from "sonner";
import CustomDialogContent from "@/components/CustomDialogContent";
import VolumetricWeightContent from "@/components/VolumetricWeightContent";

function FormGoodsInfo() {

    const typePackage = [
        {
            title: 'Document',
            value: 'document',
            content: 'Sent mail, documents with 1-3 days delivery.'
        },
        {
            title: 'Packet',
            value: 'packet',
            content: 'Sent items, gifts with 2-7 days delivery.'
        }
    ]

    const {
        // @ts-ignore
        handleFormChange, formData, createItem, removeItem, updateItem, register, errors, trigger, handleChangeSize
    } = useContext(PackageCreateContext);

    const [openDialog, setOpenDialog] = useState(false);


    return (
        <Card sx={{
            my: 3,
            borderRadius: "10px",
            boxShadow: 'rgba(76, 78, 100, 0.2) 0px 3px 13px 3px',
        }}>
            <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                borderBottom: 1,
                backgroundColor: 'primary.light',
                borderColor: '#C7C8CC',
                borderTopLeftRadius: 2,
                borderTopRightRadius: 2
            }}>
                <Typography variant="h6" sx={{
                    p: 1,
                    display: 'fit-content',
                    color: "#fff"
                }}>Item Information</Typography>
            </Box>
            <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                p: 2
            }}>
                {/*Radio*/}
                <Box>
                    <Typography variant='h6'
                                sx={{
                                    fontSize: '14px',
                                    fontWeight: 550,
                                    display: 'fit-content',
                                }}
                    >
                        Type of Package
                    </Typography>
                    <Box sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        my: 2,
                    }}>
                        {typePackage.map((type, index) => (
                            <Tooltip key={index} title={type.content} placement="bottom">
                                <Box onClick={() => handleFormChange({
                                    target: {
                                        name: 'type_package',
                                        value: type.value
                                    }
                                })}
                                     sx={{
                                         border: 1,
                                         borderRadius: 2,
                                         py: 1,
                                         mx: 2,
                                         textAlign: 'center',
                                         width: '100%',
                                         cursor: 'pointer',
                                         color: formData.type_package === type.value ? 'primary.light' : 'rgba(0,0,0,0.87)',
                                     }}>
                                    <Typography variant='h6'
                                                sx={{fontSize: '15px', fontWeight: 700}}>{type.title}</Typography>
                                </Box>
                            </Tooltip>
                        ))}
                    </Box>
                </Box>
                <Divider sx={{my: 1, borderColor: '#C7C8CC'}} variant="middle"/>
                {/*List Item*/}
                <Box component={"li"} sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    listStyleType: 'none',
                }}>
                    {formData.list_items.map((item: Item, index: any) => (
                        <Box key={index}>
                            <Box sx={{
                                display: 'flex',
                                flexDirection: 'row',
                                alignItems: 'center',
                            }}>
                                <Typography variant="h6" sx={{
                                    display: 'fit-content',
                                    fontSize: '15px',
                                    fontWeight: 400,
                                }}>
                                    Item {index + 1} :
                                </Typography>
                                {index !== 0 && (
                                    <IconButton aria-label="delete" size="small" onClick={() => removeItem(index)}>
                                        <DeleteIcon fontSize="small" color={"primary"}/>
                                    </IconButton>
                                )}
                            </Box>
                            <TextField
                                margin="dense"
                                label="Name item"
                                type="text"
                                required={true}
                                {...register(`itemName_${index}`, {
                                    required: "Name item is required",
                                    pattern: {
                                        value: /^[a-zA-Z0-9\s]+$/gu,
                                        message: "Name item must be alphabet"
                                    },
                                })}
                                onChange={(e) => {
                                    updateItem(index, e)
                                }}

                                error={!!(errors[`itemName_${index}`])}
                                helperText={errors[`itemName_${index}`]?.message}
                                size={"small"}
                                fullWidth={true}
                                autoComplete={"off"}
                            />
                            <Grid container spacing={2} columns={12}>
                                <Grid item xs={4}>
                                    <Tooltip title="Item Quantity (Unit)">
                                        <TextField
                                            margin="dense"
                                            label="Quantity"
                                            defaultValue={1}
                                            type="text"
                                            required={true}
                                            {...register(`itemQuantity_${index}`, {
                                                required: "Quantity item is required",
                                                max: {
                                                    value: 200,
                                                    message: "Quantity item must be less than 100"
                                                },
                                                min: {
                                                    value: 1,
                                                    message: "Quantity item must be more than 1"
                                                }
                                            })}

                                            InputProps={{
                                                startAdornment: <ClearAllIcon fontSize={"small"}></ClearAllIcon>,
                                            }}
                                            onChange={(e) => {
                                                e.target.value = e.target.value.replace(/[^0-9]/g, '');
                                                updateItem(index, e)
                                            }}
                                            error={!!(errors[`itemQuantity_${index}`])}
                                            helperText={errors[`itemQuantity_${index}`]?.message}
                                            size={"small"}
                                            fullWidth={true}
                                            autoComplete={"off"}
                                        />
                                    </Tooltip>
                                </Grid>
                                <Grid item xs={4}>
                                    <Tooltip title="Item Weight (gram)">
                                        <TextField
                                            margin="dense"
                                            label="Weight"
                                            type="text"
                                            required={true}
                                            {...register(`itemWeight_${index}`, {
                                                required: "Weight item is required",
                                                max: {
                                                    value: 1000000,
                                                    message: "Weight item must be less than 1000000 gram"
                                                },
                                                min: {
                                                    value: 1,
                                                    message: "Weight item must be more than 1 gram"
                                                }
                                            })}
                                            InputProps={{
                                                startAdornment: <BalanceIcon fontSize={"small"}></BalanceIcon>,
                                            }}
                                            onChange={(e) => {
                                                e.target.value = e.target.value.replace(/[^0-9]/g, '');
                                                updateItem(index, e)
                                            }}
                                            error={!!(errors[`itemWeight_${index}`])}
                                            helperText={errors[`itemWeight_${index}`]?.message}
                                            size={"small"}
                                            fullWidth={true}
                                            autoComplete={"off"}
                                        />
                                    </Tooltip>
                                </Grid>
                                <Grid item xs={4}>
                                    <Tooltip title="Item value ($)">
                                        <TextField
                                            margin="dense"
                                            label="Value"
                                            type="text"
                                            {...register(`itemValue_${index}`, {
                                                max: {
                                                    value: 100000,
                                                    message: "Value item must be less than 100000 $"
                                                },
                                                min: {
                                                    value: 1,
                                                    message: "Value item must be more than 1 $"
                                                }
                                            })}
                                            InputProps={{
                                                startAdornment: <LocalAtmIcon fontSize={"small"}></LocalAtmIcon>,
                                            }}
                                            onChange={(e) => {
                                                e.target.value = e.target.value.replace(/[^0-9]/g, '');
                                                updateItem(index, e)
                                            }}
                                            error={!!(errors[`itemValue_${index}`])}
                                            helperText={errors[`itemValue_${index}`]?.message}
                                            size={"small"}
                                            fullWidth={true}
                                            autoComplete={"off"}
                                        />
                                    </Tooltip>
                                </Grid>
                            </Grid>
                            <Divider sx={{mx: 2, my: 1, borderColor: '#C7C8CC'}} variant="middle"/>
                        </Box>
                    ))}
                </Box>
                {/*Add Item*/}
                <Box sx={{my: 2, display: 'flex', flexDirection: 'row', justifyContent: 'center'}}>
                    <Typography
                        onClick={async () => {
                            if (formData.list_items.length >= 5) {
                                toast.error('You can only add up to 5 items');
                                return;
                            }
                            let checkName = await trigger(`itemName_${formData.list_items.length - 1}`);
                            let checkQuantity = await trigger(`itemQuantity_${formData.list_items.length - 1}`);
                            let checkWeight = await trigger(`itemWeight_${formData.list_items.length - 1}`);
                            if (checkName && checkQuantity && checkWeight) {
                                createItem();
                            }
                        }}>
                        {/*
                        onClick={async () => {
                            let errorCounter = 0;
                            for (let i = 0; i < formData.list_items.length; i++) {
                                await trigger(`itemName_${i}`).then((res:any) => {
                                    if (res === false) {
                                        errorCounter++;
                                    }
                                });
                                await trigger(`itemQuantity_${i}`).then((res:any) => {
                                    if (res === false) {
                                        errorCounter++;
                                    }
                                });
                                await trigger(`itemWeight_${i}`).then((res:any) => {
                                    if (res === false) {
                                        errorCounter++;
                                    }
                                });
                                await trigger(`itemValue_${i}`).then((res:any) => {
                                    if (res === false) {
                                        errorCounter++;
                                    }
                                });
                            }
                            if (errorCounter === 0) {
                                createItem()
                            }
                        }}
                        onClick={async () => {
                                const results = [];
                                for (let i = 0; i < formData.list_items.length; i++) {
                                    const itemName = await trigger(`itemName_${i}`);
                                    const itemQuantity = await trigger(`itemQuantity_${i}`);
                                    const itemWeight = await trigger(`itemWeight_${i}`);
                                    const itemValue = await trigger(`itemValue_${i}`);
                                    results.push(itemName, itemQuantity, itemWeight, itemValue);
                                }
                                const hasErrors = results.some(i => i === false);
                                if (!hasErrors) {
                                    createItem(); // Pass all results at once
                                }
                            }}
                        */}
                        <Button sx={{
                            border: 1,
                            py: 1,
                            textAlign: 'center',
                            fontSize: '13px',
                            width: '100%',
                            fontWeight: 550,
                            color: 'red'
                        }}>Add new Item</Button>
                    </Typography>
                </Box>
                <Divider sx={{mx: 2, my: 1, borderColor: '#C7C8CC'}} variant="middle"/>
                {/*Total Value - Total Weight*/}
                <Box sx={{my: 1, display: 'flex', flexDirection: 'row'}}>
                    <Grid container>
                        <Grid item xs={6}>
                            <Typography variant='body1'
                                        sx={{
                                            py: 1,
                                            textAlign: 'left',
                                            fontSize: '16px'
                                        }}
                            >
                                Calculate Weight:
                            </Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography variant='h6' sx={{
                                py: 1,
                                textAlign: 'right',
                                fontSize: '16px',
                                width: '100%',
                                fontWeight: 550,
                                color: 'red'
                            }}>{formData.total_weight.toLocaleString() || 0} gram</Typography>
                        </Grid><Grid item xs={6}>
                        <Typography variant='body1'
                                    sx={{
                                        py: 1,
                                        textAlign: 'left',
                                        fontSize: '16px'
                                    }}
                        >
                            Calculate value:
                        </Typography>
                    </Grid>
                        <Grid item xs={6}>
                            <Typography variant='h6' sx={{
                                py: 1,
                                textAlign: 'right',
                                fontSize: '16px',
                                width: '100%',
                                fontWeight: 550,
                                color: 'red'
                            }}>${formData.total_value.toLocaleString() || 0}</Typography>
                        </Grid>
                    </Grid>
                </Box>
                <Divider sx={{mx: 2, my: 1, borderColor: '#C7C8CC'}} variant="middle"/>
                {/*Package Size*/}
                <Box sx={{my: 1, display: 'flex', flexDirection: 'column'}}>
                    <Box sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                    }}>
                        <Typography variant='h6'
                                    sx={{
                                        fontSize: '14px',
                                        fontWeight: 550,
                                        display: 'fit-content',
                                    }}
                        >
                            Package Size
                        </Typography>
                        <Tooltip title="All items will be packed into one package" placement={"right"}>
                            <IconButton color={"info"} size={"small"}>
                                <InfoIcon fontSize={"small"}></InfoIcon>
                            </IconButton>
                        </Tooltip>
                    </Box>
                    <Grid container spacing={2} columns={12}>
                        <Grid item xs={4}>
                            <TextField
                                margin="dense"
                                label="Width"
                                type="text"
                                {...register("width", {
                                    max: {
                                        value: 200,
                                        message: "Width must be less than 200 cm"
                                    },
                                    min: {
                                        value: 1,
                                        message: "Width must be more than 1 cm"
                                    }
                                })}
                                InputProps={{
                                    endAdornment: <InputAdornment position="end">cm</InputAdornment>,
                                }}
                                onChange={(e) => {
                                    e.target.value = e.target.value.replace(/[^0-9]/g, '');
                                    handleChangeSize(e)
                                }}
                                error={!!(errors.width)}
                                helperText={errors.width?.message}
                                size={"small"}
                                fullWidth={true}
                                autoComplete={"off"}
                            />
                        </Grid>
                        <Grid item xs={4}>
                            <TextField
                                margin="dense"
                                label="Height"
                                type="text"
                                {...register("height", {
                                    max: {
                                        value: 200,
                                        message: "Height must be less than 200 cm"
                                    },
                                    min: {
                                        value: 1,
                                        message: "Height must be more than 1 cm"
                                    }
                                })}
                                InputProps={{
                                    endAdornment: <InputAdornment position="end">cm</InputAdornment>,
                                }}
                                onChange={(e) => {
                                    e.target.value = e.target.value.replace(/[^0-9]/g, '');
                                    handleChangeSize(e)
                                }}
                                error={!!(errors.height)}
                                helperText={errors.height?.message}
                                size={"small"}
                                fullWidth={true}
                                autoComplete={"off"}
                            />
                        </Grid>
                        <Grid item xs={4}>
                            <TextField
                                margin="dense"
                                label="Length"
                                type="text"
                                {...register("length", {
                                    max: {
                                        value: 200,
                                        message: "Length item must be less than 200 cm"
                                    },
                                    min: {
                                        value: 1,
                                        message: "Length item must be more than 1 cm"
                                    }
                                })}
                                InputProps={{
                                    endAdornment: <InputAdornment position="end">cm</InputAdornment>,
                                }}
                                onChange={(e) => {
                                    e.target.value = e.target.value.replace(/[^0-9]/g, '');
                                    handleChangeSize(e)
                                }}
                                error={!!(errors.length)}
                                helperText={errors.length?.message}
                                size={"small"}
                                fullWidth={true}
                                autoComplete={"off"}
                            />
                        </Grid>
                    </Grid>
                    {Number(formData.size_convert) > 0 && (
                        <Box sx={{
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'center',
                        }}>
                            <Typography variant='subtitle1'
                                        sx={{
                                            fontSize: '15px',
                                            fontWeight: 500,
                                            display: 'fit-content',
                                        }}
                            >
                                Volumetric Weight: {(Number(formData.size_convert.toFixed(0))).toLocaleString()} gram
                            </Typography>
                            <Tooltip title="All items will be packed into one package" placement={"right"}>
                                <IconButton color={"warning"} size={"medium"} onClick={() => {
                                    setOpenDialog(true)
                                }}>
                                    <HelpOutlineIcon fontSize={"medium"}></HelpOutlineIcon>
                                </IconButton>
                            </Tooltip>
                        </Box>)}
                </Box>
            </Box>
            <CustomDialogContent content={<VolumetricWeightContent/>} title={"Volumetric Weight"}
                                 setIsOpen={setOpenDialog}
                                 isOpen={openDialog}/>
        </Card>
    )
}

export default FormGoodsInfo
