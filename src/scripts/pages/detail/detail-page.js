import detailConfig from "./detail-config.js";
import * as Model from '../../data/api.js'
import Map from '../../utils/map-utils.js'
import {parseActivePathname} from "../../routes/url-parser.js"
import {
    generateLoaderAbsoluteTemplate,
    generateDetailErrorTemplate,
    generateDetailTemplate,
    generateSaveStoryButtonTemplate,
    generateRemoveStoryButtonTemplate
} from '../../template.js'
import Database from '../../data/db.js';

export default class detailPage{
    #presenter = null;
    #map = null;

    async render(){
        return `
            <section>
                <div class="story-detail__container">
                    <div id="story-detail" class="story-detail"></div>
                    <div id="story-detail-loading-container"></div>
                </div>
            </section>
        `;
    }

    async afterRender(){
        this.#presenter = new detailConfig(parseActivePathname().id, {
            view: this,
            model: Model,
            dbModel: Database,
        });
        this.#presenter.showStoryDetail();
    }

    async populateStoryDetail(message, data){
        document.getElementById('story-detail').innerHTML = generateDetailTemplate({
            img: data.photoUrl,
            creatorName: data.name,
            description: data.description,
            location: data.location,
            createdAt: data.createdAt,
        });
        if(data.location.latitude !== null && data.location.longitude !== null){
            try{
                await this.#presenter.showStoryDetailMap();
                if(this.#map){
                    const coor = [data.location.latitude, data.location.longitude];
                    const marker = {alt: data.description};
                    const popupOption = {content: data.description};
                    this.#map.changeCamera(coor);
                    this.#map.addMarker(coor,marker,popupOption)
                }

                this.#presenter.showSaveButton();
            }catch(e){
                alert('Error');
            }
        }else{
            alert('location not found')
        }
    }
    async initialMap(){
        this.#map = await Map.build('#map', {
            zoom: 15,
        });
    }

    renderSaveButton(){
        document.getElementById('save-actions-container').innerHTML = generateSaveStoryButtonTemplate();
        document.getElementById('save-actions-container').addEventListener('click', async () => {
            await this.#presenter.saveStory();
            await this.#presenter.showSaveButton();
        })
    }

    saveToBookmarkSuccess(message){
        alert(message);
    }

    saveToBookmarkFailed(message){
        alert(message);
    }

    renderRemoveButton(){
        document.getElementById('save-actions-container').innerHTML = generateRemoveStoryButtonTemplate();
        document.getElementById('story-detail-remove').addEventListener('click', async () => {
            await this.#presenter.removeStory();
            await this.#presenter.showSaveButton();
        })
    }

    populateStoryDetailError(message){
        document.getElementById('story-detail').innerHTML = generateDetailErrorTemplate(message);
    }

    showStoryDetailLoading(){
        document.getElementById("story-detail-loading-container").innerHTML = generateLoaderAbsoluteTemplate();
    }

    hideStoryDetailLoading(){
        document.getElementById('story-detail-loading-container').innerHTML = '';
    }

    showMapLoading(){
        document.getElementById('map-loading-container').innerHTML = generateLoaderAbsoluteTemplate();
    }

    hideMapLoading(){
        document.getElementById('map-loading-container').innerHTML = '';
    }
}