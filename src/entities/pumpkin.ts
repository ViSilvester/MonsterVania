import { Vec2 } from "../../libs/FGE/geometry.js";
import { AnimationController } from "../controllers/animationController.js";
import { Game } from "../game.js";
import { Enemy } from "./Enemy.js";
import { Direction, Player } from "./Player.js";

export class Pumkin extends Enemy {


    state = "idle";
    timer = 0;
    active = false;

    constructor(pos: Vec2, dir: Direction, offset: Vec2, sprite: ImageBitmap) {

        super(pos, dir, offset, sprite);

        this.dim = new Vec2(1, 1);
        this.vel = new Vec2(0, 0)
        this.ani_control = new AnimationController(sprite, new Vec2(16, 16));
        this.ani_control.addAnim("pumpkin_center", 7, 0, 1);
        this.ani_control.addAnim("pumpkin_left", 7, 1, 1);
        this.ani_control.addAnim("pumpkin_right", 7, 2, 1);
        this.ani_control.play("pumpkin_center");

    }


    update(game: Game) {

        if (Math.abs(game.player.pos.x - this.pos.x) < 14 && !this.active) {
            this.active = true;
            this.timer = 41;
        }

        if (this.active) {

            //decide direção

            if (this.state == "idle") {

                if (this.timer == 40) {
                    var cdir = game.player.pos.x < this.pos.x ? Direction.left : Direction.right;

                    if (cdir != this.dir) {
                        this.ani_control.play("pumpkin_center");
                    }

                    this.dir = cdir;
                }
                else if (this.timer == 30) {
                    if (this.dir == Direction.left) {
                        this.ani_control.play("pumpkin_left");
                    }
                    else {
                        this.ani_control.play("pumpkin_right");
                    }
                }

                // se timer 0 e parado
                else if (this.timer == 0) {

                    this.state = "jump";

                    if (this.dir == Direction.left) {
                        this.vel.x = -0.1;
                    }
                    else {
                        this.vel.x = 0.1;
                    }

                    this.vel.y = -0.2;
                }
            }


            //colisao

            if (this.state == "jump") {

                if (this.vel.y < 0.2) {
                    this.vel.y += 0.01;
                }

                var p1 = game.map.getTile(this.pos.x + 0.5, this.pos.y + 0.9);


                if (p1 && p1.id == 1) {
                    this.pos.y = Math.floor(this.pos.y);
                    this.state = "idle"
                    this.timer = 41;
                    this.vel.x = 0;
                    this.vel.y = 0;
                }

            }

            //atualiza parametros

            this.pos.x += this.vel.x;
            this.pos.y += this.vel.y;

            if (this.timer > 0) {
                this.timer -= 1;
            }

            if (this.pos.x < 250) {
                this.pos.x = 344;
            }

            if (this.pos.x > 442) {
                this.pos.x = 427;
            }
        }

        this.ani_control.update();

    }
}