import { Box, Typography, TextField, Button, List, ListItem, ListItemText, Divider, Paper } from '@mui/material';
import { useState } from 'react';

export default function Produtos() {
  const [nomeProd, setNomeProd] = useState('');
  const [valor, setValor] = useState('');
  const [lista, setLista] = useState([]);

  const maskMoeda = (v) => {        // henrique agostinetto piva
    v = v.replace(/\D/g, "");
    v = v.replace(/(\d)(\d{2})$/, "$1,$2");
    v = v.replace(/(?=(\d{3})+(\D))\B/g, ".");
    return "R$ " + v;
  };

  const handleSave = (e) => {
    e.preventDefault();
    setLista([...lista, { nome: nomeProd, preco: valor }]);
    setNomeProd('');
    setValor('');
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" sx={{ mb: 4, fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px' }}>
        Produtos
      </Typography>

      <Box component="form" onSubmit={handleSave} sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 5 }}>
        <TextField label="Descrição" fullWidth required value={nomeProd} onChange={(e) => setNomeProd(e.target.value)} />
        <TextField label="Preço" fullWidth required value={valor} onChange={(e) => setValor(maskMoeda(e.target.value))} />
        <Button type="submit" variant="contained" sx={{ borderRadius: 0, fontWeight: 'bold' }}>Salvar e Listar</Button>
      </Box>

      <Typography variant="h6" sx={{ mb: 2, textTransform: 'uppercase' }}>Cadastrados</Typography>
      <Paper variant="outlined" sx={{ borderRadius: 0 }}>
        <List disablePadding>
          {lista.map((item, index) => (
            <Box key={index}>
              <ListItem sx={{ py: 1.5 }}>
                <ListItemText primary={item.nome} secondary={item.preco} primaryTypographyProps={{ fontWeight: 'bold' }} />
              </ListItem>
              {index < lista.length - 1 && <Divider />}
            </Box>
          ))}
        </List>
      </Paper>
    </Box>
  );
}
