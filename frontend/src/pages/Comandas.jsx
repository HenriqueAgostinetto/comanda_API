import { Box, Typography, TextField, Button, Paper } from '@mui/material';
import { useState } from 'react';

export default function Comandas() {
  const [numeroMesa, setNumeroMesa] = useState('');
  const [nomeCliente, setNomeCliente] = useState('');
  const [listaComandas, setListaComandas] = useState([
    { id: 1, mesa: '05', cliente: 'Henrique Piva', status: 'Aberta' },
    { id: 2, mesa: '12', cliente: 'Carlos Silva', status: 'Aberta' }
  ]);

  const handleAbrirComanda = (e) => {
    e.preventDefault();
    const novaComanda = {
      id: Date.now(),
      mesa: numeroMesa,
      cliente: nomeCliente,
      status: 'Aberta'
    };
    setListaComandas([novaComanda, ...listaComandas]);
    setNumeroMesa('');
    setNomeCliente('');
  };

  return (
    <Box className="animate-page" sx={{ p: 4, maxWidth: '900px', mx: 'auto' }}>
      <Typography variant="h4" sx={{ fontWeight: 900, mb: 1, letterSpacing: '-0.5px' }}>COMANDAS</Typography>
      <Typography variant="body2" sx={{ mb: 4 }}>Controle e abertura de novas comandas operacionais.</Typography>

      <Paper variant="outlined" sx={{ p: 4, borderRadius: 0, mb: 5 }}>
        <Box component="form" onSubmit={handleAbrirComanda} sx={{ display: 'flex', gap: 3, alignItems: 'flex-end' }}>
          <TextField label="Nº DA MESA / COMANDA" fullWidth required value={numeroMesa} onChange={(e) => setNumeroMesa(e.target.value)} variant="standard" />
          <TextField label="NOME DO CLIENTE" fullWidth required value={nomeCliente} onChange={(e) => setNomeCliente(e.target.value)} variant="standard" />
          <Button type="submit" variant="contained" className="click-effect" sx={{ bgcolor: 'var(--accent-blue) !important', color: '#ffffff !important', fontWeight: 800, px: 4, height: '40px', borderRadius: 0, '&:hover': { bgcolor: 'var(--accent-green) !important' } }}>
            ABRIR
          </Button>
        </Box>
      </Paper>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {listaComandas.map((comanda) => (
          <Box key={comanda.id} className="animate-item" sx={{ p: 2.5, border: '1px solid var(--border-main)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box>
              <Typography sx={{ fontWeight: 700, fontSize: '0.9rem' }}>Mesa: {comanda.mesa} - {comanda.cliente}</Typography>
              <Typography variant="body2" sx={{ fontSize: '0.8rem' }}>Status: {comanda.status}</Typography>
            </Box>
            <Box sx={{ px: 1.5, py: 0.5, bgcolor: 'var(--accent-green)', color: '#ffffff', fontSize: '0.75rem', fontWeight: 800, borderRadius: '2px' }}>
              {comanda.status.toUpperCase()}
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
}
// henrique agostinetto piva