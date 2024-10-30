import { Draw } from "./draw.js";
import { Entity } from "./entity.js";

export abstract class Engine {

    //Definições
    draw: Draw;
    entities: Array<Entity>;

    //Variaveis
    private last_frame_time?: number;
    private deltaTime?: number;
    private FPS: number = 0;


    constructor(canvasId: string) {
        this.draw = new Draw(canvasId);
        this.entities = [];
    }

    get getFPS() { return this.FPS; }
    get getDeltaTime() { return this.deltaTime }

    async create() {

    }

    abstract update(): void;

    abstract render(): void;

    private mainLoop() {

        let now = Date.now();

        if (this.last_frame_time) {
            this.deltaTime = (now - this.last_frame_time);
            this.FPS = Math.round(1000 / this.deltaTime);
        }

        requestAnimationFrame(() => {
            this.update();
            this.render();
            this.mainLoop();
        })

        this.last_frame_time = now;
    }

    async run() {
        await this.create();
        this.mainLoop();
    }

}
