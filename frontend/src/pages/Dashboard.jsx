import { Box, Typography, Grid, Paper, TextField } from '@mui/material';
import GroupIcon from '@mui/icons-material/Group';
import ReceiptIcon from '@mui/icons-material/Receipt';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';                                          // hernique agostinetto piva

export default function Dashboard() {
  const stats = [
    { title: 'Vendas Hoje', value: 'R$ 1.250,00', icon: <AttachMoneyIcon sx={{ fontSize: 40, color: '#10b981' }} />, color: '#ecfdf5' },
    { title: 'Comandas Abertas', value: '12', icon: <ReceiptIcon sx={{ fontSize: 40, color: '#3b82f6' }} />, color: '#eff6ff' },
    { title: 'Clientes na Casa', value: '45', icon: <GroupIcon sx={{ fontSize: 40, color: '#8b5cf6' }} />, color: '#f5f3ff' },
    { title: 'Produtos Ativos', value: '128', icon: <ShoppingCartIcon sx={{ fontSize: 40, color: '#f59e0b' }} />, color: '#fffbeb' },
  ];

  return (
    <Box sx={{ p: 1 }}>
      <Typography variant="h4" sx={{ mb: 4, fontWeight: 'bold' }}>
        Dashboard Operacional
      </Typography>

      {}
      
      <Grid container spacing={3}>
        {stats.map((item, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Paper elevation={0} sx={{ p: 2, borderRadius: 4, bgcolor: item.color, border: '1px solid rgba(0,0,0,0.05)' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="subtitle2" color="textSecondary" sx={{ fontWeight: 'bold', textTransform: 'uppercase' }}>
                    {item.title}
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: 800, mt: 1, color: '#1e293b' }}>
                    {item.value}
                  </Typography>
                </Box>
                <Box sx={{ p: 1, borderRadius: 2, bgcolor: 'white', display: 'flex', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}>
                  {item.icon}
                </Box>
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>

      <Box sx={{ mt: 5, p: 4, borderRadius: 4, bgcolor: 'background.paper', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', textAlign: 'center' }}>
        <Typography variant="h6">Bem vindo ao Sistema de Gestão de Comandas do Zé</Typography>
        <Typography color="textSecondary">Selecione uma opção no menu para começar.</Typography>
        
        <Box sx={{ mt: 3 }}>
           <img 
            src="/henriqueagostinettopiva.png" 
            alt="Perfil" 
            style={{ width: 150, height: 150, borderRadius: '50%', border: '4px solid #3b82f6', objectFit: 'cover' }} 
           />
           <Typography sx={{ mt: 1, fontWeight: 'bold' }}>Henrique Agostinetto Piva - Administrador</Typography>
        </Box>
      </Box>
    </Box>
  );
}