import { Injectable } from '@angular/core';
import { TetrisQuery } from '@angular-tetris/state/tetris/tetris.query';

const SOUND_FILE_PATH = '/assets/tetris-sound.mp3';
@Injectable({
  providedIn: 'root'
})
export class SoundManagerService {
  private context: AudioContext;
  private buffer: AudioBuffer;

  constructor(private query: TetrisQuery) {}

  start() {
    this.playMusic(0, 3.7202, 3.6224);
  }

  clear() {
    this.playMusic(0, 0, 0.7675);
  }

  fall() {
    this.playMusic(0, 1.2558, 0.3546);
  }

  gameOver() {
    this.playMusic(0, 8.1276, 1.1437);
  }

  rotate() {
    this.playMusic(0, 2.2471, 0.0807);
  }

  move() {
    this.playMusic(0, 2.9088, 0.1437);
  }

  private playMusic(when: number, offset: number, duration: number) {
    if (!this.query.isEnableSound) {
      return;
    }
    this.loadSound().then((source) => {
      if (source) {
        source.start(when, offset, duration);
      }
    });
  }

  private loadSound(): Promise<AudioBufferSourceNode> {
    return new Promise((resolve, reject) => {
      if (this.context && this.buffer) {
        resolve(this.getSource(this.context, this.buffer));
        return;
      }
      const context = new AudioContext();
      const req = new XMLHttpRequest();
      req.open('GET', SOUND_FILE_PATH, true);
      req.responseType = 'arraybuffer';

      req.onload = () => {
        context.decodeAudioData(
          req.response,
          (buffer) => {
            this.context = context;
            this.buffer = buffer;
            resolve(this.getSource(context, buffer));
          },
          () => {
            const msg = 'Sorry lah, cannot play sound. But I hope you still enjoy Angular Tetris!!';
            alert(msg);
            reject(msg);
          }
        );
      };
      req.send();
    });
  }

  private getSource(context: AudioContext, buffer: AudioBuffer): AudioBufferSourceNode {
    const source = context.createBufferSource();
    source.buffer = buffer;
    source.connect(context.destination);
    return source;
  }
}
