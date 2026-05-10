import { Box, Typography, TextField, Button, List, ListItem, ListItemText, Divider } from '@mui/material';
import { useState } from 'react';

export default function CadastraCliente() {
  const [nomeCli, setNomeCli] = useState('');
  const [telefone, setTelefone] = useState('');
  const [lista, setLista] = useState([]);

  const maskTelefone = (v) => {
    v = v.replace(/\D/g, "");
    v = v.replace(/^(\d{2})(\d)/g, "($1) $2");
    v = v.replace(/(\d)(\d{4})$/, "$1-$2");
    return v;
  };
                                                                                    // hernique agostinetto piva
  const handleSave = (e) => {
    e.preventDefault();
    setLista([...lista, { nome: nomeCli, tel: telefone }]);
    setNomeCli('');
    setTelefone('');
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" sx={{ mb: 4, fontWeight: 'bold' }}>Clientes</Typography>

      <Box component="form" onSubmit={handleSave} sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 5 }}>
        <TextField label="Nome do Cliente" fullWidth required value={nomeCli} onChange={(e) => setNomeCli(e.target.value)} />
        <TextField label="Telefone" fullWidth required value={telefone} onChange={(e) => setTelefone(maskTelefone(e.target.value))} slotProps={{ htmlInput: { maxLength: 15 } }} />
        <Button type="submit" variant="contained">Salvar e Listar</Button>
      </Box>

      <Typography variant="h6">Lista:</Typography>
      <List>
        {lista.map((item, i) => (
          <Box key={i}><ListItem><ListItemText primary={item.nome} secondary={`Tel: ${item.tel}`} /></ListItem><Divider /></Box>
        ))}
      </List>
    </Box>
  );
}