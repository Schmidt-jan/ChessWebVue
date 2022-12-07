<script setup lang="ts">
  import * as THREE from 'three'
  import {computed, onMounted, ref, watch} from "vue";
  import {BoxGeometry, Mesh, MeshBasicMaterial, PerspectiveCamera, WebGLRenderer} from "three";
  import {useWindowSize} from "@vueuse/core";
  import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
  import {Player} from "@/game/models/GameField";

  const experience = ref<HTMLCanvasElement | null>(null);
  const scene = new THREE.Scene();
  const DEFAULT_Y = 12;
  let renderer: WebGLRenderer;
  let camera: PerspectiveCamera;
  let controls: OrbitControls;

  const {width, height } = useWindowSize();
  const aspect = computed(() => width.value / height.value);

  function updateRenderer() {
    renderer.setSize(width.value, height.value);
    renderer.setPixelRatio(window.devicePixelRatio);
  }

  function updateCamera() {
    controls.update();
    camera.aspect = aspect.value;
    camera.updateProjectionMatrix();
  }

  watch(aspect, updateCamera)
  watch(aspect, updateRenderer)

  camera = new THREE.PerspectiveCamera(45, aspect.value,0.1,1000);
  setView3D();
  scene.add(camera);

  const sphere = new Mesh(new BoxGeometry(1,1,1), new MeshBasicMaterial({color:0x008088}))
  scene.add(sphere);

  const loop = () => {
    renderer.render(scene, camera);
    requestAnimationFrame(loop);
  }

  onMounted(() => {
    renderer = new WebGLRenderer({
      canvas: experience.value as unknown as HTMLCanvasElement,
      antialias: true
    })

    controls = new OrbitControls(camera, renderer.domElement);
    setControlSettings();
    updateRenderer();
    updateCamera();
    loop()
  })

  function setControlSettings() {
    controls.maxPolarAngle = Math.PI / 2
    controls.minPolarAngle = -Math.PI / 2
    controls.enabled = true
    controls.enableDamping = true;
  }

  function setView3D() {
    if (Player.White === Player.White) {
      camera.position.set(0, DEFAULT_Y / aspect.value, -5);
    } else {
      camera.position.set(0, DEFAULT_Y / aspect.value, 15);
    }
  }

  function setView2D() {
    camera.position.set(-4.5, DEFAULT_Y / aspect.value, 4.5);
    if (Player.White === Player.White) {
      camera.up = new THREE.Vector3(0, -1, 1).normalize();
    } else {
      camera.up = new THREE.Vector3(0, -1, -1).normalize();
    }
  }

</script>
<template>
  <canvas ref="experience" />
</template>