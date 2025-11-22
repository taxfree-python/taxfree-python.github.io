import Link from 'next/link';
import { AppBar, Toolbar, Container, Typography, Box } from '@mui/material';

const navLinks = [
  { href: '/blog', label: 'Blog' },
  { href: '/cv', label: 'CV' },
  // 製作中のため一時的に非表示
  // { href: '/gallery', label: 'Gallery' },
];

export function Header() {
  return (
    <AppBar
      position="sticky"
      sx={{
        bgcolor: 'transparent',
        backdropFilter: 'blur(8px)',
      }}
      elevation={0}
    >
      <Container maxWidth="md">
        <Toolbar sx={{ justifyContent: 'space-between', gap: 2 }}>
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

          <Box sx={{ display: 'flex', gap: { xs: 2, sm: 3 } }}>
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                style={{ textDecoration: 'none' }}
              >
                <Typography
                  variant="body1"
                  sx={{
                    color: 'text.secondary',
                    '&:hover': {
                      color: 'primary.main',
                    },
                    transition: 'color 0.2s',
                    fontWeight: 500,
                  }}
                >
                  {link.label}
                </Typography>
              </Link>
            ))}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
