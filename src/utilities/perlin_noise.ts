import { createNoise2D } from 'simplex-noise';
import alea from 'alea';

class PerlinNoise {
  public noise: (x: number, y: number) => number;

  constructor(seed: number) {
    const prng = alea(String(seed));
    this.noise = createNoise2D(prng);

  }
}

export default PerlinNoise;

