import { Engine } from "../../../libs/FGE/engine.js";
import { ScrollDirection, UiContainer } from "../../../libs/FGE/FUI.js";
import { Vec2 } from "../../../libs/FGE/geometry.js";
import { Game } from "../../game.js";
import { Label } from "./Label.js";

export class MainMenu extends UiContainer {


    constructor(tilesize: number) {
        super(
            new Vec2(0, 0),
            new Vec2(100, 100),
            ScrollDirection.vertical,
            []
        );

        this.children = [

            new UiContainer(
                this.pos,
                this.dim,
                ScrollDirection.horizontal,
                [
                    new Label(new Vec2(0, 0), new Vec2(10, 10), this, " A ", tilesize),
                    new Label(new Vec2(0, 0), new Vec2(10, 10), this, " B ", tilesize),
                    new Label(new Vec2(0, 0), new Vec2(10, 10), this, " C ", tilesize),
                ]
            ),
            new Label(new Vec2(0, 0), new Vec2(10, 10), this, "         ", tilesize),
            new UiContainer(
                this.pos,
                this.dim,
                ScrollDirection.horizontal,
                [
                    new Label(new Vec2(0, 0), new Vec2(10, 10), this, " A ", tilesize),
                    new Label(new Vec2(0, 0), new Vec2(10, 10), this, " B ", tilesize),
                    new Label(new Vec2(0, 0), new Vec2(10, 10), this, " C ", tilesize),
                ]
            ),
            new Label(new Vec2(0, 0), new Vec2(10, 10), this, "         ", tilesize),
            new UiContainer(
                this.pos,
                this.dim,
                ScrollDirection.horizontal,
                [
                    new Label(new Vec2(0, 0), new Vec2(10, 10), this, " A ", tilesize),
                    new Label(new Vec2(0, 0), new Vec2(10, 10), this, " B ", tilesize),
                    new Label(new Vec2(0, 0), new Vec2(10, 10), this, " C ", tilesize),
                ]
            )


        ]

    }




}