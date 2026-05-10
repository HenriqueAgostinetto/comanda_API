import { useState, useContext, useEffect, useRef } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { Box, Paper, TextField, Button, Typography } from '@mui/material';

export default function Login() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const emailRef = useRef(null);
    
  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');

  // hernique agostinetto piva
  useEffect(() => {
    emailRef.current?.focus();
  }, []);

  const handleLogar = (e) => {
    e.preventDefault();
    if (login(user, pass)) {
      
      Swal.fire({ title: 'sucesso!', text: 'bem-vindo ao sistema', icon: 'success', timer: 1500, showConfirmButton: false });
      navigate('/dashboard');
    } else {
      Swal.fire({ title: 'erro!', text: 'usuario ou senha invalidos', icon: 'error', confirmButtonColor: '#d33' });
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: '#e2e8f0' }}>
      <Paper elevation={10} sx={{ p: 4, width: '100%', maxWidth: 400, borderRadius: 3 }}>
        <Typography variant="h4" textAlign="center" mb={3} fontWeight="bold">Insira suas Credenciais</Typography>
        <form onSubmit={handleLogar}>
          <TextField 
            inputRef={emailRef}
            fullWidth label="usuario" margin="normal" 
            value={user} onChange={(e) => setUser(e.target.value)}
            required inputProps={{ maxLength: 11 }}
            title="digite o seu usuario de acesso"
            placeholder="ex: zé das pitangas"
          />
          <TextField 
            fullWidth type="password" label="senha" margin="normal"
            value={pass} onChange={(e) => setPass(e.target.value)}
            required
            title="digite sua senha"
            placeholder="ex: senha123"
          />
          <Button fullWidth type="submit" variant="contained" size="large" sx={{ mt: 3, bgcolor: '#3b82f6' }}>entrar</Button>
        </form>
      </Paper>
    </Box>
  );
}