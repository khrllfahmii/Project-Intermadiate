export default class Camera{
    #currentStream;
    #streaming =  false;
    #width = 640;
    #height = 0;
    #videoElement;
    #selectCameraElement;
    #canvasElement;
    #takePictureButton;

    static addNewStream(stream){
        if(!Array.isArray(window.currentStreams)){
            window.currentStreams = [stream];
            return;
        }
        window.currentStreams = [...window.currentStreams, stream];
    }

    static stopAllStream(){
        if (! Array.isArray(window.currentStreams)){
            window.currentStreams = []
            return;
        }
        window.currentStreams.forEach((stream)=> {
            if(stream.active){
                stream.getTracks().forEach((track) => track.stop())
            }
        });
    }

    constructor({video, cameraSelect, canvas, option = {} }){
        this.#videoElement = video;
        this.#selectCameraElement = cameraSelect;
        this.#canvasElement = canvas;
        this.#initialListener();
    }

    #initialListener(){
        this.#videoElement.oncanplay = ()=> {
            if(this.#streaming){
                return;
            }
            this.#height = (this.#videoElement.videoHeight * this.#width) / this.#videoElement.videoWidth;

            this.#canvasElement.setAttribute('width', this.#width);
            this.#canvasElement.setAttribute('height',this.#height);
            this.#streaming = true;
        }

        this.#selectCameraElement.onchange = async () => {
            await this.stop();
            await this.launch();
        };
    }

    async #populateDeviceList(stream) {
        try {
            if (!(stream instanceof MediaStream)) {
                return Promise.reject(Error('mediastream not found'));
            }
    
            const { deviceId } = stream.getVideoTracks()[0].getSettings();
            const enumerated = await navigator.mediaDevices.enumerateDevices();
            const list = enumerated.filter((device) => {
                return device.kind === 'videoinput';
            });
    
            const html = list.reduce((accumulator, device, currentIndex) => {
                return accumulator.concat(`
                    <option value="${device.deviceId}" ${deviceId === device.deviceId ? 'selected' : ''}>
                    ${device.label || `Camera ${currentIndex + 1}`}
                    </option>
                    `);
            }, '');
    
            this.#selectCameraElement.innerHTML = html;
        } catch (error) {
            console.error('#populateDeviceList: error:', error);
        }
    }
    async #getStream(){
        try{
            const deviceId = !this.#streaming && !this.#selectCameraElement.value ? undefined : {exact: this.#selectCameraElement.value};
            const stream = await navigator.mediaDevices.getUserMedia({
                video: {
                    aspectRatio: 4 / 3,
                    deviceId,
                },
            }); 
            await this.#populateDeviceList(stream);
            return stream;
        } catch (e){
            console.error('#getStream: error:', e); // ✅ perbaikan di sini
            return null;
        }
    }
    
    async launch(){
        this.#currentStream = await this.#getStream();
        if (!this.#currentStream) {
            console.error("Stream tidak tersedia");
            return;
        }
        Camera.addNewStream(this.#currentStream);
        this.#videoElement.srcObject = this.#currentStream;
    
        await new Promise((resolve) => {
            this.#videoElement.onloadedmetadata = () => { 
                this.#width = this.#videoElement.videoWidth;
                this.#height = this.#videoElement.videoHeight;
                resolve();
            };
        });
    
        this.#videoElement.play();
        this.#clearCanvas();
    }
    
    stop() {
        if (this.#videoElement) {
        this.#videoElement.srcObject = null;
        this.#streaming = false;
        }
    
        if (this.#currentStream instanceof MediaStream) {
        this.#currentStream.getTracks().forEach((track) => {
            track.stop();
        });
        }
    
        this.#clearCanvas();
    }

    #clearCanvas() {
        const context = this.#canvasElement.getContext('2d');
        context.fillStyle = '#AAAAAA';
        context.fillRect(0, 0, this.#canvasElement.width, this.#canvasElement.height);
    }
    
    async takePicture() {
        if (!(this.#width && this.#height)) {
            console.error("Ukuran kamera belum diatur.");
            return null;
        }
    
        const context = this.#canvasElement.getContext('2d');
        this.#canvasElement.width = this.#width;
        this.#canvasElement.height = this.#height;
    
        context.drawImage(this.#videoElement, 0, 0, this.#width, this.#height);
    
        // ✅ Kompres ke JPEG
        return await new Promise((resolve, reject) => {
            this.#canvasElement.toBlob((blob) => {
                if (blob) {
                    resolve(blob);
                } else {
                    reject(new Error("Gagal membuat Blob dari canvas."));
                }
            }, 'image/jpeg', 0.7); // 0.7 = 70% kualitas
        });
    }
    
    
    addCheeseButtonListener(selector, callback) {
        this.#takePictureButton = document.querySelector(selector);
        this.#takePictureButton.onclick = callback;
    }
}

