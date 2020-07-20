import { Component, HostListener, OnInit, ElementRef, Renderer2 } from '@angular/core';
import { TetrisKeyboard } from '@trungk18/interface/keyboard';
import { SoundManagerService } from '@trungk18/services/sound-manager.service';
import { KeyboardQuery } from '@trungk18/state/keyboard/keyboard.query';
import { KeyboardService } from '@trungk18/state/keyboard/keyboard.service';
import { TetrisQuery } from '@trungk18/state/tetris/tetris.query';
import { TetrisService } from '@trungk18/state/tetris/tetris.service';
import { Observable } from 'rxjs';
const KeyUp = 'document:keyup';
const KeyDown = 'document:keydown';
@Component({
  selector: 'angular-tetris',
  templateUrl: './angular-tetris.component.html',
  styleUrls: ['./angular-tetris.component.scss']
})
export class AngularTetrisComponent implements OnInit {
  drop$: Observable<boolean>;
  isShowLogo$: Observable<boolean>;
  get hasCurrent() {
    return !!this._tetrisQuery.current;
  }

  constructor(
    private _tetrisService: TetrisService,
    private _tetrisQuery: TetrisQuery,
    private _keyboardService: KeyboardService,
    private _keyboardQuery: KeyboardQuery,
    private _soundManager: SoundManagerService,
    private _el: ElementRef,
    private _render: Renderer2
  ) {}

  ngOnInit(): void {
    this.drop$ = this._keyboardQuery.drop$;
    this.isShowLogo$ = this._tetrisQuery.isShowLogo$;
    setTimeout(() => {
      this.resize();
    });
  }

  @HostListener('window:resize', ['$event'])
  resize() {
    let width = document.documentElement.clientWidth;
    let height = document.documentElement.clientHeight;
    let ratio = height / width;
    let scale = 1;
    if (ratio < 1.5) {
      scale = height / 960;
    } else {
      scale = width / 640;
      let filling = (height - 960 * scale) / scale / 3;
      let paddingTop = Math.floor(filling) + 42;
      let paddingBottom = Math.floor(filling);
      let marginTop = Math.floor(-480 - filling * 1.5);
      this.setPaddingMargin(paddingTop, paddingBottom, marginTop);
    }
    this._render.setStyle(this._el.nativeElement, 'transform', `scale(${scale})`);
  }

  private setPaddingMargin(paddingTop: number, paddingBottom: number, marginTop: number) {
    this._render.setStyle(this._el.nativeElement, 'padding-top', `${paddingTop}px`);
    this._render.setStyle(this._el.nativeElement, 'padding-bottom', `${paddingBottom}px`);
    this._render.setStyle(this._el.nativeElement, 'margin-top', `${marginTop}px`);
  }

  keyboardMouseDown(key: string) {
    this[`keyDown${key}`]();
  }

  keyboardMouseUp(key: string) {
    this[`keyUp${key}`]();
  }

  @HostListener(`${KeyDown}.${TetrisKeyboard.Left}`)
  keyDownLeft() {
    this._soundManager.move();
    this._keyboardService.setKeỵ({
      left: true
    });
    if (this.hasCurrent) {
      this._tetrisService.moveLeft();
    } else {
      this._tetrisService.decreaseLevel();
    }
  }

  @HostListener(`${KeyUp}.${TetrisKeyboard.Left}`)
  keyUpLeft() {
    this._keyboardService.setKeỵ({
      left: false
    });
  }

  @HostListener(`${KeyDown}.${TetrisKeyboard.Right}`)
  keyDownRight() {
    this._soundManager.move();
    this._keyboardService.setKeỵ({
      right: true
    });
    if (this.hasCurrent) {
      this._tetrisService.moveRight();
    } else {
      this._tetrisService.increaseLevel();
    }
  }

  @HostListener(`${KeyUp}.${TetrisKeyboard.Right}`)
  keyUpRight() {
    this._keyboardService.setKeỵ({
      right: false
    });
  }

  @HostListener(`${KeyDown}.${TetrisKeyboard.Up}`)
  keyDownUp() {
    this._soundManager.rotate();
    this._keyboardService.setKeỵ({
      up: true
    });
    if (this.hasCurrent) {
      this._tetrisService.rotate();
    } else {
      this._tetrisService.increaseStartLine();
    }
  }

  @HostListener(`${KeyUp}.${TetrisKeyboard.Up}`)
  keyUpUp() {
    this._keyboardService.setKeỵ({
      up: false
    });
  }

  @HostListener(`${KeyDown}.${TetrisKeyboard.Down}`)
  keyDownDown() {
    this._soundManager.move();
    this._keyboardService.setKeỵ({
      down: true
    });
    if (this.hasCurrent) {
      this._tetrisService.moveDown();
    } else {
      this._tetrisService.decreaseStartLine();
    }
  }

  @HostListener(`${KeyUp}.${TetrisKeyboard.Down}`)
  keyUpDown() {
    this._keyboardService.setKeỵ({
      down: false
    });
  }

  @HostListener(`${KeyDown}.${TetrisKeyboard.Space}`)
  keyDownSpace() {
    this._keyboardService.setKeỵ({
      drop: true
    });
    if (this.hasCurrent) {
      this._soundManager.fall();
      return;
    }
    this._soundManager.start();
    this._tetrisService.start();
  }

  @HostListener(`${KeyUp}.${TetrisKeyboard.Space}`)
  keyUpSpace() {
    this._keyboardService.setKeỵ({
      drop: false
    });
  }

  @HostListener(`${KeyDown}.${TetrisKeyboard.S}`)
  keyDownSound() {
    this._soundManager.move();
    this._tetrisService.setSound();
    this._keyboardService.setKeỵ({
      sound: true
    });
  }

  @HostListener(`${KeyUp}.${TetrisKeyboard.S}`)
  keyUpSound() {
    this._keyboardService.setKeỵ({
      sound: false
    });
  }

  @HostListener(`${KeyDown}.${TetrisKeyboard.P}`)
  keyDownPause() {
    this._soundManager.move();
    this._keyboardService.setKeỵ({
      pause: true
    });
    if (this._tetrisQuery.canStartGame) {
      this._tetrisService.resume();
    } else {
      this._tetrisService.pause();
    }
  }

  @HostListener(`${KeyUp}.${TetrisKeyboard.P}`)
  keyUpPause() {
    this._keyboardService.setKeỵ({
      pause: false
    });
  }

  @HostListener(`${KeyDown}.${TetrisKeyboard.R}`)
  keyDownReset() {
    this._soundManager.move();
    this._keyboardService.setKeỵ({
      reset: true
    });
    this._tetrisService.pause();
    setTimeout(() => {
      if (confirm('You are having a good game. Are you sure you want to reset?')) {
        this._tetrisService.reset();
      } else {
        this._tetrisService.start();
      }
      this.keyUpReset();
    });
  }

  @HostListener(`${KeyUp}.${TetrisKeyboard.R}`)
  keyUpReset() {
    this._keyboardService.setKeỵ({
      reset: false
    });
  }
}
