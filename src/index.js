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

// 鼠标控制变量
let mouseX = 0;
let mouseY = 0;
let isMoving = true; // 用于控制立方体是否跟随鼠标移动

// 监听鼠标移动事件，更新鼠标位置
document.addEventListener('mousemove', (event) => {
  if (isMoving) { // 仅当允许移动时更新鼠标位置
    mouseX = (event.clientX / window.innerWidth) * 2 - 1; // 将鼠标位置映射到 [-1, 1]
    mouseY = -(event.clientY / window.innerHeight) * 2 + 1; // 将 Y 坐标映射到 [-1, 1]
  }
});

// 监听鼠标点击事件，切换移动状态
document.addEventListener('mousedown', (event) => {
  if (event.button === 0) {
    // 左键点击：开始/继续移动
    isMoving = true;
  } else if (event.button === 2) {
    // 右键点击：停止移动
    isMoving = false;
  }
});

// 禁止右键菜单的显示
document.addEventListener('contextmenu', (event) => event.preventDefault());

// 监听鼠标滚轮事件，控制立方体大小
document.addEventListener('wheel', (event) => {
  const scaleAmount = 1 - event.deltaY * 0.001; // 根据滚轮方向调整缩放比例
  cubeEdges.scale.x *= scaleAmount; // X 轴缩放
  cubeEdges.scale.y *= scaleAmount; // Y 轴缩放
  cubeEdges.scale.z *= scaleAmount; // Z 轴缩放
});

// 动画函数
function animate () {
  requestAnimationFrame(animate);

  // 立方体跟随鼠标移动
  if (isMoving) { // 仅当允许移动时更新立方体位置
    cubeEdges.position.x = mouseX * 5; // 根据鼠标 X 坐标移动立方体，乘以 5 调整范围
    cubeEdges.position.y = mouseY * 5; // 根据鼠标 Y 坐标移动立方体
  }

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
  stars.geometry.attributes.position.needsUpdate = true;

  renderer.render(scene, camera);
}

// 开始动画
animate();
