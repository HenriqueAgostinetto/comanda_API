import { Box, Typography, TextField, Button, Paper } from '@mui/material';
import { useState } from 'react';

export default function Clientes() {
  const [nomeCli, setNomeCli] = useState('');
  const [telefone, setTelefone] = useState('');     // henrique agostinetto piva
  const [lista, setLista] = useState([]);

  const handleSave = (e) => {
    e.preventDefault();
    const novoItem = { nome: nomeCli, tel: telefone, id: Date.now() };
    setLista([novoItem, ...lista]);
    setNomeCli(''); 
    setTelefone('');
  };

  return (
    <Box className="animate-page" sx={{ p: 4, maxWidth: '900px', mx: 'auto' }}>
      <Typography variant="h4" sx={{ fontWeight: 900, mb: 1, letterSpacing: '-0.5px' }}>CLIENTES</Typography>
      <Typography variant="body2" sx={{ mb: 4 }}>Gerenciamento e inclusão imediata de clientes.</Typography>

      <Paper variant="outlined" sx={{ p: 4, borderRadius: 0, mb: 5 }}>
        <Box component="form" onSubmit={handleSave} sx={{ display: 'flex', gap: 3, alignItems: 'flex-end' }}>
          <TextField label="NOME" fullWidth required value={nomeCli} onChange={(e) => setNomeCli(e.target.value)} variant="standard" />
          <TextField label="TELEFONE" fullWidth required value={telefone} onChange={(e) => setTelefone(e.target.value)} variant="standard" />
          <Button type="submit" variant="contained" sx={{ bgcolor: 'var(--accent-blue) !important', color: '#ffffff !important', fontWeight: 800, px: 4, height: '40px', borderRadius: 0, '&:hover': { bgcolor: 'var(--accent-green) !important' } }}>
            SALVAR
          </Button>
        </Box>
      </Paper>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {lista.map((item) => (
          <Box key={item.id} className="animate-item" sx={{ p: 2.5, border: '1px solid var(--border-main)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box>
              <Typography sx={{ fontWeight: 700, fontSize: '0.9rem' }}>{item.nome}</Typography>
              <Typography variant="body2" sx={{ fontSize: '0.8rem' }}>{item.tel}</Typography>
            </Box>
            <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: 'var(--color-success-animate) !important' }} />
          </Box>
        ))}
      </Box>
    </Box>
  );
}
