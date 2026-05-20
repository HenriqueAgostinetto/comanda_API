import { Box, Typography, TextField, Button, List, ListItem, ListItemText, Divider, Paper } from '@mui/material';
import { useState } from 'react';

export default function Funcionarios() {
  const [nomeFunc, setNomeFunc] = useState('');
  const [cpf, setCpf] = useState('');
  const [lista, setLista] = useState([]);

  const maskCpf = (v) => {                // henrique agostinetto piva
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
      <Typography variant="h4" sx={{ mb: 4, fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px' }}>
        Funcionários
      </Typography>

      <Box component="form" onSubmit={handleSave} sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 5 }}>
        <TextField label="Nome Completo" fullWidth required value={nomeFunc} onChange={(e) => setNomeFunc(e.target.value)} />
        <TextField label="CPF" fullWidth required value={cpf} onChange={(e) => setCpf(maskCpf(e.target.value))} slotProps={{ htmlInput: { maxLength: 14 } }} />
        <Button type="submit" variant="contained" sx={{ borderRadius: 0, fontWeight: 'bold' }}>Salvar e Listar</Button>
      </Box>

      <Typography variant="h6" sx={{ mb: 2, textTransform: 'uppercase' }}>Cadastrados</Typography>
      <Paper variant="outlined" sx={{ borderRadius: 0 }}>
        <List disablePadding>
          {lista.map((item, index) => (
            <Box key={index}>
              <ListItem sx={{ py: 1.5 }}>
                <ListItemText primary={item.nome} secondary={item.cpf} primaryTypographyProps={{ fontWeight: 'bold' }} />
              </ListItem>
              {index < lista.length - 1 && <Divider />}
            </Box>
          ))}
        </List>
      </Paper>
    </Box>
  );
}
