
export class Timer {
    private startTime: number = 0;
    private elapsed: number = 0;
    private running: boolean = false;
  
    start() {
      this.reset();
      this.startTime = performance.now();
      this.running = true;
    }
  
    pause() {
      if (this.running) {
        this.elapsed += performance.now() - this.startTime;
        this.running = false;
      }
    }
  
    play() {
      if (!this.running) {
        this.startTime = performance.now();
        this.running = true;
      }
    }
  
    stop() {
      this.pause(); // same behavior as pause
    }
  
    reset() {
      this.elapsed = 0;
      this.startTime = 0;
      this.running = false;
    }
  
    getTime(): number {
      if (this.running) {
        return this.elapsed + (performance.now() - this.startTime);
      } else {
        return this.elapsed;
      }
    }
  
    getFormatted(): string {
      const ms = this.getTime();
      const totalSeconds = Math.floor(ms / 1000);
      const minutes = Math.floor(totalSeconds / 60);
      const seconds = totalSeconds % 60;
      const milliseconds = Math.floor(ms % 1000);
  
      return `${minutes}:${seconds.toString().padStart(2, '0')}.${milliseconds.toString().padStart(3, '0')}`;
    }
  }
  
  export const speedrunTimer = new Timer();
  