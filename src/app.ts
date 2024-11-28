/**
 * app.ts
 *
 * This is the first file loaded. It sets up the Renderer,
 * Scene and Camera. It also starts the render loop and
 * handles window resizes.
 *
 */
import { WebGLRenderer, PerspectiveCamera, Vector3 } from 'three';

import SeedScene from './scenes/SeedScene';

// Initialize core ThreeJS components
const scene = new SeedScene();
const camera = new PerspectiveCamera();
camera.rotation.order = 'YXZ';

const renderer = new WebGLRenderer({ antialias: true });

// Set up camera
camera.position.set(0, 0, 1.8);
camera.lookAt(new Vector3(0, 0, 0));
camera.rotation.z = 0;

// Set up renderer, canvas, and minor CSS adjustments
renderer.setPixelRatio(window.devicePixelRatio);
const canvas = renderer.domElement;
canvas.style.display = 'block'; // Removes padding below canvas
document.body.style.margin = '0'; // Removes margin around page
document.body.style.overflow = 'hidden'; // Fix scrolling
document.body.appendChild(canvas);

canvas.addEventListener('click', () => {
    canvas.requestPointerLock();
});
window.addEventListener('mousemove', (event) => {
    if (document.pointerLockElement === canvas) {
        const sensitivity = 0.001; // Adjust sensitivity as needed

        camera.rotation.y -= sensitivity * event.movementX; // Horizontal rotation
        camera.rotation.x -= sensitivity * event.movementY; // Vertical rotation

        camera.rotation.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, camera.rotation.x)); // Clamp vertical rotation
    }
});
const keys: { [key: string]: boolean } = { w: false, a: false, s: false, d: false, f: false };
window.addEventListener('keydown', (event: KeyboardEvent) => {
    if (event.key === 'w') keys.w = true;
    if (event.key === 'a') keys.a = true;
    if (event.key === 's') keys.s = true;
    if (event.key === 'd') keys.d = true;
    if (event.key === 'f') keys.f = true;
});
window.addEventListener('keyup', (event: KeyboardEvent) => {
    if (event.key === 'w') keys.w = false;
    if (event.key === 'a') keys.a = false;
    if (event.key === 's') keys.s = false;
    if (event.key === 'd') keys.d = false;
    if (event.key === 'f') keys.f = false;
});
const movementSpeed = 5; // Units per second


// Render loop
let previousTime = performance.now();
const onAnimationFrameHandler = (timeStamp: number) => {
    const delta = (timeStamp - previousTime) / 1000; // Convert ms to seconds
    previousTime = timeStamp;
    const forward = new Vector3(0, 0, -1).applyQuaternion(camera.quaternion); // Forward direction
    const right = new Vector3(1, 0, 0).applyQuaternion(camera.quaternion); // Right direction
    if (keys.w) camera.position.add(forward.multiplyScalar(movementSpeed * delta));
    if (keys.s) camera.position.add(forward.multiplyScalar(-movementSpeed * delta));
    if (keys.a) camera.position.add(right.multiplyScalar(-movementSpeed * delta));
    if (keys.d) camera.position.add(right.multiplyScalar(movementSpeed * delta));

    renderer.render(scene, camera);
    scene.update && scene.update(timeStamp);
    window.requestAnimationFrame(onAnimationFrameHandler);
};
window.requestAnimationFrame(onAnimationFrameHandler);

// Resize Handler
const windowResizeHandler = () => {
    const { innerHeight, innerWidth } = window;
    renderer.setSize(innerWidth, innerHeight);
    camera.aspect = innerWidth / innerHeight;
    camera.updateProjectionMatrix();
};
windowResizeHandler();
window.addEventListener('resize', windowResizeHandler, false);
