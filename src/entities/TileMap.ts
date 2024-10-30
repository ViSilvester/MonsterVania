import { Entity } from "../../libs/FGE/entity.js";
import { Rect, Vec2, Vec3 } from "../../libs/FGE/geometry.js";
import { Game } from "../game.js";
import { PlayerStatus } from "./Player.js";

export class TileMap extends Entity {

    height: number
    width: number
    map: Array<TileData>
    mapSize: Vec2;
    offset: Vec2;
    tileAtlas: TileAtlas | undefined;
    visibleArea: Vec2 | undefined;
    fillColor = new Vec3(255, 255, 255);
    targetOffset: Vec2;
    status: string = 'idle';
    dir: Vec2 = new Vec2(0, 0);


    constructor(width: number, height: number, offset: Vec2, map?: Array<TileData>, tileAtlas?: TileAtlas, visibleArea?: Vec2, fillColor?: Vec3) {
        super();

        this.width = width;
        this.height = height;

        this.mapSize = new Vec2(width, height);

        if (map) {
            this.map = map;
        }
        else {
            this.map = [];
            for (var y = 0; y < width * height; y++) {
                this.map.push(new TileData(1));
            }
        }

        this.offset = offset;
        this.tileAtlas = tileAtlas;
        this.visibleArea = visibleArea;
        this.fillColor = fillColor ? fillColor : this.fillColor;
        this.targetOffset = new Vec2(0, 0);

    }


    create(): void {

    }

    update(game: Game): void {


    }


    render(game: Game): void {

        var xstart = Math.floor(this.offset.x);
        var ystart = Math.floor(this.offset.y);
        var xend = this.mapSize.x
        var yend = this.mapSize.y;


        if (this.visibleArea) {
            xend = xstart + this.visibleArea.x;
            yend = ystart + this.visibleArea.y;
        }

        if (xstart >= 1) {
            xstart -= 1;
        }
        if (xstart <= this.width - 1) {
            xend += 1;
        }

        if (ystart >= 1) {
            ystart -= 1;
        }
        if (yend <= this.height - 1) {
            yend += 1;
        }

        var rdim = new Vec2(game.tileSize, game.tileSize);

        for (var y = ystart; y < yend; y++) {

            for (var x = xstart; x < xend; x++) {

                var rpos = new Vec2((x - this.offset.x) * game.tileSize, (y - this.offset.y) * game.tileSize)

                if (this.tileAtlas) {
                    this.tileAtlas.renderTile(this.getTile(x, y).id, rpos, rdim, game);
                }
                else {
                    const r = new Rect(rpos, rdim);
                    game.draw.fillRect(r, this.fillColor.x, this.fillColor.y, this.fillColor.z);
                }
            }
        }
    }

    getTile(x: number, y: number) {

        return this.map[Math.floor(y) * this.mapSize.x + Math.floor(x)];
    }

}

export class TileData {

    id: number;
    data: Map<string, any>

    constructor(id?: number, data?: Map<string, any>) {
        this.id = id ? id : 0;
        this.data = data ? data : new Map<string, any>();
    }
}

export class TileAtlas {

    img: ImageBitmap;
    tileSize: number;
    tileOffset: Vec2;


    constructor(img: ImageBitmap, tileSize: number, tileOffset?: Vec2) {

        this.img = img;
        this.tileSize = tileSize;
        this.tileOffset = tileOffset ? tileOffset : new Vec2(0, 0);

    }

    renderTile(id: number, rpos: Vec2, rdim: Vec2, game: Game) {


        const gridSize = Math.floor(this.img.width / this.tileSize)
        const ry = Math.floor(id / gridSize);
        const rx = Math.floor(id % gridSize);

        game.draw.drawImage(
            this.img,
            rpos,
            rdim,
            new Vec2(
                rx * (this.tileSize + this.tileOffset.x),
                ry * (this.tileSize + this.tileOffset.y),
            ),
            new Vec2(this.tileSize, this.tileSize)
        );
    }
}