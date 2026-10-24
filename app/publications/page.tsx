import type { Metadata } from 'next';

// Static export has no server redirects: old links land here and move on to /cv.
export const metadata: Metadata = {
  title: 'Moved to /cv',
  alternates: { canonical: '/cv' },
  other: { refresh: '0; url=/cv' },
  robots: { index: false },
};

export default function MovedToCv() {
  return (
    <p>
      Moved to <a href="/cv">/cv</a>.
    </p>
  );
}
