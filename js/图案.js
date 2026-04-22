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

let upper_armR, upper_armL;
let upper_armR_rotation, upper_armL_rotation;

// 面部骨骼
let mouth;
let eyeTopL, eyeBotL, eyeTopR, eyeBotR;

// 【关键】只保存面部原始旋转，完全不影响其他
let faceInitial = {};

// 大笑状态
let isLaughing = false;

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

            if (child.name === '骨骼002') mouth = child;

            // 眼睛
            if (child.name === '骨骼003') eyeTopL = child;
            if (child.name === '骨骼004') eyeBotL = child;
            if (child.name === '骨骼005') eyeTopR = child;
            if (child.name === '骨骼006') eyeBotR = child;

            if (child.name === 'upper_armR') upper_armR = child;
            if (child.name === 'upper_armL') upper_armL = child;
        }
    });

    // 保存手臂原始值
    upper_armR_rotation = upper_armR.rotation.z;
    upper_armL_rotation = upper_armL.rotation.z;

    // 【关键】记录面部初始旋转
    faceInitial.mouth = mouth.rotation.clone();
    faceInitial.eyeTopL = eyeTopL.rotation.clone();
    faceInitial.eyeBotL = eyeBotL.rotation.clone();
    faceInitial.eyeTopR = eyeTopR.rotation.clone();
    faceInitial.eyeBotR = eyeBotR.rotation.clone();

    mesh.translateY(-30);
    mesh.translateZ(-24);
    mesh.scale.set(20, 20, 20);
    scene.add(mesh);

    // 启动随机大笑
    setInterval(() => {
        if (!isLaughing) laugh();
    }, 4000 + Math.random() * 4000);
});

// 大笑动画
const laughAudio = document.getElementById('laughAudio');
let isAudioPlaying = false;
function laugh() {
    isLaughing = true;
    const duration = 6;
    const startTime = performance.now();

    function update() {
        const t = (performance.now() - startTime) / 1000;
        const p = Math.min(t / duration, 1);

        // 平滑曲线
        const f = p < 0.5
            ? 2 * p * p
            : 1 - Math.pow(-2 * p + 2, 2) / 2;

        // 头部后仰
        mouth.rotation.x = faceInitial.mouth.x + f * 0.5;

        // 眼睛眯起
        eyeTopL.rotation.x = faceInitial.eyeTopL.x - f * 0.8;
        eyeBotL.rotation.x = faceInitial.eyeBotL.x + f * 0.8;
        eyeTopR.rotation.x = faceInitial.eyeTopR.x - f * 0.8;
        eyeBotR.rotation.x = faceInitial.eyeBotR.x + f * 0.8;

        if (p < 1) {
            requestAnimationFrame(update);
            if (p > 0.5 && !isAudioPlaying){
                laughAudio.play().catch(() => {});
                isAudioPlaying = true;
            }
        } else {
            // 【绝对复位】直接恢复成刚加载的样子
            mouth.rotation.copy(faceInitial.mouth);
            eyeTopL.rotation.copy(faceInitial.eyeTopL);
            eyeBotL.rotation.copy(faceInitial.eyeBotL);
            eyeTopR.rotation.copy(faceInitial.eyeTopR);
            eyeBotR.rotation.copy(faceInitial.eyeBotR);

            isLaughing = false;

            laughAudio.pause();
            laughAudio.currentTime = 0;
            isAudioPlaying = false;
        }
    }
    update();
}

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

// 你的鼠标逻辑
const mainContainer = document.getElementById('container');
let mouseX = 0, mouseY = 0;

document.addEventListener('mousemove', (e) => {

    mouseX = (e.clientX - window.innerWidth / 2) / 30;
    mouseY = (e.clientY - window.innerHeight / 2) / 30;

    if (spine006) spine006.rotation.x = mouseY * 0.018 + Math.PI / 4;
    if (spine006) spine006.rotation.y = mouseX * 0.018;

    if (spine005) spine005.rotation.x = mouseY * 0.017 + Math.PI / 8;
    if (spine005) spine005.rotation.y = mouseX * 0.010;

    if (spine004) spine004.rotation.x = mouseY * 0.020;
    if (spine004) spine004.rotation.y = mouseX * 0.010;

    if (spine003) spine003.rotation.x = mouseY * 0.015;
    if (spine003) spine003.rotation.y = mouseX * 0.020;

    if (spine002) spine002.rotation.x = mouseY * 0.015;
    if (spine002) spine002.rotation.y = mouseX * 0.012;

    if (spine001) spine001.rotation.x = mouseY * 0.010;
    if (spine001) spine001.rotation.y = mouseX * 0.015;

    if (spine) spine.rotation.x = mouseY * 0.025;
    if (spine) spine.rotation.y = mouseX * 0.010;

    const isMouseLowerHalf = e.clientY > window.innerHeight / 2.4;
    let armAngle = 0;
    if (isMouseLowerHalf) {
        const downFactor = (e.clientY - window.innerHeight / 2.4) / (window.innerHeight / 2.4);
        armAngle = downFactor * 0.9;
        if (upper_armR) upper_armR.rotation.z = upper_armR_rotation - armAngle;
        if (upper_armL) upper_armL.rotation.z = upper_armL_rotation + armAngle;
    } else {
        if (upper_armR) upper_armR.rotation.z = upper_armR_rotation;
        if (upper_armL) upper_armL.rotation.z = upper_armL_rotation;
    }

    mainContainer.style.transform = `rotateY(${mouseX * 0.6}deg) rotateX(${-mouseY * 1.2}deg)`;
});