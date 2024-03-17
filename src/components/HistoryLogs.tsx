// HistoryLogs.tsx
import React from 'react'
import { Box, Typography } from '@mui/material'

interface Log {
  createdAt: string
  id: number
  step: number
  employee: { fullname: string }
  historyNote: string
}

interface TrackingData {
  value: {
    historyLogs?: Log[]
    nameFrom: string
    nameTo: string
  }
}

interface HistoryLogsProps {
  trackingData: TrackingData | null;
  statusMapping: { [key: string]: string };
}

const HistoryLogs: React.FC<HistoryLogsProps> = ({ trackingData, statusMapping }) => {
  if (!trackingData) {
    return <div>Loading...</div>
  }
  return (
    <Box sx={{ backgroundColor:'#ced4da', borderRadius:1, mx:1, my:1 }}>
      <Box sx={{ p:3 }}>
        <ul style={{ borderLeft:'1px', borderColor:'#ddd', letterSpacing: '0.2px', padding:'0 25px' }}>
          {trackingData?.value?.historyLogs?.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).map((log, index) => {
            const date = new Date(log.createdAt)
            const day = String(date.getDate()).padStart(2, '0')
            const month = String(date.getMonth() + 1).padStart(2, '0') // Months are 0-based in JavaScript
            const year = date.getFullYear()
            const hours = String(date.getHours()).padStart(2, '0')
            const minutes = String(date.getMinutes()).padStart(2, '0')
            const seconds = String(date.getSeconds()).padStart(2, '0')
            const formattedDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`

            return (
              <li key={index} style={{ paddingBottom:'8px' }}>
                <Typography sx={{ fontWeight:550, color:'red' }}>
                  {statusMapping[log.id]}
                </Typography>
                <span>
                  {formattedDate} :
                  {log.step === 0 ? trackingData.value.nameFrom
                    : log.step === 6 ? trackingData.value.nameTo
                      : `Employee: ${log.employee.fullname}`}
                  - {log.historyNote}
                </span>
              </li>
            )
          }) || <div>Loading...</div>}
        </ul>
      </Box>
    </Box>
  )
}

export default HistoryLogs