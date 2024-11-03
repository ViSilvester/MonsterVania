import { Geometry, Vec2 } from "../../libs/FGE/geometry.js";
import { AnimationController } from "../controllers/animationController.js";
import { Game } from "../game.js";
import { Enemy } from "./Enemy.js";
import { Direction, Player } from "./Player.js";
import { Projectile } from "./Projectile.js";

export class Enforcado extends Enemy {

    ani_control_2: AnimationController;
    rope_lenght = Math.floor(Math.random() * 3) + 3;
    initialPos: Vec2
    timer = 0;
    active = false;


    constructor(pos: Vec2, dir: Direction, offset: Vec2, sprite: ImageBitmap) {

        super(pos, dir, offset, sprite);

        this.initialPos = pos.copy();

        this.dim = new Vec2(1, 2);
        this.ani_control = new AnimationController(sprite, new Vec2(16, 32));
        this.ani_control_2 = new AnimationController(sprite, new Vec2(16, 16));

        this.ani_control.addAnim("static", 8, 0, 1);
        this.ani_control_2.addAnim("static", 9, 0, 1);


    }


    update(game: Game): void {

        if (Math.abs(this.pos.x - game.player.pos.x) < 14) {
            if (this.active == false) {
                this.active = true;
            }
        }
        else {
            this.active = false;
            this.timer = 0;
        }

        if (this.active) {

            if (this.pos.y < this.initialPos.y + this.rope_lenght) {

                this.pos.y += 0.05
            }
            else {

                if (this.timer == 0) {

                    var x = this.pos.x + 0.5;
                    var y = this.pos.y + 0.5;

                    var dx = (game.player.pos.x + 0.5) - x;
                    var dy = (game.player.pos.y + 0.6) - y;

                    var dist = Geometry.distVec2(new Vec2(x, y), new Vec2((game.player.pos.x + 0.5), (game.player.pos.y + 0.6)));

                    dx /= dist;
                    dy /= dist;

                    dx *= 0.15;
                    dy *= 0.15;

                    game.p_projectiles.push(new Projectile(new Vec2(x, y), new Vec2(dx, dy), "E2", this.offset, 0, game.player.p_img, "fogo"));

                    this.timer = 70
                }

                this.timer -= 1;

            }
        }
        this.ani_control.update();
        this.ani_control_2.update();
    }

    render(game: Game) {


        for (var i = this.initialPos.y - 1; i < this.pos.y; i++) {

            const rpos = new Vec2((this.pos.x - this.offset.x) * game.tileSize, (this.initialPos.y - this.offset.y) + i * game.tileSize);
            const rdim = new Vec2(game.tileSize, game.tileSize);

            this.ani_control_2.render(game, rpos, rdim);

        }


        super.render(game);

    }
}