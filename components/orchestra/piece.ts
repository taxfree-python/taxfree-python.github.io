export type Piece = 'mozart' | 'beethoven';

export const PIECES: Piece[] = ['mozart', 'beethoven'];

export const PIECE_LABEL: Record<Piece, string> = {
  mozart: 'Mozart K.155',
  beethoven: 'Beethoven Op.18-1',
};

/** Full-length clip under /public/audio/orchestra/<piece>/<file>. */
export const audioSrc = (piece: Piece, file: string): string => `/audio/orchestra/${piece}/${file}`;
