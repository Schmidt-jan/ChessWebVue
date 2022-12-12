import {Field, Figure, FigureTypes, GameField, GameFieldResponse, Player} from "./models/GameField";

export class ChessGameField {
    gameField: GameField = new Array<Array<Figure | null>>();
    flatGameField: Figure[];
    player: Player
    status: string

    constructor(data: GameFieldResponse) {
        this.gameField = this.responseToGameField(data);
        this.flatGameField = data.gameField;
        this.player = data.currentPlayer as Player;
        this.status = data.status
    }

    responseToGameField(response: GameFieldResponse): GameField {
        for (let i = 0; i < 8; i++) {
            const row = [null, null, null, null, null, null, null, null]
            this.gameField.push(row);
        }

        for (const player of response.gameField) {
            this.gameField[player.x][player.y] = player;
        }

        return this.gameField;
    }

    public getStatus(): string {
        return this.status;
    }

    public getPossiblePawnSwitches(): FigureTypes[] {
        const switches : FigureTypes[] = [];
        const enemiesFigures = this.flatGameField.filter((figure) => figure.color != this.player);
        const cntQueens = enemiesFigures.filter(figure => figure.figure === FigureTypes.Queen).length;
        const cntRooks = enemiesFigures.filter(figure => figure.figure === FigureTypes.Queen).length;
        const cntBishops = enemiesFigures.filter(figure => figure.figure === FigureTypes.Queen).length;
        const cntKnights = enemiesFigures.filter(figure => figure.figure === FigureTypes.Queen).length;

        if (cntQueens === 0) {
            switches.push(FigureTypes.Queen);
        }
        if (cntRooks < 2) {
            switches.push(FigureTypes.Rook)
        }
        if (cntBishops < 2) {
            switches.push(FigureTypes.Bishop)
        }
        if (cntKnights < 2) {
            switches.push(FigureTypes.Knight)
        }

        return switches;
    }
    /*
    public getPossibleSwitches(): FigureTypes[] {
        const switches: FigureTypes[] = [];
        const Rooks = this.flatGameField.filter(figure => figure.figure === FigureTypes.Rook)
        const Queens = this.flatGameField.filter(figure => figure.figure === FigureTypes.Queen)
        const Bishops = this.flatGameField.filter(figure => figure.figure === FigureTypes.Bishop)
        const Knights = this.flatGameField.filter(figure => figure.figure === FigureTypes.Knight)

        if (Queens.length < 2) {
            if (Queens.filter(figure => figure.color !== this.player).length === 0) {
                switches.push(FigureTypes.Queen)
            }
        }
        if (Rooks.length < 4) {
            const yours = Rooks.filter(figure => figure.color === this.player);
            const others = Rooks.filter(figure => figure.color !== this.player);
            const youCntMissing = yours.length < 2 ? 2 - yours.length : 0;
            const otherCntMissing = others.length < 2 ? 2 - others.length : 0;
        }
        if (Bishops.length < 4) {
            const yours = Bishops.filter(figure => figure.color === this.player);
            const others = Bishops.filter(figure => figure.color !== this.player);
        }
        if (Knights.length < 4) {
            const yours = Knights.filter(figure => figure.color === this.player);
            const others = Knights.filter(figure => figure.color !== this.player);
        }
    }*/

    public pointInBounds(x: number, y: number) {
        let xInBounds = false
        if (x >= 0 && x < 8)
            xInBounds = true

        let yInBounds = false
        if (y >= 0 && y < 8)
            yInBounds = true

        return xInBounds && yInBounds
    }

    public getPossibleMoves(element: Figure, filterKing?: boolean) {
        switch (element.figure) {
            case FigureTypes.Pawn:
                return this.getPossibleMovesPawn(element, filterKing)
            case FigureTypes.Queen:
                return this.getPossibleMovesQueen(element, filterKing)
            case FigureTypes.Rook:
                return this.getPossibleMovesRook(element, filterKing)
            case FigureTypes.Knight:
                return this.getPossibleMovesKnight(element, filterKing)
            case FigureTypes.Bishop:
                return this.getPossibleMovesBishop(element, filterKing)
            case FigureTypes.King:
                return this.getPossibleMovesKing(element, filterKing)
        }
    }

    public isChecked(player: Player): boolean {
        const king = player === this.player ? this.getKing(this.player) : this.getEnemiesKing(this.player);
        if (!king) {
            return true;
        }

        const enemies: Figure[] = this.flatGameField.filter(field => {
            if (player === this.player) {
                return field.color !== this.player
            }
            return field.color !== this.player
        });

        for (const enemy of enemies) {
            const possibleMoves = this.getPossibleMoves(enemy, false);
            for (const [x, y] of possibleMoves) {
                if (x == king.x && y == king.y) {
                    return true;
                }
            }
        }

        return false;
    }

    getPossibleMovesPawn(element: Figure, filterKing?: boolean): Field[] {
        const firstStep = (element.color === Player.White && element.y === 1) ||
            (element.color === Player.Black && element.y === 6);
        const stepY = element.color === Player.White ? 1 : -1

        const possibleMoves: Field[] = [];
        let [x, y] = [element.x, element.y + stepY]
        if (this.pointInBounds(x, y) && (this.gameField[x][y] === null)) {
            possibleMoves.push([x, y])
        }

        [x, y] = [element.x, element.y + 2 * stepY];
        if (firstStep && this.pointInBounds(x, y) && (this.gameField[x][y] === null)) {
            possibleMoves.push([x, y]);
        }

        [x, y] = [element.x + 1, element.y + stepY];
        if (this.pointInBounds(x, y)) {
            const otherFigure = this.gameField[x][y];
            if (otherFigure && otherFigure.color !== element.color) {
                possibleMoves.push([x, y]);
            }
        }

        [x, y] = [element.x - 1, element.y + stepY];
        if (this.pointInBounds(x, y)) {
            const otherFigure = this.gameField[x][y];
            if (otherFigure && otherFigure.color !== element.color) {
                possibleMoves.push([x, y]);
            }
        }

        if (filterKing) {
            return this.removeEnemiesKingPosition(possibleMoves, element.color);
        }

        return possibleMoves;
    }

    getPossibleMovesQueen(element: Figure, filterKing?: boolean): Field[] {
        const movesDiagonal = this.getPossibleMovesDiagonal(element);
        const movesStraight = this.getPossibleMovesStraight(element);
        const possibleMoves = [...movesDiagonal, ...movesStraight];

        if (filterKing) {
            return this.removeEnemiesKingPosition(possibleMoves, element.color);
        }

        return possibleMoves
    }

    getPossibleMovesRook(element: Figure, filterKing?: boolean): Field[] {
        const possibleMoves = this.getPossibleMovesStraight(element);

        if (filterKing) {
            return this.removeEnemiesKingPosition(possibleMoves, element.color);
        }

        return possibleMoves
    }

    getPossibleMovesKnight(element: Figure, filterKing?: boolean): Field[] {
        let possibleMoves: Field[] = [[1, 2], [-1, 2], [1, -2], [-1, -2],
            [2, 1], [2, -1], [-2, 1], [-2, -1]];
        for (const move of possibleMoves) {
            move[0] += element.x;
            move[1] += element.y;
        }
        possibleMoves = possibleMoves.filter(([x, y]) => this.pointInBounds(x, y));
        possibleMoves = possibleMoves.filter(([x, y]) => {
            const field = this.gameField[x][y];
            if (field === null) {
                return true;
            }
            return field.color !== element.color && field.figure;
        })

        if (filterKing) {
            return this.removeEnemiesKingPosition(possibleMoves, element.color);
        }

        return possibleMoves;
    }

    getPossibleMovesBishop(element: Figure, filterKing?: boolean): Field[] {
        const possibleMoves = this.getPossibleMovesDiagonal(element);

        if (filterKing) {
            return this.removeEnemiesKingPosition(possibleMoves, element.color);
        }

        return possibleMoves
    }

    getPossibleMovesKing(element: Figure, filterKing?: boolean): Field[] {
        let fieldsAround = [
            [element.x, element.y + 1],
            [element.x + 1, element.y + 1],
            [element.x + 1, element.y],
            [element.x + 1, element.y - 1],
            [element.x, element.y - 1],
            [element.x - 1, element.y - 1],
            [element.x - 1, element.y],
            [element.x - 1, element.y + 1]
        ]

        fieldsAround = fieldsAround.filter(point => this.pointInBounds(point[0], point[1]));
        const possibleMoves: Field[] = []
        for (const [x, y] of fieldsAround) {
            const otherFigure = this.gameField[x][y];
            if (!otherFigure) {
                possibleMoves.push([x, y]);
            }
            if (otherFigure && otherFigure.color !== element.color) {
                possibleMoves.push([x, y])
            }
        }

        if (filterKing) {
            return this.removeEnemiesKingPosition(possibleMoves, element.color);
        }

        return possibleMoves
    }

    getMovesTillBound(element: Figure, stepX: number, stepY: number): Field[] {
        const possibleMoves: Field[] = []

        let curX = element.x + stepX;
        let curY = element.y + stepY;

        while (this.pointInBounds(curX, curY)) {
            const field = this.gameField[curX][curY];

            if (field) {
                if (field.color === element.color) {
                    break;
                } else {
                    possibleMoves.push([curX, curY]);
                    break;
                }
            } else {
                possibleMoves.push([curX, curY])
            }

            curX += stepX;
            curY += stepY;
        }

        return possibleMoves
    }

    getPossibleMovesStraight(element: Figure): Field[] {
        const movesUp = this.getMovesTillBound(element, 0, 1);
        const movesDown = this.getMovesTillBound(element, 0, -1);
        const movesRight = this.getMovesTillBound(element, 1, 0);
        const movesLeft = this.getMovesTillBound(element, -1, 0);

        return [...movesUp, ...movesDown, ...movesRight, ...movesLeft]
    }

    getPossibleMovesDiagonal(element: Figure): Field[] {
        const movesUpRight = this.getMovesTillBound(element, 1, 1);
        const movesDownRight = this.getMovesTillBound(element, 1, -1);
        const movesDownLeft = this.getMovesTillBound(element, -1, -1);
        const movesUpLeft = this.getMovesTillBound(element, -1, 1);

        return [...movesUpRight, ...movesDownRight, ...movesDownLeft, ...movesUpLeft]
    }

    getKing(player: Player): Figure | undefined {
        return this.flatGameField.find(field => (field.figure === FigureTypes.King && field.color === player));
    }

    getEnemiesKing(player: Player): Figure | undefined {
        return this.flatGameField.find(field => (field.figure === FigureTypes.King && field.color !== player));
    }

    removeEnemiesKingPosition(possibleMoves: Field[], player: Player): Field[] {
        const king = this.getEnemiesKing(player);
        possibleMoves = possibleMoves.filter(([x, y]) => x !== king?.x || y !== king.y)
        return possibleMoves
    }

    straightWayFree(fromX: number, fromY: number, toX: number, toY: number): boolean {
        if (fromX === toX && fromY === toY)
            return true

        if (fromX !== toX && fromY !== toY)
            return false

        let stepX = 0
        let stepY = 0

        if (fromX === toX) {
            stepY = toY < fromY ? -1 : 1;
        } else {
            stepX = toX < fromX ? -1 : 1;
        }

        let curX = fromX + stepX
        let curY = fromY + stepY
        while (curX !== toX + stepX || curY !== toY + stepY) {
            if (this.gameField[curX][curY] !== null) {
                return false;
            }

            curX += stepX;
            curY += stepY;
        }

        return true;
    }

    diagonalWayFree(fromX: number, fromY: number, toX: number, toY: number): boolean {
        if (fromX === toX && fromY === toY)
            return true

        const deltaX = toX - fromX;
        const deltaY = toY - fromY;
        if (Math.abs(deltaX) !== Math.abs(deltaY))
            return false;

        const stepX = toX < fromX ? -1 : 1;
        const stepY = toY < fromY ? -1 : 1;

        let curX = fromX + stepX;
        let curY = fromY + stepY;
        while (curY !== toY + stepY) {
            if (this.gameField[curX][curY] !== null) {
                return false;
            }

            curX += stepX
            curY += stepY
        }

        return true
    }
}
