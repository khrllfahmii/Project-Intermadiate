export default class addConfig{
    #view;
    #model;
    constructor({view,model}){
        this.#view = view;
        this.#model = model;
    }

    async showFormMap(){
        this.#view.showMapLoading();
        try{
            await this.#view.initialMap();
        }catch(e){
            console.error('shadowNewFormMap: error:', e);
        }finally{
            this.#view.hideMapLoading();
        }
    }

    async addStory({ desc, img, lat, lon }) {
        this.#view.showLoadingSubmitButton();
        try {
            if (img.size > 1000000) {
                this.#view.addFailed("Ukuran gambar melebihi 1MB. Coba kompres ulang.");
                return;
            }
    
            const data = {
                desc: desc,
                img: img,
                lat: lat,
                lon: lon
            };
    
            const response = await this.#model.addNewStory(data);
    
            if (!response.ok) {
                console.error('addStory: response:', response);
                this.#view.addFailed(response.message);
                return;
            }
    
            this.#view.addStorySuccess(response.message);
        } catch (e) {
            console.error('addStory: error:', e);
            this.#view.addFailed(e.message);
        } finally {
            this.#view.hideLoadingSubmitButton();
        }
    }
    
    
}