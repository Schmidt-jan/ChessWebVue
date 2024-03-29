<template>
  <canvas ref="experience" id="gameCanvas"/>
</template>

<style>

#gameCanvas {
  background: #5c68b5;
  z-index: 1;
  opacity: 0;
  animation-delay: 1.5s;
  animation-name: fadein;
  animation-duration: 2s;
  animation-fill-mode: forwards;
}

@keyframes fadein {
  from {
    opacity: 0
  }
  to {
    opacity: 1
  }
}


.inner {
  position: absolute;
}

.hud {
  min-height: 100vh;
  min-width: 100vw;
  pointer-events: none;
}

.hudButtons {
  border-radius: 10px;
  min-height: 2vw;
  min-width: 2vw;
  pointer-events: all;
  margin: 1vh;
}

.top_left {
  left: 0;
  top: 0;
  position: absolute;
}

.bottom_left {
  left: 0;
  bottom: 0;
  position: absolute;
}


</style>

<script setup lang="ts">
import * as THREE from 'three'
import {PerspectiveCamera, WebGLRenderer} from 'three'
import {computed, defineExpose, defineProps, onMounted, ref, toRefs, watch} from "vue";
import {useWindowSize} from "@vueuse/core";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import {FigureTypes, GameFieldResponse, Player} from "@/game/models/GameField";
import {ChessBoard} from "@/game/chessBoard";
import {WebChessApiWs} from "@/game/webChessApiWs";
import {ChessGameField} from "@/game/move_calculator";
import {degToRad, radToDeg} from "three/src/math/MathUtils";
import {OutlineEffect} from "three/examples/jsm/effects/OutlineEffect";


// property settings
interface Props {
  gameField: GameFieldResponse | undefined
}

const props = defineProps<Props>();
let gameFieldRef = toRefs(props).gameField
let player = Player.White;

watch(gameFieldRef, () => {
  if (gameFieldRef.value) {
    updateGameField(gameFieldRef.value)
  }
})

// threejs properties
const experience = ref<HTMLCanvasElement | null>(null);
let chessBoard: ChessBoard;
let renderer: WebGLRenderer;
let camera: PerspectiveCamera;
let controls: OrbitControls;

// animation properties
const MAX_ANIM_SPEED = 20;
const x0 = -4.5;
const z0 = 4.5;
let angle: number;
let deltaX: number;
let deltaZ: number;
let animStopAngle: number | undefined = undefined;

const {width, height} = useWindowSize();
const aspect = computed(() => width.value / height.value);

let ws: WebSocket;

function updateRenderer() {
  renderer.setSize(width.value, height.value);
  renderer.setPixelRatio(window.devicePixelRatio);
}

function updateCamera() {
  controls.update();
  camera.aspect = aspect.value;
  camera.position.y = 12 / camera.aspect;
  camera.updateProjectionMatrix();
}

let effect: OutlineEffect;

watch(aspect, updateCamera)
watch(aspect, updateRenderer)

camera = new THREE.PerspectiveCamera(45, aspect.value, 0.1, 1000);
let increaseCnt = 5;
const loop = () => {
  animRotation()

  controls.update()
  effect.render(chessBoard.getScene(), camera);
  requestAnimationFrame(loop);
}

function animRotation() {
  if (controls.autoRotate && animStopAngle !== undefined) {
    deltaX = camera.position.x - x0;
    deltaZ = camera.position.z - z0;
    angle = Math.floor(radToDeg(Math.atan2(deltaZ, deltaX) + degToRad(90)));
    if (angle < 0) angle = 360 + angle;

    const diff = Math.min(Math.abs(animStopAngle - angle), 360 - Math.abs(animStopAngle - angle))
    if (diff <= 60) {
      if (controls.autoRotateSpeed > 1)
        controls.autoRotateSpeed = diff / 2;
    } else if (controls.autoRotateSpeed <= MAX_ANIM_SPEED) {
      if (increaseCnt === 10) {
        increaseCnt = 0;
        controls.autoRotateSpeed = Math.min(controls.autoRotateSpeed + 2, MAX_ANIM_SPEED);
      } else {
        increaseCnt++;
      }
    }

    if (animStopAngle === angle) {
      controls.autoRotate = false
      controls.autoRotateSpeed = 2;
    }
  }
}

onMounted(() => {
  renderer = new WebGLRenderer({
    canvas: experience.value as unknown as HTMLCanvasElement,
    antialias: true
  })

  effect = new OutlineEffect(renderer);

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
        await chessBoard.handleIntersection(obj.object, ws);
      }
    }
  })

  controls = new OrbitControls(camera, renderer.domElement);
  setControlSettings();
  updateRenderer();
  updateCamera();
  chessBoard = new ChessBoard(player, renderer, camera, controls, false);
  loop();
})

function initBoard(_ws: WebSocket) {
  console.log("init board called")
  ws = _ws;
  chessBoard.loadFigures()
      .then(() => {
        if (ws) {
          WebChessApiWs.getGame(ws);
          controls.autoRotate = true;
          loop();
        }
      });
}

function setControlSettings(val = true) {
  val ? setView3D() : setView2D();
}

function setView3D() {
  camera = new THREE.PerspectiveCamera(50, aspect.value, 0.1, 1000);
  camera.position.set(-4.5, 12 / camera.aspect, -4.5);
  if (player === Player.White) {
    camera.position.set(-4.5, 12 / camera.aspect, -5);
  } else {
    camera.position.set(-4.5, 12 / camera.aspect, 15);
  }
  controls = new OrbitControls(camera, renderer.domElement);
  controls.target.set(-4.5, 0, 4.5)
  controls.maxPolarAngle = Math.PI / 2
  controls.minPolarAngle = -Math.PI / 2

  controls.enableZoom = true
  controls.enablePan = false
  controls.enableDamping = false
  controls.enableRotate = true
}

function setView2D() {
  camera = new THREE.PerspectiveCamera(50, aspect.value, 0.1, 1000);
  camera.position.set(-4.5, 13 / camera.aspect, 4.5);
  if (player === Player.White) {
    camera.up = new THREE.Vector3(0, -1, 1).normalize();
  } else {
    camera.up = new THREE.Vector3(0, -1, -1).normalize();
  }
  controls = new OrbitControls(camera, renderer.domElement);
  controls.target.set(-4.5, 0, 4.5)
  controls.enableZoom = true
  controls.enablePan = false
  controls.enableDamping = false
  controls.enableRotate = false
}

function updateGameField(response: GameFieldResponse) {
  const chessField = new ChessGameField(response);

  if (chessBoard) {
    chessBoard.updateField(chessField);
  }
}

function setPlayer(newPlayer: Player) {
  if (chessBoard) {
    player = newPlayer;
    chessBoard.updatePlayer(newPlayer);
    animStopAngle = newPlayer === Player.White ? 0 : 180
  }

}

function getPossibleSwitches(): FigureTypes[] {
  return [FigureTypes.Knight, FigureTypes.Rook]
}

function toggleShowHints(val: boolean) {
  console.log(val)
  chessBoard.showHints = val;
}

defineExpose({setPlayer, initBoard, getPossibleSwitches, toggleShowHints, setControlSettings});

</script>