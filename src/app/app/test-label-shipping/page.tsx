'use client'
import { Box, Container, Divider, Grid, Paper, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import ContactsIcon from '@mui/icons-material/Contacts'
import BwipJs from 'bwip-js/node'

function Page() {
  const [barcodeSrc, setBarcodeSrc] = useState('')

  useEffect(() => {
    const barcodeValue = '1234567890' // replace with your string

    BwipJs.toBuffer({
      bcid: 'code128',       // Barcode type
      text: barcodeValue,    // Text to encode
      scale: 3,              // 3x scaling factor
      height: 10,            // Bar height, in millimeters
      includetext: true,     // Show human-readable text
      textxalign: 'center',  // Always good to set this
    }, (err, png) => {
      if (err) {
        // Decide how to handle the error
        // `err` may be a string or Error object
      } else {
        let src = 'data:image/png;base64,' + png.toString('base64')
        setBarcodeSrc(src)
      }
    })
  }, [])
  return (
    <Container maxWidth='md'>
      <Paper elevation={3} sx={{ my: 3, borderRadius: '6px', boxSizing: 'border-box' }}>
        <Grid container>
          <Grid item xs={4} >
            <Typography sx={{ fontSize:'35px', color:'red', fontWeight:550, my:2, textAlign:'center', justifyContent:'center' }}>site name</Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography sx={{ fontSize:'25px', fontWeight:550, my:2, textAlign:'center', justifyContent:'center' }}>BILL OF CONSIGNMENT</Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography sx={{ my:2, textAlign:'center', justifyContent:'center' }}><img style={{ width:'65%', justifyContent:'center' }} src={barcodeSrc} alt="barcode" /></Typography>
          </Grid>
        </Grid>
        <Divider sx={{ color:'black', mb:2 }}/>
        <Box sx={{ border:1, borderBottom:0, mx:2, py:2 }}>
          <Typography sx={{ fontWeight:550 }}>1. Sender </Typography>
          <Typography sx={{ fontWeight:550, fontSize:'16px', mx:2 }}>Sender name :</Typography>
          <Typography sx={{ fontWeight:500, fontSize:'16px', mx:2 }}>Nguyen Van A</Typography>
          <Typography sx={{ fontWeight:550, fontSize:'16px', mx:2 }}>Address From</Typography>
          <Typography sx={{ fontWeight:500, fontSize:'16px', mx:2 }}>abcdèf</Typography>
        </Box>
        <Box sx={{ border:1, borderBottom:0, mx:2, py:2 }}>
          <Typography sx={{ fontWeight:550 }}>2. Reciever </Typography>
          <Typography sx={{ fontWeight:550, fontSize:'16px', mx:2 }}>Reciver name :</Typography>
          <Typography sx={{ fontWeight:500, fontSize:'16px', mx:2 }}>Nguyen Van A</Typography>
          <Typography sx={{ fontWeight:550, fontSize:'16px', mx:2 }}>Address From</Typography>
          <Typography sx={{ fontWeight:500, fontSize:'16px', mx:2 }}>abcdef</Typography>
        </Box>
        <Box sx={{ border:1, mx:2, py:2 }}>
          <Typography sx={{ fontWeight:550 }}>3. Goods Content </Typography>
          <Typography sx={{ fontSize:'12px', textDecorationStyle:'italic', mx:2 }}>Item name, quantity, value, imei, ...</Typography>
          <Typography sx={{ mx:2, mt:1 }}>1 x ItemName</Typography>
        </Box>
        <Divider sx={{ color:'black', my:2 }}/>
        <Box sx={{ mx:2, my:3 }}>
          <Grid container>
            <Grid item xs={3}>
              <Box sx={{ display:'flex', flexDirection:'row', justifyContent:'center', justifyItems:'center' }}>
                <ContactsIcon sx={{ fontSize:'40px' }}></ContactsIcon>
                <Box sx={{ display:'flex', flexDirection:'column' }}>
                  <Typography sx={{ fontSize:'25px', fontWeight:550 }}>0000 - 0000</Typography>
                  <Typography sx={{ fontSize:'14px' }}>Tars Delivery</Typography>

                </Box>
              </Box>
            </Grid>
            <Grid item xs={4.5}>
              <Typography sx={{ textAlign:'center', justifyContent:'center', fontSize:'14px' }}>Date sent: 01/02/2024</Typography>
              <Typography sx={{ textAlign:'center', justifyContent:'center', pb:15, fontWeight:550 }}>Sender Sign</Typography>
            </Grid>
            <Grid item xs={4.5}>
              <Typography sx={{ textAlign:'center', justifyContent:'center', fontSize:'14px' }}>Date Reicieve: 01/02/2024</Typography>
              <Typography sx={{ textAlign:'center', justifyContent:'center', pb:15, fontWeight:550 }}>Reciever Sign</Typography>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Container>
  )
}

export default Page