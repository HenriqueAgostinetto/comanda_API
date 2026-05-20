import { Box, Typography, Grid, Paper } from '@mui/material';
import GroupIcon from '@mui/icons-material/Group';
import ReceiptIcon from '@mui/icons-material/Receipt';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';

export default function Dashboard() {
  const stats = [
    { title: 'Vendas Hoje', value: 'R$ 1.250,00', icon: <AttachMoneyIcon sx={{ fontSize: 40, color: 'var(--accent, #ff0000)' }} /> },
    { title: 'Comandas Abertas', value: '12', icon: <ReceiptIcon sx={{ fontSize: 40, color: 'text.primary' }} /> },
    { title: 'Clientes na Casa', value: '45', icon: <GroupIcon sx={{ fontSize: 40, color: 'text.primary' }} /> },
    { title: 'Produtos Ativos', value: '128', icon: <ShoppingCartIcon sx={{ fontSize: 40, color: 'text.primary' }} /> },
  ];
                      // henrique agostinetto piva
  return (
    <Box sx={{ p: 4 }}>
      <Typography 
        variant="h4" 
        sx={{ mb: 4, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '1.5px', fontFamily: 'Impact, sans-serif', color: 'text.primary' }}
      >
        Dashboard Operacional
      </Typography>

      <Grid container spacing={3}>
        {stats.map((item, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Paper 
              variant="outlined" 
              sx={{ p: 3, borderRadius: 0, borderColor: 'var(--border-color, #262626)', bgcolor: 'background.paper', transition: 'all 0.3s ease' }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 800, textTransform: 'uppercase', color: 'text.secondary', letterSpacing: '0.5px' }}>
                    {item.title}
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: 900, mt: 1, color: 'text.primary' }}>
                    {item.value}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  {item.icon}
                </Box>
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>

      <Box sx={{ mt: 6, p: 4, borderRadius: 0, border: '1px solid var(--border-color, #262626)', bgcolor: 'background.paper', textAlign: 'center' }}>
        <Typography variant="h6" sx={{ fontWeight: 800, textTransform: 'uppercase', color: 'text.primary', mb: 1 }}>
          Bem vindo ao Sistema de Gestão de Comandas do Zé
        </Typography>
        <Typography sx={{ color: 'text.secondary', fontSize: '0.9rem' }}>
          Selecione uma opção no menu superior para começar o gerenciamento operacional.
        </Typography>
        
        <Box sx={{ mt: 4 }}>
          <img 
            src="/henriqueagostinettopiva.png" 
            alt="Perfil" 
            style={{ width: 140, height: 140, objectFit: 'cover', border: '1px solid var(--border-color, #262626)' }}
          />
        </Box>
      </Box>
    </Box>
  );
}
