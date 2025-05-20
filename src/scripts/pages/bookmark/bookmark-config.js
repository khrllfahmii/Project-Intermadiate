import { storyMapper } from "../../data/api-map";

export default class BookmarkConfig {
    #view;
    #model;

    constructor({view, model}){
        this.#view = view;
        this.#model = model;
    }

    async showBookmarkPage(){
        this.#view.showStoryLoading();
        try {
            const listStory = await this.#model.getAllStory();
            this.#view.populateBookmarkStoryList("Data berhasil dimuat", listStory);
        } catch (e) {
            console.error('showBookmarkPage: error', e);
            this.#view.populateBookmarkStoryError(e.message);
        } finally {
            this.#view.hideStoryLoading();
        }
    }
}