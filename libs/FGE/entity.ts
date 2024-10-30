import { Engine } from "./engine.js";
import { Vec2 } from "./geometry.js";

export abstract class Entity {

    pos: Vec2 = new Vec2(0, 0);

    abstract create(engine: Engine): void;

    abstract update(engine: Engine): void;

    abstract render(engine: Engine): void;

}