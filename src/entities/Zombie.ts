import { Vec2 } from "../../libs/FGE/geometry.js";
import { AnimationController } from "../controllers/animationController.js";
import { Game } from "../game.js";
import { Enemy } from "./Enemy.js";
import { Direction, Player } from "./Player.js";

export class Zombie extends Enemy {


    active = false;

    constructor(pos: Vec2, dir: Direction, offset: Vec2, sprite: ImageBitmap) {
        super(pos, dir, offset, sprite);

        this.vel.x = dir == Direction.left ? -0.025 : 0.025;
        this.ani_control.play("zombie_" + dir);

    }
}