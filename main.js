import { Simulation } from './src/simulacion.js';

async function init() {
  try {
    const simulation = new Simulation();
    await simulation.init();
  } catch (error) {
    console.error('Failed to start application:', error);
  }
}

init();
