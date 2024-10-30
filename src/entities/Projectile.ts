import { Engine } from "../../libs/FGE/engine.js";
import { Entity } from "../../libs/FGE/entity.js";
import { Rect, Vec2 } from "../../libs/FGE/geometry.js";
import { AnimationController, animationControllerStatus } from "../controllers/animationController.js";
import { Game } from "../game.js";

export class Projectile extends Entity {

    dim: Vec2;
    vel: Vec2;
    type: string;
    offset: Vec2;
    alive: boolean;
    p_img: ImageBitmap | undefined;
    anicom: AnimationController | undefined;
    gravidade: number

    constructor(pos: Vec2, vel: Vec2, type: string, offset: Vec2, gravidade: number, p_img?: ImageBitmap, animation?: string,) {

        super();
        this.pos = pos;
        this.dim = new Vec2(0.2, 0.2);
        this.vel = vel;
        this.type = type;
        this.offset = offset
        this.alive = true;
        this.p_img = p_img;
        this.gravidade = gravidade;

        if (p_img) {
            this.anicom = new AnimationController(p_img, new Vec2(16, 16));

            this.anicom.addAnim("faca_right", 0, 0, 1,);
            this.anicom.addAnim("faca_left", 1, 0, 1,);
            this.anicom.addAnim("machado_right", 2, 0, 2, 5);
            this.anicom.addAnim("machado_left", 3, 0, 2, 5);
            this.anicom.addAnim("granada_right", 4, 0, 4, 5);
            this.anicom.addAnim("granada_left", 4, 0, 4, 5);
            this.anicom.addAnim("explosao", 5, 0, 5, 4, undefined, "pause");

            if (animation) {
                this.anicom.play(animation);
            }
            else {
                this.anicom.stop();
            }

        }

    }

    create(game: Game): void {


    }
    update(game: Game): void {

        if (!this.alive) {
            return;
        }

        this.pos.x += this.vel.x;
        this.pos.y += this.vel.y;

        //colisão
        if (this.type.charAt(0) == "P") {

            for (var i = 0; i < game.enemies.length; i++) {
                var p = game.enemies[i];
                var rect = new Rect(p.pos, p.dim);
                if (rect.checkIntersect(new Rect(this.pos, this.dim))) {

                    if (this.type != "P4") {
                        this.alive = false;
                    }
                    p.alive = false;

                    if (this.type == "P3") {
                        this.explodir(game, new Vec2(p.pos.x + 0.5, p.pos.y));
                    }
                    if (this.type != "P3" && this.type != "P4") {
                        game.addBlood(this.pos.copy());
                    }

                }
            }

            if (this.type == "P1" || this.type == "P3") {
                var t = game.map.getTile(this.pos.x + 0.5, this.pos.y + 0.5);

                if (t && t.id == 1) {

                    this.alive = false;

                    if (this.type == "P3") {

                        this.explodir(game, this.pos);
                    }
                }
            }

            if (this.type == "P4") {
                if (this.anicom?.getCurrentFrame() == 4) {
                    this.alive = false;
                }
            }
        }


        //deleção por estar na tela
        if (this.pos.x > this.offset.x + 30 || this.pos.x < this.offset.x) {
            this.alive = false;
        }

        this.vel.y += this.gravidade;
        if (this.gravidade != 0 && this.vel.y >= 0.5) {
            this.vel.y = 0.25;
        }

        this.anicom?.update();


    }

    render(game: Game): void {

        const rpos = new Vec2((this.pos.x - this.offset.x) * game.tileSize, (this.pos.y - this.offset.y) * game.tileSize);
        const rdim = new Vec2(1 * game.tileSize, 1 * game.tileSize);

        if (this.anicom) {
            this.anicom.render(game, rpos, rdim);
        }
        else {
            game.draw.fillRect(new Rect(rpos, rdim), 255, 0, 0);
        }



    }


    explodir(game: Game, position: Vec2) {


        for (var i = Math.floor(position.x) - 1; i < Math.floor(position.x) + 2; i++) {
            for (var j = Math.floor(position.y) - 1; j < Math.floor(position.y) + 2; j++) {

                var t2 = game.map.getTile(i, j);

                if (t2 && t2.id != 1) {


                    var explosao = new Projectile(
                        new Vec2(i, j),
                        new Vec2(0, 0),
                        "P4",
                        this.offset,
                        0,
                        this.p_img,
                        "explosao"
                    );
                    game.p_projectiles.push(explosao);
                }
            }
        }
    }

}