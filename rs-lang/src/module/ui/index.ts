//Utils
import getHTMLElement from '../../utils/getHTMLElement';
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
                    <a href="#">Главная</a>
                </li>
                <li class="header__menu-item">
                    <a href="#">Учебник</a>
                </li>
                <li class="header__menu-item dropdown">
                    <a href="#">Игры</a>
                    <ul class="dropdown__menu">
                      <li class="dropdown__menu-item">
                          <a href="#">Игра 1</a>
                      </li>
                      <li class="dropdown__menu-item">
                          <a href="#">Игра 2</a>
                      </li>
                    </ul>
                </li>
                <li class="header__menu-item">
                    <a href="#">Статистика</a>
                </li>
                <li class="header__menu-item">
                    <a href="#">Иконка авторизации</a>
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
                    <div class="developer__title">Разраб 1</div>
                    <ul class="developer__role-list">
                        <li class="developer__role-item">Role1</li>
                        <li class="developer__role-item">Role2</li>
                    </ul>
                    <p class="developer__description">
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Officia, sunt.
                    </p>
                </div>
                <div class="developer">
                    <div class="developer__title">Разраб 2</div>
                    <ul class="developer__role-list">
                        <li class="developer__role-item">Role1</li>
                        <li class="developer__role-item">Role2</li>
                        <li class="developer__role-item">Role3</li>
                    </ul>
                    <p class="developer__description">
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Officia, sunt.
                    </p>
                </div>
                <div class="developer">
                    <div class="developer__title">Разраб 3</div>
                    <ul class="developer__role-list">
                        <li class="developer__role-item">Role1</li>
                    </ul>
                    <p class="developer__description">
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Officia, sunt.
                    </p>
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
        <div class="footer__menu-block">
            <h3 class="footer__menu-title">Меню</h3>
            <ul class="footer__menu-items">
                <li class="footer__menu-item">
                    <a href="#">Главная</a>
                </li>
                <li class="footer__menu-item">
                    <a href="#">Учебник</a>
                </li>
                <li class="footer__menu-item">
                    <a href="#">Статистика</a>
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
        `;
        return footer;
    }
}
