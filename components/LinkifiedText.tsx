import React from 'react';
import MuiLink from '@mui/material/Link';

interface LinkifiedTextProps {
  text: string;
  preserveLineBreaks?: boolean;
}

const URL_REGEX = /(https?:\/\/[^\s]+)/g;
const TRAILING_PUNCTUATION_REGEX = /[),.;!?]+$/;

function linkifySegment(segment: string, keyPrefix: string): React.ReactNode[] {
  const nodes: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = URL_REGEX.exec(segment)) !== null) {
    const matchIndex = match.index ?? 0;
    const rawUrl = match[0];
    const trimmedUrl = rawUrl.replace(TRAILING_PUNCTUATION_REGEX, '');
    const trailing = rawUrl.slice(trimmedUrl.length);

    if (matchIndex > lastIndex) {
      nodes.push(segment.slice(lastIndex, matchIndex));
    }

    nodes.push(
      <MuiLink
        key={`${keyPrefix}-link-${matchIndex}`}
        href={trimmedUrl}
        target="_blank"
        rel="noopener noreferrer"
        underline="hover"
        color="primary"
      >
        {trimmedUrl}
      </MuiLink>,
    );

    if (trailing) {
      nodes.push(trailing);
    }

    lastIndex = matchIndex + rawUrl.length;
  }

  if (lastIndex < segment.length) {
    nodes.push(segment.slice(lastIndex));
  }

  return nodes;
}

export function LinkifiedText({ text, preserveLineBreaks = false }: LinkifiedTextProps) {
  if (!text) {
    return null;
  }

  const segments = preserveLineBreaks ? text.split('\n') : [text];
  const nodes: React.ReactNode[] = [];

  segments.forEach((segment, index) => {
    nodes.push(
      <React.Fragment key={`segment-${index}`}>
        {linkifySegment(segment, `segment-${index}`)}
      </React.Fragment>,
    );

    if (preserveLineBreaks && index < segments.length - 1) {
      nodes.push(<br key={`br-${index}`} />);
    }
  });

  return <>{nodes}</>;
}
