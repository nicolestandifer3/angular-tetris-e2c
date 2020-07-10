import { Component, OnInit } from '@angular/core';
import { MatrixUtil } from '../../utils/matrix';
@Component({
  selector: 't-matrix',
  templateUrl: './matrix.component.html',
  styleUrls: ['./matrix.component.scss'],
})
export class MatrixComponent implements OnInit {
  matrix: number[][] = MatrixUtil.BlankMatrix;
  constructor() {}

  ngOnInit(): void {}

  isFilled(block: number) {
    return MatrixUtil.isBlockFilled(block);
  }
}
