import { Vec2 } from "../../libs/FGE/geometry.js";
import { Game } from "../game.js";

export class AnimationController {

    tileset: ImageBitmap;
    tile_dim: Vec2;
    private anim_data: Map<string, AnimationData>;
    private timer: number;
    private current_frame: number;
    private current_anim?: AnimationData;
    private current_tick_rate: number;
    private status: animationControllerStatus;

    readonly stdTickRate = 10;


    constructor(tileset: ImageBitmap, tile_dim: Vec2) {

        this.tileset = tileset;
        this.tile_dim = tile_dim;
        this.current_frame = 0;
        this.current_tick_rate = this.stdTickRate;
        this.timer = 0;
        this.status = animationControllerStatus.finished;
        this.anim_data = new Map<string, AnimationData>;

    }

    get playback_status() {
        return this.status;
    }

    getCurrentFrame() {
        return this.current_frame;
    }

    addAnim(name: string, pos: number, startFrame: number, time: number, tick_p_s?: number, offset?: Vec2, onEnd?: string) {

        const ad = new AnimationData(name, pos, startFrame, time, tick_p_s ? tick_p_s : this.stdTickRate, offset, onEnd);

        if (this.anim_data.size == 0) {
            this.current_anim = ad;
            this.current_tick_rate = ad.tick_p_f;
        }

        this.anim_data.set(name, ad);


    }

    play(name: string) {

        const a = this.anim_data.get(name);

        if (this.status == animationControllerStatus.playing) {

            if (this.current_anim && this.current_anim.name == name) {
                return;
            }
            else {
                this.timer = 0;
                this.current_frame = 0;
            }

        }
        if (this.status == animationControllerStatus.finished) {
            if (this.current_anim && this.current_anim.name == name) {
                this.timer = 0;
                this.current_frame = 0;
            }
            else {
                this.timer = 0;
                this.current_frame = 0;
            }
        }
        if (this.status == animationControllerStatus.paused) {
            if (this.current_anim && this.current_anim.name == name) {
                this.timer = 0;
            }
            else {
                this.timer = 0;
                this.current_frame = 0;
            }
        }

        if (a) {
            this.current_anim = a;
            this.current_tick_rate = a.tick_p_f;
            this.status = animationControllerStatus.playing
        }
    }

    setCurrentTickRate(tick_p_f: number) {
        this.current_tick_rate = tick_p_f;
    }

    setCurrentFrame(frame: number) {
        this.current_frame = frame;
    }

    isPaused() {
        return this.status == animationControllerStatus.paused;
    }

    pause() {
        this.status == animationControllerStatus.paused;
    }

    resume() {

        if (this.current_anim) {
            if (this.current_frame > this.current_anim?.duration) {
                this.status = animationControllerStatus.finished;
            }
            else {
                this.status = animationControllerStatus.playing;
            }
        }
    }

    stop() {
        this.status = animationControllerStatus.finished;
        this.timer = 0;
        this.current_frame = 0;
    }


    update() {

        if (this.current_anim) {


            if (this.status == animationControllerStatus.paused || this.status == animationControllerStatus.finished) {
                return;
            }

            this.timer += 1;

            if (this.timer >= this.current_tick_rate) {
                this.current_frame += 1;
                this.timer = 0;
            }

            if (this.current_frame >= this.current_anim.duration) {

                switch (this.current_anim.onEnd) {
                    case "loop":
                        this.current_frame = 0;
                        break;
                    case "pause":
                        this.stop();
                        this.current_frame -= 1;
                        this.pause();
                        break;
                    case "stop":
                        this.stop();
                        break;
                    default:
                        this.current_frame = 0;
                        break;
                }
            }
        }
    };

    render(game: Game, pos: Vec2, dim: Vec2) {

        if (this.current_anim) {

            const uvPos = new Vec2(
                (this.current_anim.pos * this.tile_dim.x) + (this.current_anim.offset.x * this.tile_dim.x),
                (this.current_frame + this.current_anim.startFrame) * (this.tile_dim.y + this.current_anim.offset.y)
            );
            const uvDim = new Vec2(this.tile_dim.x + this.current_anim.offset.x, this.tile_dim.y + this.current_anim.offset.y);
            game.draw.drawImage(this.tileset, pos, dim, uvPos, uvDim);

        }
    }


    createInstance() {

        var a = new AnimationController(this.tileset, this.tile_dim.copy());

        var keys = Array.from(this.anim_data.keys());

        for (var i = 0; i < keys.length; i++) {

            var data = this.anim_data.get(keys[i]);

            if (data) {
                a.addAnim(keys[i], data.pos, data.startFrame, data.duration, data.tick_p_f, data.offset, data.onEnd);
            }

        }
        return a;
    }
}

export class AnimationData {

    name: string
    pos: number
    startFrame: number
    duration: number
    tick_p_f: number
    offset: Vec2
    onEnd: string

    constructor(name: string, pos: number, startFrame: number, time: number, tick_p_f: number, offset?: Vec2, onEnd?: string) {
        this.name = name;
        this.pos = pos;
        this.startFrame = startFrame;
        this.duration = time;
        this.tick_p_f = tick_p_f;
        this.offset = offset ? offset : new Vec2(0, 0);
        this.onEnd = onEnd ? onEnd : "loop";

    }

}

export enum animationControllerStatus {
    playing = "playing",
    paused = "paused",
    finished = "finished"
}