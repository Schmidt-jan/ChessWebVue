<script setup lang="ts">
import * as THREE from 'three'
import {PerspectiveCamera, WebGLRenderer} from 'three'
import {computed, onMounted, ref, watch, defineProps, toRefs} from "vue";
import {useWindowSize} from "@vueuse/core";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import {GameFieldResponse, Player} from "@/game/models/GameField";
import {ChessBoard} from "@/game/chessBoard";
import {WebChessApiWs} from "@/game/webChessApiWs";
import {ResponseMessage} from "@/game/messageTypes/responses/ResponseMessage";
import {GameFieldRes} from "@/game/messageTypes/responses/GameFieldRes";
import {StatusUpdateRes} from "@/game/messageTypes/responses/StatusUpdateRes";
import {KeepAliveReq} from "@/game/messageTypes/requests/KeepAliveReq";
import {ChessGameField} from "@/game/move_calculator";

const props = defineProps<{
  ws: WebSocket
}>();

const { ws } = toRefs(props)

const experience = ref<HTMLCanvasElement | null>(null);
let chessBoard: ChessBoard;
const scene = new THREE.Scene();
const DEFAULT_Y = 12;
let renderer: WebGLRenderer;
let camera: PerspectiveCamera;
let controls: OrbitControls;

const {width, height} = useWindowSize();
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

camera = new THREE.PerspectiveCamera(45, aspect.value, 0.1, 1000);

const loop = () => {
  renderer.render(chessBoard.getScene(), camera);
  requestAnimationFrame(loop);
}

onMounted(() => {
  renderer = new WebGLRenderer({
    canvas: experience.value as unknown as HTMLCanvasElement,
    antialias: true
  })

  renderer.domElement.addEventListener('click', async (evt) => {
    evt.preventDefault();
    //this.stopAnimation()
    let mouse3D = new THREE.Vector2(((evt.clientX - renderer.domElement.offsetLeft) / renderer.domElement.clientWidth) * 2 - 1,
        -((evt.clientY - renderer.domElement.offsetTop) / renderer.domElement.clientHeight) * 2 + 1)

    const raycaster = new THREE.Raycaster()
    raycaster.setFromCamera(mouse3D, camera);
    const intersects = raycaster.intersectObjects(chessBoard.getScene().children);

    if (intersects.length > 0) {
      const obj = intersects[0];
      if (obj) {
        await chessBoard.handleIntersection(obj.object);
      }
    }
  })

  chessBoard = new ChessBoard(Player.White, renderer, camera, controls, ws.value, false);
  chessBoard.loadFigures().then(() => {
    WebChessApiWs.createNewGame(ws.value);
  }).then()

  controls = new OrbitControls(camera, renderer.domElement);
  setControlSettings();
  updateRenderer();
  updateCamera();
  loop()
})

function setControlSettings() {
  setView3D();
}

function setView3D() {
  camera = new THREE.PerspectiveCamera(50, aspect.value, 0.1, 1000);
  if (Player.White === Player.White) {
    camera.position.set(-4.5, 12 / camera.aspect, -5);
  } else {
    camera.position.set(-4.5, 12 / camera.aspect, 15);
  }
  controls = new OrbitControls(camera, renderer.domElement);
  controls.target.set(-4.5, 0, 4.5)
  controls.maxPolarAngle = Math.PI / 2
  controls.minPolarAngle = -Math.PI / 2
  controls.enabled = true
}

ws.value.onmessage = function (event) {
  let message = JSON.parse(event.data) as ResponseMessage<any>;

  switch (message.type) {
    case "GameField":
      message = message as GameFieldRes
      updateGameField(message.data);
      break;
    case "StatusUpdate":
      message = message as StatusUpdateRes;
      //updateStatus(message.data)
      break;
  }
  /*
    toggleAutoRotate = document.getElementById('toggleAutoRotate');
    toggleHints = document.getElementById('toggleHints');
    toggleSound = document.getElementById('toggleSound');
    labelPlayer = document.getElementById('labelPlayer');
    labelState = document.getElementById('labelState');
  */
}

setInterval(() => {
  const keepAlive: KeepAliveReq = new KeepAliveReq();
  ws.value.send(JSON.stringify(keepAlive))
}, 10000)

async function updateGameField(response: GameFieldResponse) {
  const chessField = new ChessGameField(response);

  if (chessBoard) {
    chessBoard.updateField(chessField);
  }

  //await updateStatus(response as StatusUpdate)
}

</script>
<template>
  <canvas ref="experience"/>
</template>