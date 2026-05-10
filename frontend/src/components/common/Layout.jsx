import { Outlet } from 'react-router-dom';
import Navbar from './Navbar'; 
import { Box } from '@mui/material';

export default function Layout() {                                        // hernique agostinetto piva
  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', bgcolor: 'background.default' }}>
      {/*  Navbar   */}
      <Navbar />
      
      {/*  paginaas     */}
      <Box component="main" sx={{ p: 4, flexGrow: 1 }}>
        <Outlet />
      </Box>
    </Box>
  );
}