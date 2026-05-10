import { Box, Typography, TextField, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function Funcionarios() {
  const navigate = useNavigate();
                                                              // hernique agostinetto piva
  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>lista de funcionarios</Typography>
      <TextField label="" fullWidth sx={{ mb: 4 }} />
      <Button variant="contained" onClick={() => navigate('/cadastra-funcionario')}>
        cadastrar novo
      </Button>
    </Box>
  );
}