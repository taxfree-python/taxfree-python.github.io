import type { Metadata } from 'next';
import { Container } from '@mui/material';

import { Weathering } from '@/components/Weathering';
import { getDailyArt } from '@/lib/dailyArt';
import { siteConfig } from '@/config/site';

const pageTitle = `Weathering - ${siteConfig.name}`;
const pageDescription =
  'Wikipedia の「今日は何の日」に関わるパブリックドメイン画像が、日本時間の一日をかけてブラウザの中で風化していくジェネラティブアート。';

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

  return (
    <Container maxWidth="md" component="section" sx={{ py: 6 }}>
      <Weathering date={art.date} works={art.works} />
    </Container>
  );
}
