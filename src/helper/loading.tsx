import * as React from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import { IconButton } from '@mui/material';

export default function Loading() {
  return (
    <IconButton>
      <CircularProgress size={24} />
    </IconButton>
  );
}