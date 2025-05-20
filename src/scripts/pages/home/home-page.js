import {
  generateLoaderAbsoluteTemplate,
  generateStoryListTemplate,
  generateStoryListEmptyTemplate,
  generateStoryListErrorTemplate
} from '../../template.js'

import homeConfig from './home-config.js';
import * as StoriesAPI from '../../data/api.js';

export default class homePage {
  #presenter = null;
  #mapInstance = null;

  async render() {
    return `
      <section class="container">
        <!-- Elemen untuk MAP -->
        <div id="map" style="height: 400px; margin-bottom: 1rem;"></div>
        <h1 class="section-title">Daftar story</h1>
          <div class="story-list__container">
            <div id="story-list"></div>
            <div id="story-list-loading-container"></div>
          </div>
      </section>
    `;
  }

  async afterRender() {
    this.#presenter = new homeConfig({
      view: this,
      model: StoriesAPI,
    });
    await this.#presenter.showHomePage();
  }

  async populateStoryList(message, data) {
    if (data.length <= 0) {
      this.populateStoryListEmpty();
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

  populateStoryListEmpty() {
    document.getElementById('story-list').innerHTML = generateStoryListEmptyTemplate();
  }

  populateStoryListError(message) {
    document.getElementById('story-list').innerHTML = generateStoryListErrorTemplate(message);
  }

  showStoryLoading() {
    document.getElementById('story-list-loading-container').innerHTML = generateLoaderAbsoluteTemplate();
  }

  hideStoryLoading() {
    document.getElementById('story-list-loading-container').innerHTML = '';
  }
}
