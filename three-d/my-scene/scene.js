// scene.js - 星球宇宙主题
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000011);
scene.fog = new THREE.Fog(0x000011, 20, 60);

const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 200);
camera.position.set(0, 8, 16);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const controls = new THREE.OrbitControls(camera, renderer.domElement);

// 光源：环境光 + 太阳光（点光源）
scene.add(new THREE.AmbientLight(0x222244, 0.5));
const sunLight = new THREE.PointLight(0xffaa33, 2, 60);
sunLight.position.set(0, 0, 0);
scene.add(sunLight);

// 星空背景：3000个随机散布的小点
const starGeo = new THREE.BufferGeometry();
const starCount = 3000;
const starPos = new Float32Array(starCount * 3);
for (let i = 0; i < starCount; i++) {
  starPos[i * 3] = (Math.random() - 0.5) * 120;
  starPos[i * 3 + 1] = (Math.random() - 0.5) * 120;
  starPos[i * 3 + 2] = (Math.random() - 0.5) * 120;
}
starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
const stars = new THREE.Points(starGeo, new THREE.PointsMaterial({ color: 0xffffff, size: 0.15, sizeAttenuation: true }));
scene.add(stars);

// 太阳：发光球体（emissive材质）
const sun = new THREE.Mesh(
  new THREE.SphereGeometry(1.5, 32, 32),
  new THREE.MeshStandardMaterial({ color: 0xffaa33, emissive: 0xff6600, emissiveIntensity: 1 })
);
scene.add(sun);

// 动画：太阳自转 + 星空缓转
const animate = () => {
  requestAnimationFrame(animate);
  sun.rotation.y += 0.003;
  stars.rotation.y += 0.0002;
  renderer.render(scene, camera);
};
animate();

// 窗口适配
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
