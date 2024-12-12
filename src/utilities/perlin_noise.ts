import { createNoise2D } from 'simplex-noise';
import alea from 'alea';

class PerlinNoise {
  public noise: any;
  private width : number;
  private height : number;

  constructor(seed: number, width : number, height : number) {
    console.log("Perlin", seed);
    const prng = alea(seed);
    this.noise = createNoise2D(prng);
    this.width = width;
    this.height = height;
  }
}

export default PerlinNoise;

