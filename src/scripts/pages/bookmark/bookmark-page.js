import { generateLoaderAbsoluteTemplate,generateStoryListTemplate,generateStoryListEmptyTemplate,generateStoryListErrorTemplate } from "../../template";
import bookmarkConfig from "./bookmark-config.js";
import Database from "../../data/db.js";

export default class BookmarkPage{
    #presenter = null;
    #mapInstance = null;

    async render(){
        return `
        <section>
            <div id="map" style="height: 400px; margin-bottom: 1rem;"></div>
            <h1 class="section-title">Daftar story yang tersimpan</h1>
                <div class="story-list__container">
                    <div id="story-list"></div>
                    <div id="story-list-loading-container"></div>
                </div>
        </section>
        `;
    }

    async afterRender(){
        this.#presenter = new bookmarkConfig({
            view: this,
            model: Database,
        });
        await this.#presenter.showBookmarkPage();
    }

    async populateBookmarkStoryList(message, data) {
    if (data.length <= 0) {
        this.populateBookmarkStoryListEmpty();
        return;
    }

    // Inisialisasi MAP hanya sekali
    if (!this.#mapInstance) {
        const { default: Map } = await import('../../utils/map-utils.js');
        this.#mapInstance = await Map.build('#map', { locate: true });
    }

    // Tambahkan marker ke MAP
    data.forEach(story => {
        if (story.lat && story.lon) {
        this.#mapInstance.addMarker([story.lat, story.lon], {}, {
            content: `<p>${story.name}</p>`
            });
        }
    });

    // Tampilkan daftar story
    const html = data.reduce((accumulator, storyList) => {
        return accumulator.concat(
            generateStoryListTemplate({
                id: storyList.id,
                name: storyList.name,
                description: storyList.description,
                photoUrl: storyList.photoUrl,
                createdAt: storyList.createdAt,
                location: { latitude: storyList.lat, longitude: storyList.lon },
            })
        );
    }, '');

    document.getElementById("story-list").innerHTML = `
        <div class="story-list">${html}</div>
    `;
    }

    populateBookmarkStoryListEmpty(){
        document.getElementById("story-list").innerHTML = generateStoryListEmptyTemplate();
    }

    populateBookmarkStoryError(message){
        document.getElementById("story-list").innerHTML = generateStoryListErrorTemplate(message);
    }

    showStoryLoading() {
        document.getElementById('story-list-loading-container').innerHTML = generateLoaderAbsoluteTemplate();
    }

    hideStoryLoading() {
        document.getElementById('story-list-loading-container').innerHTML = '';
    }
}
