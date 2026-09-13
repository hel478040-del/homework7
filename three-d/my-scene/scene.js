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

// 行星组：3颗不同行星绕太阳公转
const planets = new THREE.Group();

// 行星1：类地行星（球体 + 蓝色材质）
const planet1 = new THREE.Mesh(
  new THREE.SphereGeometry(0.5, 32, 32),
  new THREE.MeshStandardMaterial({ color: 0x4fc3f7 })
);
planet1.userData = { orbitRadius: 4, orbitSpeed: 0.02, orbitAngle: 0 };
planets.add(planet1);

// 行星2：类土星（球体 + 环 — TorusGeometry，不同几何体类型）
const planet2Group = new THREE.Group();
const planet2 = new THREE.Mesh(
  new THREE.SphereGeometry(0.7, 32, 32),
  new THREE.MeshStandardMaterial({ color: 0xffb74d })
);
const ring = new THREE.Mesh(
  new THREE.TorusGeometry(1.1, 0.12, 16, 64),
  new THREE.MeshStandardMaterial({ color: 0xffcc80, side: THREE.DoubleSide })
);
ring.rotation.x = Math.PI / 2.5;
planet2Group.add(planet2, ring);
planet2Group.userData = { orbitRadius: 7, orbitSpeed: 0.012, orbitAngle: Math.PI / 2 };
planets.add(planet2Group);

// 行星3：小行星（二十面体 — 第三种几何体，flatShading粗糙感）
const planet3 = new THREE.Mesh(
  new THREE.IcosahedronGeometry(0.35, 0),
  new THREE.MeshStandardMaterial({ color: 0xef5350, flatShading: true })
);
planet3.userData = { orbitRadius: 10, orbitSpeed: 0.008, orbitAngle: Math.PI };
planets.add(planet3);

scene.add(planets);

// 动画：太阳自转 + 行星公转自转 + 星空缓转
const animate = () => {
  requestAnimationFrame(animate);
  sun.rotation.y += 0.003;
  planets.children.forEach(p => {
    const d = p.userData;
    d.orbitAngle += d.orbitSpeed;
    p.position.x = Math.cos(d.orbitAngle) * d.orbitRadius;
    p.position.z = Math.sin(d.orbitAngle) * d.orbitRadius;
    p.rotation.y += 0.01;
  });
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
