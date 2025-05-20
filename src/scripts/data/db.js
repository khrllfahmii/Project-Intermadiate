import {openDB} from 'idb';
import { getAllStory } from './api';

const DATABASE_NAME = 'StoryAPP';
const DATABASE_VERSION = 1;
const OBJECT_STORE_NAME = 'saved-stories';

const dbPromise = openDB(DATABASE_NAME, DATABASE_VERSION, {
    upgrade(database) {
        database.createObjectStore(OBJECT_STORE_NAME, {keyPath: 'id'});
    },
});

const Database = {
    async putStory(stories){
        if(!Object.hasOwn(stories, 'id')){
            throw new Error('`id` is required');
        }
        return (await dbPromise).put(OBJECT_STORE_NAME, stories);
    },

    async getDetailStory(id){
        if(!id){
            throw new Error('`id` is required');
        }
        return (await dbPromise).get(OBJECT_STORE_NAME, id);
    },

    async getAllStory(){
        return (await dbPromise).getAll(OBJECT_STORE_NAME);
    },

    async removeStory(id){
        return (await dbPromise).delete(OBJECT_STORE_NAME, id);
    }
};

export default Database;