//Utils
import getHTMLElement from '../../utils/getHTMLElement';
import IWord from '../interface/IWord';

//Interface
import IResultChart from '../interface/IResultChart';
import IStatistics from '../interface/IStatistics';
import IStatisticsDay from '../interface/IStatisticsDay';
import ISettings from '../interface/ISettings';

//Enums
import { gameChart, gameType, statisticType } from '../../utils/enums';
import IUserWord from '../interface/IUserWord';

//Modules
import Chart from 'chart.js/auto';
import CustomDate from 'date-and-time';
const ru = require('date-and-time/locale/ru');

export default class Render {
    constructor() {}

    header(userName: string) {
        const header = document.createElement('header');
        header.classList.add('header');
        const headerContainer = document.createElement('div');
        headerContainer.classList.add('container');
        header.appendChild(headerContainer);
        headerContainer.innerHTML += `
        <div class="header-left">
            <a href="#" class="header__logo rs-logo"></a>
            <nav class="nav header__menu">
                <ul class="nav__list">
                    <li class="nav__item">
                        <a href="/" class="nav__link">Главная</a>
                    </li>
                    <li class="nav__item">
                        <a href="/book/0/0" class="nav__link">Учебник</a>
                    </li>
                    <li class="nav__item">
                        <a href="/stats" class="nav__link">Статистика</a>
                    </li>
                    <li class="nav__item dropdown">
                        <span>Игры</span>
                        <ul class="dropdown__menu">
                          <li class="dropdown__menu-item">
                              <a href="/games/sprint">Спринт →</a>
                          </li>
                          <li class="dropdown__menu-item">
                              <a href="/games/audio-call">Аудио-вызов →</a>
                          </li>
                        </ul>
                    </li>
                    <li class="nav__item">
                        <a href="/about" class="nav__link">О команде</a>
                    </li>
                </ul>
            </nav>
        </div>    
        <div class="header__user-links">
            <a href="#" class="bttn bttn--transparent js-signin-modal-trigger" data-routerjs-ignore data-signin="login">Войти →</a>
            <div class="user">
               <div class="user__avatar"></div>
               <div class="user__name"></div>
            </div>
            <a href="#" class="bttn bttn--transparent" data-routerjs-ignore data-signin="logout">Выход →</a>
            <a href="#" class="bttn js-signin-modal-trigger" data-routerjs-ignore data-signin="signup">Регистрация</a>
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
        splash.classList.add('parallax');
        const splashContainer = document.createElement('div');
        splashContainer.classList.add('container');
        splash.appendChild(splashContainer);
        splashContainer.innerHTML += `
        <div class="splash__wrapper">
          <h3 class="splash__subtitle">Онлайн Учeбник</h3>
          <h2 class="splash__title">Изучай английский вместе с нами.</h2>
          <p class="splash__description">Практикуйте английский язык и изучайте новое с помощью платформы</p>
          <div class="splash__buttons">
              <a href="#" class="bttn bttn--transparent js-signin-modal-trigger" data-routerjs-ignore="" data-signin="login">Войти →</a>
              <a href="#benefits" class="bttn bttn--light" data-routerjs-ignore="true">О платформе</a>
          </div>
          <div class="app-statistic">
              <div class="words">
                  <span class="numbers">600</span>
                  <span class="text">Популярных слов</span>
              </div>
              <div class="games">
                  <span class="numbers">2</span>
                  <span class="text">Мини-игры</span>
              </div>
          </div>
        </div>
        `;
        return splash;
    }

    sectionGames(gameLinkSprintGame: string, gameLinkAudioGame: string, disableButton?: string) {
        const games = document.createElement('div');
        games.classList.add('page__games');
        games.classList.add('games');
        games.innerHTML += `
          <div class="games__list">
              <div class="game game--sprint">
                    <img src="../assets/img/icon-sprint.svg" class="game__img">
                    <a href="${gameLinkSprintGame}" class="bttn bttn--transparent game__bttn ${disableButton}">Спринт</a>
              </div>
              <div class="game game--audio-call">
                    <img src="../assets/img/icon-audio-call.svg" class="game__img">
                    <a href="${gameLinkAudioGame}" class="bttn bttn--transparent game__bttn ${disableButton}">Аудио-вызов</a>
              </div>
          </div>
      `;
        return games;
    }

    sectionBenefits() {
        const benefits = document.createElement('section');
        benefits.classList.add('benefits');
        benefits.classList.add('benefits');
        benefits.innerHTML += `
          <div class="benefits__item" id="benefits">
              <div class="container">
                  <div class="section-img">
                      <img src="../assets/img/section1-bg.png">
                  </div>
                  <div class="section-right">
                      <h3 class="section__title">Изучай язык в игровой форме</h3>
                      <p class="section__description">
                          Сделайте изучение слов более увлекательным с помощью мини-игр
                      </p>
                      <div class="games">
                          <div class="games__list">
                              <div class="game game--sprint">
                                  <img src="../assets/img/icon-sprint.svg" class="game__img">
                                  <a href="/games/sprint" class="bttn bttn--transparent game__bttn">Спринт →</a>
                              </div>
                              <div class="game game--audio-call">
                                  <img src="../assets/img/icon-audio-call.svg" class="game__img">
                                  <a href="/games/audio-call" class="bttn bttn--transparent game__bttn">Аудио-вызов →</a>
                              </div>
                          </div>
                      </div>    
                  </div>
              </div>    
          </div>

          <div class="benefits__item">
              <div class="container">
                  <div class="section-img">
                      <img src="../assets/img/section2-bg.png">
                  </div>
                  <div class="section-right">
                      <h3 class="section__title">Увеличь свой словарный запас</h3>
                      <p class="section__description">
                          Традиционные и новые эффективные подходы к изучению слов
                      </p>
                      <a href="/book/0/0" class="bttn bttn--light">Учебник →</a>
                  </div>
              </div>    
          </div>

          <div class="benefits__item">
              <div class="container">
                  <div class="section-img">
                      <img src="../assets/img/section3-bg.png">
                  </div>
                  <div class="section-right">
                      <h3 class="section__title">Следи за прогрессом каждый день</h3>
                      <p class="section__description">
                          Сохраняй статистику своих достижений, изученных слов и ошибок
                      </p>
                      <a href="/stats" class="bttn bttn--light">Статистика →</a>
                  </div>
              </div>
          </div>
        `;
        return benefits;
    }

    footer() {
        const footer = document.createElement('footer');
        footer.classList.add('footer');
        const footerContainer = document.createElement('div');
        footerContainer.classList.add('container');
        footer.appendChild(footerContainer);
        footerContainer.innerHTML += `
        <div class="footer__wrapper">
            <div class="footer-left">
                <nav class="nav footer__menu">
                    <ul class="nav__list">
                        <li class="nav__item">
                            <a href="/" class="nav__link">Главная</a>
                        </li>
                        <li class="nav__item">
                            <a href="/book/0/0" class="nav__link">Учебник</a>
                        </li>
                        <li class="nav__item">
                            <a href="/stats" class="nav__link">Статистика</a>
                        </li>
                        <li class="nav__item">
                            <a href="/games/sprint" class="nav__link">Спринт</a>
                        </li>
                        <li class="nav__item">
                            <a href="/games/audio-call" class="nav__link">Аудио-вызов</a>
                        </li>
                    </ul>
                </nav>
            </div>    
            <div class="footer-right">
                <nav class="nav footer__menu">
                    <ul class="nav__list">
                        <li class="nav__item">
                            <a href="https://github.com/Mrdoker1/" class="nav__link" target="_blank">Mrdoker1</a>
                        </li>
                        <li class="nav__item">
                            <a href="https://github.com/GeoBo/" class="nav__link" target="_blank">GeoBo</a>
                        </li>
                        <li class="nav__item">
                        <a href="https://github.com/makrakvladislav/" class="nav__link" target="_blank">makrakvladislav</a>
                        </li>
                    </ul>
                </nav>  
            </div>
        </div>
        <div class="footer-bottom">
            <div class="footer__social">
                <nav class="nav">
                    <ul class="nav__list">
                        <li class="nav__item"><a href="#" class="icon icon--git"></a></li>
                        <li class="nav__item"><a href="#" class="icon icon--rs"></a></li>
                        <li class="nav__item"><a href="#" class="icon icon--yt"></a></li>
                    </ul>
                </nav>
            </div>
            <div class="footer__copyright">
                ©2022 RS LANG. <a href="https://rs.school/js/" target="_blank">Project for RS School JS Course.</a>
            </div>
        </div>
     
        `;
        return footer;
    }

    //Pages
    pageAbout() {
        const pageAbout = document.createElement('div');
        pageAbout.classList.add('page__about');
        pageAbout.classList.add('page');
        const pageAboutContainer = document.createElement('div');
        pageAboutContainer.classList.add('container');
        pageAboutContainer.appendChild(pageAbout);
        pageAbout.innerHTML = `
      <div class="about__list">
          <div class="statistics-denied">
            <div class="about-avatar-1"></div>
            <div class="statistics-denied__body">
              <div class="statistics-denied__heading">
                  <div class="statistics-denied__heading-header">Mrdoker1</div>
                  <div class="statistics-denied__heading-subtitle">Сделал дизайн, запросы к api, статистику, игру Спринт, немного верстал и курировал разработку.</div>
              </div>
            </div>
          </div>

          <div class="statistics-denied">
            <div class="about-avatar-2"></div>
            <div class="statistics-denied__body">
              <div class="statistics-denied__heading">
                  <div class="statistics-denied__heading-header">GeoBo</div>
                  <div class="statistics-denied__heading-subtitle">Сделал авторизацию, игру Аудио-вызов.</div>
              </div>
            </div>
          </div>

          <div class="statistics-denied">
            <div class="about-avatar-3"></div>
            <div class="statistics-denied__body">
              <div class="statistics-denied__heading">
                  <div class="statistics-denied__heading-header">makrakvladislav</div>
                  <div class="statistics-denied__heading-subtitle">Сделал главную страницу приложения, электронный учебник.</div>
              </div>
            </div>
          </div>
      </div>    
      `;
        return pageAboutContainer;
    }

    pageBook(settings: ISettings) {
        const pageBook = document.createElement('div');
        pageBook.classList.add('page__book');
        pageBook.classList.add('page');
        const pageBookContainer = document.createElement('div');
        pageBookContainer.classList.add('container');
        pageBookContainer.appendChild(pageBook);
        pageBook.innerHTML += `
            <div class="page-header">
                <div class="page__menu">
                    <a href="/book/0/0" class="menu__item hat-icon">Учебник</a>
                </div>
                <div class="page-header__right">
                </div>
            </div>
        `;
        const wordsList = document.createElement('div');

        const bookView = settings.optional.listView ? '' : 'grid';

        wordsList.classList.add('words__list', bookView);
        pageBook.append(wordsList);
        return pageBookContainer;
    }

    wordLevels() {
        const wordLevelsList = document.createElement('div');
        wordLevelsList.classList.add('word-levels__list');
        wordLevelsList.classList.add('align-center');

        for (let i: number = 1; i <= 6; i++) {
            let levelDiff;
            let levelName;
            let className;
            let counter;
            if (i <= 2) {
                if (i % 2) {
                    counter = 1;
                } else {
                    counter = 2;
                }
                levelName = 'A';
                levelDiff = 'Easy';
                className = 'label--green';
            } else if (i > 2 && i <= 4) {
                if (i % 2) {
                    counter = 1;
                } else {
                    counter = 2;
                }
                levelName = 'B';
                levelDiff = 'Medium';
                className = 'label--yellow';
            } else if ((i: number) => 4 && i <= 8) {
                if (i % 2) {
                    counter = 1;
                } else {
                    counter = 2;
                }
                levelName = 'C';
                levelDiff = 'Hard';
                className = 'label--red';
            }

            const wordLevels = `  
                <a href="/book/${i - 1}/0" class="word-levels__item">
                    ${levelName}${counter} <span class="label ${className}">${levelDiff}</span>
                </a>
            `;
            wordLevelsList.innerHTML += wordLevels;
        }
        return wordLevelsList;
    }

    bookSettings(settings: ISettings) {
        const component = `
            <div class="page__settings dropdown">
                <span class="icon icon--gear"></span>
                <ul class="dropdown__menu">
                    <li class="dropdown__menu-item">
                        <input class="settings-value-checkbox" type="checkbox" id="grid" ${
                            settings.optional.listView ? 'checked' : ''
                        }>
                        <label class="settings-value-label" for="grid">Показывать слова списком</label>
                    </li>
                    <li class="dropdown__menu-item">
                        <input class="settings-value-checkbox" type="checkbox" id="hide-buttons" ${
                            settings.optional.showButtons ? 'checked' : ''
                        }>
                        <label class="settings-value-label" for="hide-buttons">Показывать кнопки 'в изученные' и 'в словарь'</label>
                    </li>
                </ul>
            </div>
        `;
        return component;
    }

    hardWords() {
        const hardWords = `
            <a href="/book/6/0" class="menu__item book-icon">Словарь</a>
        `;
        return hardWords;
    }

    hardWordsEmpty() {
        const emptyMessage = `
            <div class="container align-center">
              <div class="empty-message">
                  <div class="empty__img">
                      <img src="./assets/img/empty-img.png">
                  </div>
                  <div class="empty__info">
                      <h2 class="empty__title">
                          В этом разделе пока нет слов
                      </h2>
                      <p class="empty__description">
                          Чтобы сохранять сложные слова для дальнейшего изучения перейдите в учебник и выбирите ‘добавить в словарь’
                      </p>
                      <a href="/book/0/0" class="bttn empty__bttn">В учебник</a>
                  </div>
              </div>
            </div>  
        `;
        return emptyMessage;
    }

    pageHardWordsDenied() {
        const pageStatisticsContainer = document.createElement('div');
        pageStatisticsContainer.classList.add('container', 'align-center');

        pageStatisticsContainer.innerHTML = `
          <div class="statistics-denied">
              <div class="empty-book-image"></div>
              <div class="statistics-denied__body">
                  <div class="statistics-denied__heading">
                      <div class="statistics-denied__heading-header">Извините, словарь недоступен 🥺</div>
                      <div class="statistics-denied__heading-subtitle">Чтобы получтить доступ к словарю зарегистрируйтесь или войдите в аккаунт</div>
                  </div>
                  <div class="statistics-denied__buttons">
                      <div class="bttn bttn--transparent statistics-denied__login js-signin-modal-trigger" data-signin="login">Войти →</div>
                      <div class="bttn statistics-denied__register js-signin-modal-trigger" data-signin="signup">Регистрация</div>
                  </div>
              </div>
          </div>
      `;

        return pageStatisticsContainer;
    }

    bookPagination(levelNumber: number, pagesNumber: number) {
        const bookPagination = document.createElement('div');
        bookPagination.classList.add('pagination');
        const paginationPrev = `
            <a href="/book/${levelNumber}/0" class="pagination__item">
            ←
            </a>
        `;
        const paginationNext = `
            <a href="/book/${levelNumber}/0" class="pagination__item">
            →
            </a>
        `;
        for (let i = 0; i < pagesNumber; i++) {
            const pagination = `
                <a href="/book/${levelNumber}/${i}" class="pagination__item">
                    ${i + 1}
                </a>
            `;
            bookPagination.innerHTML += pagination;
        }
        //bookPagination.insertAdjacentHTML('afterbegin', paginationPrev);
        //bookPagination.insertAdjacentHTML('beforeend', paginationNext);
        return bookPagination;
    }

    pagination(level: number, pagesSequence: number[], pagesCount?: number) {
        const bookPagination = document.createElement('div');
        bookPagination.classList.add('pagination');
        let firstPageSequence = [...pagesSequence].shift();
        let pagination = '';
        if (1 !== firstPageSequence!)
            pagination = `
            <a href="/book/${level}/0" class="pagination__item">←</a>`;
        pagesSequence.forEach((page) => {
            pagination += `
                <a href="/book/${level}/${page - 1}" class="pagination__item">
                    ${page}
                </a>`;
        });
        let lastPage = pagesCount! - 1;
        let lastPageSequence = [...pagesSequence].pop();
        if (lastPage !== lastPageSequence! - 1)
            pagination += `
        <a href="/book/${level}/${lastPage}" class="pagination__item">→</a>`;

        bookPagination.innerHTML = pagination;
        return bookPagination;
    }

    cardWord(data: IWord, loginStatus: Boolean, id: string, hardWord?: Boolean, easyWord?: Boolean, stats?: IUserWord) {
        let bttnAddToHard;
        let bttnAddToEasy;
        if (loginStatus) {
            bttnAddToHard = `<button class="bttn bttn--red" data-handle="add-to-hard" data-id="${id}">Добавить в словарь</button>`;
            bttnAddToEasy = `<button class="bttn bttn--green" data-handle="add-to-easy" data-id="${id}">Добавить в изученные</button>`;
        } else {
            bttnAddToHard = '';
            bttnAddToEasy = '';
        }

        let stateClass;
        let stateText;
        if (hardWord) {
            stateClass = 'hard';
            stateText = 'сложное';
            bttnAddToHard = `<button class="bttn bttn--red" data-handle="delete-from-hard" data-id="${id}">Удалить из словаря</button>`;
        } else if (easyWord) {
            stateClass = 'easy';
            stateText = 'изученное';
            bttnAddToEasy = `<button class="bttn bttn--green" data-handle="delete-from-easy" data-id="${id}">Удалить из изученых</button>`;
        } else {
            stateClass = '';
            stateText = '';
        }

        let statisctic = '';
        if (
            stats !== undefined &&
            stats?.optional?.total !== undefined &&
            stats?.optional?.right !== undefined &&
            stats?.optional?.series !== undefined
        ) {
            statisctic = `
              <ul class="stat__list">
                  <li><span class="icon icon--bookmark"></span>${stats?.optional?.total} <span class="text">встретилось</span></li>
                  <li><span class="icon icon--star"></span>${stats?.optional?.right} <span class="text">изучено</span></li>
                  <li><span class="icon icon--lightning-w"></span>${stats?.optional?.series} <span class="text">лучшая серия</span></li>
              </ul>
          `;
        }

        const card = `
          <div class="card card-word ${stateClass}">
              <div class="card-left">
                  ${statisctic}
                  <img src="https://rslang-learnwords-app.herokuapp.com/${data.image}" class="card__image">
              </div>
              <div class="card-right">
                  <div class="card__header">
                      <div class="card__title">
                          <span class="word-title">${data.word}&nbsp;/&nbsp;</span><span class="word-translate">${data.wordTranslate}</span>
                          <div class="card__sub-title">
                              <span class="card-word__transcription">${data.transcription}</span>
                              <span class="card-word__status label">${stateText}</span>
                          </div>
                      </div> 
                      <div class="card-word__audio">
                          <button class="play-icon"></button>
                      </div>
                  </div>
                  <div class="card-word__text-meaning">
                      <p>${data.textMeaning}&nbsp;&ndash;&nbsp;${data.textMeaningTranslate}</p>
                  </div>
                  <div class="card-word__text-example">
                      <p>${data.textExample}&nbsp;&ndash;&nbsp;${data.textExampleTranslate}</p>
                  </div>

                  <div class="card__bottom">
                      ${bttnAddToEasy}
                      ${bttnAddToHard}
                  </div>
              </div> 
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

    //Statistics
    pageStatistics(statistics: IStatistics) {
        //Container for content
        const pageStatisticsContainer = document.createElement('div');
        pageStatisticsContainer.classList.add('container', 'align-center');
        //Wrapper for page content
        const pageStatistics = document.createElement('div');
        pageStatistics.classList.add('statistics__wrapper');

        //Tabs
        const pageStatisticsTabs = document.createElement('div');
        pageStatisticsTabs.classList.add('statistics__tabs');
        const pageStatisticsDailyTab = document.createElement('div');
        const pageStatisticsTotalTab = document.createElement('div');
        pageStatisticsDailyTab.classList.add('statistics__tabs-tab');
        pageStatisticsDailyTab.classList.add('active');
        pageStatisticsTotalTab.classList.add('statistics__tabs-tab');
        pageStatisticsDailyTab.textContent = 'За день';
        pageStatisticsTotalTab.textContent = 'За все время';

        pageStatisticsDailyTab.addEventListener('click', () => {
            console.log('Daily');
            pageStatisticsDailyTab.classList.add('active');
            pageStatisticsTotalTab.classList.remove('active');
            const container = getHTMLElement(document.querySelector('.statistics__container'));
            container.innerHTML = '';
            container.appendChild(this.statistics(statisticType.Daily, statistics));
            container.appendChild(this.statisticsCharts(statisticType.Daily, statistics));
        });

        pageStatisticsTotalTab.addEventListener('click', () => {
            console.log('Total');
            pageStatisticsTotalTab.classList.add('active');
            pageStatisticsDailyTab.classList.remove('active');
            const container = getHTMLElement(document.querySelector('.statistics__container'));
            container.innerHTML = '';
            container.appendChild(this.statistics(statisticType.Total, statistics));
            container.appendChild(this.statisticsCharts(statisticType.Total, statistics));
        });

        pageStatisticsTabs.appendChild(pageStatisticsDailyTab);
        pageStatisticsTabs.appendChild(pageStatisticsTotalTab);

        //Container for statistics
        const statisticsContainer = document.createElement('div');
        statisticsContainer.classList.add('statistics__container');
        statisticsContainer.appendChild(this.statistics(statisticType.Daily, statistics));
        statisticsContainer.appendChild(this.statisticsCharts(statisticType.Daily, statistics));

        pageStatistics.appendChild(pageStatisticsTabs);
        pageStatistics.appendChild(statisticsContainer);
        pageStatisticsContainer.appendChild(pageStatistics);
        return pageStatisticsContainer;
    }

    pageStatisticsDenied() {
        const pageStatisticsContainer = document.createElement('div');
        pageStatisticsContainer.classList.add('container', 'align-center');

        pageStatisticsContainer.innerHTML = `
            <div class="statistics-denied">
                <div class="statistics-image"></div>
                <div class="statistics-denied__body">
                    <div class="statistics-denied__heading">
                        <div class="statistics-denied__heading-header">Извините, статистика недоступна 🥺</div>
                        <div class="statistics-denied__heading-subtitle">Чтобы получать статистику и следить за своими результатами зарегистрируйтесь или войдите в аккаунт</div>
                    </div>
                    <div class="statistics-denied__buttons">
                        <div class="bttn bttn--transparent statistics-denied__login js-signin-modal-trigger" data-signin="login">Войти →</div>
                        <div class="bttn statistics-denied__register js-signin-modal-trigger" data-signin="signup">Регистрация</div>
                    </div>
                </div>
            </div>
        `;

        return pageStatisticsContainer;
    }

    statistics(type: statisticType, statistics: IStatistics) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        let wordLearned = 0;
        let rightAnswers = 0;
        let wordLearnedSprint = 0;
        let rightAnswersSprint = 0;
        let recordSprint = 0;
        let recordAudioCall = 0;
        let wordLearnedAudiocall = 0;
        let rightAnswersAudiocall = 0;
        let wordTotal = 0;
        let wordTotalSprint = 0;
        let wordTotalAudiocall = 0;
        let header = 'Default Header';
        let subtitle = 'Ваша статистика по всем активностям';

        switch (type) {
            case statisticType.Daily:
                header = 'Статистика за сегодня';
                for (let day in statistics.optional) {
                    const statisticDay = statistics.optional[day];
                    const statisticDate = new Date(statisticDay.date);
                    statisticDate.setHours(0, 0, 0, 0);
                    if (today.getTime() == statisticDate.getTime()) {
                        updateData(statisticDay);
                    } else {
                        //console.log('false');
                    }
                }
                break;
            case statisticType.Total:
                header = 'Статистика за все время';
                for (let day in statistics.optional) {
                    const statisticDay = statistics.optional[day];
                    updateData(statisticDay);
                }
                break;
        }

        function updateData(statisticDay: IStatisticsDay) {
            wordLearned += statisticDay.sprint.learned + statisticDay.audio.learned + statisticDay.book.learned;
            rightAnswers += statisticDay.sprint.right + statisticDay.audio.right;
            wordLearnedSprint += statisticDay.sprint.learned;
            wordLearnedAudiocall += statisticDay.audio.learned;
            rightAnswersSprint += statisticDay.sprint.right;
            rightAnswersAudiocall += statisticDay.audio.right;
            wordTotalSprint += statisticDay.sprint.total;
            wordTotalAudiocall += statisticDay.audio.total;
            wordTotal = wordTotalSprint + wordTotalAudiocall;
            if (recordSprint < statisticDay.sprint.record) {
                recordSprint = statisticDay.sprint.record;
            }
            if (recordAudioCall < statisticDay.audio.record) {
                recordAudioCall = statisticDay.audio.record;
            }
        }

        const stats = document.createElement('div');
        stats.classList.add('statistics');

        const rightAnswersPercent = (rightAnswers / (wordTotal <= 0 ? 1 : wordTotal)) * 100;
        const rightAnswersSprintPercent = (rightAnswersSprint / (wordTotalSprint <= 0 ? 1 : wordTotalSprint)) * 100;
        const rightAnswersAudiocallPercent =
            (rightAnswersAudiocall / (wordTotalAudiocall <= 0 ? 1 : wordTotalAudiocall)) * 100;

        stats.innerHTML = `
        <div class="statistics__body">
            <div class="statistics__body-heading">
                <div class="statistics__header">${header}</div>
                <div class="statistics__subtitle">${subtitle}</div>
            </div>
            <div class="statistics__body-info">
                <div class="statistics__wordLearnedTotal">
                    <div class="statistics__wordLearnedTotal-number">${wordLearned}<span>+</span></div>
                    <div class="statistics__wordLearnedTotal-subtitle">слов изучено</div>
                </div>
                <div class="divider-vertical"></div>
                <div class="statistics__rightAnswersTotal">
                    <div class="statistics__rightAnswersTotal-number">
                        ${typeof rightAnswersPercent === 'number' ? rightAnswersPercent.toFixed(1) : 0}<span>%</span>
                    </div>
                    <div class="statistics__rightAnswersTotal-subtitle">правильных ответов</div>
                </div>
            </div>
            <div class="statistics__sprint">
                <div class="statistics__sprint sprint-image"></div>
                <div class="statistics__sprint-body">
                    <div class="statistics__sprint-heading">
                        <div class="statistics__sprint-header">Спринт</div>
                        <div class="label statistics__sprint-label">на скорость</div>
                    </div>
                    <div class="statistics__sprint-info">
                        <span><b>${wordLearnedSprint}</b> слов изучено</span>
                        <span><b>${
                            typeof rightAnswersSprintPercent === 'number' ? rightAnswersSprintPercent.toFixed(1) : 0
                        }%</b> правильных ответов</span>
                        <span><b>${recordSprint}</b> лучшая серия правильных ответов</span>
                    </div>
                </div>
            </div>
            <div class="divider-horizontal"></div>
            <div class="statistics__audiocall">
            <div class="statistics__audiocall audiocall-image"></div>
                <div class="statistics__audiocall-body">
                    <div class="statistics__audiocall-heading">
                        <div class="statistics__audiocall-header">Аудиовызов</div>
                        <div class="label statistics__audiocall-label">на слух</div>
                    </div>
                    <div class="statistics__audiocall-info">
                        <span><b>${wordLearnedAudiocall}</b> слов изучено</span>
                        <span><b>${
                            typeof rightAnswersAudiocallPercent === 'number'
                                ? rightAnswersAudiocallPercent.toFixed(1)
                                : 0
                        }%</b> правильных ответов</span>
                        <span><b>${recordAudioCall}</b> лучшая серия правильных ответов</span>
                    </div>
                </div>
            </div>
        </div>
        `;

        return stats;
    }

    statisticsCharts(type: statisticType, statistics: IStatistics) {
        console.log(statistics);
        const container = document.createElement('div');
        container.classList.add('statistics__charts');
        const empty = document.createElement('div');
        empty.classList.add('statistics__empty');
        empty.innerHTML = `<div>Нет данных за сегодня</div>`;
        let header = '';
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const canvas = document.createElement('canvas');
        canvas.id = 'Chart';
        let isEmpty = true;

        switch (type) {
            case statisticType.Daily:
                header = 'Колличество изученных слов на сегодня';
                let sprintLearned = 0;
                let audioLearned = 0;
                let bookLearned = 0;
                for (let day in statistics.optional) {
                    const statisticDay = statistics.optional[day];
                    const statisticDate = new Date(statisticDay.date);
                    statisticDate.setHours(0, 0, 0, 0);
                    if (today.getTime() == statisticDate.getTime()) {
                        sprintLearned += statisticDay.sprint.learned;
                        audioLearned += statisticDay.audio.learned;
                        bookLearned += statisticDay.book.learned;
                        isEmpty = false;
                    }
                }
                if (isEmpty) {
                    console.log('No related Data');
                    container.appendChild(empty);
                } else {
                    const myChart = new Chart(canvas, {
                        type: 'doughnut',
                        data: {
                            labels: ['Спринт', 'Аудиовызов', 'Добавлено в изученное'],
                            datasets: [
                                {
                                    label: 'Dataset 1',
                                    data: [sprintLearned, audioLearned, bookLearned],
                                    backgroundColor: ['#5996A5', '#639B6D', '#A15993'],
                                },
                            ],
                        },
                        options: {
                            responsive: true,
                            plugins: {
                                legend: {
                                    position: 'top',
                                },
                                title: {
                                    display: true,
                                    text: header,
                                },
                            },
                        },
                    });
                    container.appendChild(canvas);
                }
                break;
            case statisticType.Total:
                header = 'Выучено слов по дням';
                const dates: Array<string> = [];
                const sprintData: Array<number> = [];
                const audioCallData: Array<number> = [];

                const sortedStatistics = Object.entries(statistics.optional).sort(function (a, b) {
                    return new Date(a[1].date).getTime() - new Date(b[1].date).getTime();
                });

                sortedStatistics.forEach((day) => {
                    const statisticDay = day[1];
                    CustomDate.locale(ru);
                    dates.push(CustomDate.format(new Date(statisticDay.date), 'D MMM YYYY').toString());
                    sprintData.push(statisticDay.sprint.learned);
                    audioCallData.push(statisticDay.audio.learned);
                });

                const data = {
                    labels: dates,
                    datasets: [
                        {
                            label: 'Спринт',
                            data: sprintData,
                            borderColor: '#945069',
                            backgroundColor: '#945069',
                        },
                        {
                            label: 'Аудиовызов',
                            data: audioCallData,
                            borderColor: '#2B788B',
                            backgroundColor: '#2B788B',
                        },
                    ],
                };
                const myChart = new Chart(canvas, {
                    type: 'line',
                    data: data,
                    options: {
                        responsive: true,
                        plugins: {
                            legend: {
                                position: 'top',
                            },
                            title: {
                                display: true,
                                text: header,
                            },
                        },
                    },
                });
                container.appendChild(canvas);
                break;
        }

        return container;
    }

    //Games
    gameDifficulty(type: gameType) {
        const container = document.createElement('div');
        container.classList.add('container');
        let levels = '';
        let title;
        let desc;
        let skill;
        let gameImage = '';
        let control;

        if (type === gameType.AudioCall) {
            title = 'Аудиовызов';
            desc = 'Прослушайте звук и выберите правильный ответ.';
            control = '<span>✦ Совет:</span> &nbsp Для управления используйте кнопки <span>1 - 5</span> на клавиатуре';
            skill = 'на слух';
            gameImage = 'audiocall-image';
        } else if (type === gameType.Sprint) {
            title = 'Спринт';
            desc = 'Вам нужно выбрать соответствует ли перевод предложенному слову.';
            control = '<span>✦ Совет:</span> &nbsp Для управления используйте кнопки <span>← →</span> на клавиатуре';
            skill = 'на скорость';
            gameImage = 'sprint-image';
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
                <input id="level-${i}" type="radio" name="radio" value="${i - 1}" ${checked}>
                <label class="levels__btn" for="level-${i}">${letter}${n}</label>
            </li>`;
            checked = '';
        }

        const html = `<div class="game">
            <div class="game__wrapper">
                <div class="game__window game__window__light">
                <div class="game__window ${gameImage}"></div>
                    <div class="game__block">
                        <div class="game__heading">
                            <h2 class="game__heading-title">${title}</h2>
                            <div class="game__heading-skill">${skill}</div>
                        </div>
                        <p class="game__desc">${desc}</p>
                        <p class="game__control">${control}</p>
                        <p class="game__text">Уровень:</p>
                        <ul class="game__levels levels">${levels}</ul>
                        <button class="bttn game__start">Начать</button>
                    </div>
                </div>
            </div>
        </div>`;

        container.innerHTML = html;
        return container;
    }

    gameSprint(multiplier: number, points: number, strike: number, word: string, translatedWord: string) {
        const container = document.createElement('div');
        let strikesHTML = '';
        let maxStrike = 3;
        for (let i = strike; i > 0; i--) {
            strikesHTML += `<div class="sprint-game__normal-strike">✦</div>`;
        }
        for (let i = maxStrike - strike; i > 0; i--) {
            strikesHTML += `<div class="sprint-game__empty-strike">✦</div>`;
        }
        container.classList.add('sprint-game__body');
        container.innerHTML = `
            <div class="sprint-game__body-info">
                <div class="sprint-game__multiplier">
                    <span>x${multiplier}</span>
                    <span>множитель</span>
                </div>
                <div class="divider-vertical"></div>
                <div class="sprint-game__points">
                    <span>${points}</span>
                    <span>очки</span>
                </div>
            </div>
            <div>
                <div class="sprint-game__body-strike">${strikesHTML}</div>
                <div class="sprint-game__body-words">
                    <div class="sprint-game__word">${word}</div>
                    <div class="sprint-game__translatedWord">${translatedWord}</div>
                </div>
            </div>
            <div class="sprint-game__body-actions">
                <button class="bttn sprint-game__true-button">Верно</button> <button class="bttn sprint-game__false-button">Неверно</button>
            </div>
        `;
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
                            <img class="audio__img" src="../assets/img/music.svg">
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
                            <span class="audio__icon-heart">♥</span>
                            <span class="audio__icon-heart">♥</span>
                            <span class="audio__icon-heart">♥</span>
                            <span class="audio__icon-heart">♥</span>
                            <span class="audio__icon-heart">♥</span>
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
                        <button class="bttn audio__know-btn">Не знаю</button>  
                        <button class="bttn audio__next-btn hidden">Дальше</button>  
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
                            <input class="bttn cd-signin-modal__input--full-width" type="submit" value="Войти">
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
                            <input class="bttn cd-signin-modal__input--full-width cd-signin-modal__input--has-padding" type="submit" value="Создать аккаунт">
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
        chart.style.width = `${chartSize}px`;
        chart.style.height = `${chartSize}px`;
        let opacity = 100;
        const roundRadius = chartSize / 2;
        const roundCircum = 2 * roundRadius * Math.PI;
        const roundDraw = (percent * roundCircum) / 100;

        if (percent <= 0) {
            opacity = 0;
        }

        chart.innerHTML = `
        <div class="chart-wrapper">
            <svg class="chart-background" viewbox="0 0 ${chartSize} ${chartSize}" data-percent="100" stroke=${backgroundColor} stroke-width="${strokeSize}">
                <circle cx="${roundRadius}" cy="${roundRadius}" r="${roundRadius - strokeSize / 2}" />
            </svg>
        </div>
        <div class="chart-wrapper">
            <svg class="chart-percentage" viewbox="0 0 ${chartSize} ${chartSize}" data-percent="0" stroke=${color} stroke-width="${strokeSize}">
                <circle cx="${roundRadius}" cy="${roundRadius}" r="${
            roundRadius - strokeSize / 2
        }" stroke-opacity="${opacity}" stroke-dasharray="${roundDraw} ${roundCircum}"/>
            </svg>
        </div>
        `;

        return chart;
    }

    //GameResult
    gameResult(
        gameType: gameType,
        message: string,
        chartList: IResultChart[],
        knowingWords: IWord[],
        unknowingWords: IWord[],
        base: string
    ) {
        const container = document.createElement('div');
        container.classList.add('container', 'align-center');
        const wrapper = document.createElement('div');
        wrapper.classList.add('gameresult__wrapper');

        wrapper.append(this.gameResultInfo(gameType, message, chartList));
        wrapper.append(this.gameResultWords(knowingWords, unknowingWords, base));

        container.appendChild(wrapper);
        return container;
    }

    gameResultChart(type: gameChart, maxValue: number, currentValue: number) {
        let color = '';
        let backgroundColor = '';
        let upperLabel = '';
        let value = `${currentValue}`;
        let buttomLabel = '';
        let percent = (currentValue / maxValue) * 100;

        switch (type) {
            case gameChart.Healths:
                color = '#945069';
                backgroundColor = '#F2D4DC';
                upperLabel = 'осталось';
                value = `<span class="gameresult-chart__heart">♥</span>${currentValue}`;
                if (currentValue == 1) {
                    buttomLabel = 'жизнь';
                } else if (currentValue > 1 && currentValue < 5) {
                    buttomLabel = 'жизни';
                } else if (currentValue < 1 || currentValue > 4) {
                    buttomLabel = 'жизней';
                }
                break;
            case gameChart.Words:
                color = '#639B6D';
                backgroundColor = '#B1CDB6';
                upperLabel = `${maxValue}/`;
                if (currentValue == 1) {
                    buttomLabel = 'слово';
                } else if (currentValue > 1 && currentValue < 5) {
                    buttomLabel = 'слова';
                } else if (currentValue < 1 || currentValue > 4) {
                    buttomLabel = 'слов';
                }
                break;
            case gameChart.Points:
                color = '#2B788B';
                backgroundColor = '#C3DCE3';
                upperLabel = 'получено';
                if (currentValue == 1) {
                    buttomLabel = 'очко';
                } else if (currentValue > 1 && currentValue < 5) {
                    buttomLabel = 'очка';
                } else if (currentValue < 1 || currentValue > 4) {
                    buttomLabel = 'очков';
                }
                break;
        }

        const chart = this.chart(120, 5, percent, color, backgroundColor);
        const gameResultChart = document.createElement('div');
        const gameResultChartBody = document.createElement('div');

        gameResultChart.classList.add('gameresult-chart');
        gameResultChartBody.classList.add('gameresult-chart__body');

        gameResultChartBody.innerHTML = `
            <div class="gameresult-chart__body-upper">${upperLabel}</div>
            <div class="gameresult-chart__body-value">${value}</div>
            <div class="gameresult-chart__body-buttom">${buttomLabel}</div>
        `;

        gameResultChart.appendChild(chart);
        gameResultChart.appendChild(gameResultChartBody);

        return gameResultChart;
    }

    gameResultInfo(type: gameType, message: string, chartList: Array<IResultChart>) {
        const container = document.createElement('div');
        const charts = document.createElement('div');
        let header = '';
        let resultMessage = message;
        chartList.forEach((chart) => {
            let node = this.gameResultChart(chart.type, chart.maxValue, chart.currentValue);
            charts.appendChild(node);
        });
        container.classList.add('gameresult');

        switch (type) {
            case gameType.AudioCall:
                header = 'Ваш Аудиовызов';
                break;
            case gameType.Sprint:
                header = 'Ваш Спринт';
                break;
        }

        container.innerHTML = `
        <div class="container">
            <div class="gameresult__info">
                <img src="../assets/img/result.svg">
                <div class="gameresult__info-body">
                    <div class="gameresult__header">${header}</div>
                    <div class="gameresult__message">${resultMessage}</div>
                    <div class="gameresult__charts">${charts.innerHTML}</div>
                </div>
            </div>
            <div class="gameresult__actions">
                <button class="bttn bttn--transparent gameresult__button-replay">Сыграть еще раз</button>
                <button class="gameresult__button-tobook bttn bttn--light">Перейти в учебник</button>  
            </div>
        </div>`;
        return container;
    }

    gameResultWord(word: IWord, base: string) {
        const gameResultWord = document.createElement('div');
        gameResultWord.classList.add('gameresultword');
        gameResultWord.innerHTML = `
        <div class="gameresultword__icon" data-src="${word.audio}">
            <div class="play-icon"></div>
        </div>
        <div class="gameresultword__body">
            <div class="gameresultword__body-word">${word.word}</div>
            <span>-</span>
            <div class="gameresultword__body-translation">${word.wordTranslate}</div>
        </div>
        `;
        return gameResultWord;
    }

    gameResultWords(knowingWords: Array<IWord>, unknowingWords: Array<IWord>, base: string) {
        const gameResultWords = document.createElement('div');
        const knowingWordsList = document.createElement('div');
        const unknowingWordsList = document.createElement('div');

        gameResultWords.classList.add('gameresultwords');
        knowingWordsList.classList.add('gameresultwords__list');
        unknowingWordsList.classList.add('gameresultwords__list');

        knowingWords.forEach((knowingWord) => {
            const word = this.gameResultWord(knowingWord, base);
            knowingWordsList.appendChild(word);
        });

        unknowingWords.forEach((unknowingWord) => {
            const word = this.gameResultWord(unknowingWord, base);
            unknowingWordsList.appendChild(word);
        });

        const knowingWordsContainer = document.createElement('div');
        const unknowingWordsContainer = document.createElement('div');

        knowingWordsContainer.classList.add('knowingwords__container');
        unknowingWordsContainer.classList.add('unknowingwords__container');

        const knowingWordsHeader = document.createElement('div');
        const unknowingWordsHeader = document.createElement('div');

        knowingWordsHeader.classList.add('knowingwords__header');
        unknowingWordsHeader.classList.add('unknowingwords__header');

        knowingWordsHeader.innerHTML = `
        <div class="knowingwords__header-title">Я знаю</div>
        <div class="knowingwords__header-label">${knowingWords.length} слов</div>
        `;

        unknowingWordsHeader.innerHTML = `
        <div class="unknowingwords__header-title">Я не знаю</div>
        <div class="unknowingwords__header-label">${unknowingWords.length} слов</div>
        `;

        knowingWordsContainer.appendChild(knowingWordsHeader);
        knowingWordsContainer.appendChild(knowingWordsList);

        unknowingWordsContainer.appendChild(unknowingWordsHeader);
        unknowingWordsContainer.appendChild(unknowingWordsList);

        gameResultWords.appendChild(knowingWordsContainer);
        gameResultWords.appendChild(unknowingWordsContainer);

        return gameResultWords;
    }

    static currentLink(path: string) {
        const navLinks = document.querySelectorAll('.header__menu a:not([href^="#"])');
        const levelLinks = document.querySelectorAll('.word-levels__list a:not([href^="#"])');
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
