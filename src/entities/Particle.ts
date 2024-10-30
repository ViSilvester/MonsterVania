import { Entity } from "../../libs/FGE/entity.js";
import { Vec2 } from "../../libs/FGE/geometry.js";
import { AnimationController } from "../controllers/animationController.js";
import { Game } from "../game.js";

export class Particle extends Entity {

    dim: Vec2;
    lifetime: number | undefined;
    ani_control: AnimationController
    offset: Vec2;
    alive: boolean = true;
    std_anim: string;
    timer: number;

    constructor(pos: Vec2, dim: Vec2, offset: Vec2, ani_controller: AnimationController, std_anim: string, lifetime?: number) {

        super();

        this.pos = pos;
        this.dim = dim;
        this.lifetime = lifetime
        this.ani_control = ani_controller;
        this.offset = offset;
        this.std_anim = std_anim;
        this.timer = 0;

        ani_controller.play(std_anim);

    }


    create(game: Game): void {

    }

    update(game: Game): void {

        this.timer += 1;

        this.ani_control.update();

        if (this.lifetime && this.timer > this.lifetime) {
            this.alive = false;
        }
    }
    render(game: Game): void {

        const rpos = new Vec2((this.pos.x - this.offset.x) * game.tileSize, (this.pos.y - this.offset.y) * game.tileSize);
        const rdim = new Vec2(this.dim.x * game.tileSize, this.dim.y * game.tileSize);

        this.ani_control.render(game, rpos, rdim);

    }

    create_instance(pos: Vec2) {

        return new Particle(
            pos,
            this.dim.copy(),
            this.offset,
            this.ani_control.createInstance(),
            this.std_anim,
            this.lifetime
        );
    }

}