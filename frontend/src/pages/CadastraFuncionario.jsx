import { Box, Typography, TextField, Button, List, ListItem, ListItemText, Divider } from '@mui/material';
import { useState } from 'react';

export default function CadastraFuncionario() {
  const [nomeFunc, setNomeFunc] = useState('');
  const [cpf, setCpf] = useState('');
  const [lista, setLista] = useState([]);
                                                                                // hernique agostinetto piva
  const maskCpf = (v) => {
    v = v.replace(/\D/g, "");
    v = v.replace(/(\d{3})(\d)/, "$1.$2");
    v = v.replace(/(\d{3})(\d)/, "$1.$2");
    v = v.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
    return v;
  };

  const handleSave = (e) => {
    e.preventDefault();
    setLista([...lista, { nome: nomeFunc, cpf: cpf }]);
    setNomeFunc('');
    setCpf('');
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" sx={{ mb: 4, fontWeight: 'bold' }}>Funcionários</Typography>

      <Box component="form" onSubmit={handleSave} sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 5 }}>
        <TextField label="Nome Completo" fullWidth required value={nomeFunc} onChange={(e) => setNomeFunc(e.target.value)} />
        <TextField label="CPF" fullWidth required value={cpf} onChange={(e) => setCpf(maskCpf(e.target.value))} slotProps={{ htmlInput: { maxLength: 14 } }} />
        <Button type="submit" variant="contained">Salvar e Listar</Button>
      </Box>

      <Typography variant="h6">Lista:</Typography>
      <List>
        {lista.map((item, i) => (
          <Box key={i}><ListItem><ListItemText primary={item.nome} secondary={`CPF: ${item.cpf}`} /></ListItem><Divider /></Box>
        ))}
      </List>
    </Box>
  );
}