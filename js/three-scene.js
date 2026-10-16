/* ===========================
   Three.js — 3D Background Scene
   Floating geometric wireframes
   =========================== */

function initThreeScene(canvasId) {
  let container = document.getElementById(canvasId);
  if (!container) {
    const headerParent = document.querySelector('.hero') || document.querySelector('.page-header') || document.body;
    if (headerParent) {
      container = document.createElement('div');
      container.id = canvasId;
      container.className = 'hero-canvas page-bg-canvas';
      headerParent.prepend(container);
    } else {
      return;
    }
  }

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
  camera.position.z = 30;

  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x000000, 0);
  container.appendChild(renderer.domElement);

  // Lighting for real 3D physical shapes
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
  scene.add(ambientLight);

  const lightViolet = new THREE.PointLight(0x7c3aed, 2.5, 90);
  lightViolet.position.set(-16, 16, 25);
  scene.add(lightViolet);

  const lightCyan = new THREE.PointLight(0x06b6d4, 2.2, 90);
  lightCyan.position.set(16, -12, 25);
  scene.add(lightCyan);

  // Materials - Real 3D physical shaded & wireframe accents
  const matVioletSolid = new THREE.MeshPhongMaterial({ color: 0x7c3aed, specular: 0xc4b5fd, shininess: 80, transparent: true, opacity: 0.35 });
  const matCyanSolid = new THREE.MeshPhongMaterial({ color: 0x06b6d4, specular: 0x67e8f9, shininess: 90, transparent: true, opacity: 0.32 });
  const matPinkSolid = new THREE.MeshPhongMaterial({ color: 0xec4899, specular: 0xf472b6, shininess: 85, transparent: true, opacity: 0.28 });
  const matViolet = new THREE.MeshBasicMaterial({ color: 0x7c3aed, wireframe: true, transparent: true, opacity: 0.22 });
  const matCyan = new THREE.MeshBasicMaterial({ color: 0x06b6d4, wireframe: true, transparent: true, opacity: 0.2 });
  const matPink = new THREE.MeshBasicMaterial({ color: 0xec4899, wireframe: true, transparent: true, opacity: 0.16 });
  const matWhite = new THREE.MeshBasicMaterial({ color: 0xa78bfa, wireframe: true, transparent: true, opacity: 0.12 });

  // Create real 3D geometries
  const shapes = [];

  // Real 3D Glossy Sphere
  const sphere1 = new THREE.Mesh(new THREE.SphereGeometry(3.5, 32, 32), matCyanSolid);
  sphere1.position.set(-14, 6, -8);
  scene.add(sphere1);
  shapes.push({ mesh: sphere1, rotSpeed: { x: 0.002, y: 0.003 }, floatSpeed: 0.5, floatAmount: 2 });

  // Real 3D Glossy Cube
  const cube1 = new THREE.Mesh(new THREE.BoxGeometry(4.2, 4.2, 4.2), matVioletSolid);
  cube1.position.set(15, -4, -6);
  scene.add(cube1);
  shapes.push({ mesh: cube1, rotSpeed: { x: 0.003, y: 0.004 }, floatSpeed: 0.65, floatAmount: 1.8 });

  // Real 3D Torus Ring
  const torus1 = new THREE.Mesh(new THREE.TorusGeometry(3.8, 1.2, 16, 32), matPinkSolid);
  torus1.position.set(-8, -9, -5);
  scene.add(torus1);
  shapes.push({ mesh: torus1, rotSpeed: { x: 0.004, y: 0.002 }, floatSpeed: 0.6, floatAmount: 1.6 });

  // 3D Icosahedron
  const ico1 = new THREE.Mesh(new THREE.IcosahedronGeometry(5.5, 1), matViolet);
  ico1.position.set(12, 9, -12);
  scene.add(ico1);
  shapes.push({ mesh: ico1, rotSpeed: { x: 0.002, y: 0.003 }, floatSpeed: 0.55, floatAmount: 2 });

  // 3D Dodecahedron
  const dodec = new THREE.Mesh(new THREE.DodecahedronGeometry(3.8, 0), matCyan);
  dodec.position.set(0, -11, -14);
  scene.add(dodec);
  shapes.push({ mesh: dodec, rotSpeed: { x: 0.002, y: 0.002 }, floatSpeed: 0.45, floatAmount: 2.2 });

  // 3D Torus knot
  const knot = new THREE.Mesh(new THREE.TorusKnotGeometry(3, 0.85, 64, 16), matVioletSolid);
  knot.position.set(-16, 12, -16);
  scene.add(knot);
  shapes.push({ mesh: knot, rotSpeed: { x: 0.001, y: 0.002 }, floatSpeed: 0.35, floatAmount: 1.2 });

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

  // Update materials on theme change
  const updateMaterialsForTheme = (isLight) => {
    matVioletSolid.opacity = isLight ? 0.45 : 0.35;
    matCyanSolid.opacity = isLight ? 0.42 : 0.32;
    matPinkSolid.opacity = isLight ? 0.38 : 0.28;
    matViolet.opacity = isLight ? 0.35 : 0.22;
    matCyan.opacity = isLight ? 0.32 : 0.2;
    matPink.opacity = isLight ? 0.28 : 0.16;
    matWhite.opacity = isLight ? 0.22 : 0.12;
    particleMat.opacity = isLight ? 0.6 : 0.5;
  };

  updateMaterialsForTheme(document.documentElement.getAttribute('data-theme') === 'light');

  window.addEventListener('themechange', (e) => {
    updateMaterialsForTheme(e.detail ? e.detail.theme === 'light' : document.documentElement.getAttribute('data-theme') === 'light');
  });

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
