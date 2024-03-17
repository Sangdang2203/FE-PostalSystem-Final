'use client'
import { Autocomplete, Box, Button, Grid, TextField, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import Paper from '@mui/material/Paper'
import trackingSvg from '../../public/cuoc-phi.png'
import Image from 'next/image'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation' // Import useRouter hook


export default function UocTinhCuocPhi() {

  const [locations, setLocations] = useState<Location[]>([])

  const [selectedCity, setSelectedCity] = useState<Location | null>(null)
  const [selectedCityTo, setSelectedCityTo] = useState<Location | null>(null)

  const [childLocations, setChildLocations] = useState<Location[]>([])
  const [childLocationsTo, setChildLocationsTo] = useState<Location[]>([])

  const [selectedDistrict, setSelectedDistrict] = useState<Location | null>(null)
  const [selectedDistrictTo, setSelectedDistrictTo] = useState<Location | null>(null)

  const [newCitySelected, setNewCitySelected] = useState(false)
  const [newCitySelectedTo, setNewCitySelectedTo] = useState(false)

  const [newDistrictSelected, setNewDistrictSelected] = useState(false)
  const [newDistrictSelectedTo, setNewDistrictSelectedTo] = useState(false)

  const [postalCodeFrom, setPostalCodeFrom] = useState('')
  const [postalCodeTo, setPostalCodeTo] = useState('')

  const router = useRouter() // Initialize the useRouter hook

  // Fetch all tỉnh/thành phố
  useEffect(() => {
    fetch('http://localhost:5255/api/Location/GetListLocationByLevel/Province')
      .then(response => response.json())
      .then(data => setLocations(data))
      .catch(error => console.log(error))
  }, [])

  // Fetch child locations for selectedCity
  useEffect(() => {
    if (selectedCity) {
      fetch(`http://localhost:5255/api/Location/GetChildLocation/${selectedCity.id}`)
        .then(response => response.json())
        .then(data => {
          setChildLocations(data.districs || [])
        })
        .catch(error => console.error('Error:', error))
    }
  }, [selectedCity])

  // Fetch child locations for selectedCityTo
  useEffect(() => {
    if (selectedCityTo) {
      fetch(`http://localhost:5255/api/Location/GetChildLocation/${selectedCityTo.id}`)
        .then(response => response.json())
        .then(data => {
          setChildLocationsTo(data.districs || [])
        })
        .catch(error => console.error('Error:', error))
    }
  }, [selectedCityTo])


  const handleCitySelect = (value: Location | null) => {
    setSelectedCity(value)
    setNewCitySelected(true) // Set newCitySelected to true when a new city is selected
  }
  const handleCitySelectTo = (value: Location | null) => {
    setSelectedCityTo(value)
    setNewCitySelectedTo(true) // Set newCitySelected to true when a new city is selected
  }

  const handleDistrictSelect = (value: Location | null) => {
    setSelectedDistrict(value)
    setPostalCodeFrom(value?.postalCode || '')
    setNewCitySelected(false) // Set newCitySelected to false when a district is selected
    setNewDistrictSelected(true) // Set newDistrictSelected to true when a new district is selected
  }
  const handleDistrictSelectTo = (value: Location | null) => {
    setSelectedDistrictTo(value)
    setPostalCodeTo(value?.postalCode || '')
    setNewCitySelectedTo(false) // Set newCitySelected to false when a district is selected
    setNewDistrictSelectedTo(true) // Set newDistrictSelected to true when a new district is selected
  }

  const handleTraCuuEstimateCost = async () => {
    // Get the values from the fields
    const postalCodeFrom = selectedDistrict?.postalCode
    const postalCodeTo = selectedDistrictTo?.postalCode
    const weight = (document.querySelector('input[type="number"]') as HTMLInputElement).value

    // Check if all fields are selected
    if (!postalCodeFrom || !postalCodeTo || !weight) {
      toast.error('All fields must be selected')
      return
    }

    try {
      const response = await fetch(`http://localhost:5255/api/FeeCustom/GetFeeByPostalCodeWeight/${postalCodeFrom}/${postalCodeTo}/${weight}`)
      const data = await response.json()

      // Check if the response is successful
      if (response.ok) {
        // Check if data is an array and has at least one element
        if (Array.isArray(data) && data.length > 0) {
          // Store the data in the local storage
          const dataToStore = {
            expiry: new Date().getTime() + 24 * 60 * 60 * 1000, // 24 hours from now
            value: data // the data you want to store
          }
          localStorage.setItem('dataEstimate', JSON.stringify(dataToStore))
          console.log('Data fetched successfully:', data)
          // Redirect to the page.tsx
          router.push('/estimate-cost')
        } else {
          toast.error('No data found')
        }
      } else {
        toast.error('Error fetching data')
      }
    } catch (error) {
      console.error('Error:', error)
      toast.error('An error occurred')
    }
  }

  enum ELocationLevel {
    province = 0,
    district = 1,
    ward = 2
  }

  interface Location {
    id: number
    locationName: string
    postalCode: string | null
    locationLevel: ELocationLevel
    locationOf: number | null
    createdAt: string | null
    updatedAt: string | null
    status: ELocationLevel
  }
  return (
    <>
      <Paper elevation={3}>
        <Grid container sx={{ p:4 }}>
          <Grid item xs={12} sm={6}>
            <Box>
              <Typography sx={{ fontWeight:550 }} variant="h5" component="h5">
                Estimate cost
              </Typography>
              <Typography sx={{ my:2, fontWeight:'550' }}>Send from *</Typography>
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
                    label="Choose a city"
                    inputProps={{
                      ...params.inputProps,
                      autoComplete: 'new-password' // disable autocomplete and autofill
                    }}
                  />
                )}
              />
              <Typography sx={{ my:2, fontWeight:'550' }}>District *</Typography>

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
                    label="Choose a district"
                    inputProps={{
                      ...params.inputProps,
                      autoComplete: 'new-password' // disable autocomplete and autofill
                    }}
                  />
                )}
              />
              <Typography sx={{ my:2, fontWeight:'550' }}>Send to *</Typography>
              <Autocomplete
                id="city-to-select-demo"
                options={locations}
                autoHighlight
                getOptionLabel={(option) => option.locationName}
                onChange={(event, value) => handleCitySelectTo(value)}
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
                    label="Choose a city"
                    inputProps={{
                      ...params.inputProps,
                      autoComplete: 'new-password' // disable autocomplete and autofill
                    }}
                  />
                )}
              />
              <Typography sx={{ my:2, fontWeight:'550' }}>District *</Typography>

              <Autocomplete
                id="district-to-select-demo"
                options={childLocationsTo}
                autoHighlight
                getOptionLabel={(option) => newCitySelectedTo ? '' : option.locationName}
                onChange={(event, value) => handleDistrictSelectTo(value)}
                renderOption={(props, option) => (
                  <Box component="li" {...props}>
                    {option.locationName}
                  </Box>
                )}
                renderInput={(params) => (
                  <TextField
                    sx={{ flexGrow: 1 }}
                    {...params}
                    label="Choose a district"
                    inputProps={{
                      ...params.inputProps,
                      autoComplete: 'new-password' // disable autocomplete and autofill
                    }}
                  />
                )}
              />
              <Typography sx={{ my:2, fontWeight:'550' }}>Total weight *</Typography>
              <TextField sx={{ '& .MuiInputBase-input':{ py:1 }, width:'100%', mt:1 }} type="number" placeholder='Enter weight in grams'/>

              <Typography sx={{ fontWeight:550 }}>
                <Button sx={{
                  my:2,
                  color:'white',
                  backgroundColor:'red',
                  borderRadius:1,
                  '&:hover':{
                    backgroundColor:'red',
                    color:'white'
                  }
                }}
                onClick={handleTraCuuEstimateCost}
                >Search</Button>
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Box>
              <Image priority src={trackingSvg} alt="tracking" style={{ display:'block', marginLeft:'auto', marginRight:'auto', maxWidth:'290px' }}/>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </>
  )
}
