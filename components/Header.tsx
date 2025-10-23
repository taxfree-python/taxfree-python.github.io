import Link from 'next/link';
import { AppBar, Toolbar, Container, Typography } from '@mui/material';

export function Header() {
  return (
    <AppBar
      position="sticky"
      sx={{
        bgcolor: 'background.paper',
        backdropFilter: 'blur(8px)',
        borderBottom: 1,
        borderColor: 'divider',
      }}
      elevation={0}
    >
      <Container maxWidth="md">
        <Toolbar sx={{ justifyContent: 'center' }}>
          <Link href="/" style={{ textDecoration: 'none' }}>
            <Typography
              variant="h5"
              component="div"
              fontWeight="bold"
              sx={{
                color: 'text.primary',
                '&:hover': {
                  color: 'primary.main',
                },
                transition: 'color 0.2s',
              }}
            >
              tax_free
            </Typography>
          </Link>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
