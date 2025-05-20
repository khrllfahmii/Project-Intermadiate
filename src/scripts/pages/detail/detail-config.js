import {storyMapper} from "../../data/api-map.js"

export default class detailConfig{
  #StoryId;
  #view;
  #model;
  #dbModel;

  constructor(StoryId, {view, model, dbModel}){
    this.#StoryId = StoryId;
    this.#view = view;
    this.#model = model;
    this.#dbModel = dbModel;
  }

  async saveStory(){
    try{
      const story = await this.#model.getDetailStory(this.#StoryId);
      await this.#dbModel.putStory(story.story);

      this.#view.saveToBookmarkSuccess('Success to save to bookmark');
    }catch(e){
      console.log('saveStory: error', e)
      this.#view.saveToBookmarkFailed(e.message);
    }
  }

  async removeStory(){
  try{
    await this.#dbModel.removeStory(this.#StoryId);
    this.#view.saveToBookmarkSuccess('Berhasil dihapus');
  }catch(e){
    this.#view.saveToBookmarkFailed(e.message);
  }
}

  async showSaveButton(){
    if(await this.#isReportSaved()){
      this.#view.renderRemoveButton();
      return;
    }
    this.#view.renderSaveButton();
  }


  async #isReportSaved(){
    return !! (await this.#dbModel.getDetailStory(this.#StoryId));
  }

  async showStoryDetailMap(){
    this.#view.showMapLoading();
    try{
      await this.#view.initialMap();
    }catch (e){
      console.error('showDetailMap: error:', e)
    }finally{
      this.#view.hideMapLoading();
    }
  }

  async showStoryDetail(){
    this.#view.showStoryDetailLoading();
    try{
      const response = await this.#model.getDetailStory(this.#StoryId);
      if (!response.ok){
        this.#view.populateStoryDetailError(response.message);
        return;
      }
      const detail = await storyMapper(response.story);
      this.#view.populateStoryDetail(response.message, detail);
    }catch(e){
      console.error('showStoryDetail: response:', e);
      this.#view.populateStoryDetailError(e.message);
    }finally{
      this.#view.hideStoryDetailLoading();
    }
  }
}