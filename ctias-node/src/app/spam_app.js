import FirstPage from "./page/FirstPage";
import SecondPage from "./page/SecondPage";
import SettingPage from "./page/SettingPage.js";
import {toggleClass, findChild, findParent, hasClass} from "./util/Common";


require('./common.styl')

const _html = `
        <div class="flex h-full">
<!--            <div style="background:#625955;width:55px;" class="flex flex-col z-50 shadow page-navigator">-->

<!--                <button class="bg-white flex items-center justify-center btn-home" style="height: 108px">-->
<!--                    <svg aria-hidden="true" -->
<!--                        focusable="false" -->
<!--                        data-prefix="fas" -->
<!--                        data-icon="home" -->
<!--                        class="w-5 svg-inline&#45;&#45;fa fa-home fa-w-18" -->
<!--                        role="img" xmlns="http://www.w3.org/2000/svg" -->
<!--                        viewBox="0 0 576 512">-->
<!--                        <path fill="#625955" d="M280.37 148.26L96 300.11V464a16 16 0 0 0 16 16l112.06-.29a16 16 0 0 0 15.92-16V368a16 16 0 0 1 16-16h64a16 16 0 0 1 16 16v95.64a16 16 0 0 0 16 16.05L464 480a16 16 0 0 0 16-16V300L295.67 148.26a12.19 12.19 0 0 0-15.3 0zM571.6 251.47L488 182.56V44.05a12 12 0 0 0-12-12h-56a12 12 0 0 0-12 12v72.61L318.47 43a48 48 0 0 0-61 0L4.34 251.47a12 12 0 0 0-1.6 16.9l25.5 31A12 12 0 0 0 45.15 301l235.22-193.74a12.19 12.19 0 0 1 15.3 0L530.9 301a12 12 0 0 0 16.9-1.6l25.5-31a12 12 0 0 0-1.7-16.93z">-->
<!--                        </path>-->
<!--                    </svg>-->
<!--                </button>-->

<!--                &lt;!&ndash;<button class="flex items-center justify-center" style="height: 50px">&ndash;&gt;-->
<!--                    &lt;!&ndash;<svg aria-hidden="true" &ndash;&gt;-->
<!--                        &lt;!&ndash;focusable="false" &ndash;&gt;-->
<!--                        &lt;!&ndash;data-prefix="far" &ndash;&gt;-->
<!--                        &lt;!&ndash;data-icon="file-alt" &ndash;&gt;-->
<!--                        &lt;!&ndash;class="w-4 svg-inline&#45;&#45;fa fa-file-alt fa-w-12" role="img" &ndash;&gt;-->
<!--                        &lt;!&ndash;xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512">&ndash;&gt;-->
<!--                        &lt;!&ndash;<path fill="#fff" d="M288 248v28c0 6.6-5.4 12-12 12H108c-6.6 0-12-5.4-12-12v-28c0-6.6 5.4-12 12-12h168c6.6 0 12 5.4 12 12zm-12 72H108c-6.6 0-12 5.4-12 12v28c0 6.6 5.4 12 12 12h168c6.6 0 12-5.4 12-12v-28c0-6.6-5.4-12-12-12zm108-188.1V464c0 26.5-21.5 48-48 48H48c-26.5 0-48-21.5-48-48V48C0 21.5 21.5 0 48 0h204.1C264.8 0 277 5.1 286 14.1L369.9 98c9 8.9 14.1 21.2 14.1 33.9zm-128-80V128h76.1L256 51.9zM336 464V176H232c-13.3 0-24-10.7-24-24V48H48v416h288z">&ndash;&gt;-->
<!--                        &lt;!&ndash;</path>&ndash;&gt;-->
<!--                    &lt;!&ndash;</svg>&ndash;&gt;-->
<!--                &lt;!&ndash;</button>&ndash;&gt;-->
<!--                &lt;!&ndash;<button class="flex items-center justify-center" style="height: 50px">&ndash;&gt;-->
<!--                    &lt;!&ndash;<svg aria-hidden="true" &ndash;&gt;-->
<!--                        &lt;!&ndash;focusable="false" &ndash;&gt;-->
<!--                        &lt;!&ndash;data-prefix="far" &ndash;&gt;-->
<!--                        &lt;!&ndash;data-icon="chart-bar" &ndash;&gt;-->
<!--                        &lt;!&ndash;class="w-5 svg-inline&#45;&#45;fa fa-chart-bar fa-w-16" role="img" &ndash;&gt;-->
<!--                        &lt;!&ndash;xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">&ndash;&gt;-->
<!--                        &lt;!&ndash;<path fill="#fff" d="M396.8 352h22.4c6.4 0 12.8-6.4 12.8-12.8V108.8c0-6.4-6.4-12.8-12.8-12.8h-22.4c-6.4 0-12.8 6.4-12.8 12.8v230.4c0 6.4 6.4 12.8 12.8 12.8zm-192 0h22.4c6.4 0 12.8-6.4 12.8-12.8V140.8c0-6.4-6.4-12.8-12.8-12.8h-22.4c-6.4 0-12.8 6.4-12.8 12.8v198.4c0 6.4 6.4 12.8 12.8 12.8zm96 0h22.4c6.4 0 12.8-6.4 12.8-12.8V204.8c0-6.4-6.4-12.8-12.8-12.8h-22.4c-6.4 0-12.8 6.4-12.8 12.8v134.4c0 6.4 6.4 12.8 12.8 12.8zM496 400H48V80c0-8.84-7.16-16-16-16H16C7.16 64 0 71.16 0 80v336c0 17.67 14.33 32 32 32h464c8.84 0 16-7.16 16-16v-16c0-8.84-7.16-16-16-16zm-387.2-48h22.4c6.4 0 12.8-6.4 12.8-12.8v-70.4c0-6.4-6.4-12.8-12.8-12.8h-22.4c-6.4 0-12.8 6.4-12.8 12.8v70.4c0 6.4 6.4 12.8 12.8 12.8z">&ndash;&gt;-->
<!--                        &lt;!&ndash;</path>&ndash;&gt;-->
<!--                    &lt;!&ndash;</svg>&ndash;&gt;-->
<!--                &lt;!&ndash;</button>&ndash;&gt;-->
<!--                &lt;!&ndash;<button class="flex items-center justify-center" style="height: 50px">&ndash;&gt;-->
<!--                    &lt;!&ndash;<svg aria-hidden="true" &ndash;&gt;-->
<!--                        &lt;!&ndash;focusable="false" &ndash;&gt;-->
<!--                        &lt;!&ndash;data-prefix="fab" &ndash;&gt;-->
<!--                        &lt;!&ndash;data-icon="keycdn" &ndash;&gt;-->
<!--                        &lt;!&ndash;class="w-5 svg-inline&#45;&#45;fa fa-keycdn fa-w-16" role="img" &ndash;&gt;-->
<!--                        &lt;!&ndash;xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">&ndash;&gt;-->
<!--                        &lt;!&ndash;<path fill="#fff" d="M63.8 409.3l60.5-59c32.1 42.8 71.1 66 126.6 67.4 30.5.7 60.3-7 86.4-22.4 5.1 5.3 18.5 19.5 20.9 22-32.2 20.7-69.6 31.1-108.1 30.2-43.3-1.1-84.6-16.7-117.7-44.4.3-.6-38.2 37.5-38.6 37.9 9.5 29.8-13.1 62.4-46.3 62.4C20.7 503.3 0 481.7 0 454.9c0-34.3 33.1-56.6 63.8-45.6zm354.9-252.4c19.1 31.3 29.6 67.4 28.7 104-1.1 44.8-19 87.5-48.6 121 .3.3 23.8 25.2 24.1 25.5 9.6-1.3 19.2 2 25.9 9.1 11.3 12 10.9 30.9-1.1 42.4-12 11.3-30.9 10.9-42.4-1.1-6.7-7-9.4-16.8-7.6-26.3-24.9-26.6-44.4-47.2-44.4-47.2 42.7-34.1 63.3-79.6 64.4-124.2.7-28.9-7.2-57.2-21.1-82.2l22.1-21zM104 53.1c6.7 7 9.4 16.8 7.6 26.3l45.9 48.1c-4.7 3.8-13.3 10.4-22.8 21.3-25.4 28.5-39.6 64.8-40.7 102.9-.7 28.9 6.1 57.2 20 82.4l-22 21.5C72.7 324 63.1 287.9 64.2 250.9c1-44.6 18.3-87.6 47.5-121.1l-25.3-26.4c-9.6 1.3-19.2-2-25.9-9.1-11.3-12-10.9-30.9 1.1-42.4C73.5 40.7 92.2 41 104 53.1zM464.9 8c26 0 47.1 22.4 47.1 48.3S490.9 104 464.9 104c-6.3.1-14-1.1-15.9-1.8l-62.9 59.7c-32.7-43.6-76.7-65.9-126.9-67.2-30.5-.7-60.3 6.8-86.2 22.4l-21.1-22C184.1 74.3 221.5 64 260 64.9c43.3 1.1 84.6 16.7 117.7 44.6l41.1-38.6c-1.5-4.7-2.2-9.6-2.2-14.5C416.5 29.7 438.9 8 464.9 8zM256.7 113.4c5.5 0 10.9.4 16.4 1.1 78.1 9.8 133.4 81.1 123.8 159.1-9.8 78.1-81.1 133.4-159.1 123.8-78.1-9.8-133.4-81.1-123.8-159.2 9.3-72.4 70.1-124.6 142.7-124.8zm-59 119.4c.6 22.7 12.2 41.8 32.4 52.2l-11 51.7h73.7l-11-51.7c20.1-10.9 32.1-29 32.4-52.2-.4-32.8-25.8-57.5-58.3-58.3-32.1.8-57.3 24.8-58.2 58.3zM256 160">&ndash;&gt;-->
<!--                        &lt;!&ndash;</path>&ndash;&gt;-->
<!--                    &lt;!&ndash;</svg>&ndash;&gt;-->
<!--                &lt;!&ndash;</button>&ndash;&gt;-->
<!--                <button class="flex items-center justify-center btn-setting" style="height: 50px">-->
<!--                    <svg aria-hidden="true" -->
<!--                        focusable="false" -->
<!--                        data-prefix="fas" -->
<!--                        data-icon="cog" -->
<!--                        class="w-5 svg-inline&#45;&#45;fa fa-cog fa-w-16" role="img" -->
<!--                        xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">-->
<!--                        <path fill="#fff" d="M487.4 315.7l-42.6-24.6c4.3-23.2 4.3-47 0-70.2l42.6-24.6c4.9-2.8 7.1-8.6 5.5-14-11.1-35.6-30-67.8-54.7-94.6-3.8-4.1-10-5.1-14.8-2.3L380.8 110c-17.9-15.4-38.5-27.3-60.8-35.1V25.8c0-5.6-3.9-10.5-9.4-11.7-36.7-8.2-74.3-7.8-109.2 0-5.5 1.2-9.4 6.1-9.4 11.7V75c-22.2 7.9-42.8 19.8-60.8 35.1L88.7 85.5c-4.9-2.8-11-1.9-14.8 2.3-24.7 26.7-43.6 58.9-54.7 94.6-1.7 5.4.6 11.2 5.5 14L67.3 221c-4.3 23.2-4.3 47 0 70.2l-42.6 24.6c-4.9 2.8-7.1 8.6-5.5 14 11.1 35.6 30 67.8 54.7 94.6 3.8 4.1 10 5.1 14.8 2.3l42.6-24.6c17.9 15.4 38.5 27.3 60.8 35.1v49.2c0 5.6 3.9 10.5 9.4 11.7 36.7 8.2 74.3 7.8 109.2 0 5.5-1.2 9.4-6.1 9.4-11.7v-49.2c22.2-7.9 42.8-19.8 60.8-35.1l42.6 24.6c4.9 2.8 11 1.9 14.8-2.3 24.7-26.7 43.6-58.9 54.7-94.6 1.5-5.5-.7-11.3-5.6-14.1zM256 336c-44.1 0-80-35.9-80-80s35.9-80 80-80 80 35.9 80 80-35.9 80-80 80z">-->
<!--                        </path>-->
<!--                    </svg>-->
<!--                </button>-->
<!--            </div>-->

            <div class="flex-1 h-full pages">
                <div class="absolute h-full w-full page active" id="firstPage"></div>
                <div class="absolute flex flex-col h-full w-full page" id="secondPage"></div>
                <div class="absolute flex flex-col h-full w-full page" id="settingPage"></div>

                <div class="absolute loader-box">
                    <div class="loader"></div>
                </div>
            </div>
            
            
        </div>
        
        <div class="h-full absolute hidden" id="interude">
            interude
        </div>
        `




export class PocSpamApp {
    constructor(domSelector) {

        this.rootDomElem = document.querySelector(domSelector);
        this.rootDomElem.innerHTML = _html;

        this.firstPageElem = document.querySelector('#firstPage')
        this.secondPageElem = document.querySelector('#secondPage')
        this.settingPageElem = document.querySelector('#settingPage')

        this.firstPage = new FirstPage('#firstPage')
        this.secondPage = new SecondPage('#secondPage')
        this.settingPage = new SettingPage('#settingPage')

        this.handlePatternSearch = this.handlePatternSearch.bind(this)
        this.handleGoHome = this.handleGoHome.bind(this)
        this.handleNavigationStyle = this.handleNavigationStyle.bind(this)
        this.handleGoSetting = this.handleGoSetting.bind(this)
        this.pageToggleClass = this.pageToggleClass.bind(this)

        this.firstPage.on('patternSearch', this.handlePatternSearch.bind(this))
        this.secondPage.on('goHome', this.handleGoHome.bind(this))

        // this.rootDomElem.querySelector('.btn-home').addEventListener('click', (evt)=>{
        //     let buttonElem = findParent(evt.target, 'button')
        //     this.handleNavigationStyle(buttonElem)
        //     this.handleGoHome()
        // })
        //
        // this.rootDomElem.querySelector('.btn-setting').addEventListener('click', (evt)=>{
        //     console.log('setting button click')
        //     let buttonElem = findParent(evt.target, 'button')
        //     this.handleNavigationStyle(buttonElem)
        //     this.handleGoSetting(this.settingPageElem)
        //     // let pattern = '[{"gtype":"vertex","label":"groups","params":[]},{"gtype":"edge","label":"in_group","direction":"forward"},{"gtype":"vertex","label":"domain","params":[]}]'
        //     // this.handlePatternSearch(pattern)
        // })
    }

    handlePatternSearch(pattern, advanced=false) {
        this.secondPage.setPattern(pattern, advanced)
        this.pageToggleClass(this.secondPageElem)
    }

    handleGoHome() {
        this.pageToggleClass(this.firstPageElem)
    }

    handleNavigationStyle(target) {
        let navElems = this.rootDomElem.querySelectorAll('.page-navigator button')

        navElems.forEach(e=>{
            if(target != e) {
                e.classList.remove('bg-white')
                let pathElem = findChild(e, 'path')
                pathElem.setAttribute('fill', '#fff')
            }else{
                e.classList.add('bg-white')
                let pathElem = findChild(e, 'path')
                pathElem.setAttribute('fill', '#625955')
            }
        })
    }

    handleGoSetting(settingPage) {
        this.pageToggleClass(settingPage)
    }

    pageToggleClass(movePage) {
        let pagesElem = this.rootDomElem.querySelector('.pages')
        let pageList = pagesElem.children

        let currentPage = null
        Array.prototype.slice.call(pageList,0).filter(page=>{
            return hasClass(page, 'active')
        }).forEach(page=>{
            currentPage = page
        })

        if(currentPage != movePage) {
            toggleClass(currentPage, 'pt-page-rotatePushRight')
            toggleClass(movePage, 'active')
            toggleClass(movePage, 'pt-page-moveFromLeft')

            setTimeout(()=>{
                toggleClass(currentPage, 'active')
                toggleClass(movePage, 'pt-page-moveFromLeft')
                toggleClass(currentPage, 'pt-page-rotatePushRight')
            },600)
        }
    }
}

window.addEventListener("beforeunload", function (event) {
    event.returnValue = "Are you sure want to close";
});