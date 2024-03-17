'use client'
import { Box, Button, Grid, TextField, Typography } from '@mui/material'
import React, { useState } from 'react'
import trackingSvg from '../../public/tracking-img.svg'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'


export default function TrackingShipment() {
  const [trackingCode, setTrackingCode] = useState('')
  const [phoneFrom, setPhoneFrom] = useState('')
  const router = useRouter()

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTrackingCode(event.target.value)
  }
  const handlePhoneFromChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPhoneFrom(event.target.value)
  }
  const handleTraCuuButton = async () => {
    // Check if trackingCode is not empty
    if (!trackingCode || !phoneFrom) {
      toast.error('Please enter a tracking code and phone number')
      return
    }

    try {
      const response = await fetch(`http://localhost:5255/api/Package/getbytracking/${trackingCode}/${phoneFrom}`)
      const data = await response.json()

      // Check if the response is successful
      if (response.ok) {
        // Store the data in the local storage with expiry time
        const dataToStore = {
          value: data, // the data you want to store
          expiry: new Date().getTime() + 24 * 60 * 60 * 1000// 24 hours from now
        }
        localStorage.setItem('trackingData', JSON.stringify(dataToStore))

        // Navigate to the new page
        router.push('/tracking-shipment')
      } else {
        toast.error('Package not found')
      }
    } catch (error) {
      console.log(error)
      toast.error('An error occurred')
    }
  }

  return (
    <>
      <Box>
        <Grid container sx={{ p: 4 }}>
          <Grid item xs={12} sm={6}>
            <Box>
              <Typography sx={{ fontWeight: 550, py: 1 }}>
                Tracking Code
              </Typography>
              {/* <Typography sx={{ fontWeight:550, fontSize:'16px', py:1 }}>
                (Tra nhiều bill bằng cách thêm dấu phẩy giữa các bill)
              </Typography> */}
              <TextField sx={{ '& .MuiInputBase-input': { py: 1 }, width: '100%' }}
                type="text"
                placeholder='Example: 123456, 24563'
                value={trackingCode}
                onChange={handleInputChange}
              />

              <TextField
                sx={{ '& .MuiInputBase-input': { py: 1 }, width: '100%', mt: 1 }}
                type="text"
                placeholder='Enter your phone number'
                onChange={handlePhoneFromChange}
              />
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
                onClick={handleTraCuuButton}
              >
                Search
              </Button>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Box>
              <Image priority src={trackingSvg} alt="tracking" style={{ display: 'flex', marginLeft: 'auto', marginRight: 'auto' }} />
            </Box>
          </Grid>
        </Grid>
        {/* <Box sx={{ backgroundColor:'#ced4da', borderRadius:1, mx:1 }}>
          <Box sx={{ py:2, px:3 }}>
            <Typography sx={{ fontWeight:550 }} variant="h5">
              Thông tin vận đơn
            </Typography>
          </Box>
          <Box sx={{ py:2, px:3 }}>
            <Grid container>
              <Grid item xs={12} sm={4} sx={{ display:'flex', flexDirection:'row', borderRight:{ xs:0, sm:1 } }}>
                <Grid item xs={6}>
                  <Typography sx={{ py:2, textAlign:'left' }}>
                    Mã vận đơn:
                  </Typography>
                  <Typography sx={{ py:2 }}>
                    Chi tiết đơn hàng:
                  </Typography>
                  <Typography sx={{ py:2 }}>
                    Người gửi:
                  </Typography>
                  <Typography sx={{ py:2 }}>
                    Người nhận:
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography sx={{ textAlign:'right', pr:2, fontWeight:'550', py:2 }}>
                    1122336655
                  </Typography>
                  <Typography sx={{ textAlign:'right', pr:2, fontWeight:'550', py:2 }}>
                    Xem thêm
                  </Typography>
                  <Typography sx={{ textAlign:'right', pr:2, fontWeight:'550', py:2 }}>
                    TPHCM
                  </Typography>
                  <Typography sx={{ textAlign:'right', pr:2, fontWeight:'550', py:2 }}>
                    Hmm
                  </Typography>
                </Grid>
              </Grid>
              <Grid item xs={12} sm={4} sx={{ display:'flex', flexDirection:'row', borderRight:{ xs:0, sm:1 } }}>
                <Grid item xs={6}>
                  <Typography sx={{ py:2, pl:{ xs:0, sm:2 } }}>
                    Khối lượng (gram):
                  </Typography>
                  <Typography sx={{ py:2, pl:{ xs:0, sm:2 } }}>
                    Dịch vụ:
                  </Typography>
                  <Typography sx={{ py:2, pl:{ xs:0, sm:2 } }}>
                    Trạng thái
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography sx={{ textAlign:'right', pr:2, fontWeight:'550', py:2 }}>
                    12000
                  </Typography>
                  <Typography sx={{ textAlign:'right', pr:2, fontWeight:'550', py:2 }}>
                    Giao hàng tiết kiệm
                  </Typography>
                  <Typography sx={{ textAlign:'right', pr:2, fontWeight:'550', py:2 }}>
                    Giao thành công
                  </Typography>
                </Grid>
              </Grid>
              <Grid item xs={12} sm={4} sx={{ display:'flex', flexDirection:'row' }}>
                <Grid item xs={6}>
                  <Typography sx={{ py:2, pl:{ xs:0, sm:2 } }}>
                    Ngày tạo:
                  </Typography>
                  <Typography sx={{ py:2, pl:{ xs:0, sm:2 } }}>
                    Ngày nhận hàng:
                  </Typography>
                  <Typography sx={{ py:2, pl:{ xs:0, sm:2 } }}>
                    Ngày giao hàng dự kiến:
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography sx={{ textAlign:'right', fontWeight:'550', py:2, pr:3 }}>
                    01/02/2024
                  </Typography>
                  <Typography sx={{ textAlign:'right', fontWeight:'550', py:2, pr:3 }}>
                    02/02/2024
                  </Typography>
                  <Typography sx={{ textAlign:'right', fontWeight:'550', py:2, pr:3 }}>
                    02/02/2024
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
          </Box>
        </Box> */}
      </Box>
    </>
  )
}
