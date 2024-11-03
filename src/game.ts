import { EzIO } from "../libs/FGE/EzIO.js";
import { Engine } from "../libs/FGE/engine.js";
import { Rect, Vec2 } from "../libs/FGE/geometry.js";
import { KeybordController } from "../libs/FGE/keyboardController.js";
import { SoundController } from "../libs/FGE/soundController.js";
import { AnimationController } from "./controllers/animationController.js";
import { Boss } from "./entities/Boss.js";
import { Enemy } from "./entities/Enemy.js";
import { Enforcado } from "./entities/Enforcado.js";
import { Morcego } from "./entities/Morcego.js";
import { Particle } from "./entities/Particle.js";
import { Direction, Player, PlayerStatus } from "./entities/Player.js";
import { Projectile } from "./entities/Projectile.js";
import { TileAtlas, TileData, TileMap } from "./entities/TileMap.js";
import { Zombie } from "./entities/Zombie.js";
import { Pumkin } from "./entities/pumpkin.js";


export class Game extends Engine {


    map!: TileMap;
    player!: Player

    worldOffset = new Vec2(0, 0);
    gamestatus = "running";
    tileSize = 40;
    p_projectiles: Array<Projectile> = [];
    enemies: Array<Enemy> = [];
    particles: Array<Particle> = []
    blood_particle!: Particle;
    spawn_timer = 0;
    map_width!: number;
    boss!: Boss;
    soundController: SoundController;


    enemy_sprite!: ImageBitmap;
    background!: ImageBitmap;
    midlayer!: ImageBitmap;


    readonly screen_w = 30;
    readonly screen_h = 20;


    constructor(canvasId: string) {

        super(canvasId);

        this.draw.getContext().webkitImageSmoothingEnabled = false;
        this.draw.getContext().mozImageSmoothingEnabled = false;
        this.draw.getContext().imageSmoothingEnabled = false;

        this.draw.getContext().save();

        KeybordController.startKeybordListner();
        this.soundController = new SoundController();

    }

    restartGame() {

        this.player = new Player(this.player.ani_control.tileset, this.player.p_img, this.worldOffset);

        this.enemies = [];
        this.particles = [];
        this.p_projectiles = [];

        this.worldOffset.x = this.worldOffset.y = 0;

        this.enemies.push(new Morcego(new Vec2(132, 12), Direction.left, this.worldOffset, this.enemy_sprite));
        this.enemies.push(new Morcego(new Vec2(139, 11), Direction.left, this.worldOffset, this.enemy_sprite));
        this.enemies.push(new Morcego(new Vec2(150, 6), Direction.left, this.worldOffset, this.enemy_sprite));
        this.enemies.push(new Morcego(new Vec2(165, 6), Direction.left, this.worldOffset, this.enemy_sprite));
        this.enemies.push(new Morcego(new Vec2(172, 10), Direction.left, this.worldOffset, this.enemy_sprite));

        this.enemies.push(new Pumkin(new Vec2(350, 17), Direction.left, this.worldOffset, this.enemy_sprite));
        this.enemies.push(new Pumkin(new Vec2(350 + 20, 17), Direction.left, this.worldOffset, this.enemy_sprite));
        this.enemies.push(new Pumkin(new Vec2(350 + 40, 17), Direction.left, this.worldOffset, this.enemy_sprite));
        this.enemies.push(new Pumkin(new Vec2(350 + 60, 17), Direction.left, this.worldOffset, this.enemy_sprite));
        this.enemies.push(new Pumkin(new Vec2(350 + 70, 17), Direction.left, this.worldOffset, this.enemy_sprite));
        this.enemies.push(new Pumkin(new Vec2(350 + 72, 17), Direction.left, this.worldOffset, this.enemy_sprite));

        this.enemies.push(new Enforcado(new Vec2(260, 8), Direction.left, this.worldOffset, this.enemy_sprite));
        this.enemies.push(new Enforcado(new Vec2(260 + 10, 6), Direction.left, this.worldOffset, this.enemy_sprite));
        this.enemies.push(new Enforcado(new Vec2(260 + 20, 7), Direction.left, this.worldOffset, this.enemy_sprite));
        this.enemies.push(new Enforcado(new Vec2(260 + 30, 9), Direction.left, this.worldOffset, this.enemy_sprite));
        this.enemies.push(new Enforcado(new Vec2(260 + 35, 8), Direction.left, this.worldOffset, this.enemy_sprite));
        this.enemies.push(new Enforcado(new Vec2(260 + 40, 6), Direction.left, this.worldOffset, this.enemy_sprite));

        this.boss = new Boss(this.boss.ani_control.tileset, this.worldOffset);

        this.soundController.play("level_song");


    }

    async create(): Promise<void> {

        //loading screen

        this.draw.fillBackgroudColor(0, 0, 0);

        this.draw.fillText("LOADING...", new Vec2(0, 800 - this.tileSize), 255, 255, 255, this.tileSize + "px Consolas")

        //images

        var tileset = await EzIO.loadImageFromUrl("./assets/images/tileset.png");
        var player_sprite = await EzIO.loadImageFromUrl("./assets/images/player.png")
        this.enemy_sprite = await EzIO.loadImageFromUrl("./assets/images/Enemies.png");
        this.background = await EzIO.loadImageFromUrl("./assets/images/background.png");
        this.midlayer = await EzIO.loadImageFromUrl("./assets/images/mid_layer.png");
        var blood = await EzIO.loadImageFromUrl("./assets/images/blood.png");
        var projectiles = await EzIO.loadImageFromUrl("./assets/images/armas.png");
        var boss = await EzIO.loadImageFromUrl("./assets/images/boss_2.png");

        //sound

        this.soundController.addSound("risada", "./assets/sounds/risada.ogg");
        this.soundController.addSound("boss_defeated", "./assets/sounds/boss_defeated.ogg");
        this.soundController.addSound("level_song", "./assets/sounds/level_song.ogg", true);
        this.soundController.addSound("hit", "./assets/sounds/hit.ogg");
        this.soundController.addSound("explode", "./assets/sounds/explode.ogg");
        this.soundController.addSound("attack", "./assets/sounds/attack.ogg");
        this.soundController.addSound("attack_machado", "./assets/sounds/attack_machado.ogg");
        this.soundController.addSound("you_dead", "./assets/sounds/you_dead.ogg");
        this.soundController.addSound("victory", "./assets/sounds/victory.ogg");

        this.soundController.play("level_song");

        // Build Map

        var map_data = await EzIO.loadJsonFromUrl("./data/mapa.json");
        var tiles = map_data.layers[0].data;
        this.map_width = map_data.width;
        var tileData: Array<TileData> = [];

        for (var i = 0; i < tiles.length; i++) {
            tileData.push(new TileData(tiles[i] - 1, undefined));
        }

        var atlas = new TileAtlas(tileset, 16, new Vec2(0, 0));
        this.map = new TileMap(this.map_width, 20, this.worldOffset, tileData, atlas, new Vec2(30, 20));

        //player
        this.player = new Player(player_sprite, projectiles, this.worldOffset);


        //blood

        var blood_controller = new AnimationController(
            blood,
            new Vec2(32, 32)
        )

        blood_controller.addAnim("std", 0, 0, 5, 5, undefined, "pause");

        this.blood_particle = new Particle(
            new Vec2(0, 0),
            new Vec2(1, 1),
            this.worldOffset,
            blood_controller,
            "std",
            25
        )

        //static enemies

        this.enemies.push(new Morcego(new Vec2(132, 12), Direction.left, this.worldOffset, this.enemy_sprite));
        this.enemies.push(new Morcego(new Vec2(139, 11), Direction.left, this.worldOffset, this.enemy_sprite));
        this.enemies.push(new Morcego(new Vec2(150, 6), Direction.left, this.worldOffset, this.enemy_sprite));
        this.enemies.push(new Morcego(new Vec2(165, 6), Direction.left, this.worldOffset, this.enemy_sprite));
        this.enemies.push(new Morcego(new Vec2(172, 10), Direction.left, this.worldOffset, this.enemy_sprite));

        this.enemies.push(new Pumkin(new Vec2(350, 17), Direction.left, this.worldOffset, this.enemy_sprite));
        this.enemies.push(new Pumkin(new Vec2(350 + 20, 17), Direction.left, this.worldOffset, this.enemy_sprite));
        this.enemies.push(new Pumkin(new Vec2(350 + 40, 17), Direction.left, this.worldOffset, this.enemy_sprite));
        this.enemies.push(new Pumkin(new Vec2(350 + 60, 17), Direction.left, this.worldOffset, this.enemy_sprite));
        this.enemies.push(new Pumkin(new Vec2(350 + 70, 17), Direction.left, this.worldOffset, this.enemy_sprite));
        this.enemies.push(new Pumkin(new Vec2(350 + 72, 17), Direction.left, this.worldOffset, this.enemy_sprite));

        this.enemies.push(new Enforcado(new Vec2(260, 8), Direction.left, this.worldOffset, this.enemy_sprite));
        this.enemies.push(new Enforcado(new Vec2(260 + 10, 6), Direction.left, this.worldOffset, this.enemy_sprite));
        this.enemies.push(new Enforcado(new Vec2(260 + 20, 7), Direction.left, this.worldOffset, this.enemy_sprite));
        this.enemies.push(new Enforcado(new Vec2(260 + 30, 9), Direction.left, this.worldOffset, this.enemy_sprite));
        this.enemies.push(new Enforcado(new Vec2(260 + 35, 8), Direction.left, this.worldOffset, this.enemy_sprite));
        this.enemies.push(new Enforcado(new Vec2(260 + 40, 6), Direction.left, this.worldOffset, this.enemy_sprite));



        //boss
        this.boss = new Boss(boss, this.worldOffset);


    }

    update(): void {

        this.player.update(this);

        if (this.player.status == PlayerStatus.dead) {
            return;
        }

        // projeteis
        for (var i = 0; i < this.p_projectiles.length; i++) {
            this.p_projectiles[i].update(this);
        }

        for (var i = 0; i < this.p_projectiles.length; i++) {
            if (!this.p_projectiles[i].alive) {
                this.p_projectiles.splice(i, 1);
                i--;
            }
        }

        // inimigos
        for (var i = 0; i < this.enemies.length; i++) {
            this.enemies[i].update(this);
        }

        for (var i = 0; i < this.enemies.length; i++) {
            if (!this.enemies[i].alive) {
                this.enemies.splice(i, 1);
                i--;
            }
        }

        //chefe
        if (this.boss.active) {
            this.boss.update(this);
        }

        //particulas
        for (var i = 0; i < this.particles.length; i++) {
            this.particles[i].update(this);
        }

        for (var i = 0; i < this.particles.length; i++) {
            if (!this.particles[i].alive) {
                this.particles.splice(i, 1);
                i--;
            }
        }

        this.spawn_enemy();

    }

    render(): void {

        this.draw.fillBackgroudColor(0, 0, 0);

        this.draw.drawImage(this.background, new Vec2(0, 0), new Vec2(1200, 800), new Vec2(0, 0), new Vec2(1200, 800));
        this.draw.drawImage(this.midlayer, new Vec2(-this.worldOffset.x * 2, 0));

        this.map.render(this);

        this.renderPlayerUi();

        this.player.render(this);
        for (var i = 0; i < this.p_projectiles.length; i++) {
            this.p_projectiles[i].render(this);
        }

        for (var i = 0; i < this.enemies.length; i++) {
            this.enemies[i].render(this);
        }

        if (this.boss.active) {
            this.boss.render(this);
        }

        for (var i = 0; i < this.particles.length; i++) {
            this.particles[i].render(this);
        }

        if (KeybordController.getKeyPress("M")) {
            this.soundController.play_pause("level_song");
        }

    }

    spawn_enemy() {

        if (this.spawn_timer == 0) {

            //section 1
            if (this.worldOffset.x > 18 && this.worldOffset.x < 100) {


                this.spawn_timer = 300;

                var y = this.player.pos.y < 15 ? 15 : 16

                this.enemies.push(
                    new Enemy(
                        new Vec2(this.worldOffset.x + 30, y),
                        Direction.left,
                        this.worldOffset,
                        this.enemy_sprite
                    )
                );

                this.enemies.push(
                    new Enemy(
                        new Vec2(this.worldOffset.x + 29, y),
                        Direction.left,
                        this.worldOffset,
                        this.enemy_sprite
                    )
                );

                this.enemies.push(
                    new Enemy(
                        new Vec2(this.worldOffset.x + 28, y),
                        Direction.left,
                        this.worldOffset,
                        this.enemy_sprite
                    )
                );
            }


            //section 2
            if (this.worldOffset.x > 180 && this.worldOffset.x < 220) {


                this.spawn_timer = 30 + Math.floor(Math.random() * 20);



                var dir = this.player.dir == Direction.right ? Direction.left : Direction.right


                this.enemies.push(
                    new Zombie(
                        new Vec2(dir == Direction.left ? this.worldOffset.x + 30 : this.worldOffset.x + 1, 16),
                        Direction.left,
                        this.worldOffset,
                        this.enemy_sprite
                    )
                );

            }

            //boss
            if (this.worldOffset.x >= 469 && this.boss.hp > 0) {

                this.boss.active = true;
            }
        }
        else {
            this.spawn_timer -= 1;
        }


    }

    addBlood(pos: Vec2) {
        var p = this.blood_particle.create_instance(pos)
        this.particles.push(p);

    }

    renderPlayerUi() {

        const fontsize = this.tileSize * 0.75;
        const font = fontsize + "px Press_Start_2p";
        this.draw.fillText("SCORE=" + this.player.score.toString().padStart(6, '0') + "                WEAPON", new Vec2(0, 0), 255, 255, 255, font);
        this.draw.fillText("PLAYER", new Vec2(0, this.tileSize), 255, 255, 255, font);
        this.draw.fillText("█".repeat(this.player.vida), new Vec2(fontsize * 7, this.tileSize + 1), 255, 170, 150, fontsize - 2 + "px Verdana");
        this.draw.fillText("ENEMY", new Vec2(0, this.tileSize * 2), 255, 255, 255, font);
        this.draw.fillText("█".repeat(this.boss.hp), new Vec2(fontsize * 7, (this.tileSize * 2 + 1)), 255, 170, 150, fontsize - 2 + "px Verdana");

        var pos = new Vec2(fontsize * 29, fontsize);
        var dim = new Vec2(this.tileSize * 3, this.tileSize * 2.5);

        var pos2 = new Vec2(pos.x + 5, pos.y + 5);
        var dim2 = new Vec2(dim.x - 10, dim.y - 10);

        this.draw.fillRect(new Rect(pos, dim), 225, 0, 0);
        this.draw.fillRect(new Rect(pos2, dim2), 0, 0, 0);

        switch (this.player.selected_weapon) {
            case 'faca':
                this.draw.drawImage(this.player.p_img, pos2, dim2, new Vec2(0, 0), new Vec2(16, 16));
                break;
            case 'machado':
                this.draw.drawImage(this.player.p_img, pos2, dim2, new Vec2(32, 0), new Vec2(16, 16));
                break;
            case 'granada':
                this.draw.drawImage(this.player.p_img, pos2, dim2, new Vec2(64, 0), new Vec2(16, 16));
                break;
        }
    }

}