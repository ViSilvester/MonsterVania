import { UiContainer, UiElement } from "../../../libs/FGE/FUI.js";
import { Rect, Vec2 } from "../../../libs/FGE/geometry.js";
import { Game } from "../../game.js";

export class Label extends UiElement {

    text = ""
    size = 10;

    constructor(pos: Vec2, dim: Vec2, father: UiContainer, text: string, size: number) {

        super(pos, dim, father)
        this.text = text;
        this.size = size;
        this.dim.x = text.length * size;
        this.dim.y = size;
    }


    render(rpos: Vec2, game: Game): Vec2 {

        rpos.x += this.pos.x
        rpos.y += this.pos.y

        game.draw.fillRect(new Rect(
            rpos,
            this.dim
        ), 1, 1, 1);

        game.draw.fillText(this.text, rpos, 255, 255, 255, this.size + "px Press_Start_2p")

        return this.dim;


    }

}