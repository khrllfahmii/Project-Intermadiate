import {showFormattedDate} from "./utils"

// start loader
export function generateLoaderTemplate(){
    return `
        <div class="loader"></div>
    `;
}

export function generateLoaderAbsoluteTemplate(){
    return `
        <div class="loader loader-absolute"></div>
    `;
}
// end loader 

// start navigation
export function generateNavigationListTemplate(){
    return `
        <li><a id="story-list-button" class="story-list-button" href="#/">Daftar Story</a></li>
        <li><a id="bookmark-button" class="bookmark-button" href="#/bookmark">Story Tersimpan</a></li>
    `;
}

export function generateAuthenticatedNavigationListTemplate(){
    return `
    <li id="push-notification-tools" class="push-notification-tools"></li>
    <li><a id="new-story-button" class="btn new-story-button" href="#/add"> Buat Story Baru <i class="fas fa-plus"></i></a></li>
    <li><a id="logout-button" class="logout-button" href="#/logout"><i class="fas fa-sign-out-alt"></i> Logout </a></li>
    `;
}

export function generateUnAuthenticatedNavigationListTemplate(){
    return `
    <li><a id="login-button" href="#/login">Login</a></li>
    <li><a id="register-button" href="#/regis">Regis</a></li>
    `;
}
//end navigation

// start detail
export function generateDetailErrorTemplate(message){
    return `
        <div id="story-detail-error" class="story-detail__error">
            <h2>Terdapat kesalahan saat pengambilan story</h2>
            <p>${message ? message : 'Tidak ada jaringan'}</p>
        </div>
    `;
}

export function generateImageDetailTemplate(image = null, alt = '') {
    const defaultImg = 'placeholder.jpg'; // atau path placeholder kamu
    return `
        <img class="story-detail__image" src="${image || defaultImg}" alt="${alt || 'Story image'}">
    `;
}


export function generateDetailTemplate({
    img,
    creatorName,
    description,
    location,
    createdAt,
}) {
    const createdAtFormatted = showFormattedDate(createdAt, "id-ID");
    const imageHTML = generateImageDetailTemplate(img || "placeholder.jpg");

    return `
    <h1 class="title-detail">Detail Story</h1>
    <div class="container story-detail">
        <div class="story-detail__images__container">
            <div class="story-detail__image">
                ${imageHTML}
            </div>
        </div>

        <div class="story-detail__body">
            <div class="story-detail__more-info">
                <div class="story-detail__more-info__inline">
                    <div class="story-detail__createdat"><i class="fas fa-calendar-alt"></i> ${createdAtFormatted}</div>
                    <div class="story-detail__location__place-name"><i class="fas fa-map"></i> ${location.placeName || '-'}</div>
                </div>
                <div class="story-detail__more-info__inline">
                    <div class="story-detail__location__latitude">Latitude: ${location.latitude ?? 'Tidak ada'}</div>
                    <div class="story-detail__location__longitude">Longitude: ${location.longitude ?? 'Tidak ada'}</div>
                </div>
                <div class="story-detail__author">Dibuat oleh: ${creatorName || '-'}</div>
            </div>

            <div class="story-detail__body__description__container">
                <h2 class="story-detail__description__title">Deskripsi</h2>
                <div class="story-detail__description__body">
                    ${description}
                </div>
            </div>

            <div class="story-detail__body__map__container">
                <h2 class="story-detail__map__title">Peta Lokasi</h2>
                <div id="map" class="story-detail__map"></div>
                <div id="map-loading-container"></div>
            </div>

            <div class="story-detail__body__actions__container">
                <h2>Aksi</h2>
                <div class="story-detail__actions__buttons">
                    <div id="save-actions-container"></div>
                </div>
            </div>
        </div>
    </div>
    `;
}
//end detail

//start template homepage
export function generateStoryListTemplate({
    id,
    name,
    description,
    photoUrl,
    createdAt,
    location
}) {
    return `
        <div class="story-slider-item">
            <div tabindex="0" class="story-item" data-storyid="${id}">
                <img class="story-item__image" src="${photoUrl}" alt="${name}">
                <div class="story-item__body">
                    <div class="story-item__main">
                        <h2 id="story-title" class="story-item__title">${name}</h2>
                        <div class="story-item__more-info">
                            <div class="story-item__createdat">
                                <i class="fas fa-calendar-alt"></i> ${showFormattedDate(createdAt,"id-ID")}
                            </div>
                            <div class="story-item__location">
                                <i class="fas fa-map"></i>${location.latitude ?? "Tidak ada data"}, ${location.longitude ?? "Tidak ada data"}
                            </div>
                        </div>
                    </div>
                    <div id="story-description" class="story-item__description">${description}</div>
                    <div class="story-item__more-info">
                        <div class="story-item__author">Dibuat oleh: ${name}</div>
                    </div>
                    <a class="btn story-item__read-more" href="#/story/${id}">Selengkapnya <i class="fas fa-arrow-right"></i></a>
                </div>
            </div>
        </div>
    `
}

export function generateStoryListEmptyTemplate(){
    return `
        <h2>Tidak ada story yang tersedia</h2>
        <p>Saat ini, tidak ada story yang dapat ditampilkan.</p>
    `
}

export function generateStoryListErrorTemplate(message){
    return `
    div id="story-list-error" class="story-list__error">
        <h2>Terjadi kesalahan pengambilan daftar story</h2>
        <p>${message ? message : 'Gunakan jaringan lain atau laporkan error ini.'}</p>
    </div>
    `;
}

// start template subscribe Story
export function generateSubscribeButtonTemplate(){
    return `
        <a id="subscribe-button" class="btn btn-subscribe">
            Subscribe <i class="fas fa-bell"></i>
        </a>
    `;
}

export function generateUnSubscribeButtonTemplate(){
    return `
        <a id="unsubscribe-button" class="btn btn-unsubscribe">
            Unsubscribe <i class="fas fa-bell"></i>
        </a>
    `;
}

export function generateSaveStoryButtonTemplate(){
    return `
        <button id="story-detail-save" class="btn btn-save-story">
            Simpan <i class="fas fa-save"></i>
        </button>
    `;
}

export function generateRemoveStoryButtonTemplate(){
    return `
        <button id="story-detail-remove" class="btn btn-remove-story">
            Hapus <i class="fas fa-trash"></i>
        </button>
    `;
}