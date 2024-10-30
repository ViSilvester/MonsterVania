import { Engine } from "../../libs/FGE/engine.js";
import { Entity } from "../../libs/FGE/entity.js";
import { Vec2 } from "../../libs/FGE/geometry.js";
import { AnimationController } from "../controllers/animationController.js";
import { Game } from "../game.js";
import { Direction } from "./Player.js";
import { Projectile } from "./Projectile.js";

export class Enemy extends Entity {
    refpos: Vec2;
    dim: Vec2;
    vel: Vec2;
    dir: Direction;
    offset: Vec2
    ani_control: AnimationController;
    type: string;
    alive: boolean;
    attack_timer = 40;

    constructor(pos: Vec2, dim: Vec2, vel: Vec2, dir: Direction, offset: Vec2, sprites: ImageBitmap, sprite_dim: Vec2, type: string) {

        super();
        this.pos = pos;
        this.refpos = new Vec2(pos.x, pos.y);
        this.dim = dim;
        this.vel = vel;
        this.dir = dir;
        this.offset = offset;
        this.ani_control = new AnimationController(sprites, sprite_dim);
        this.type = type;
        this.alive = true;


        this.ani_control.addAnim("ghost", 1, 0, 1);
        this.ani_control.addAnim("zombie", 3, 0, 1);
        this.ani_control.addAnim("morcego", 5, 0, 1);

        switch (type) {
            case "ghost":
                this.ani_control.play("ghost");
                break;
            case "zombie":
                this.ani_control.play("zombie");
                vel.x *= 0.5;
                break;
            case "morcego":
                this.ani_control.play("morcego");
                break;
        }
    }

    create(game: Game): void {

    }


    update(game: Game): void {

        this.pos.x += this.vel.x;
        this.pos.y += this.vel.y;
        this.anim_pattern();

        if (this.pos.x > this.offset.x + 30 || this.pos.x < this.offset.x) {
            this.alive = false;
        }

        this.attack(game);

    }

    render(game: Game): void {

        const rpos = new Vec2((this.pos.x - this.offset.x) * game.tileSize, (this.pos.y - this.offset.y) * game.tileSize);
        const rdim = new Vec2(this.dim.x * game.tileSize, this.dim.y * game.tileSize);

        this.ani_control.render(game, rpos, rdim);

    }


    anim_pattern() {

        if (this.type == 'morcego') {
            this.pos.y = this.refpos.y + Math.cos(this.pos.x / 2)
        }

    }

    attack(game: Game) {

        this.attack_timer += 1;

        if (this.attack_timer > 100) {

            this.attack_timer = 0;

            switch (this.type) {

                case "morcego":

                    game.p_projectiles.push(new Projectile(new Vec2(this.pos.x, this.pos.y), new Vec2(-0.15, 0.15), "E1", this.offset, 0));
                    game.p_projectiles.push(new Projectile(new Vec2(this.pos.x, this.pos.y), new Vec2(-0.21, 0), "E1", this.offset, 0));
                    game.p_projectiles.push(new Projectile(new Vec2(this.pos.x, this.pos.y), new Vec2(-0.15, -0.15), "E1", this.offset, 0));

                    break;
            }
        }
    }
}