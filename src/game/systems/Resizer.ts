import {Camera, PerspectiveCamera, WebGLRenderer} from "three";

const setSize = (container: HTMLElement, camera: PerspectiveCamera, renderer: WebGLRenderer) => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
};

export class Resizer {
    constructor(container: HTMLElement, camera: PerspectiveCamera, renderer: WebGLRenderer) {
        // set initial size on load
        setSize(container, camera, renderer);

        window.addEventListener('resize', () => {
            // set the size again if a resize occurs
            setSize(container, camera, renderer);
            // perform any custom actions
            this.onResize();
        });
    }

    onResize() {
    }
}