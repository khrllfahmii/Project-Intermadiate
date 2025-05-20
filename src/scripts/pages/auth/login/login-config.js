export default class loginConfig{
    #view;
    #model;
    #authorModel;

    constructor({view, model, authorModel}){
        this.#view = view;
        this.#model = model;
        this.#authorModel = authorModel;
    }

    async getLogin({email, password}){
        this.#view.showSubmitLoadingbtn();
        try{
            const response = await this.#model.getLogin({email,password});
            if(!response.ok){
                console.error('getLogin: response:', response);
                this.#view.loginFailed(response.message);
                return;
            }
            this.#authorModel.putAccessToken(response.loginResult.token);
            this.#view.loginSuccess(response.message, response.loginResult);
        }catch(e){
            console.error('getLogin: error:', e);
            this.#view.loginFailed(e.message);
        }finally{
            this.#view.hideSubmitLoadingbtn();
        }
    }
}