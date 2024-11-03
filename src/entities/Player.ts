import { Entity } from "../../libs/FGE/entity.js";
import { Rect, Vec2 } from "../../libs/FGE/geometry.js";
import { KeybordController } from "../../libs/FGE/keyboardController.js";
import { AnimationController } from "../controllers/animationController.js";
import { Game } from "../game.js";
import { Projectile } from "./Projectile.js";
import { TileData } from "./TileMap.js";

export class Player extends Entity {


    dir: Direction;
    dim: Vec2;
    vel: Vec2;
    offset: Vec2;
    status: PlayerStatus;
    ani_control: AnimationController;
    onground = true;
    p_img: ImageBitmap;
    selected_weapon = "faca";
    colisionBox: Rect;
    anim_timer = 400;

    score = 0;
    vida = 20;

    damagecolldowntimer = 0;



    constructor(sprite: ImageBitmap, p_img: ImageBitmap, offset: Vec2) {
        super();
        this.pos.x = 15;
        this.pos.y = 16;
        this.dir = Direction.right;
        this.dim = new Vec2(1, 2);
        this.vel = new Vec2(0, 0);
        this.offset = offset;
        this.status = PlayerStatus.idle;
        this.p_img = p_img;
        this.ani_control = new AnimationController(sprite, new Vec2(16, 32));
        this.colisionBox = new Rect(new Vec2(0.2, 0), new Vec2(0.6, 2))

        this.ani_control.addAnim("idle_right", 0, 0, 1);
        this.ani_control.addAnim("idle_left", 1, 0, 1);

        this.ani_control.addAnim("walk_right", 2, 0, 2, 15);
        this.ani_control.addAnim("walk_left", 3, 0, 2, 15);

        this.ani_control.addAnim("crouch_right", 4, 0, 1);
        this.ani_control.addAnim("crouch_left", 5, 0, 1);

        this.ani_control.play("idle_right");


    }

    create(): void {

    }

    update(game: Game): void {

        this.ani_control.update();

        if (this.status == PlayerStatus.dead) {

            game.soundController.pause("level_song");

            if (this.anim_timer == 300) {
                this.damagecolldowntimer = 0;
            }
            else if (this.anim_timer == 1) {
                game.restartGame();
            }
            this.anim_timer -= 1;

            return;
        }

        if (KeybordController.getKeyState('S') && this.status != PlayerStatus.jumping) {
            this.vel.x = 0;
            if (this.dir == Direction.left) {
                this.ani_control.play("crouch_left");
            }
            else {
                this.ani_control.play("crouch_right");
            }
            this.status = PlayerStatus.crouch;
        }
        else if (KeybordController.getKeyState('A')) {
            this.vel.x = -0.08;
            this.dir = Direction.left;
            this.ani_control.play("walk_left");
            this.status = PlayerStatus.walking;

        }
        else if (KeybordController.getKeyState('D')) {
            this.vel.x = 0.08;
            this.dir = Direction.right;
            this.ani_control.play("walk_right");
            this.status = PlayerStatus.walking;
        }
        else {
            this.vel.x = 0;
            if (this.dir == Direction.left) {
                this.ani_control.play("idle_left");
            }
            else {
                this.ani_control.play("idle_right");
            }
            if (this.onground) {
                this.status = PlayerStatus.idle;
            }
        }

        if (KeybordController.getKeyPress('K') && this.status != PlayerStatus.crouch && this.onground) {
            this.vel.y = -0.275;
            this.status = PlayerStatus.jumping;
        }

        if (KeybordController.getKeyPress('J')) {
            this.attack(game);
        }

        if (KeybordController.getKeyPress("shift")) {
            if (this.selected_weapon == "faca") {
                this.selected_weapon = "machado";
            }
            else if (this.selected_weapon == "machado") {
                this.selected_weapon = "granada";
            }
            else if (this.selected_weapon == "granada") {
                this.selected_weapon = "faca";
            }
        }


        if (this.status == PlayerStatus.crouch) {
            this.colisionBox = new Rect(new Vec2(0.2, 1), new Vec2(0.6, 1));
        }
        else {
            this.colisionBox = new Rect(new Vec2(0.2, 0), new Vec2(0.6, 2));
        }

        this.vel.y += 0.017;

        if (this.vel.y > 0.8) {
            this.vel.y = 0.8;
        }

        var oldPos = this.pos.copy();

        this.pos.x += this.vel.x;
        this.pos.y += this.vel.y;

        //scroll

        if (this.pos.x > 15 && this.offset.x < game.map_width - 31) {
            this.offset.x = this.pos.x - 15;
        }

        if (this.offset.x < 0) {
            this.offset.x = 0;
        }

        if (this.offset.x >= game.map_width - 31) {
            this.offset.x = game.map_width - 31;
        }

        this.solveMapColision(game, oldPos);

        if (KeybordController.getKeyPress("Y")) {

            //this.pos.x = 483;
            //this.pos.x = 324;
            //this.pos.x = 245;
        }

        this.calcDamage(game);

        if (this.damagecolldowntimer > 0) {
            this.damagecolldowntimer -= 1;
        }

    }

    render(game: Game): void {

        if (this.damagecolldowntimer == 0 || (this.damagecolldowntimer > 0 && (this.damagecolldowntimer % 10) > 5)) {

            const rpos = new Vec2((this.pos.x - this.offset.x) * game.tileSize, (this.pos.y - this.offset.y) * game.tileSize);
            const rdim = new Vec2(this.dim.x * game.tileSize, this.dim.y * game.tileSize);

            this.ani_control.render(game, rpos, rdim);

        }

    }

    attack(game: Game) {



        var spawn_point = new Vec2(this.dir == Direction.left ? this.pos.x - 0.2 : this.pos.x + 0.2, this.status == PlayerStatus.crouch ? this.pos.y + 0.7 : this.pos.y);
        var vel = new Vec2(this.dir == Direction.left ? -0.5 : 0.5, 0);


        var g = 0;
        var n = "1";
        if (this.selected_weapon == "machado") {
            g = 0.02;
            vel = new Vec2((this.dir == Direction.left ? -0.25 : 0.25), -0.4);
            n = "2";
            game.soundController.play("attack_machado");

        }
        else if (this.selected_weapon == "granada") {
            g = 0.01;
            vel = new Vec2((this.dir == Direction.left ? -0.2 : 0.2), -0.08);
            n = "3";
            game.soundController.play("attack");

        }
        else {
            game.soundController.play("attack");

        }

        game.p_projectiles.push(new Projectile(spawn_point, vel, "P" + n, this.offset, g, this.p_img, this.selected_weapon + (this.dir == Direction.left ? "_left" : "_right")));

    }


    solveMapColision(game: Game, oldPos: Vec2) {

        var newPos = this.pos.copy();
        var groundPoints: Array<TileData> = [];

        // chão

        groundPoints = [];

        groundPoints.push(game.map.getTile(oldPos.x + 0.2, this.pos.y + 1.99));
        groundPoints.push(game.map.getTile(oldPos.x + 0.8, this.pos.y + 1.99));

        this.onground = false;

        for (var i = 0; i < groundPoints.length; i++) {
            if (groundPoints[i] && groundPoints[i].id == 1) {
                newPos.y = Math.floor(this.pos.y + 2) - 2;
                this.onground = true;
                if (this.vel.y > 0) {
                    this.vel.y = 0;
                }
            }
        }

        // parede a direita

        groundPoints = [];

        groundPoints.push(game.map.getTile(this.pos.x + 0.85, newPos.y + 1.5));
        groundPoints.push(game.map.getTile(this.pos.x + 0.85, newPos.y + 1.99));


        for (var i = 0; i < groundPoints.length; i++) {
            if (groundPoints[i] && groundPoints[i].id == 1) {
                newPos.x = Math.floor(this.pos.x) + 0.15;
            }
        }

        // parede a esquerda

        groundPoints = [];

        groundPoints.push(game.map.getTile(this.pos.x + 0.2, newPos.y + 1.5));
        groundPoints.push(game.map.getTile(this.pos.x + 0.2, newPos.y + 1.99));


        for (var i = 0; i < groundPoints.length; i++) {
            if (groundPoints[i] && groundPoints[i].id == 1) {
                newPos.x = Math.floor(this.pos.x + 1) - 0.2;
            }
        }

        this.pos = newPos;
    }


    calcDamage(game: Game) {

        for (var i = 0; i < game.enemies.length; i++) {

            if (this.damagecolldowntimer == 0) {

                var e = game.enemies[i];

                var r = this.colisionBox.copy();
                r.pos.x = (this.pos.x + r.pos.x);
                r.pos.y = (this.pos.y + r.pos.y);
                r.dim.x = r.dim.x;
                r.dim.y = r.dim.y;

                if (r.checkIntersect(e.getColisionBox())) {

                    //e.alive = false;
                    this.vida -= 3;
                    this.damagecolldowntimer = 100;
                    game.soundController.play("hit");

                    if (this.vida <= 0) {
                        this.vida = 0;
                        this.status = PlayerStatus.dead;

                        setTimeout(() => { game.soundController.play("you_dead"); }, 2000)

                    }
                }

            }
        }


        for (var i = 0; i < game.p_projectiles.length; i++) {

            if (this.damagecolldowntimer == 0) {

                var p = game.p_projectiles[i];

                if (p.type.charAt(0) == 'E') {

                    var r = this.colisionBox.copy();
                    r.pos.x = (this.pos.x + r.pos.x);
                    r.pos.y = (this.pos.y + r.pos.y);
                    r.dim.x = r.dim.x;
                    r.dim.y = r.dim.y;

                    if (r.checkIntersect(p.getColisionBox())) {

                        p.alive = false;
                        this.vida -= Number(p.type.charAt(1));
                        this.damagecolldowntimer = 100;
                        game.soundController.play("hit");

                        if (this.vida <= 0) {
                            this.vida = 0;
                            this.status = PlayerStatus.dead;
                            setTimeout(() => { game.soundController.play("you_dead"); }, 2000)
                        }
                    }
                }
            }
        }

        if (this.pos.y > 20) {
            this.status = PlayerStatus.dead;
            setTimeout(() => { game.soundController.play("you_dead"); }, 2000)
        }
    }
}

export enum PlayerStatus {
    idle,
    static,
    walking,
    jumping,
    attacking,
    crouch,
    dead,
}


export class PlayerStats {

    max_hp = 100;
    max_mp = 100;
    max_exp = 100;
    max_gold = 100;
    def = 10;
    atk = 10;
    mag = 10;

}

export enum Direction {
    up = "up", down = "down", left = "left", right = "right"
}   