import { Box, Typography, TextField, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function Clientes() {
  const navigate = useNavigate();                                                                       // hernique agostinetto piva

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>lista de clientes</Typography>
      <TextField label="" fullWidth sx={{ mb: 4 }} />
      <Button variant="contained" onClick={() => navigate('/cadastra-cliente')}>
        cadastrar novo
      </Button>
    </Box>
  );
}