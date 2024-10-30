export class EzIO {

    static async loadImageFromUrl(url: string): Promise<ImageBitmap> {

        return new Promise<ImageBitmap>(
            (resolve, reject) => {
                var request = new XMLHttpRequest();
                request.responseType = "blob";
                request.open("GET", url, true);
                request.send();
                request.onload = async () => {
                    let img: ImageBitmap;
                    if (request.status == 200) {
                        img = await createImageBitmap(request.response);
                        resolve(img);
                    }
                    else {
                        reject();
                    }
                }
            }
        );
    }

    static async loadArrayBufferFromUrl(url: string): Promise<ArrayBuffer> {

        return new Promise<ArrayBuffer>(
            (resolve, reject) => {
                var request = new XMLHttpRequest();
                request.responseType = "arraybuffer";
                request.open("GET", url, true);
                request.send();
                request.onload = async () => {
                    if (request.status == 200) {
                        resolve(request.response);
                    }
                    else {
                        reject();
                    }
                }
            }
        );
    }

    static async loadJsonFromUrl(url: string): Promise<any> {

        return new Promise<ArrayBuffer>(
            (resolve, reject) => {
                var request = new XMLHttpRequest();
                request.responseType = "json";
                request.open("GET", url, true);
                request.send();
                request.onload = async () => {
                    if (request.status == 200) {
                        resolve(request.response);
                    }
                    else {
                        reject();
                    }
                }
            }
        );
    }

}