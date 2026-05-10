import { Box, Typography, TextField, Button, List, ListItem, ListItemText, Divider } from '@mui/material';
import { useState } from 'react';

export default function CadastraProduto() {
  const [nomeProd, setNomeProd] = useState('');
  const [valor, setValor] = useState('');
  const [lista, setLista] = useState([]);

  const maskMoeda = (v) => {
    v = v.replace(/\D/g, "");
    v = v.replace(/(\d)(\d{2})$/, "$1,$2");
    v = v.replace(/(?=(\d{3})+(\D))\B/g, ".");
    return "R$ " + v;
  };
                                                                              // hernique agostinetto piva
  const handleSave = (e) => {
    e.preventDefault();
    setLista([...lista, { nome: nomeProd, preco: valor }]);
    setNomeProd('');
    setValor('');
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" sx={{ mb: 4, fontWeight: 'bold' }}>Produtos</Typography>

      <Box component="form" onSubmit={handleSave} sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 5 }}>
        <TextField label="Descrição" fullWidth required value={nomeProd} onChange={(e) => setNomeProd(e.target.value)} />
        <TextField label="Preço" fullWidth required value={valor} onChange={(e) => setValor(maskMoeda(e.target.value))} />
        <Button type="submit" variant="contained">Salvar e Listar</Button>
      </Box>

      <Typography variant="h6">Lista:</Typography>
      <List>
        {lista.map((item, i) => (
          <Box key={i}><ListItem><ListItemText primary={item.nome} secondary={`Preço: ${item.preco}`} /></ListItem><Divider /></Box>
        ))}
      </List>
    </Box>
  );
}