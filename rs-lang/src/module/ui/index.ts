//Utils
import getHTMLElement from '../../utils/getHTMLElement';
import IWord from '../interface/IWord';
export default class Render {
    constructor() {}

    header() {
        const header = document.createElement('header');
        header.classList.add('header');
        const headerContainer = document.createElement('div');
        headerContainer.classList.add('container');
        header.appendChild(headerContainer);
        headerContainer.innerHTML += `<a href="#" class="header__logo"><h1>RSLang</h1></a>`;
        headerContainer.innerHTML += `
        <div class="header__menu">
            <ul class="header__menu-items">
                <li class="header__menu-item">
                    <a href="/">Главная</a>
                </li>
                <li class="header__menu-item">
                    <a href="/book">Учебник</a>
                </li>
                <li class="header__menu-item dropdown">
                    <span>Игры</span>
                    <ul class="dropdown__menu">
                      <li class="dropdown__menu-item">
                          <a href="/games/sprint">Играть в Спринт</a>
                      </li>
                      <li class="dropdown__menu-item">
                          <a href="/games/audio-call">Играть в Аудио-вызов</a>
                      </li>
                    </ul>
                </li>
                <li class="header__menu-item">
                    <a href="/stats">Статистика</a>
                </li>
                <li class="header__menu-item">
                    <a href="#" class="js-signin-modal-trigger" data-signin="login">Войти</a>
                    <a href="#" data-signin="logout">Выйти</a>
                </li>
            </ul>
        </div>
        `;
        return header;
    }

    main() {
        const main = document.createElement('main');
        main.classList.add('main');
        return main;
    }

    sectionSplash() {
        const splash = document.createElement('section');
        splash.classList.add('splash');
        const splashContainer = document.createElement('div');
        splashContainer.classList.add('container');
        splash.appendChild(splashContainer);
        splashContainer.innerHTML += `
            <h2 class="splash__title">Какое-то название</h2>
            <p class="splash__descrition">Какое-то описание</p>
        `;
        return splash;
    }

    sectionDevelovers() {
        const developers = document.createElement('section');
        const developersContainer = document.createElement('div');
        developersContainer.classList.add('container');
        developers.classList.add('developers');
        developers.appendChild(developersContainer);
        developersContainer.innerHTML = `
            <h3 class="section__title">Наша команда</h3>
            <div class="developers__list">
                <div class="developer">
                    <img src="https://via.placeholder.com/120x120?text=Фото разработчика" class="developer__img" alt="разраб1">
                    <div class="developer__title">Разраб 1</div>
                    <ul class="developer__role-list">
                        <li class="developer__role-item">Role1</li>
                        <li class="developer__role-item">Role2</li>
                    </ul>
                    <p class="developer__description">
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Officia, sunt.
                    </p>
                    <a href="#" class="developer__link" target="_blank">Ссылка на гитхаб</a>
                </div>
                <div class="developer">
                    <img src="https://via.placeholder.com/120x120?text=Фото разработчика" class="developer__img" alt="разраб2">
                    <div class="developer__title">Разраб 2</div>
                    <ul class="developer__role-list">
                        <li class="developer__role-item">Role1</li>
                        <li class="developer__role-item">Role2</li>
                        <li class="developer__role-item">Role3</li>
                    </ul>
                    <p class="developer__description">
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Officia, sunt.
                    </p>
                    <a href="#" class="developer__link" target="_blank">Ссылка на гитхаб</a>
                </div>
                <div class="developer">
                    <img src="https://via.placeholder.com/120x120?text=Фото разработчика" class="developer__img" alt="разраб3">
                    <div class="developer__title">Разраб 3</div>
                    <ul class="developer__role-list">
                        <li class="developer__role-item">Role1</li>
                    </ul>
                    <p class="developer__description">
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Officia, sunt.
                    </p>
                    <a href="#" class="developer__link" target="_blank">Ссылка на гитхаб</a>
                </div>
            </div>
        `;
        return developers;
    }

    sectionBenefits() {
        const benefits = document.createElement('section');
        const benefitsContainer = document.createElement('div');
        benefitsContainer.classList.add('container');
        benefits.classList.add('benefits');
        benefits.appendChild(benefitsContainer);
        benefitsContainer.innerHTML += `
            <h3 class="section__title">Наши преимущества</h3>
            <div class="benefits__list">
                <div class="benefits__item">
                    <img src="https://via.placeholder.com/50/FF0000/FFFFFF?Text=Down.comC/O" class="benefits__item-image" alt="Игры">
                    <div class="benefits__item-title">Игры</div>
                    <div class="benefits__item-description">Сделайте изучение слов более увлекательным с помощью мини-игр</div>
                </div>
                <div class="benefits__item">
                    <img src="https://via.placeholder.com/50/FF0000/FFFFFF?Text=Down.comC/O" class="benefits__item-image" alt="Статистика">
                    <div class="benefits__item-title">Статистика</div>
                    <div class="benefits__item-description">Следите за своим прогрессом каждый день. А авторизованным пользователям доступна возможность просмотра долгосрочной статистики</div>
                </div>
                <div class="benefits__item">
                    <img src="https://via.placeholder.com/50/FF0000/FFFFFF?Text=Down.comC/O" class="benefits__item-image" alt="Словарь">
                    <div class="benefits__item-title">Словарь</div>
                    <div class="benefits__item-description">Авторизованный пользователь может заносить сложные слова в словарь</div>
                </div>
            </div>
        `;
        return benefits;
    }

    sectionGames() {
        const games = document.createElement('section');
        const gamesContainer = document.createElement('div');
        gamesContainer.classList.add('container');
        games.classList.add('games');
        games.appendChild(gamesContainer);
        gamesContainer.innerHTML += `
            <h3 class="section__title">Игры</h3>
            <div class="games__list">
                <div class="card">
                  <div class="card__image">
                      <img src="https://via.placeholder.com/150/FF0000/FFFFFF?Text=Down.comC/O" alt="Игра 1">
                  </div>
                  <div class="card__title">
                      Название игры 1
                  </div>
                  <p class="card__description">
                      Описание игры 1
                  </p>
                  <button class="bttn">Кнопка</button>
                </div>
                <div class="card">
                  <div class="card__image">
                      <img src="https://via.placeholder.com/150/FF0000/FFFFFF?Text=Down.comC/O" alt="Игра 2">
                  </div>
                  <div class="card__title">
                      Название игры 2
                  </div>
                  <p class="card__description">
                      Описание игры 2
                  </p>
                  <button class="bttn">Кнопка</button>
                </div>
            </div>
        `;
        return games;
    }

    footer() {
        const footer = document.createElement('footer');
        footer.classList.add('footer');
        const footerContainer = document.createElement('div');
        footerContainer.classList.add('container');
        footer.appendChild(footerContainer);
        footerContainer.innerHTML += `
        <div class="footer__wrapper">
          <div class="footer__menu-block">
              <h3 class="footer__menu-title">Меню</h3>
              <ul class="footer__menu-items">
                  <li class="footer__menu-item">
                      <a href="/">Главная</a>
                  </li>
                  <li class="footer__menu-item">
                      <a href="/book">Учебник</a>
                  </li>
                  <li class="footer__menu-item">
                      <a href="/stats">Статистика</a>
                  </li>
              </ul>
          </div>
          <div class="footer__menu-block">
              <h3 class="footer__menu-title">Разработчики</h3>
              <ul class="footer__menu-items">
                  <li class="footer__menu-item">
                      <a href="https://github.com/Mrdoker1/" target="_blank">Mrdoker1</a>
                  </li>
                  <li class="footer__menu-item">
                      <a href="https://github.com/GeoBo/" target="_blank">GeoBo</a>
                  </li>
                  <li class="footer__menu-item">
                  <a href="https://github.com/makrakvladislav/" target="_blank">makrakvladislav</a>
                  </li>
              </ul>
          </div>
        </div>
        <div class="footer__copyright">
            ©2022 RS LANG.<a href="https://rs.school/js/" class="rs-icon" target="_blank"></a>
        </div>
        `;
        return footer;
    }

    //Pages
    pageBook() {
        const pageBook = document.createElement('div');
        pageBook.classList.add('page__book');
        pageBook.classList.add('page');
        const pageBookContainer = document.createElement('div');
        pageBookContainer.classList.add('container');
        pageBookContainer.appendChild(pageBook);
        pageBook.innerHTML += `<h2 class="page__title">Учебник</h2>`;

        const wordsList = document.createElement('div');
        wordsList.classList.add('words__list');
        pageBook.append(wordsList);
        /*
        const wordLevels = document.createElement('div');
        wordLevels.classList.add('word-levels');
        wordLevels.innerHTML += `
            <div class="word-levels__list">
                Уровни
            </div>
        `;
        pageBook.append(wordLevels);
       
        const bookPagination = document.createElement('div');
        bookPagination.classList.add('pagination');
        pageBook.append(bookPagination);
         */
        return pageBookContainer;
    }

    wordLevels() {
        const wordLevelsList = document.createElement('div');
        wordLevelsList.classList.add('word-levels__list');
        for (let i = 0; i <= 5; i++) {
            const wordLevels = `  
                <a href="/book/${i}/0" class="word-levels__item">
                    Уровень ${i}
                </a>
            `;
            wordLevelsList.innerHTML += wordLevels;
        }
        return wordLevelsList;
    }

    hardWords() {
        const hardWords = `
            <a href="/book/6/0" class="word-levels__item">
                Сложные слова
            </a>
        `;
        return hardWords;
    }

    bookPagination(levelNumber: number, pagesNumber: number) {
        const bookPagination = document.createElement('div');
        bookPagination.classList.add('pagination');
        for (let i = 0; i < pagesNumber; i++) {
            const pagination = `
                <a href="/book/${levelNumber}/${i}" class="pagination__item">
                    ${i + 1}
                </a>
            `;
            bookPagination.innerHTML += pagination;
        }
        return bookPagination;
    }

    cardWord(data: IWord, loginStatus: Boolean, id: string) {
        let bttnAddToHard;
        if (loginStatus) {
            bttnAddToHard = `<button class="bttn" data-handle="add-to-hard" data-id="${id}">Добавить в сложные</button>`;
        } else {
            bttnAddToHard = '';
        }
        const card = `
          <div class="card card-word">
              <img src="https://rslang-learnwords-app.herokuapp.com/${data.image}" class="card__image">
              <div class="card__title">
                  <div class="card-word__translate">
                      ${data.word} - ${data.wordTranslate} - ${data.transcription}
                  </div>
                  <div class="card-word__audio">
                      <audio controls src="https://rslang-learnwords-app.herokuapp.com/${data.audioExample}">
                        Your browser does not support the
                        <code>audio</code> element.
                      </audio>
                  </div
              </div>
              <div class="card-word__text-example">
                  <span>Пример</span>
                  <p>${data.textExample}</p>
              </div>
              <div class="card-word__text-translate">
                  <p>${data.textExampleTranslate}</p>
              </div>
              <div class="card-word__text-meaning">
                  <span>Значение</span>
                  <p>${data.textMeaning}</p>
              </div>
              <div class="card-word__text-meaning-translate">
                  <p>${data.textMeaningTranslate}</p>
              </div>
              ${bttnAddToHard}
          </div>
        `;
        return card;
    }

    pageGames() {
        const pageGames = document.createElement('div');
        pageGames.classList.add('page__games');
        const pageGamesContainer = document.createElement('div');
        pageGamesContainer.classList.add('container');
        pageGamesContainer.appendChild(pageGames);
        pageGames.innerHTML += `<h2>Игры</h2>`;
        return pageGamesContainer;
    }

    pageStats() {
        const pageStats = document.createElement('div');
        pageStats.classList.add('page__stats');
        const pageStatsContainer = document.createElement('div');
        pageStatsContainer.classList.add('container');
        pageStatsContainer.appendChild(pageStats);
        pageStats.innerHTML += `<h2>Статистика</h2>`;
        return pageStatsContainer;
    }

    //Games

    gameDifficulty(type: string) {
        const container = document.createElement('div');
        container.classList.add('container');
        let levels = '';
        let title;
        let desc;
        let skill;

        if (type === 'audio-call') {
            title = 'Аудиовызов';
            desc =
                '«Аудиовызов» - Тренировка Аудиовызов развивает словарный запаса и улучшает восприятие речи на слух.';
            skill = 'на слух';
        } else if (type === 'sprint') {
            title = 'Спринт';
            desc =
                '«Спринт» - Тренирует навык быстрого перевода с английского языка на русский. Вам нужно выбрать соответствует ли перевод предложенному слову.';
            skill = 'на скорость';
        }

        let checked;
        let letter;
        let n;
        for (let i = 1; i <= 6; i += 1) {
            if (i > 1) checked = '';
            else checked = 'checked';
            if (i % 2 !== 0) n = 1;
            else n = 2;
            switch (i) {
                case 1:
                case 2:
                    letter = 'A';
                    break;
                case 3:
                case 4:
                    letter = 'B';
                    break;
                case 5:
                case 6:
                    letter = 'C';
                    break;
            }
            levels += `<li class="levels__item">
                <input id="level-${i}" type="radio" name="radio" value="${i}" ${checked}>
                <label class="levels__btn" for="level-${i}">${letter}${n}</label>
            </li>`;
            checked = '';
        }

        const html = `<div class="game">
            <div class="game__wrapper">
                <div class="game__window">
                    <img src="../assets/img/${type}.svg"/>
                    <div class="game__block">
                        <h2 class="game__title">${title}</h2>
                        <p class="game__desc">${desc}</p>
                        <p class="game__text">Выберите уровень:</p>
                        <ul class="game__levels levels">${levels}</ul>
                        <button class="game__start">Начать</button>
                        <div class="game__skill">${skill}</div>
                    </div>
                </div>
            </div>
        </div>`;

        container.innerHTML = html;
        return container;
    }

    gameSprint(group: number, page: number) {
        const container = document.createElement('div');
        container.classList.add('container');
        container.innerHTML = '<h2>Игра Спринт</h2>';
        return container;
    }

    gameAudioCall() {
        const container = document.createElement('div');
        container.classList.add('container');

        const html = `<div class="game">
            <div class="game__wrapper">
                <div class="game__window audio">
                    <div class="audio__main">
                        <button class="audio__question js-play-word">
                            <img src="../assets/img/music.svg">
                            <span class="audio__text-play">Play</span>
                        </button>   
                        <div class="audio__answer answer hidden">
                            <img class="answer__photo">
                            <div class="answer__word">
                                <button class="answer__play js-play-word">
                                    <img class="answer__icon-music" src="../assets/img/music-mini.svg">
                                </button>
                                <span class="answer__text"></span>
                            </div>   
                        </div>  
                        <div class="audio__attempts">
                            <span class="audio__icon-heart"></span>
                            <span class="audio__icon-heart"></span>
                            <span class="audio__icon-heart"></span>
                            <span class="audio__icon-heart"></span>
                            <span class="audio__icon-heart"></span>
                        </div>
                    </div>
                    <div class="audio__choices">
                        <button class="audio__choice"></button>  
                        <button class="audio__choice"></button>  
                        <button class="audio__choice"></button>  
                        <button class="audio__choice"></button>  
                        <button class="audio__choice"></button>  
                    </div>
                    <div class="audio__next">
                        <button class="audio__know-btn">Не знаю</button>  
                        <button class="audio__next-btn hidden">Дальше</button>  
                    </div>
                </div>
            </div>
        </div>`;
        container.innerHTML = html;
        return container;
    }

    modalLogin() {
        const modal = document.createElement('div');
        modal.classList.add('cd-signin-modal', 'js-signin-modal');
        const html = `
            <div class="cd-signin-modal__container">
                <ul class="cd-signin-modal__switcher js-signin-modal-switcher js-signin-modal-trigger">
                    <li><a href="#0" data-routerjs-ignore data-signin="login" data-type="login">Вход</a></li>
                    <li><a href="#0" data-routerjs-ignore data-signin="signup" data-type="signup">Регистрация</a></li>
                </ul>
    
                <div class="cd-signin-modal__block js-signin-modal-block" data-type="login">
                    <form class="cd-signin-modal__form">
                        <p class="cd-signin-modal__fieldset">
                            <label class="cd-signin-modal__label cd-signin-modal__label--email cd-signin-modal__label--image-replace" for="signin-email">E-mail</label>
                            <input class="cd-signin-modal__input cd-signin-modal__input--full-width cd-signin-modal__input--has-padding cd-signin-modal__input--has-border" title="qwer@mail.ru" pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$" required id="signin-email" type="email" placeholder="Введите адрес почты" autocomplete="false">
                            <span class="cd-signin-modal__error">Error message here!</span>
                        </p>
    
                        <p class="cd-signin-modal__fieldset">
                            <label class="cd-signin-modal__label cd-signin-modal__label--password cd-signin-modal__label--image-replace" for="signin-password">Пароль</label>
                            <input class="cd-signin-modal__input cd-signin-modal__input--full-width cd-signin-modal__input--has-padding cd-signin-modal__input--has-border" minlength="8" required id="signin-password" type="text" placeholder="Введите пароль" autocomplete="false">
                            <a href="#0" data-routerjs-ignore class="cd-signin-modal__hide-password js-hide-password">Скрыть</a>
                            <span class="cd-signin-modal__error">Error message here!</span>
                        </p>
                        <p class="cd-signin-modal__message js-signin-modal__message"></p>
                        <p class="cd-signin-modal__fieldset">
                            <input class="cd-signin-modal__input cd-signin-modal__input--full-width" type="submit" value="Войти">
                        </p>
                    </form>
                </div>
    
                <div class="cd-signin-modal__block js-signin-modal-block" data-type="signup">
                    <form class="cd-signin-modal__form">
                        <p class="cd-signin-modal__fieldset">
                            <label class="cd-signin-modal__label cd-signin-modal__label--username cd-signin-modal__label--image-replace" for="signup-username">Имя пользователя</label>
                            <input class="cd-signin-modal__input cd-signin-modal__input--full-width cd-signin-modal__input--has-padding cd-signin-modal__input--has-border" minlength="4" required id="signup-username" type="text" placeholder="Введите имя" autocomplete="false">
                            <span class="cd-signin-modal__error">Error message here!</span>
                        </p>
    
                        <p class="cd-signin-modal__fieldset">
                            <label class="cd-signin-modal__label cd-signin-modal__label--email cd-signin-modal__label--image-replace" for="signup-email">Адрес электронной почты</label>
                            <input class="cd-signin-modal__input cd-signin-modal__input--full-width cd-signin-modal__input--has-padding cd-signin-modal__input--has-border" required id="signup-email" type="email" title="qwer@mail.ru" pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$" placeholder="Введите адрес почты" autocomplete="false">
                            <span class="cd-signin-modal__error">Error message here!</span>
                        </p>
    
                        <p class="cd-signin-modal__fieldset">
                            <label class="cd-signin-modal__label cd-signin-modal__label--password cd-signin-modal__label--image-replace" for="signup-password">Пароль</label>
                            <input class="cd-signin-modal__input cd-signin-modal__input--full-width cd-signin-modal__input--has-padding cd-signin-modal__input--has-border" minlength="8" required id="signup-password" type="text" placeholder="Введите пароль" autocomplete="false">
                            <a href="#0" class="cd-signin-modal__hide-password js-hide-password" data-routerjs-ignore>Скрыть</a>
                            <span class="cd-signin-modal__error">Error message here!</span>
                        </p>
                        <p class="cd-signin-modal__message js-signin-modal__message"></p>
                        <p class="cd-signin-modal__fieldset">
                            <input class="cd-signin-modal__input cd-signin-modal__input--full-width cd-signin-modal__input--has-padding" type="submit" value="Создать аккаунт">
                        </p>
                    </form>
                </div>
                <a href="#0" data-routerjs-ignore class="cd-signin-modal__close js-close">Close</a>
            </div>`;
        modal.innerHTML = html;
        return modal;
    }

    chart(chartSize: number, strokeSize: number, percent: number, color: string, backgroundColor: string) {
        const chart = document.createElement('div');
        chart.classList.add('chart');

        const roundRadius = chartSize / 2;
        const roundCircum = 2 * roundRadius * Math.PI;
        const roundDraw = (percent * roundCircum) / 100;

        chart.innerHTML = `
        <div class="chart-wrapper">
            <svg class="chart-background" viewbox="0 0 ${chartSize} ${chartSize}" width="${chartSize}" height="${chartSize}" data-percent="100" stroke=${backgroundColor} stroke-width="${strokeSize}">
                <circle cx="${roundRadius}" cy="${roundRadius}" r="${roundRadius - strokeSize / 2}" />
            </svg>
        </div>
        <div class="chart-wrapper">
            <svg class="chart-percentage" viewbox="0 0 ${chartSize} ${chartSize}" width="${chartSize}" height="${chartSize}" data-percent="0" stroke=${color} stroke-width="${strokeSize}">
                <circle cx="${roundRadius}" cy="${roundRadius}" r="${
            roundRadius - strokeSize / 2
        }" stroke-dasharray="${roundDraw}"/>
            </svg>
        </div>
        `;

        return chart;
    }

    static currentLink(path: string) {
        const navLinks = document.querySelectorAll('.header__menu a:not([href^="#"])');
        const parts = path.split('/').reverse();

        for (let link of navLinks) {
            link.classList.remove('active');
        }

        for (let item of parts) {
            for (let link of navLinks) {
                const href = link.getAttribute('href');
                if (href?.indexOf(item) !== -1) {
                    link.classList.add('active');
                    return;
                }
            }
        }
    }
}
