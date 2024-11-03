import { Vec2 } from "../../libs/FGE/geometry.js";
import { AnimationController } from "../controllers/animationController.js";
import { Game } from "../game.js";
import { Enemy } from "./Enemy.js";
import { Direction, Player } from "./Player.js";

export class Morcego extends Enemy {


    active = false;

    constructor(pos: Vec2, dir: Direction, offset: Vec2, sprite: ImageBitmap) {

        super(pos, dir, offset, sprite);

        this.dim = new Vec2(1, 1);
        this.ani_control = new AnimationController(sprite, new Vec2(16, 16));
        this.ani_control.addAnim("morcego_static", 4, 0, 1, 8);
        this.ani_control.addAnim("morcego_attack", 5, 0, 2, 8);
        this.ani_control.play("morcego_static");

    }



    update(game: Game) {

        if (this.active) {

            this.ani_control.play("morcego_attack");

            if (this.pos.x > game.player.pos.x) {

                if (game.player.pos.y + 0.5 > this.pos.y) {
                    this.pos.y += 0.15;
                }
                else {
                    this.pos.y -= 0.15;
                }
            }

            this.pos.x -= 0.1;

            if (this.pos.x < this.offset.x - 1) {
                this.alive = false;
            }
        }
        else if (Math.abs(game.player.pos.x - this.pos.x) < 5) {
            this.active = true;
        }

        this.ani_control.update();
    }
}