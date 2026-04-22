import * as THREE from 'three';
import { GLTFLoader } from 'https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/loaders/GLTFLoader.js';

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

const light1 = new THREE.DirectionalLight(0x00B140, 2);
light1.position.set(-5, -5, -8);
scene.add(light1);

const ambient = new THREE.AmbientLight(0xffffff, 0.2);
scene.add(ambient);

let mesh;

const loader = new GLTFLoader();
loader.load('./model/我是奶龙.glb', (gltf) => {
    mesh = gltf.scene;
    mesh.traverse((child) => {
        if (child.isMesh && child.material) {
            const oldMat = child.material;

            // 👇 这是真正能保留贴图的三渲二材质
            child.material = new THREE.MeshToonMaterial({
                // 关键：把原贴图直接给卡通材质！
                map: oldMat.map,

                // 三渲二风格
                gradientMap: null,

                // 透明
                transparent: oldMat.transparent,
                opacity: 0.95,
            });

            child.material.needsUpdate = true;
            child.geometry.computeVertexNormals();
        }
    });
    mesh.rotation.x = Math.PI;
    mesh.translateY(10);
    mesh.scale.set(7, 7, 7);
    scene.add(mesh);
});

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
    mesh.rotation.x = mouseY * 0.05;
    mainContainer.style.transform = `rotateY(${mouseX * 0.6}deg) rotateX(${-mouseY * 1.2}deg)`;
});