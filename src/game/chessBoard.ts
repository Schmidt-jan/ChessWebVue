import {FigureTypes, Player} from "@/game/models/GameField";
import * as THREE from "three";
import {CanvasTexture, Object3D, PerspectiveCamera, WebGLRenderer} from "three";
import {ChessGameField} from "@/game/move_calculator";
import {OBJLoader} from "three/examples/jsm/loaders/OBJLoader";
import {degToRad} from "three/src/math/MathUtils";
import {MovePiece, WebChessApiWs} from "@/game/webChessApiWs";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";

interface MyObject3D {
    object: Object3D,
    isFigure: boolean,
    ofPlayer: Player
}

export class ChessBoard {
    private readonly scene: THREE.Scene;
    private pawn: undefined | Object3D = undefined;
    private knight: undefined | Object3D = undefined;
    private bishop: undefined | Object3D = undefined;
    private rook: undefined | Object3D = undefined;
    private queen: undefined | Object3D = undefined;
    private king: undefined | Object3D = undefined;

    private figuresLoaded = false;

    // variables for the game
    visibleFigures: MyObject3D[] = [];
    highlightedCells: Object3D[] = [];
    selectedFigure?: MyObject3D;
    currGameField?: ChessGameField;

    constructor(private readonly player: Player,
                private renderer: WebGLRenderer,
                private camera: PerspectiveCamera,
                private controls: OrbitControls,
                private readonly ws: WebSocket,
                private g3d: boolean = false) {
        // init scene
        this.scene = new THREE.Scene();
        this.scene.clear();
        this.scene.background = new THREE.Color(0xffffff);
        this.scene.add(new THREE.HemisphereLight(0xffffff, 0.8))
        const light = new THREE.DirectionalLight(0xffffff, 0.5)

        light.position.set(0, -5, 5);

        this.scene.add(light);
        this.createBoard();
    }

    public getScene(): Object3D {
        return this.scene;
    }

    private drawKs() {
        [0, 1, 2].forEach((idx) => {
            let color = 0xff0000;
            if (idx === 1) color = 0x00ff00;
            if (idx === 2) color = 0x0000ff;

            const material = new THREE.LineBasicMaterial({color: color});
            const points = [];
            points.push(new THREE.Vector3(0, 0, 0));
            if (idx === 1) {
                points.push(new THREE.Vector3(10, 0, 0));
            } else if (idx === 2) {
                points.push(new THREE.Vector3(0, 10, 0));
            } else {
                points.push(new THREE.Vector3(0, 0, 10));
            }
            const geometry = new THREE.BufferGeometry().setFromPoints(points);
            const line = new THREE.Line(geometry, material);
            this.scene.add(line);
        })
    }

    private createBoard() {
        let cellBlack = false;
        let columnCt = 0;

        for (const letter of ['', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', '']) {
            for (const row of [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]) {
                const cellGeometry = new THREE.BoxGeometry(1, 0.1, 1);

                // beschriftung
                const isDescRow = row === 0 || row === 9;
                const isDescColumn = letter.length === 0;
                if (isDescRow || isDescColumn) {
                    const canvas: HTMLCanvasElement = isDescRow ? this.createCanvas(letter) : this.createCanvas(row.toString())
                    const cellMaterial = new THREE.MeshPhongMaterial({
                        flatShading: true,
                        map: new CanvasTexture(canvas)
                    });
                    const cell = new THREE.Mesh(cellGeometry, cellMaterial);
                    cell.position.set(-columnCt, 0, row);
                    cell.rotateZ(Math.PI);
                    this.scene.add(cell);
                } else {
                    const cellMaterial = new THREE.MeshPhongMaterial({
                        color: cellBlack ? 0x3d2b1f : 0xffe4b5,
                        flatShading: true
                    });
                    const cell = new THREE.Mesh(cellGeometry, cellMaterial);
                    cell.position.set(-columnCt, 0, row);
                    cell.rotateZ(Math.PI);
                    this.scene.add(cell);
                    cellBlack = !cellBlack;
                }
            }

            cellBlack = !cellBlack;
            columnCt++;
        }
    }

    private createCanvas(text: string): HTMLCanvasElement {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        canvas.width = canvas.height = 256;
        if (ctx) {
            ctx.beginPath();
            ctx.strokeStyle = 'black'
            ctx.lineWidth = 10
            ctx.strokeRect(0, 0, 256, 256);
            ctx.rect(0, 0, 256, 256);

            ctx.fillStyle = '#3d2b1f';
            ctx.fill();
            ctx.fillStyle = '#ffe4b5';
            ctx.stroke();
            ctx.font = '128px sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(text, 128, 128);
        }

        return canvas;
    }

    public async loadFigures(): Promise<void> {
        const loader = new OBJLoader();
        let cntModelsLoaded = 0;

        return new Promise((res) => {
            loader.load('http://localhost:9000/assets/3dModels/Pawn.obj', (obj) => {
                this.pawn = obj.children[0];
                this.pawn.scale.set(.8, .8, .8)
                checkFiguresLoaded();
            })

            loader.load('http://localhost:9000/assets/3dModels/Rook.obj', (obj) => {
                this.rook = obj.children[0];
                this.rook.scale.set(.8, .8, .8)
                checkFiguresLoaded();
            })

            loader.load('http://localhost:9000/assets/3dModels/Bishop.obj', (obj) => {
                this.bishop = obj.children[0];
                this.bishop.scale.set(.8, .8, .8)
                checkFiguresLoaded();
            })

            loader.load('http://localhost:9000/assets/3dModels/Knight.obj', (obj) => {
                this.knight = obj.children[0];
                this.knight.scale.set(.8, .8, .8)
                checkFiguresLoaded();
            })

            loader.load('http://localhost:9000/assets/3dModels/Queen.obj', (obj) => {
                this.queen = obj.children[0];
                this.queen.scale.set(.8, .8, .8)
                checkFiguresLoaded();
            })

            loader.load('http://localhost:9000/assets/3dModels/King.obj', (obj) => {
                this.king = obj.children[0];
                this.king.scale.set(.8, .8, .8)
                checkFiguresLoaded();
            })

            const checkFiguresLoaded = () => {
                if (++cntModelsLoaded == 6) {
                    this.figuresLoaded = true;
                    res();
                }
            }
        })
    }

    private setFigures(gameField: ChessGameField) {
        this.currGameField = gameField;
        gameField.flatGameField.forEach((figure) => {
            this.setFigure(figure.figure, [[figure.x + 1, figure.y + 1]], figure.color);
        });
    }

    private setFigure(type: FigureTypes, positions: [number, number][], player: Player = Player.White) {
        for (const [x, y] of positions) {
            const figure = this.cloneFigure(type, player);
            figure.object.position.set(-x, 0, y);
            figure.isFigure = true;
            figure.ofPlayer = player ? Player.Black : Player.White
            if (player === Player.White) {
                figure.object.rotateY(-Math.PI);
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                figure.object.material = new THREE.MeshPhongMaterial({color: 0x8b4514, shininess: 30})
            } else {
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                figure.object.material = new THREE.MeshPhongMaterial({color: 0xf4a460, shininess: 30})
            }
            this.visibleFigures.push(figure);
            this.scene.add(figure.object);
        }
    }

    private cloneFigure(type: FigureTypes, player: Player): MyObject3D {
        if (!this.pawn || !this.rook || !this.bishop || !this.knight || !this.queen || !this.king) {
            throw new Error(`3D models are not loaded`);
        }

        switch (type) {
            case FigureTypes.Pawn:
                return createResult(this.pawn);
            case FigureTypes.Rook:
                return createResult(this.rook);
            case FigureTypes.Bishop:
                return createResult(this.bishop);
            case FigureTypes.Knight:
                return createResult(this.knight);
            case FigureTypes.Queen:
                return createResult(this.queen);
            case FigureTypes.King:
                return createResult(this.king);
        }

        function createResult(object: Object3D): MyObject3D {
            return {
                object: object.clone(),
                isFigure: true,
                ofPlayer: player
            }
        }
    }

    public startAnimation() {
        this.controls.autoRotate = true
    }

    public stopAnimation() {
        this.controls.autoRotate = false
    }

    public async handleIntersection(obj: Object3D) {
        // game field is not initialized, or it's the others turn
        if (!this.currGameField ||
            (this.currGameField.player !== this.player)) {
            return;
        }

        const objFigure = this.objIsFigure(obj);
        console.log(objFigure)
        if (!objFigure) {
            if (this.selectedFigure) {
                const req: MovePiece = {
                    fromX: -this.selectedFigure.object.position.x - 1,
                    fromY: this.selectedFigure.object.position.z - 1,
                    toX: -obj.position.x - 1,
                    toY: obj.position.z - 1
                };

                WebChessApiWs.movePiece(this.ws, req);
                this.selectedFigure.object.position.y = 0;
            }

            this.selectedFigure = undefined;
            this.scene.remove(...this.highlightedCells);
            this.highlightedCells = [];
            return;
        }

        // no figure was selected
        if (!this.selectedFigure) {
            this.selectedFigure = objFigure;
            obj.position.y = 0.5;
            this.showPossibleMoves(-obj.position.x, obj.position.z);
        } else {
            const isNewFigure = objFigure !== this.selectedFigure
            this.selectedFigure.object.position.y = 0;
            this.selectedFigure = undefined;
            this.scene.remove(...this.highlightedCells);
            this.highlightedCells = [];

            if (isNewFigure) {
                this.selectedFigure = objFigure;
                obj.position.y = 0.5;
                this.showPossibleMoves(-obj.position.x, obj.position.z);
            }


        }
    }

    private objIsFigure(obj: Object3D): MyObject3D | null {
        for (const figure of this.visibleFigures) {
            if (obj.position.equals(figure.object.position) && figure.isFigure) {
                return figure;
            }
        }

        return null;
    }

    private showPossibleMoves(x: number, y: number) {
        console.log('show possible moves')
        this.scene.remove(...this.highlightedCells);
        this.highlightedCells = [];

        if (!this.currGameField) {
            throw new Error('No game field loaded');
        }
        const figure = this.currGameField.gameField[x - 1][y - 1];
        if (figure) {
            const possibleMoves = this.currGameField.getPossibleMoves(figure, true);
            console.log(possibleMoves)
            for (const [x, y] of possibleMoves) {
                const geometry = new THREE.PlaneGeometry();
                const material = new THREE.MeshBasicMaterial({transparent: true, opacity: 0.4, color: 0xffa500});
                const highlight = new THREE.Mesh(geometry, material);
                highlight.position.set(-(x + 1), 0.051, y + 1);
                highlight.rotateX(-Math.PI / 2)
                this.highlightedCells.push(highlight);
                this.scene.add(highlight);
            }
        }
    }

    public updateField(chessField: ChessGameField) {
        if (!this.figuresLoaded) {
            return;
        }
        this.selectedFigure = undefined;
        this.scene.remove(...this.highlightedCells);
        this.highlightedCells = [];
        this.scene.remove(...this.visibleFigures.map((figure) => figure.object));
        this.visibleFigures = [];
        this.setFigures(chessField);
    }

    public async rotateToWhite() {
        const rad = 9.5;
        const cameraStartX = -4.5
        if (this.g3d) {
            for (let angle = 0; angle >= -180; angle--) {
                const deltaX = rad * Math.sin((degToRad(angle)));
                const deltaZ = rad * Math.cos((degToRad(angle)));
                this.camera.position.set(cameraStartX + deltaX, this.camera.position.y, 4.5 + deltaZ);
                this.controls.target.set(-4.5, 0, 4.5);
                await this.sleep(5);
            }
        } else {
            for (let angle = 0; angle <= 180; angle++) {
                this.camera.position.set(-4.5, 12, 4.5);
                const vecX = Math.sin(degToRad(angle))
                const vecZ = Math.cos(degToRad(angle))
                this.camera.up = new THREE.Vector3(vecX, -1, -vecZ).normalize();
                this.controls.target.set(-4.5, 0, 4.5)
                await this.sleep(5)
            }
        }
    }

    public async rotateToBlack() {
        const rad = 9.5;
        const cameraStartX = -4.5
        if (this.g3d) {
            for (let angle = 0; angle <= 180; angle++) {
                const deltaX = rad * Math.sin((degToRad(angle)));
                const deltaZ = rad * Math.cos((degToRad(angle)));
                this.camera.position.set(cameraStartX + deltaX, this.camera.position.y, 4.5 - deltaZ);
                this.controls.target.set(-4.5, 0, 4.5);
                await this.sleep(5);
            }
        } else {
            for (let angle = 0; angle >= -180; angle--) {
                this.camera.position.set(-4.5, 12, 4.5);
                const vecX = Math.sin(degToRad(angle))
                const vecZ = Math.cos(degToRad(angle))
                this.camera.up = new THREE.Vector3(vecX, -1, vecZ).normalize();
                this.controls.target.set(-4.5, 0, 4.5)
                await this.sleep(5)
            }
        }
    }

    private sleep(ms: number) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}