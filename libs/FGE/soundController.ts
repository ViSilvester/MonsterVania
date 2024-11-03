export class SoundController {

    private sounds = new Map<string, HTMLAudioElement>();
    status = SoundControllerStatus.initial;


    getStatus() {
        return this.status;
    }

    addSound(id: string, path: string, loop?: boolean) {

        var audio: any;
        try {
            audio = new Audio(path);
            audio.loop = loop;
            this.sounds.set(id, audio);
        }
        catch {
            console.log("arquivo de audio não encontrado");
        }

    }


    async play(id: string) {

        const audio = this.sounds.get(id);

        if (audio) {

            audio.pause();
            audio.currentTime = 0;

            try {
                await audio.play();
            }
            catch (e: any) {
                setTimeout(() => { this.play(id) }, 500);
            }
        }
    }

    async pause(id: string) {

        const audio = this.sounds.get(id);

        if (audio) {

            try {
                audio.pause();
            }
            catch (e: any) {
                setTimeout(() => { this.pause(id) }, 500);
            }
        }
    }

    async play_pause(id: string) {
        const audio = this.sounds.get(id);

        if (audio?.paused) {

            this.play(id);
        }
        else {
            this.pause(id);
        }
    }
}


export enum SoundControllerStatus {

    initial,
    playing,
    paused,
    finished,

}
