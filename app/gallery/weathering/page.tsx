import type { Metadata } from 'next';
import { Box, Container, Link, Typography } from '@mui/material';

import { Weathering } from '@/components/Weathering';
import { getDailyArt } from '@/lib/dailyArt';
import { siteConfig } from '@/config/site';

const pageTitle = `風化 - ${siteConfig.name}`;
const pageDescription =
  'Wikipedia の「今日は何の日」に関わるパブリックドメイン画像が、日本時間の一日をかけてエッジの色に侵食されていくジェネラティブアート。';

export const metadata: Metadata = {
  title: pageTitle,
  description: pageDescription,
  openGraph: {
    type: 'website',
    locale: siteConfig.locale,
    url: `${siteConfig.url}/gallery/weathering`,
    title: pageTitle,
    description: pageDescription,
    siteName: siteConfig.name,
    images: [
      {
        url: siteConfig.ogImage.url,
        width: siteConfig.ogImage.width,
        height: siteConfig.ogImage.height,
        alt: pageTitle,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: siteConfig.social.twitter,
    creator: siteConfig.social.twitter,
    title: pageTitle,
    description: pageDescription,
    images: [siteConfig.ogImage.url],
  },
};

export default function WeatheringPage() {
  const art = getDailyArt();
  const [year, month, day] = art.date.split('-');

  return (
    <Container maxWidth="md" component="section" sx={{ py: 6 }}>
      <Typography variant="h2" component="h1" gutterBottom sx={{ mb: 4 }}>
        風化
      </Typography>

      <Weathering image={art.image} />

      <Box sx={{ mt: 3 }}>
        <Typography variant="caption" color="text.secondary" display="block">
          {year}年{Number(month)}月{Number(day)}日 — {art.event.year}年:{' '}
          <Link href={art.event.pageUrl} target="_blank" rel="noopener noreferrer">
            {art.event.pageTitle}
          </Link>
        </Typography>
        <Typography variant="caption" color="text.secondary" display="block">
          元画像:{' '}
          <Link href={art.source.filePageUrl} target="_blank" rel="noopener noreferrer">
            {art.source.fileTitle.replace(/^File:/, '')}
          </Link>
          {art.source.artist ? ` — ${art.source.artist}` : ''}(
          {art.source.licenseUrl ? (
            <Link href={art.source.licenseUrl} target="_blank" rel="noopener noreferrer">
              {art.source.license}
            </Link>
          ) : (
            art.source.license
          )}
          ), via Wikimedia Commons
        </Typography>
      </Box>
    </Container>
  );
}
