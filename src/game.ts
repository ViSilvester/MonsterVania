import { EzIO } from "../libs/FGE/EzIO.js";
import { Engine } from "../libs/FGE/engine.js";
import { Vec2 } from "../libs/FGE/geometry.js";
import { KeybordController } from "../libs/FGE/keyboardController.js";
import { AnimationController } from "./controllers/animationController.js";
import { Enemy } from "./entities/Enemy.js";
import { Particle } from "./entities/Particle.js";
import { Direction, Player } from "./entities/Player.js";
import { Projectile } from "./entities/Projectile.js";
import { TileAtlas, TileData, TileMap } from "./entities/TileMap.js";


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

    }

    async create(): Promise<void> {


        //images

        var tileset = await EzIO.loadImageFromUrl("../assets/images/tileset.png");
        var player_sprite = await EzIO.loadImageFromUrl("../assets/images/player.png")
        this.enemy_sprite = await EzIO.loadImageFromUrl("../assets/images/Enemies.png");
        this.background = await EzIO.loadImageFromUrl("../assets/images/background.png");
        this.midlayer = await EzIO.loadImageFromUrl("../assets/images/mid_layer.png");
        var blood = await EzIO.loadImageFromUrl("../assets/images/blood.png");
        var projectiles = await EzIO.loadImageFromUrl("../assets/images/armas.png");

        // Build Map

        var map_data = await EzIO.loadJsonFromUrl("../data/mapa.json");
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


    }

    update(): void {

        this.player.update(this);

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

        this.spawn_timer += 1;

        if (this.spawn_timer > 100) {
            this.spawn_enemy();
            this.spawn_timer = 0;
        }
    }

    render(): void {

        this.draw.fillBackgroudColor(0, 0, 0);

        this.draw.drawImage(this.background, new Vec2(0, 0), new Vec2(1200, 800), new Vec2(0, 0), new Vec2(1200, 800));
        this.draw.drawImage(this.midlayer, new Vec2(-this.worldOffset.x * 2, 0));

        this.map.render(this);

        this.player.render(this);
        for (var i = 0; i < this.p_projectiles.length; i++) {
            this.p_projectiles[i].render(this);
        }

        for (var i = 0; i < this.enemies.length; i++) {
            this.enemies[i].render(this);
        }

        for (var i = 0; i < this.particles.length; i++) {
            this.particles[i].render(this);
        }
    }

    spawn_enemy() {

        var enemy: Enemy;

        const types = ["morcego", "ghost", "zombie"];
        const type = types[Math.floor(Math.random() * types.length)];

        var posy: number


        switch (type) {
            case "ghost":
                posy = 16;
                break;
            case "zombie":
                posy = 16;
                break;
            case "morcego":
                posy = 14 + (Math.random() * 6) - 3;
                break;
            default:
                posy = 16;
                break;
        }


        enemy = new Enemy(
            new Vec2(this.worldOffset.x + 30, posy),
            new Vec2(1, 2),
            new Vec2(-0.1, 0),
            Direction.left,
            this.worldOffset,
            this.enemy_sprite,
            new Vec2(16, 32),
            type
        )

        this.enemies.push(enemy);

    }

    addBlood(pos: Vec2) {
        var p = this.blood_particle.create_instance(pos)
        this.particles.push(p);

    }

}