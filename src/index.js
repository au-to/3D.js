import * as THREE from 'three';

// 创建场景、相机和渲染器
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// 创建动态星空背景
const starsGeometry = new THREE.BufferGeometry();
const starsMaterial = new THREE.PointsMaterial({ color: 0xffffff });

const starsVertices = [];
for (let i = 0; i < 10000; i++) {
  starsVertices.push((Math.random() - 0.5) * 2000); // X
  starsVertices.push((Math.random() - 0.5) * 2000); // Y
  starsVertices.push((Math.random() - 0.5) * 2000); // Z
}
starsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starsVertices, 3));
const stars = new THREE.Points(starsGeometry, starsMaterial);
scene.add(stars);

// 创建虚线边框的立方体
const cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
const cubeEdgesGeometry = new THREE.EdgesGeometry(cubeGeometry);
const cubeEdgesMaterial = new THREE.LineDashedMaterial({ color: 0x00ff00, dashSize: 0.1, gapSize: 0.1 });
const cubeEdges = new THREE.LineSegments(cubeEdgesGeometry, cubeEdgesMaterial);
cubeEdges.computeLineDistances(); // 计算线段的距离，以便正确显示虚线
scene.add(cubeEdges);

// 设定相机位置
camera.position.z = 5;

// 动画函数
function animate () {
  requestAnimationFrame(animate);

  // 旋转立方体
  cubeEdges.rotation.x += 0.01;
  cubeEdges.rotation.y += 0.01;

  // 动态星空背景的更新
  stars.geometry.attributes.position.array.forEach((value, index) => {
    if (index % 3 === 0) {
      stars.geometry.attributes.position.array[index] += 0.01 * (Math.random() - 0.5);
      if (stars.geometry.attributes.position.array[index] > 1000) {
        stars.geometry.attributes.position.array[index] = -1000;
      }
    }
  });
  stars.geometry.attributes.position.needsUpdate = true; // 更新星星的位置

  renderer.render(scene, camera);
}

// 开始动画
animate();
