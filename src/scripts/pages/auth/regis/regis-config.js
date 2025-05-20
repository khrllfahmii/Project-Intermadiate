export default class regisConfig{
    #view;
    #model;

    constructor({view, model}){
        this.#view = view;
        this.#model = model;
    }

    async getRegis({name, email, password}){
        this.#view.showSubmitLoadingbtn();
        try {
            const response = await this.#model.getRegis({ name,email,password});
            if(!response.ok){
                console.error('getRegis: response:', response);
                this.#view.regisFailed(response.message);
                return
            }
            this.#view.regisSuccess(response.message, response.data);
        }catch (e){
            console.error("getRegis: error:", e);
            this.#view.regisFailed(e.message);
        } finally{
            this.#view.hideSubmitLoadingbtn();
        }
    }
}