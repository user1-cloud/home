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
let spine006, spine005, spine004, spine003, spine002, spine001, spine;

// 👇 定义手臂骨骼
let upper_armR, upper_armL;
let upper_armR_rotation, upper_armL_rotation;

const loader = new GLTFLoader();
loader.load('./model/我是奶龙.glb', (gltf) => {
    mesh = gltf.scene;
    mesh.traverse((child) => {
        if (child.isMesh && child.material) {
            const oldMat = child.material;

            child.material = new THREE.MeshToonMaterial({
                map: oldMat.map,
                gradientMap: null,
                transparent: oldMat.transparent,
                opacity: 0.95,
            });

            child.material.needsUpdate = true;
            child.geometry.computeVertexNormals();
        }

        if (child.isBone) {
            console.log("骨骼名称：", child.name);
            if (child.name === 'spine006') spine006 = child;
            if (child.name === 'spine005') spine005 = child;
            if (child.name === 'spine004') spine004 = child;
            if (child.name === 'spine003') spine003 = child;
            if (child.name === 'spine002') spine002 = child;
            if (child.name === 'spine001') spine001 = child;
            if (child.name === 'spine') spine = child;

            // 👇 匹配你的手臂骨骼
            if (child.name === 'upper_armR') upper_armR = child;
            if (child.name === 'upper_armL') upper_armL = child;
        }
    });
    upper_armL_rotation = upper_armL.rotation.z;
    upper_armR_rotation = upper_armR.rotation.z;
    mesh.translateY(-30);
    mesh.translateZ(-24);
    mesh.scale.set(20, 20, 20);
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

    // 脊柱旋转（原逻辑不变）
    if (spine006) spine006.rotation.x = mouseY * 0.015 + Math.PI/4;
    if (spine006) spine006.rotation.y = mouseX * 0.010;

    if (spine005) spine005.rotation.x = mouseY * 0.015 + Math.PI/8;
    if (spine005) spine005.rotation.y = mouseX * 0.010;

    if (spine004) spine004.rotation.x = mouseY * 0.015;
    if (spine004) spine004.rotation.y = mouseX * 0.010;

    if (spine003) spine003.rotation.x = mouseY * 0.015;
    if (spine003) spine003.rotation.y = mouseX * 0.010;

    if (spine002) spine002.rotation.x = mouseY * 0.015;
    if (spine002) spine002.rotation.y = mouseX * 0.015;

    if (spine001) spine001.rotation.x = mouseY * 0.020;
    if (spine001) spine001.rotation.y = mouseX * 0.015;

    if (spine) spine.rotation.x = mouseY * 0.025;
    if (spine) spine.rotation.y = mouseX * 0.020;

    // ==============================================
    // 👇 核心：鼠标在屏幕下半部分 → 手臂自动张开
    // ==============================================
    const isMouseLowerHalf = e.clientY > window.innerHeight / 2.2;
    let armAngle = 0;
    if (isMouseLowerHalf) {
        // 越靠下，张得越开
        const downFactor = (e.clientY - window.innerHeight/2.2) / (window.innerHeight/2.2);
        armAngle = downFactor * 0.9; // 张开幅度，可自己调大小
        // 右臂向外张
        if (upper_armR) upper_armR.rotation.z = upper_armR_rotation - armAngle;
        // 左臂向外张
        if (upper_armL) upper_armL.rotation.z = upper_armL_rotation + armAngle;
    }
    else{
        upper_armR.rotation.z = upper_armR_rotation;
        upper_armL.rotation.z = upper_armL_rotation;
    }

    // 容器旋转不变
    mainContainer.style.transform = `rotateY(${mouseX * 0.6}deg) rotateX(${-mouseY * 1.2}deg)`;
});