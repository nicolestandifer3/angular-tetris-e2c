import { Piece } from './piece';
import { PieceRotation, PieceTypes } from './piece-enum';
import { Shapes } from './shape';

const ShapesI: Shapes = [];
ShapesI[PieceRotation.Deg0] = [
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [1, 1, 1, 1],
];

ShapesI[PieceRotation.Deg90] = [
  [1, 0, 0, 0],
  [1, 0, 0, 0],
  [1, 0, 0, 0],
  [1, 0, 0, 0],
];

export class PieceI extends Piece {
  constructor(x: number, y: number) {
    super(x, y);
    this.type = PieceTypes.I;
    this.setShapes(ShapesI);
  }
}
