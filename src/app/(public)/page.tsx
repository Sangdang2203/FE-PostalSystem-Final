'use client'
import * as React from 'react'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import TrackingShipment from '@/components/TrackingShipment'
import UocTinhCuocPhi from '@/components/UocTinhCuocPhi'
import people from '../../../public/ic-people.png'
import box from '../../../public/ic-box.png'
import { Grid } from '@mui/material'
import Image from 'next/image'
import CountUp from 'react-countup'
import NewsHomepage from '@/components/NewsHomepage'
import Link from 'next/link'

interface TabPanelProps {
    children?: React.ReactNode
    index: number
    value: number
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <>{children}</>
        </Box>
      )}
    </div>
  )
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`
  }
}

export default function Home() {
  const [value, setValue] = React.useState(0)

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue)
  }

  return (
    <Box sx={{ width: '100%' }}>
      <NewsHomepage />
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example" variant="fullWidth">
          <Tab sx={{ fontWeight:'550', fontSize:'20px' }} label="TRACKING ORDER" {...a11yProps(0)} />
          <Tab sx={{ fontWeight:'550', fontSize:'20px' }} label="ESTIMATE COST" {...a11yProps(1)} />
        </Tabs>
      </Box>
      <CustomTabPanel value={value} index={0}>
        <TrackingShipment />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        <UocTinhCuocPhi />
      </CustomTabPanel>
      <Box sx={{ py:3 }}>
        <Grid container direction='row'>
          <Grid item xs={12} md={4} sx={{ backgroundColor:'#f2f2f2' }}>
            <Typography sx={{ textAlign:'center', fontSize:26, fontWeight:550, color:'#44494d', width:'50%', justifyContent:'center', mx:'auto' }}>
              Post office network in 63 provinces
            </Typography>
            <Box sx={{ display:'flex', flexDirection:'row', justifyContent:'space-evenly' }}>
              <Link href="https://apps.apple.com/us/app/viettelpost-chuy%E1%BB%83n-ph%C3%A1t-nhanh/id1398283517">
                <img style={{ paddingTop:'10px' }} src="https://en.viettelpost.com.vn/wp-content/themes/viettel/assets/images/app.png" alt=""/>
              </Link>
              <Link href="https://play.google.com/store/apps/details?id=com.viettel.ViettelPost">
                <img src="https://en.viettelpost.com.vn/wp-content/themes/viettel/assets/images/gg.png" alt=""/>
              </Link>
            </Box>
          </Grid>
          <Grid item xs={12} md={4} sx={{ backgroundColor:'#ee0033', display:'flex', flexDirection:'row', alignItems:'center', justifyContent:'center' }}>
            <Box sx={{ justifyContent:'center' }}>
              <Image src={people} alt='people' style={{ width: '80%', height:'auto' }}/>
            </Box>
            <Box sx={{ justifyContent:'center' }}>
              <Typography sx={{ fontSize:'36px', color:'#fff', fontWeight:'550' }}>
                <CountUp start={10} end={123.457} decimals={3} duration={1} />+
              </Typography>
              <Typography sx={{ fontSize:'16px', color:'#fff' }}>CUSTOMERS TRUST AND USE</Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={4} sx={{ backgroundColor:'#ee0033', display:'flex', flexDirection:'row', alignItems:'center', justifyContent:'center' }}>
            <Box sx={{ justifyContent:'center' }}>
              <Image src={box} alt='box' style={{ width: '80%', height:'auto' }}/>
            </Box>
            <Box sx={{ justifyContent:'center' }}>
              <Typography sx={{ fontSize:'36px', color:'#fff', fontWeight:'550' }}>
                <CountUp start={40} end={789.12} decimals={2} duration={1.5} />+
              </Typography>
              <Typography sx={{ fontSize:'16px', color:'#fff' }}>ORDERS ARE SHIPPING</Typography>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Box>
  )
}
