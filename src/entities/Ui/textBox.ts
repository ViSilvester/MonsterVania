import { Engine } from "../../../libs/FGE/engine.js";
import { Entity } from "../../../libs/FGE/entity.js";
import { Rect, Vec2 } from "../../../libs/FGE/geometry.js";
import { KeybordController } from "../../../libs/FGE/keyboardController.js";
import { Game } from "../../game.js";

export class TextBox extends Entity {

    dim: Vec2;
    paragraphs: Array<string>;
    current_p: number;
    fontsize: number;


    readonly baseFont = "Press_Start_2p";

    constructor(pos: Vec2, dim: Vec2, fontsize: number, paragraphs: Array<string>) {
        super();
        this.pos = pos;
        this.dim = dim;
        this.fontsize = fontsize;
        this.paragraphs = paragraphs;
        this.current_p = 0;
    }


    get font() { return this.fontsize + "px " + this.baseFont };

    create(game: Game): void {

    }


    update(game: Game): void {

        if (KeybordController.getKeyPress("k")) {

            this.current_p += 1;

            if (this.current_p >= this.paragraphs.length) {
                game.gamestatus = "running"
            }
        }
    }


    render(game: Game): void {

        const text = this.paragraphs[this.current_p];
        const lines = text.split('\n');

        game.draw.fillRect(new Rect(this.pos, this.dim), 0, 0, 0);

        var rpos = new Vec2(this.pos.x, this.pos.y);

        for (var i = 0; i < lines.length; i++) {

            game.draw.fillText(lines[i], rpos, 255, 255, 255, this.font);
            rpos.y += this.fontsize;
        }
    }


}