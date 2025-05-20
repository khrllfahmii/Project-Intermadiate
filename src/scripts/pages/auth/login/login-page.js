import loginConfig from "./login-config";
import * as AuthorModel from "../../../utils/auth-utils.js";
import * as StoryAPI from "../../../data/api.js";

export default class loginPage{
    #presenter = null;
    async render (){
        return `
        <section class="login-container">
            <article class="login-form-container">
                <h1 class="login__title">Masuk akun</h1>
            <form id="login-form" class="login-form">
                <div class="form-control">
                    <label for="email-input" class="login-form__email-title">Email</label>
                <div class="login-form__title-container">
                    <input id="email-input" class="email-input" type="email" name="email" placeholder="Contoh: nama@email.com">
                </div>
            </div>
            <div class="form-control">
                <label for="password-input" class="login-form__password-title">Password</label>
                <div class="login-form__title-container">
                    <input id="password-input" type="password" class="password-input" name="password" placeholder="Masukkan password Anda">
                </div>
            </div>
            <div class="form-buttons login-form__form-buttons">
                <div id="submit-button-container">
                <button class="btn" type="submit">Masuk</button>
                </div>
                <p class="login-form__do-not-have-account">Belum punya akun? <a href="#/regis">Daftar</a></p>
            </div>
            </form>
        </article>
        </section>
        `;
    }

    async afterRender(){
        this.#presenter = new loginConfig({
            view: this,
            model: StoryAPI,
            authorModel: AuthorModel,
        });
        this.#setupForm();
    }
    #setupForm(){
        document.getElementById('login-form').addEventListener('submit', async (e) => {
            e.preventDefault();
            const data = {
                email: document.getElementById('email-input').value,
                password: document.getElementById('password-input').value,
            };
            await this.#presenter.getLogin(data);
        });
    }

    loginSuccess(message){
        console.log(message);
        location.hash = '/';
    }

    loginFailed(message){
        alert(message);
    }

    showSubmitLoadingbtn(){
        document.getElementById('submit-button-container').innerHTML = `
            <button class="btn" type="submit" disabled>
                <i class="fas fa-spinner loader-button"></i> Masuk
            </button>
        `;
    }
    
    hideSubmitLoadingbtn(){
        document.getElementById('submit-button-container').innerHTML = `
            <button class="btn" type="submit"> Masuk </button>
        `;
    }
}