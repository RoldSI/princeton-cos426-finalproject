import { createNoise2D } from 'simplex-noise';
import alea from 'alea';

class PerlinNoise {
  public noise: any;

  constructor(seed: number) {
    console.log("Perlin", seed);
    const prng = alea(seed);
    this.noise = createNoise2D(prng);

  }
}

export default PerlinNoise;

