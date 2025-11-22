'use client';

import { Box, Typography, Container } from '@mui/material';
import { keyframes } from '@mui/system';

// アニメーション定義
const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const float = keyframes`
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
`;

export function BlogEmptyState() {
  return (
    <Container maxWidth="md">
      <Box
        sx={{
          minHeight: '60vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          py: 8,
          animation: `${fadeIn} 0.6s ease-out`,
        }}
      >
        {/* アイコン */}
        <Box
          sx={{
            fontSize: '5rem',
            mb: 3,
            animation: `${float} 3s ease-in-out infinite`,
          }}
        >
          ✍️
        </Box>

        {/* タイトル */}
        <Typography
          variant="h3"
          component="h2"
          fontWeight="bold"
          gutterBottom
          sx={{
            color: 'text.primary',
            mb: 2,
          }}
        >
          No Posts Yet
        </Typography>

        {/* 説明文 */}
        <Typography
          variant="h6"
          sx={{
            color: 'text.secondary',
            mb: 1,
            fontWeight: 400,
          }}
        >
          記事を執筆中です
        </Typography>

        <Typography
          variant="body1"
          sx={{
            color: 'text.secondary',
            fontWeight: 300,
          }}
        >
          もうしばらくお待ちください
        </Typography>

        {/* 装飾的な要素 */}
        <Box
          sx={{
            mt: 4,
            display: 'flex',
            gap: 1,
            opacity: 0.6,
          }}
        >
          {[...Array(3)].map((_, i) => (
            <Box
              key={i}
              sx={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                bgcolor: 'primary.main',
                animation: `${float} 2s ease-in-out infinite`,
                animationDelay: `${i * 0.2}s`,
              }}
            />
          ))}
        </Box>
      </Box>
    </Container>
  );
}
