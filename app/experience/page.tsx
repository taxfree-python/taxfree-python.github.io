import type { Metadata } from 'next';

// Static export has no server redirects: old links land here and move on to /cv.
// Metadata `other` emits <meta name>, which browsers ignore for refresh, so the
// http-equiv tag is rendered here and React hoists it into <head>.
export const metadata: Metadata = {
  title: 'Moved to /cv',
  alternates: { canonical: '/cv' },
  robots: { index: false },
};

export default function MovedToCv() {
  return (
    <>
      <meta httpEquiv="refresh" content="0; url=/cv" />
      <p>
        Moved to <a href="/cv">/cv</a>.
      </p>
    </>
  );
}
