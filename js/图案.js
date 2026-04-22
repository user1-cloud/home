import * as THREE from 'three';

const container = document.getElementById('canvas-container');
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
container.appendChild(renderer.domElement);
camera.position.z = 12;

const light = new THREE.DirectionalLight(0xffffff, 5);
light.position.set(5, 5, 8);
scene.add(light);

const light1 = new THREE.DirectionalLight(0xE6397C, 2);
light1.position.set(-5, -5, -8);
scene.add(light1);

const ambient = new THREE.AmbientLight(0xffffff, 0.2);
scene.add(ambient);

const geometry = new THREE.TorusGeometry(5, 1, 16, 120); // 圆环
const material = new THREE.MeshToonMaterial({
    color: 0x999999,
    transparent: true,
    opacity: 0.95,
});

const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}
animate();

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

const mainContainer = document.getElementById('container');
let mouseX = 0, mouseY = 0;

document.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX - window.innerWidth/2) / 30;
    mouseY = (e.clientY - window.innerHeight/2) / 30;

    mesh.rotation.y = mouseX * 0.06;
    mesh.rotation.x = mouseY * 0.06;
    mainContainer.style.transform = `rotateY(${mouseX * 0.6}deg) rotateX(${-mouseY * 1.2}deg)`;
});