/*
'use client'
import { Box, Tooltip, Typography } from '@mui/material'
import HomeRepairServiceIcon from '@mui/icons-material/HomeRepairService'
import Radio from '@mui/material/Radio'
import RadioGroup from '@mui/material/RadioGroup'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormControl from '@mui/material/FormControl'
import ReceiptIcon from '@mui/icons-material/Receipt'
import { useContext, useEffect, useState } from 'react'
import { PostalCodeContext } from '@/context/PostalCodeContext'
import { DataFeeCustomType } from '@/models/DataFeeCustomType'


function FormService() {
  const context = useContext(PostalCodeContext)
  const [isFetching, setIsFetching] = useState(false)
  if (!context) {
    throw new Error('PostalCodeContext is undefined, make sure it is provided in a parent component')
  }
  const { postalCodeFrom, postalCodeTo, totalWeight } = context

  interface Service {
    id: number;
    serviceName: string;
    serviceDescription: string;
    weighFrom: number;
    weighTo: number;
    createdAt: string;
    updatedAt: string;
    status: number;
  }
  // interface Location {
  //   id: number;
  //   locationName: string;
  //   postalCode: string;
  //   locationLevel: number;
  //   locationOf: number;
  //   createdAt: string;
  //   updatedAt: string;
  //   status: number;
  //   parentLocation: null;
  //   childLocations: null;
  // }

  const [services, setServices] = useState<Service[]>([])
  const [listFee, setListFee] = useState<DataFeeCustomType[]>([])
  const [timeProcess, setTimeProcess] = useState(0)
  const [feeCharge, setFeeCharge] = useState(0)

  const handleSelectFee = (event: React.ChangeEvent<HTMLInputElement>) => {
    const feeId = parseInt(event.target.value)
    const fee = listFee.find(fee => fee.id === feeId)
    if (fee) {
      setFeeCharge(fee.feeCharge)
    }
    const timeProcess = listFee.find(fee => fee.id === feeId)
    if (timeProcess) {
      setTimeProcess(timeProcess.timeProcess)
    }
  }

  useEffect(() => {
    if (totalWeight > 0) {
      fetch(`http://localhost:5255/GetServicesByWeight/${totalWeight}`)
        .then(response => response.json())
        .then(data => setServices(data))
    }
    // .catch(error => console.error('Error:', error))
  }, [totalWeight])


  //Fetch servicesFeeby 3 paramas : postalCodeFrom, postalCodeTo, totalWeight
  useEffect(() => {
    if (totalWeight > 0 && !isFetching) {
      setIsFetching(true)
      setTimeout(() => {
        fetch(`http://localhost:5255/api/FeeCustom/GetFeeByPostalCodeWeight/${postalCodeFrom}/${postalCodeTo}/${totalWeight}`)
          .then(response => response.json())
          .then(data => {
            setListFee(data)
            setIsFetching(false)
            console.log(data)
          })
          .catch(error => {
            console.error('Error:', error)
            setIsFetching(false)
          })
      }, 1000) // 1000 ms delay
    }
  }, [totalWeight, postalCodeFrom, postalCodeTo])
  return (
    <>
      <Box sx={{
        m: 2,
        mb:8,
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
          <Typography variant='h6' sx={{ p: 1, fontSize:'14px', fontWeight: 550, display:'fit-content' }}>
            <HomeRepairServiceIcon sx={{ color: 'red', p:'0 6px', fontSize:'small' }} />CHỌN DỊCH VỤ
          </Typography>
        </Box>
        <Box>
          <FormControl>
            <Typography variant='h6'
              sx={{ fontSize:'14px', fontWeight: 550, display:'fit-content', mx:2, pt:1 }}>
              <ReceiptIcon sx={{ color: 'red', p:'0 6px', fontSize:'small' }} />DỊCH VỤ CHÍNH
            </Typography>
            {}
            <RadioGroup
              row
              aria-labelledby="demo-row-radio-buttons-group-label"
              name="row-radio-buttons-group"
              sx={{ mx:2, pt:1 }}
              onChange={handleSelectFee}
            >
              {/!* {services.map(service => (
                <Tooltip title={service.serviceDescription} key={service.id}>
                  <FormControlLabel
                    value={service.id}
                    control={<Radio sx={{ color:'red', '&.Mui-checked':{ color:'red' } }} />}
                    label={service.serviceName}
                  />
                </Tooltip>
              ))} *!/}
              {listFee.map(fee => (
                <Tooltip title={fee.service.serviceDescription} key={fee.id}>
                  <FormControlLabel
                    value={fee.id}
                    control={<Radio sx={{ color:'red', '&.Mui-checked':{ color:'red' } }} />}
                    label={fee.service.serviceName}
                  />
                </Tooltip>
              ))}
            </RadioGroup>
          </FormControl>
          {!isFetching &&
            <Box sx={{ mx:2, mb:2, display:'flex', flexDirection:'row', justifyContent:'space-between' }}>
              <Typography>
                {listFee.length > 0 && feeCharge > 0 ? `Phí vận chuyển: ${feeCharge.toLocaleString()} VNĐ`: 'Vui lòng chọn dịch vụ'}
              </Typography>
              {/!* ngày giao hàng *!/}
              <Typography>
                {listFee.length > 0 && feeCharge > 0 ? `Phí vận chuyển: ${timeProcess} ngày`: 'Vui lòng chọn dịch vụ'}
              </Typography>
            </Box>
          }
        </Box>
      </Box>
    </>
  )
}

export default FormService*/
