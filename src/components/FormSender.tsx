/*
'use client'
import React, { useContext, useEffect } from 'react'
import { Grid } from '@mui/material'
import { Box, MenuItem, TextField, Typography } from '@mui/material'
import SendIcon from '@mui/icons-material/Send'
import Radio from '@mui/material/Radio'
import RadioGroup from '@mui/material/RadioGroup'
import FormControlLabel from '@mui/material/FormControlLabel'
import { useState } from 'react'
import Autocomplete from '@mui/material/Autocomplete'
import { PostalCodeContext } from '@/context/PostalCodeContext'
function FormSender() {

  const currencies = [
    {
      value: '1',
      label: 'Người gửi 1'
    },
    {
      value: '2',
      label: 'Người gửi 2'
    },
    {
      value: '3',
      label: 'Người gửi 3'
    },
    {
      value: '4',
      label: 'Nguoi gui 4'
    }
  ]
  const [value, setValue] = useState('true')
  const [locations, setLocations] = useState<Location[]>([])
  const [wards, setWards] = useState<Location[]>([])
  const [selectedCity, setSelectedCity] = useState<Location | null>(null)
  const [childLocations, setChildLocations] = useState<Location[]>([])
  const [selectedDistrict, setSelectedDistrict] = useState<Location | null>(null)
  const [newCitySelected, setNewCitySelected] = useState(false)
  const [newDistrictSelected, setNewDistrictSelected] = useState(false)


  // @ts-ignore
  const {  setPostalCodeFrom } = useContext(PostalCodeContext)
  // Fetch all tỉnh/thành phố
  useEffect(() => {
    fetch('http://localhost:5255/api/Location/GetListLocationByLevel/Province')
      .then(response => response.json())
      .then(data => setLocations(data))
      .catch(error => console.log(error))
  }, [])

  useEffect(() => {
    if (selectedCity) {
      fetch(`http://localhost:5255/api/Location/GetChildLocation/${selectedCity.id}`)
        .then(response => response.json())
        .then(data => {
          // Put the response object in an array
          setChildLocations(data.districs || [])
        })
        .catch(error => console.error('Error:', error))
    }
  }, [selectedCity])

  useEffect(() => {
    if (selectedDistrict) {
      fetch(`http://localhost:5255/api/Location/GetChildLocation/${selectedDistrict.id}`)
        .then(response => response.json())
        .then(data => {
          setWards(data.wards || [])
        })
        .catch(error => console.error('Error:', error))
    }
  }, [selectedDistrict])

  const handleCitySelect = (value: Location | null) => {
    setSelectedCity(value)
    setNewCitySelected(true) // Set newCitySelected to true when a new city is selected
  }

  const handleDistrictSelect = (value: Location | null) => {
    setSelectedDistrict(value)
    setPostalCodeFrom(value?.postalCode || '')
    setNewCitySelected(false) // Set newCitySelected to false when a district is selected
    setNewDistrictSelected(true) // Set newDistrictSelected to true when a new district is selected
  }

  const handleWardSelect = (value: Location | null) => {
    setNewDistrictSelected(false) // Set newDistrictSelected to false when a ward is selected
  }

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue((event.target as HTMLInputElement).value)
  }
    enum ELocationLevel {
    province = 0,
    district = 1,
    ward = 2
  }

  interface Location {
    id: number;
    locationName: string;
    postalCode: string | null;
    locationLevel: ELocationLevel;
    locationOf: number | null;
    createdAt: string | null;
    updatedAt: string | null;
    status: ELocationLevel;
  }

  return (
    <>
      <Box sx={{
        m: 2,
        p:'0 0 8px 0',
        border: 1,
        borderColor: '#C7C8CC',
        borderRadius: 1
      }}>
        <Box sx={{
          display: 'flex',
          flexDirection: 'column',
          borderBottom: 1,
          backgroundColor: '#C7C8CC',
          borderColor: '#C7C8CC',
          borderTopLeftRadius: 2,
          borderTopRightRadius: 2
        }}>
          <Typography variant='h6' sx={{ p: 1, fontSize:'14px', fontWeight: 550, display:'fit-content' }}>SENDER INFO</Typography>
        </Box>
        <Box sx={{
          display: 'flex',
          flexDirection: 'column'
        }}>
          <RadioGroup
            sx={{ m: 2 }}
            row
            aria-labelledby="demo-row-radio-buttons-group-label"
            name="row-radio-buttons-group"
            value={value}
            onChange={handleChange}
          >
            <FormControlLabel value='true' control={<Radio />} label="Chocse from list Sender Address" />
            <FormControlLabel value='false' control={<Radio />} label="Nhập người gửi mới" />
          </RadioGroup>

          {value === 'true' ?
            <TextField
              sx={{ mx: 2, mb:1 }}
              id="outlined-select-currency"
              select
              label="Choose sender"
              defaultValue="1"
            >
              {currencies.map((option) => (
                <MenuItem
                  key={option.value}
                  value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField> :
            <Box sx={{ mx:2, '& .MuiTextField-root': { my: 1, width: '100%' } }}>
              <TextField sx={{ '& .MuiInputBase-input':{ py:1.5 } }} label="Sđt" type="number" placeholder='Nhập sđt người gửi'/>
              <TextField sx={{ '& .MuiInputBase-input':{ py:1.5 } }} label="Người gửi" type="text" placeholder='Nhập tên người gửi'/>
              <TextField sx={{ '& .MuiInputBase-input':{ py:1.5 } }} label="Địa chỉ" type="text" placeholder='Nhập địa chỉ người gửi'/>
              <Grid container spacing={1}>
                <Grid item xs={6}>
                  <Autocomplete
                    id="city-select-demo"
                    options={locations}
                    autoHighlight
                    getOptionLabel={(option) => option.locationName}
                    onChange={(event, value) => handleCitySelect(value)}
                    renderOption={(props, option) => {
                      return (
                        <Box component="li" {...props} key={option.id}>
                          {option.locationName}
                        </Box>
                      )
                    }}
                    renderInput={(params) => (
                      <TextField
                        sx={{ flexGrow: 1 }}
                        {...params}
                        label="Chọn tỉnh/thành phố"
                        inputProps={{
                          ...params.inputProps,
                          autoComplete: 'new-password' // disable autocomplete and autofill
                        }}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={6}>
                  <Autocomplete
                    id="district-select-demo"
                    options={childLocations}
                    autoHighlight
                    getOptionLabel={(option) => newCitySelected ? '' : option.locationName}
                    onChange={(event, value) => handleDistrictSelect(value)}
                    renderOption={(props, option) => (
                      <Box component="li" {...props}>
                        {option.locationName}
                      </Box>
                    )}
                    renderInput={(params) => (
                      <TextField
                        sx={{ flexGrow: 1 }}
                        {...params}
                        label="Chọn quận/huyện"
                        inputProps={{
                          ...params.inputProps,
                          autoComplete: 'new-password' // disable autocomplete and autofill
                        }}
                      />
                    )}
                  />
                </Grid>
              </Grid>
              <Autocomplete
                id="xaPhuong-select-demo"
                options={wards}
                autoHighlight
                getOptionLabel={(option) => option.locationName}
                onChange={(event, newValue) => {
                  handleDistrictSelect(newValue)
                }}
                renderOption={(props, option) => (
                  <Box component="li" {...props}>
                    {option.locationName}
                  </Box>
                )}
                renderInput={(params) => (
                  <TextField
                    sx={{ flexGrow: 1 }}
                    {...params}
                    label="Chọn xã/phường"
                    inputProps={{
                      ...params.inputProps,
                      autoComplete: 'new-password'// disable autocomplete and autofill
                    }}
                  />
                )}
              />
            </Box>}
        </Box>
      </Box>
    </>
  )
}

export default FormSender*/
