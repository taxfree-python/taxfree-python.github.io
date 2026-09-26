export type Piece = 'mozart' | 'beethoven';

export const PIECES: Piece[] = ['mozart', 'beethoven'];

export const PIECE_LABEL: Record<Piece, string> = {
  mozart: 'Mozart K.155',
  beethoven: 'Beethoven Op.18-1',
};

/** Full-length clip under /public/audio/2026-07-06/<piece>/<file>. */
export const audioSrc = (piece: Piece, file: string): string => `/audio/2026-07-06/${piece}/${file}`;
