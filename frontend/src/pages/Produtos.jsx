import { Box, Typography, TextField, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function Produtos() {
  const navigate = useNavigate();
                                                                                            // hernique agostinetto piva
  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>Lista de Produtos</Typography>
      
      <TextField 
        label="" 
        fullWidth 
        sx={{ mb: 4 }} 
      />

      <Button 
        variant="contained" 
        onClick={() => navigate('/cadastra-produto')}
      >
        Cadastrar Novo Produto
      </Button>
    </Box>
  );
}