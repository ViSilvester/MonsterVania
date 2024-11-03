import { Entity } from "../../libs/FGE/entity.js";
import { Rect, Vec2 } from "../../libs/FGE/geometry.js";
import { AnimationController } from "../controllers/animationController.js";
import { Game } from "../game.js";
import { Direction } from "./Player.js";

export class Enemy extends Entity {
    refpos: Vec2;
    dim: Vec2;
    dir: Direction;
    offset: Vec2
    ani_control: AnimationController;
    alive: boolean;
    attack_timer = 40;
    vel = new Vec2(0, 0);

    constructor(pos: Vec2, dir: Direction, offset: Vec2, sprites: ImageBitmap) {

        super();
        this.pos = pos;
        this.refpos = new Vec2(pos.x, pos.y);
        this.dim = new Vec2(1, 2);
        this.dir = dir;
        this.offset = offset;
        this.ani_control = new AnimationController(sprites, new Vec2(16, 32));
        this.alive = true;
        this.vel.x = -0.1;

        this.ani_control.addAnim("ghost", 1, 0, 1);
        this.ani_control.addAnim("zombie_right", 2, 0, 1);
        this.ani_control.addAnim("zombie_left", 3, 0, 1);
        this.ani_control.addAnim("hanged_zombie", 8, 0, 1);
        this.ani_control.play("ghost");

    }

    create(game: Game): void {

    }


    update(game: Game): void {

        this.pos.x += this.vel.x;
        this.pos.y += this.vel.y;

        if (this.pos.x > this.offset.x + 33 || this.pos.x < this.offset.x - 3) {
            this.alive = false;
        }

    }

    render(game: Game): void {

        const rpos = new Vec2((this.pos.x - this.offset.x) * game.tileSize, (this.pos.y - this.offset.y) * game.tileSize);
        const rdim = new Vec2(this.dim.x * game.tileSize, this.dim.y * game.tileSize);
        this.ani_control.render(game, rpos, rdim);

        // var r = this.getColisionBox();
        // r.pos.x -= this.offset.x;
        // r.pos.x *= game.tileSize;
        // r.dim.x *= game.tileSize;
        // r.pos.y -= this.offset.y;
        // r.pos.y *= game.tileSize;
        // r.dim.y *= game.tileSize;

        // game.draw.fillRect(r, 255, 0, 0);

    }

    getColisionBox() {
        return new Rect(new Vec2(this.pos.x, this.pos.y), new Vec2(this.dim.x, this.dim.y));
    }



}