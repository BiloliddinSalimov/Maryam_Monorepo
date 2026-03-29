export class Timer {
  private steps: { label: string; ms: number }[] = [];
  private last: number;
  private readonly route: string;

  constructor(route: string) {
    this.route = route;
    this.last = performance.now();
  }

  step(label: string) {
    const now = performance.now();
    this.steps.push({ label, ms: now - this.last });
    this.last = now;
  }

  done() {
    const total = this.steps.reduce((s, x) => s + x.ms, 0);
    const parts = this.steps.map((s) => `${s.label}=${s.ms.toFixed(2)}ms`).join(" | ");
    console.log(`[${this.route}] ${parts} | total=${total.toFixed(2)}ms`);
  }
}
