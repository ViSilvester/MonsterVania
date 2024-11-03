import { Engine } from "../../libs/FGE/engine.js";
import { Entity } from "../../libs/FGE/entity.js";
import { Rect, Vec2 } from "../../libs/FGE/geometry.js";
import { AnimationController } from "../controllers/animationController.js";
import { Game } from "../game.js";
import { Projectile } from "./Projectile.js";

export class Boss extends Entity {

    dim = new Vec2(3, 3)
    colisionBox = new Rect(new Vec2(2, 0), new Vec2(2, 3));
    ani_control: AnimationController;
    offset: Vec2;
    state = 0;
    timer = 200;
    killable = false;
    active = false;
    hp = 20;
    damagecolldowntimer = 10;


    constructor(tileset: ImageBitmap, offset: Vec2) {
        super()
        this.pos = new Vec2(482.5, 6);
        this.ani_control = new AnimationController(tileset, new Vec2(48, 48));
        this.offset = offset;

        this.ani_control.addAnim("static", 0, 0, 1,);
        this.ani_control.addAnim("attack_right", 1, 0, 2, undefined, undefined, "pause");
        this.ani_control.addAnim("attack_left", 2, 0, 2, undefined, undefined, "pause");
        this.ani_control.addAnim("fade_in", 3, 0, 4, undefined, undefined, "pause");
        this.ani_control.addAnim("fade_off", 4, 0, 4, undefined, undefined, "pause");
        this.ani_control.addAnim("attack_center", 5, 0, 2,);
    }

    create(game: Game): void {

    }

    update(game: Game): void {


        if (this.active) {

            switch (this.state) {
                case 0:
                    this.state_0(game);
                    break;
                case 1:
                    this.state_1(game);
                    break;
                case 2:
                    this.state_2(game);
                    break;
                case 3:
                    this.state_3(game);
                    break;
                case 4:
                    this.state_4(game);
                    break;
            }

            if (this.timer > 0) {
                this.timer -= 1;
            }

            if (this.damagecolldowntimer > 0) {
                this.damagecolldowntimer -= 1;
            }
        }

        this.ani_control.update();
        this.calcDamage(game);

        //console.log(this.ani_control.playback_status)
    }


    render(game: Game): void {

        if (this.damagecolldowntimer == 0 || (this.damagecolldowntimer > 0 && (this.damagecolldowntimer % 10) > 5)) {

            const rpos = new Vec2((this.pos.x - this.offset.x) * game.tileSize, (this.pos.y - this.offset.y) * game.tileSize);
            const rdim = new Vec2(this.dim.x * game.tileSize, this.dim.y * game.tileSize);
            this.ani_control.render(game, rpos, rdim);

        }



        // var r = this.colisionBox.copy();
        // r.pos.x = (this.pos.x + r.pos.x - this.offset.x) * game.tileSize;
        // r.pos.y = (this.pos.y + r.pos.y - this.offset.y) * game.tileSize;
        // r.dim.x = r.dim.x * game.tileSize;
        // r.dim.y = r.dim.y * game.tileSize;

        // game.draw.fillRect(r, 255, 0, 0);

    }


    state_0(game: Game) {

        if (this.timer == 200) {
            this.colisionBox = new Rect(new Vec2(1, 0), new Vec2(1, 3));
            this.ani_control.play("fade_in");
        }
        else if (this.timer == 150) {
            game.soundController.play("risada");
        }
        else if (this.timer == 100) {
            this.ani_control.play("fade_off");
        }
        else if (this.timer == 0) {
            this.state = Math.random() > 0.5 ? 1 : 2;
            this.timer = 401;
        }
    }

    state_1(game: Game) {

        if (this.timer == 400) {
            this.pos = new Vec2(495, 15);
            this.colisionBox = new Rect(new Vec2(1, 0), new Vec2(2, 3));
            this.ani_control.play("fade_in");
        }
        else if (this.timer == 300) {
            this.ani_control.play("attack_left");
            this.killable = true;
        }
        else if (this.timer < 300 && this.timer > 100) {
            if (this.timer % 30 == 0) {
                game.p_projectiles.push(
                    new Projectile(
                        new Vec2(
                            this.pos.x,
                            Math.random() > 0.6 ? 15.5 : 17
                        ),
                        new Vec2(-0.12, 0),
                        "E3",
                        this.offset,
                        0,
                        game.player.p_img,
                        "fogo"
                    )
                );
            }
        }
        else if (this.timer == 100) {
            this.ani_control.play("fade_off");
            this.killable = false;
        }
        else if (this.timer == 0) {
            this.state = Math.random() > 0.6 ? 2 : 3;
            this.timer = 401;
        }

    }

    state_2(game: Game) {

        if (this.timer == 400) {
            this.pos = new Vec2(470, 15);
            this.colisionBox = new Rect(new Vec2(0, 0), new Vec2(2, 3));
            this.ani_control.play("fade_in");
        }
        else if (this.timer == 300) {
            this.ani_control.play("attack_right");
            this.killable = true;
        }
        else if (this.timer < 300 && this.timer > 100) {
            if (this.timer % 40 == 0) {
                game.p_projectiles.push(
                    new Projectile(
                        new Vec2(
                            this.pos.x,
                            Math.random() > 0.6 ? 15.5 : 17
                        ),
                        new Vec2(0.12, 0),
                        "E3",
                        this.offset,
                        0,
                        game.player.p_img,
                        "fogo",
                    )
                );
            }
        }
        else if (this.timer == 100) {
            this.ani_control.play("fade_off");
            this.killable = false;
        }
        else if (this.timer == 0) {
            this.state = Math.random() > 0.6 ? 1 : 3;
            this.timer = 401;
        }

    }


    state_3(game: Game) {

        if (this.timer == 400) {
            this.pos = new Vec2(482.5, 8);
            this.colisionBox = new Rect(new Vec2(0.5, 0.5), new Vec2(2, 2));
            this.ani_control.play("fade_in");
        }
        else if (this.timer == 300) {
            this.ani_control.play("attack_center");
            this.killable = true;

        }
        else if ((this.timer < 300 && this.timer > 200) || (this.timer < 200 && this.timer > 100)) {


            var angle = 0;
            var p = 5;

            if (this.timer % 40 == 0) {


                var rf = Math.random() > 0.5;

                if (rf) {
                    angle = 3.14156 + 3.14156 / 2
                    p = 5;
                }
                else {
                    angle = 3.14156 + 3.14156 / 2.2
                    p = 6;
                }

                for (var i = 0; i < p; i++) {
                    angle += 3.14156 / 6

                    var x = Math.sin(angle) * 0.1;
                    var y = Math.cos(angle) * 0.1;

                    game.p_projectiles.push(
                        new Projectile(new Vec2(this.pos.x + 1, this.pos.y + 1.5),
                            new Vec2(x, y),
                            "E3",
                            this.offset,
                            0,
                            game.player.p_img,
                            "fogo"
                        )
                    );
                }
            }

        }
        else if (this.timer == 100) {
            this.ani_control.play("fade_off");
            this.killable = false;
        }
        else if (this.timer == 0) {
            this.state = Math.random() > 0.5 ? 1 : 2;
            this.timer = 401;
        }

    }
    state_4(game: Game) {

        if (this.timer >= 400) {
            this.ani_control.play("fade_out");
        }
        else if (this.timer == 300) {
            this.pos = new Vec2(482.5, 6);
            this.ani_control.play("fade_in")
            game.soundController.pause("level_song");
        }
        else if (this.timer == 350) {
            this.ani_control.play("static")
        }
        else if (this.timer < 300 && this.timer > 0) {

            if (this.timer == 50) {

            }

            if (this.timer == 100) {
                this.damagecolldowntimer = 1000;
                game.soundController.play("boss_defeated");
            }

            if (this.timer % 20 == 0) {
                game.soundController.play("hit");
                var ppos = new Vec2(this.pos.x + (Math.random() * 2), this.pos.y + (Math.random() * 2));
                game.particles.push(game.blood_particle.create_instance(ppos));
            }
        }

        else if (this.timer == 0) {
            this.active = false;
            setTimeout(() => { game.soundController.play("victory") }, 1000);
            setTimeout(() => { game.restartGame() }, 10000);
        }



    }

    calcDamage(game: Game) {

        if (this.killable) {

            for (var i = 0; i < game.p_projectiles.length; i++) {

                if (this.damagecolldowntimer == 0) {

                    var p = game.p_projectiles[i];
                    if (p.type.charAt(0) == 'P') {

                        var r = this.colisionBox.copy();
                        r.pos.x = (this.pos.x + r.pos.x);
                        r.pos.y = (this.pos.y + r.pos.y);
                        r.dim.x = r.dim.x;
                        r.dim.y = r.dim.y;

                        if (r.checkIntersect(p.getColisionBox())) {

                            p.alive = false;
                            game.soundController.play("hit");

                            switch (p.type) {

                                case "P1":
                                    this.hp -= 1;
                                    this.damagecolldowntimer = 120;
                                    break;
                                case "P2":
                                    this.hp -= 2;
                                    this.damagecolldowntimer = 120;
                                    break;
                                case "P3":
                                    p.explodir(game, new Vec2(this.pos.x + 1.5, this.pos.y + 1.5))
                                    break;
                                case "P4":
                                    this.hp -= 3;
                                    this.damagecolldowntimer = 150;
                                    break;
                            }

                            if (this.hp <= 0) {
                                this.hp = 0;
                                this.timer = 401;
                                this.state = 4;
                            }
                        }
                    }
                }
            }
        }
    }
}