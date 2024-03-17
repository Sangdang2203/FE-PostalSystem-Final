'use client'
import React, { useEffect, useState } from 'react'
import Breadcrumbs from '@mui/material/Breadcrumbs'
import Link from '@mui/material/Link'
import Stack from '@mui/material/Stack'
import NavigateNextIcon from '@mui/icons-material/NavigateNext'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import { TrackingDataItem } from '@/components/interfaces'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { Autocomplete, Box, Button, Grid, TextField, Typography } from '@mui/material'
import Paper from '@mui/material/Paper'
import Image from 'next/image'
import trackingSvg from '../../../../public/tracking-img.svg'

function Page() {
  const breadcrumbs = [
    <Link underline="hover" key="1" color="inherit" href="/">
      Trang chủ
    </Link>,
    <Typography key="2" color="text.primary">
      Ước tính cước phí
    </Typography>
  ]

  const [trackingData, setTrackingData] = useState<TrackingDataItem[] | null>(null)

  useEffect(() => {
    const itemStr = localStorage.getItem('dataEstimate')

    if (!itemStr) {
      // console.log('No data in localStorage')
      setTrackingData(null)
      return
    }

    const item = JSON.parse(itemStr)
    const now = new Date()

    if (now.getTime() > item.expiry) {
      // console.log('Data in localStorage expired')
      localStorage.removeItem('dataEstimate')
      setTrackingData(null)
    } else {
      const item = JSON.parse(itemStr)
      // console.log('Data from localStorage:', item.value)
      setTrackingData(item.value)
    }
  }, [])

  //Autocomplete
  const [locations, setLocations] = useState<Location[]>([])

  const [selectedCity, setSelectedCity] = useState<Location | null>(null)
  const [selectedCityTo, setSelectedCityTo] = useState<Location | null>(null)

  const [childLocations, setChildLocations] = useState<Location[]>([])
  const [childLocationsTo, setChildLocationsTo] = useState<Location[]>([])

  const [selectedDistrict, setSelectedDistrict] = useState<Location | null>(null)
  const [selectedDistrictTo, setSelectedDistrictTo] = useState<Location | null>(null)

  const [newCitySelected, setNewCitySelected] = useState(false)
  const [newCitySelectedTo, setNewCitySelectedTo] = useState(false)

  // const [newDistrictSelected, setNewDistrictSelected] = useState(false)
  // const [newDistrictSelectedTo, setNewDistrictSelectedTo] = useState(false)

  // const [postalCodeFrom, setPostalCodeFrom] = useState('')
  // const [postalCodeTo, setPostalCodeTo] = useState('')

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
    // setPostalCodeFrom(value?.postalCode || '')
    setNewCitySelected(false) // Set newCitySelected to false when a district is selected
    // setNewDistrictSelected(true) // Set newDistrictSelected to true when a new district is selected
  }
  const handleDistrictSelectTo = (value: Location | null) => {
    setSelectedDistrictTo(value)
    // setPostalCodeTo(value?.postalCode || '')
    setNewCitySelectedTo(false) // Set newCitySelected to false when a district is selected
    // setNewDistrictSelectedTo(true) // Set newDistrictSelected to true when a new district is selected
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
          setTrackingData(data)
          // Redirect to the page.tsx
          router.push('/estimate-cost')
        } else {
          toast.error('No data found')
        }
      } else {
        toast.error('Error fetching data')
      }
    } catch (error) {
      // console.error('Error:', error)
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
      <Box sx={{ py: 1, px: 2 }}>
        <Stack>
          <Breadcrumbs
            separator={<NavigateNextIcon fontSize="small" />}
            aria-label="breadcrumb"
          >
            {breadcrumbs}
          </Breadcrumbs>
        </Stack>
      </Box>

      {/* Table */}
      <Box sx={{ my: 2 }}>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 380 }} aria-label="simple table">
            <TableHead>
              <TableRow sx={{ backgroundColor: '#f0f0f0' }}>
                <TableCell style={{ fontSize: '16px', fontWeight: 550 }} align="center">Service Name</TableCell>
                <TableCell style={{ fontSize: '16px', fontWeight: 550 }} align="center">Cost</TableCell>
                <TableCell style={{ fontSize: '16px', fontWeight: 550 }} align="center">Estimate Time</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {trackingData ? trackingData.map((row) => (
                <TableRow key={row.id}>
                  <TableCell style={{ fontSize: '16px' }}>{row.serviceName}</TableCell>
                  <TableCell style={{ fontSize: '16px' }}>{row.feeCharge.toLocaleString()} VND</TableCell>
                  <TableCell style={{ fontSize: '16px' }}>{row.timeProcess} day(s)</TableCell>
                </TableRow>
              )) : <TableRow><TableCell colSpan={3}>No data</TableCell></TableRow>}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      {/* Form tra cuu */}
      <Paper elevation={3} sx={{ my: 4 }}>
        <Grid container sx={{ p: 4 }}>
          <Grid item xs={12} sm={6}>
            <Box>
              <Typography sx={{ fontWeight: 550 }} variant="h5" component="h5">
                Estimate Cost
              </Typography>
              <Typography sx={{ my: 2, fontWeight: '550' }}>From *</Typography>
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
              <Typography sx={{ my: 2, fontWeight: '550' }}>District *</Typography>

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
              <Typography sx={{ my: 2, fontWeight: '550' }}>To *</Typography>
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
              <Typography sx={{ my: 2, fontWeight: '550' }}>District *</Typography>

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
              <Typography sx={{ my: 2, fontWeight: '550' }}>Enter total weight *</Typography>
              <TextField sx={{ '& .MuiInputBase-input': { py: 1 }, width: '100%', mt: 1 }} type="number" placeholder='Enter weight in grams' />

              <Typography sx={{ fontWeight: 550 }}>
                <Button sx={{
                  my: 2,
                  color: 'white',
                  backgroundColor: 'red',
                  borderRadius: 1,
                  '&:hover': {
                    backgroundColor: 'red',
                    color: 'white'
                  }
                }}
                  onClick={handleTraCuuEstimateCost}
                >SEARCH</Button>
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Box>
              <Image priority src={trackingSvg} alt="tracking" style={{ display: 'block', marginLeft: 'auto', marginRight: 'auto', maxWidth: '280px' }} />
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </>
  )
}

export default Page