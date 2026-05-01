/* ===========================
   Three.js — 3D Background Scene
   Floating geometric wireframes
   =========================== */

function initThreeScene(canvasId) {
  const container = document.getElementById(canvasId);
  if (!container) return;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
  camera.position.z = 30;

  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x000000, 0);
  container.appendChild(renderer.domElement);

  // Materials
  const matViolet = new THREE.MeshBasicMaterial({ color: 0x7c3aed, wireframe: true, transparent: true, opacity: 0.25 });
  const matCyan = new THREE.MeshBasicMaterial({ color: 0x06b6d4, wireframe: true, transparent: true, opacity: 0.2 });
  const matPink = new THREE.MeshBasicMaterial({ color: 0xec4899, wireframe: true, transparent: true, opacity: 0.18 });
  const matWhite = new THREE.MeshBasicMaterial({ color: 0xa78bfa, wireframe: true, transparent: true, opacity: 0.12 });

  // Create geometries
  const shapes = [];

  // Large icosahedron
  const ico1 = new THREE.Mesh(new THREE.IcosahedronGeometry(6, 1), matViolet);
  ico1.position.set(-12, 5, -10);
  scene.add(ico1);
  shapes.push({ mesh: ico1, rotSpeed: { x: 0.002, y: 0.003 }, floatSpeed: 0.5, floatAmount: 2 });

  // Torus
  const torus1 = new THREE.Mesh(new THREE.TorusGeometry(4, 1.2, 8, 24), matCyan);
  torus1.position.set(14, -3, -8);
  scene.add(torus1);
  shapes.push({ mesh: torus1, rotSpeed: { x: 0.003, y: 0.002 }, floatSpeed: 0.7, floatAmount: 1.5 });

  // Octahedron
  const oct1 = new THREE.Mesh(new THREE.OctahedronGeometry(3.5, 0), matPink);
  oct1.position.set(-8, -8, -5);
  scene.add(oct1);
  shapes.push({ mesh: oct1, rotSpeed: { x: 0.004, y: 0.001 }, floatSpeed: 0.6, floatAmount: 1.8 });

  // Small icosahedron
  const ico2 = new THREE.Mesh(new THREE.IcosahedronGeometry(2.5, 0), matWhite);
  ico2.position.set(10, 8, -12);
  scene.add(ico2);
  shapes.push({ mesh: ico2, rotSpeed: { x: 0.001, y: 0.004 }, floatSpeed: 0.8, floatAmount: 1.2 });

  // Dodecahedron
  const dodec = new THREE.Mesh(new THREE.DodecahedronGeometry(4, 0), matViolet);
  dodec.position.set(0, -10, -15);
  scene.add(dodec);
  shapes.push({ mesh: dodec, rotSpeed: { x: 0.002, y: 0.002 }, floatSpeed: 0.4, floatAmount: 2.5 });

  // Torus knot
  const knot = new THREE.Mesh(new THREE.TorusKnotGeometry(3, 0.8, 64, 8), matCyan);
  knot.position.set(-15, 10, -18);
  scene.add(knot);
  shapes.push({ mesh: knot, rotSpeed: { x: 0.001, y: 0.002 }, floatSpeed: 0.3, floatAmount: 1 });

  // Second torus
  const torus2 = new THREE.Mesh(new THREE.TorusGeometry(2.5, 0.8, 8, 20), matPink);
  torus2.position.set(18, 6, -14);
  scene.add(torus2);
  shapes.push({ mesh: torus2, rotSpeed: { x: 0.003, y: 0.003 }, floatSpeed: 0.9, floatAmount: 1.3 });

  // Particles
  const particleCount = 200;
  const particleGeom = new THREE.BufferGeometry();
  const positions = new Float32Array(particleCount * 3);
  for (let i = 0; i < particleCount * 3; i++) {
    positions[i] = (Math.random() - 0.5) * 80;
  }
  particleGeom.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const particleMat = new THREE.PointsMaterial({ color: 0x7c3aed, size: 0.08, transparent: true, opacity: 0.5 });
  const particles = new THREE.Points(particleGeom, particleMat);
  scene.add(particles);

  // Mouse tracking for parallax
  let mouseX = 0, mouseY = 0;
  let targetMouseX = 0, targetMouseY = 0;

  document.addEventListener('mousemove', (e) => {
    targetMouseX = (e.clientX / window.innerWidth - 0.5) * 2;
    targetMouseY = (e.clientY / window.innerHeight - 0.5) * 2;
  });

  // Store original positions for floating
  shapes.forEach(s => {
    s.originalY = s.mesh.position.y;
  });

  // Animation loop
  const clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);
    const elapsed = clock.getElapsedTime();

    // Smooth mouse follow
    mouseX += (targetMouseX - mouseX) * 0.05;
    mouseY += (targetMouseY - mouseY) * 0.05;

    // Animate shapes
    shapes.forEach(s => {
      s.mesh.rotation.x += s.rotSpeed.x;
      s.mesh.rotation.y += s.rotSpeed.y;
      s.mesh.position.y = s.originalY + Math.sin(elapsed * s.floatSpeed) * s.floatAmount;
    });

    // Parallax camera
    camera.position.x += (mouseX * 3 - camera.position.x) * 0.02;
    camera.position.y += (-mouseY * 2 - camera.position.y) * 0.02;
    camera.lookAt(scene.position);

    // Rotate particles slowly
    particles.rotation.y += 0.0003;
    particles.rotation.x += 0.0001;

    renderer.render(scene, camera);
  }

  animate();

  // Handle resize
  window.addEventListener('resize', () => {
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
  });
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  initThreeScene('hero-canvas');
});
