import EventEmitter, {DomComponent} from "../util/EventEmitter";
import GlobeWidget from "../component/setting_page/GlobeWidget";

require('./SettingPage.styl')

const _html = `

    <div class="tabview w-full h-full flex">
        <div style="width:260px" class="bg-white flex flex-col shadow z-40">

            <div class="p-4 px-5 my-2">
                <h3 class="text-base mb-2 flex items-center">
                    SETTING PAGE
                </h3>
                <div class="text-sm"><small>설정페이지에서 원하는 데이터를 <br/>수정(필터) 또는 삭제할 수 있습니다.</small></div>
            </div>

            <ul class="w-full list-reset flex-1 overflow-y-auto overflow-x-hidden sidebar-menu-list">
                <li>
                    <button class="w-full flex items-center block p-4 px-5 text-xs active" style="height:50px">
                        <svg aria-hidden="true" 
                            focusable="false" 
                            data-prefix="fas" 
                            data-icon="skull" 
                            class="w-4 mr-4 svg-inline--fa fa-skull fa-w-16" role="img" 
                            xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                            <path fill="#625955" d="M256 0C114.6 0 0 100.3 0 224c0 70.1 36.9 132.6 94.5 173.7 9.6 6.9 15.2 18.1 13.5 29.9l-9.4 66.2c-1.4 9.6 6 18.2  15.7 18.2H192v-56c0-4.4 3.6-8 8-8h16c4.4 0 8 3.6 8 8v56h64v-56c0-4.4 3.6-8 8-8h16c4.4 0 8 3.6 8 8v56h77.7c9.7 0 17.1-8.6 15.7-18.2l-9.4-66.2c-1.7-11.7 3.8-23 13.5-29.9C475.1 356.6 512 294.1 512 224 512 100.3 397.4 0 256 0zm-96 320c-35.3 0-64-28.7-64-64s28.7-64 64-64 64 28.7 64 64-28.7 64-64 64zm192 0c-35.3 0-64-28.7-64-64s28.7-64 64-64 64 28.7 64 64-28.7 64-64 64z">
                            </path>
                        </svg>
                        Black List
                    </button>
                </li>
                <li>
                    <button class="w-full flex items-center block p-4 px-5 text-xs globe-btn" style="height:50px">
                        <svg aria-hidden="true" 
                            focusable="false" 
                            data-prefix="fas" 
                            data-icon="filter" 
                            class="w-4 mr-4 svg-inline--fa fa-filter fa-w-16" role="img" 
                            xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                            <path fill="#625955" d="M487.976 0H24.028C2.71 0-8.047 25.866 7.058 40.971L192 225.941V432c0 7.831 3.821 15.17 10.237 19.662l80 55.98C298.02 518.69 320 507.493 320 487.98V225.941l184.947-184.97C520.021 25.896 509.338 0 487.976 0z">
                            </path>
                        </svg>
                        Data Filter
                    </button>
                </li>
                <li>
                    <button class="w-full flex items-center block p-4 px-5 text-xs" style="height:50px">
                        <svg aria-hidden="true" 
                            focusable="false" 
                            data-prefix="fas" 
                            data-icon="user-cog" 
                            class="w-5 mr-3 svg-inline--fa fa-user-cog fa-w-20" role="img" 
                            xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512">
                            <path fill="#625955" d="M610.5 373.3c2.6-14.1 2.6-28.5 0-42.6l25.8-14.9c3-1.7 4.3-5.2 3.3-8.5-6.7-21.6-18.2-41.2-33.2-57.4-2.3-2.5-6-3.1-9-1.4l-25.8 14.9c-10.9-9.3-23.4-16.5-36.9-21.3v-29.8c0-3.4-2.4-6.4-5.7-7.1-22.3-5-45-4.8-66.2 0-3.3.7-5.7 3.7-5.7 7.1v29.8c-13.5 4.8-26 12-36.9 21.3l-25.8-14.9c-2.9-1.7-6.7-1.1-9 1.4-15 16.2-26.5 35.8-33.2 57.4-1 3.3.4 6.8 3.3 8.5l25.8 14.9c-2.6 14.1-2.6 28.5 0 42.6l-25.8 14.9c-3 1.7-4.3 5.2-3.3 8.5 6.7 21.6 18.2 41.1 33.2 57.4 2.3 2.5 6 3.1 9 1.4l25.8-14.9c10.9 9.3 23.4 16.5 36.9 21.3v29.8c0 3.4 2.4 6.4 5.7 7.1 22.3 5 45 4.8 66.2 0 3.3-.7 5.7-3.7 5.7-7.1v-29.8c13.5-4.8 26-12 36.9-21.3l25.8 14.9c2.9 1.7 6.7 1.1 9-1.4 15-16.2 26.5-35.8 33.2-57.4 1-3.3-.4-6.8-3.3-8.5l-25.8-14.9zM496 400.5c-26.8 0-48.5-21.8-48.5-48.5s21.8-48.5 48.5-48.5 48.5 21.8 48.5 48.5-21.7 48.5-48.5 48.5zM224 256c70.7 0 128-57.3 128-128S294.7 0 224 0 96 57.3 96 128s57.3 128 128 128zm201.2 226.5c-2.3-1.2-4.6-2.6-6.8-3.9l-7.9 4.6c-6 3.4-12.8 5.3-19.6 5.3-10.9 0-21.4-4.6-28.9-12.6-18.3-19.8-32.3-43.9-40.2-69.6-5.5-17.7 1.9-36.4 17.9-45.7l7.9-4.6c-.1-2.6-.1-5.2 0-7.8l-7.9-4.6c-16-9.2-23.4-28-17.9-45.7.9-2.9 2.2-5.8 3.2-8.7-3.8-.3-7.5-1.2-11.4-1.2h-16.7c-22.2 10.2-46.9 16-72.9 16s-50.6-5.8-72.9-16h-16.7C60.2 288 0 348.2 0 422.4V464c0 26.5 21.5 48 48 48h352c10.1 0 19.5-3.2 27.2-8.5-1.2-3.8-2-7.7-2-11.8v-9.2z">
                            </path>
                        </svg>
                        Access Control
                    </button>
                </li>

                <li>
                    <button class="w-full flex items-center block p-4 px-5 text-xs" style="height:50px">
                        <svg aria-hidden="true"
                            focusable="false"
                            data-prefix="far"
                            data-icon="star"
                            class="w-5 mr-3 align-middle vg-inline&#45;&#45;fa fa-star fa-w-18" role="img"
                            xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512">
                            <path fill="#625955" d="M528.1 171.5L382 150.2 316.7 17.8c-11.7-23.6-45.6-23.9-57.4 0L194 150.2 47.9 171.5c-26.2 3.8-36.7 36.1-17.7 54.6l105.7 103-25 145.5c-4.5 26.3 23.2 46 46.4 33.7L288 439.6l130.7 68.7c23.2 12.2 50.9-7.4 46.4-33.7l-25-145.5 105.7-103c19-18.5 8.5-50.8-17.7-54.6zM388.6 312.3l23.7 138.4L288 385.4l-124.3 65.3 23.7-138.4-100.6-98 139-20.2 62.2-126 62.2 126 139 20.2-100.6 98z">
                            </path>
                        </svg>
                        Favorite List
                    </button>
                </li>

                <li>
                    <button class="w-full flex items-center block p-4 px-5 text-xs" style="height:50px">
                        <svg aria-hidden="true" 
                            focusable="false" 
                            data-prefix="fas" 
                            data-icon="layer-group" 
                            class="w-4 mr-4 svg-inline--fa fa-layer-group fa-w-16" role="img" 
                            xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                            <path fill="#625955" d="M12.41 148.02l232.94 105.67c6.8 3.09 14.49 3.09 21.29 0l232.94-105.67c16.55-7.51 16.55-32.52 0-40.03L266.65 2.31a25.607 25.607 0 0 0-21.29 0L12.41 107.98c-16.55 7.51-16.55 32.53 0 40.04zm487.18 88.28l-58.09-26.33-161.64 73.27c-7.56 3.43-15.59 5.17-23.86 5.17s-16.29-1.74-23.86-5.17L70.51 209.97l-58.1 26.33c-16.55 7.5-16.55 32.5 0 40l232.94 105.59c6.8 3.08 14.49 3.08 21.29 0L499.59 276.3c16.55-7.5 16.55-32.5 0-40zm0 127.8l-57.87-26.23-161.86 73.37c-7.56 3.43-15.59 5.17-23.86 5.17s-16.29-1.74-23.86-5.17L70.29 337.87 12.41 364.1c-16.55 7.5-16.55 32.5 0 40l232.94 105.59c6.8 3.08 14.49 3.08 21.29 0L499.59 404.1c16.55-7.5 16.55-32.5 0-40z">
                            </path>
                        </svg>
                        Dashboard Layer
                    </button>
                </li>

                <li>
                    <button class="w-full flex items-center block p-4 px-5 text-xs" style="height:50px">
                        <svg aria-hidden="true" 
                            focusable="false" 
                            data-prefix="far" 
                            data-icon="object-group" 
                            class="w-4 mr-4 svg-inline--fa fa-object-group fa-w-16" role="img" 
                            xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                            <path fill="#625955" d="M500 128c6.627 0 12-5.373 12-12V44c0-6.627-5.373-12-12-12h-72c-6.627 0-12 5.373-12 12v12H96V44c0-6.627-5.373-12-12-12H12C5.373 32 0 37.373 0 44v72c0 6.627 5.373 12 12 12h12v256H12c-6.627 0-12 5.373-12 12v72c0 6.627 5.373 12 12 12h72c6.627 0 12-5.373 12-12v-12h320v12c0 6.627 5.373 12 12 12h72c6.627 0 12-5.373 12-12v-72c0-6.627-5.373-12-12-12h-12V128h12zm-52-64h32v32h-32V64zM32 64h32v32H32V64zm32 384H32v-32h32v32zm416 0h-32v-32h32v32zm-40-64h-12c-6.627 0-12 5.373-12 12v12H96v-12c0-6.627-5.373-12-12-12H72V128h12c6.627 0 12-5.373 12-12v-12h320v12c0 6.627 5.373 12 12 12h12v256zm-36-192h-84v-52c0-6.628-5.373-12-12-12H108c-6.627 0-12 5.372-12 12v168c0 6.628 5.373 12 12 12h84v52c0 6.628 5.373 12 12 12h200c6.627 0 12-5.372 12-12V204c0-6.628-5.373-12-12-12zm-268-24h144v112H136V168zm240 176H232v-24h76c6.627 0 12-5.372 12-12v-76h56v112z">
                            </path>
                        </svg>
                        Cluster Info
                    </button>
                </li>

                <li>
                    <button class="w-full flex items-center block p-4 px-5 text-xs" style="height:50px">
                        <svg aria-hidden="true" 
                            focusable="false" 
                            data-prefix="fas" 
                            data-icon="paper-plane" 
                            class="w-4 mr-4 svg-inline--fa fa-paper-plane fa-w-16" 
                            role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                            <path fill="currentColor" d="M476 3.2L12.5 270.6c-18.1 10.4-15.8 35.6 2.2 43.2L121 358.4l287.3-253.2c5.5-4.9 13.3 2.6 8.6 8.3L176 407v80.5c0 23.6 28.5 32.9 42.5 15.8L282 426l124.6 52.2c14.2 6 30.4-2.9 33-18.2l72-432C515 7.8 493.3-6.8 476 3.2z">
                            /path>
                        </svg>
                        sender
                    </button>
                </li>

                <li>
                    <button class="w-full flex items-center block p-4 px-5 text-xs" style="height:50px">
                        <svg aria-hidden="true" 
                            focusable="false" 
                            data-prefix="far" 
                            data-icon="envelope-open" 
                            class="w-4 mr-4 svg-inline--fa fa-envelope-open fa-w-16" role="img" 
                            xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                            <path fill="currentColor" d="M494.586 164.516c-4.697-3.883-111.723-89.95-135.251-108.657C337.231 38.191 299.437 0 256 0c-43.205 0-80.636 37.717-103.335 55.859-24.463 19.45-131.07 105.195-135.15 108.549A48.004 48.004 0 0 0 0 201.485V464c0 26.51 21.49 48 48 48h416c26.51 0 48-21.49 48-48V201.509a48 48 0 0 0-17.414-36.993zM464 458a6 6 0 0 1-6 6H54a6 6 0 0 1-6-6V204.347c0-1.813.816-3.526 2.226-4.665 15.87-12.814 108.793-87.554 132.364-106.293C200.755 78.88 232.398 48 256 48c23.693 0 55.857 31.369 73.41 45.389 23.573 18.741 116.503 93.493 132.366 106.316a5.99 5.99 0 0 1 2.224 4.663V458zm-31.991-187.704c4.249 5.159 3.465 12.795-1.745 16.981-28.975 23.283-59.274 47.597-70.929 56.863C336.636 362.283 299.205 400 256 400c-43.452 0-81.287-38.237-103.335-55.86-11.279-8.967-41.744-33.413-70.927-56.865-5.21-4.187-5.993-11.822-1.745-16.981l15.258-18.528c4.178-5.073 11.657-5.843 16.779-1.726 28.618 23.001 58.566 47.035 70.56 56.571C200.143 320.631 232.307 352 256 352c23.602 0 55.246-30.88 73.41-45.389 11.994-9.535 41.944-33.57 70.563-56.568 5.122-4.116 12.601-3.346 16.778 1.727l15.258 18.526z">
                            </path>
                        </svg>
                        receiver
                    </button>
                </li>

                <li>
                    <button class="w-full flex items-center block p-4 px-5 text-xs" style="height:50px">
                        <svg aria-hidden="true" 
                            focusable="false" 
                            data-prefix="fas" 
                            data-icon="envelope-open-text" 
                            class="w-4 mr-4 svg-inline--fa fa-envelope-open-text fa-w-16" role="img" 
                            xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                            <path fill="currentColor" d="M176 216h160c8.84 0 16-7.16 16-16v-16c0-8.84-7.16-16-16-16H176c-8.84 0-16 7.16-16 16v16c0 8.84 7.16 16 16 16zm-16 80c0 8.84 7.16 16 16 16h160c8.84 0 16-7.16 16-16v-16c0-8.84-7.16-16-16-16H176c-8.84 0-16 7.16-16 16v16zm96 121.13c-16.42 0-32.84-5.06-46.86-15.19L0 250.86V464c0 26.51 21.49 48 48 48h416c26.51 0 48-21.49 48-48V250.86L302.86 401.94c-14.02 10.12-30.44 15.19-46.86 15.19zm237.61-254.18c-8.85-6.94-17.24-13.47-29.61-22.81V96c0-26.51-21.49-48-48-48h-77.55c-3.04-2.2-5.87-4.26-9.04-6.56C312.6 29.17 279.2-.35 256 0c-23.2-.35-56.59 29.17-73.41 41.44-3.17 2.3-6 4.36-9.04 6.56H96c-26.51 0-48 21.49-48 48v44.14c-12.37 9.33-20.76 15.87-29.61 22.81A47.995 47.995 0 0 0 0 200.72v10.65l96 69.35V96h320v184.72l96-69.35v-10.65c0-14.74-6.78-28.67-18.39-37.77z">
                            </path>
                        </svg>
                        email-message
                    </button>
                </li>

            </ul>
        </div>

        <!-- #############
            page content 
        ############## -->

        <div class="bg-white flex-1 flex display-div" style="background:#fbf8f1">

            <div class="p-6 mb-1 flex flex-col flex-1">

                <!-- #####
                    page title 
                ##### -->

                <div class="mb-6">
                    <h3 class="text-base flex items-center mb-1">
                        <svg aria-hidden="true" 
                            focusable="false" 
                            data-prefix="far" 
                            data-icon="object-group" 
                            class="w-4 mr-2 svg-inline--fa fa-object-group fa-w-16" role="img" 
                            xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                            <path fill="#625955" d="M500 128c6.627 0 12-5.373 12-12V44c0-6.627-5.373-12-12-12h-72c-6.627 0-12 5.373-12 12v12H96V44c0-6.627-5.373-12-12-12H12C5.373 32 0 37.373 0 44v72c0 6.627 5.373 12 12 12h12v256H12c-6.627 0-12 5.373-12 12v72c0 6.627 5.373 12 12 12h72c6.627 0 12-5.373 12-12v-12h320v12c0 6.627 5.373 12 12 12h72c6.627 0 12-5.373 12-12v-72c0-6.627-5.373-12-12-12h-12V128h12zm-52-64h32v32h-32V64zM32 64h32v32H32V64zm32 384H32v-32h32v32zm416 0h-32v-32h32v32zm-40-64h-12c-6.627 0-12 5.373-12 12v12H96v-12c0-6.627-5.373-12-12-12H72V128h12c6.627 0 12-5.373 12-12v-12h320v12c0 6.627 5.373 12 12 12h12v256zm-36-192h-84v-52c0-6.628-5.373-12-12-12H108c-6.627 0-12 5.372-12 12v168c0 6.628 5.373 12 12 12h84v52c0 6.628 5.373 12 12 12h200c6.627 0 12-5.372 12-12V204c0-6.628-5.373-12-12-12zm-268-24h144v112H136V168zm240 176H232v-24h76c6.627 0 12-5.372 12-12v-76h56v112z">
                            </path>
                        </svg>
                        Cluster Infomation 
                    </h3>
                    <span class="text-sm text-grey-darker"><small>
                    You can check information of registered white and black nodes.</small></span>
                </div>

                <!-- #####
                    search
                ##### -->

                <!-- <div class="flex" style="height:40px">
                    <div class="flex items-center px-4 bg-grey">
                        <h3 class="text-xs">Search</h3>
                    </div>
                    <div class="relative flex">
                        <input class="outline-none text-xs pl-4 pr-10 z-10" type="text" style="width:280px;height:calc(100% + 1px);" placeholder="Search labels by keyword" />
                        <span class="absolute m-auto pin-y z-10" style="width:14px;right:1rem;top:.7rem" alt="searchicon">
                            <svg id="Layer_1" 
                                data-name="Layer 1" 
                                xmlns="http://www.w3.org/2000/svg"
                                class="w-4"
                                viewBox="0 0 400 399.48">
                                <path fill="#aaa" d="M398.47,369.56l-96-96a5.17,5.17,0,0,0-3.26-1.51l-18.33-1.52a161.79,161.79,0,1,0-10.09,10.12l1.52,18.3a5.17,5.17,0,0,0,1.51,3.26l96,96a5.2,5.2,0,0,0,7.37,0l21.28-21.28A5.2,5.2,0,0,0,398.47,369.56Zm-237-82.79a125,125,0,1,1,125-125A125,125,0,0,1,161.49,286.77Z" 
                                transform="translate(0 -0.26)"/>
                            </svg>
                        </span>
                        <div class="border border-grey border-t-0 absolute overflow-y-auto outline-none">
                        </div>
                    </div>        
                </div> -->

                <!-- #####
                    cluster table
                ##### -->

                <div class="flex-1">

                    <!-- #####
                        cluster table summery info 
                    ##### -->

                    <div class="flex justify-between items-center mb-4">
                        <ul class="list-reset flex items-center">
                            <li>
                                <div class="flex items-center">
                                    <p class="text-sm text-grey-dark"><small>Cluster selected :</small></p> 
                                    <span class="block ml-2 text-xs flex border border-grey rounded-sm bg-white" style="height:22px; line-height:21px">
                                        <span class="px-3">Cluster1</span>
                                        <button class="border-l border-grey px-2">
                                            <svg aria-hidden="true" 
                                                focusable="false" 
                                                data-prefix="far" 
                                                data-icon="edit" 
                                                class="w-3 svg-inline--fa fa-edit fa-w-18" 
                                                role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512">
                                                <path fill="currentColor" d="M402.3 344.9l32-32c5-5 13.7-1.5 13.7 5.7V464c0 26.5-21.5 48-48 48H48c-26.5 0-48-21.5-48-48V112c0-26.5 21.5-48 48-48h273.5c7.1 0 10.7 8.6 5.7 13.7l-32 32c-1.5 1.5-3.5 2.3-5.7 2.3H48v352h352V350.5c0-2.1.8-4.1 2.3-5.6zm156.6-201.8L296.3 405.7l-90.4 10c-26.2 2.9-48.5-19.2-45.6-45.6l10-90.4L432.9 17.1c22.9-22.9 59.9-22.9 82.7 0l43.2 43.2c22.9 22.9 22.9 60 .1 82.8zM460.1 174L402 115.9 216.2 301.8l-7.3 65.3 65.3-7.3L460.1 174zm64.8-79.7l-43.2-43.2c-4.1-4.1-10.8-4.1-14.8 0L436 82l58.1 58.1 30.9-30.9c4-4.2 4-10.8-.1-14.9z">
                                                </path>
                                            </svg>
                                        </button>
                                    </span>
                                </div>
                            </li>
                            <li class="ml-5">
                                <div class="flex items-center">
                                    <p class="text-sm text-grey-dark"><small>Today Node Number :</small></p>
                                    <span class="ml-2 text-sm">4</span>
                                </div>
                            </li>
                        </ul>
                        <div class="flex items-center">
                            <p class="text-sm text-grey-dark"><small>The linked cluster list  :</small></p>
                            <select class="border border-grey text-xs px-2 ml-2 text-center" style="height:22px; line-height:21px">
                                <option>All</option>
                                <option>Cluster2</option>
                                <option>Cluster3</option>
                            </select>
                        </div>
                    </div>

                    <!-- #####
                        cluster table info
                    ##### -->

                    <div>
                        <table class="bg-white w-full text-xs">
                            <thead class="bg-grey">
                                <tr>
                                    <th>Label</th>
                                    <th>Name</th>
                                    <th>Value</th>
                                    <th>생성날짜</th>
                                    <th>위험도</th>
                                    <th>등록날짜</th>
                                    <th>비고</th>
                                    <th>연결성</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td align="center">email</td>
                                    <td align="center">email_address</td>
                                    <td align="center">yu8108@naver.com</td>
                                    <td align="center">2019.04.25 16:45</td>
                                    <td align="center">
                                        <div class="flex items-center justify-center">
                                            <span class="inline-block mr-2 bg-red-light border border-red-light rounded-sm text-xs text-white" 
                                                style="padding: .15rem;line-height:8px;"><small>매우위험</small>
                                            </span> 
                                            92.84
                                        </div>
                                    </td>
                                    <td align="center">2019.04.26 12:24</td>
                                    <td>의심스러운 패턴의 email-address로 중복30건</td>
                                    <td align="center"> -</td>
                                </tr>
                                <tr>
                                    <td align="center">email</td>
                                    <td align="center">email_address</td>
                                    <td align="center">yu8108@naver.com</td>
                                    <td align="center">2019.04.25 16:45</td>
                                    <td>
                                        <div class="flex items-center justify-center">
                                            <span class="inline-block mr-2 bg-orange-light border border-orange-light rounded-sm text-xs text-white" 
                                                style="padding: .15rem;line-height:8px;"><small>보통위험</small>
                                            </span> 
                                            62.17
                                        </div>
                                    </td>
                                    <td align="center">2019.04.26 12:24</td>
                                    <td>의심스러운 패턴의 email-address로 중복30건</td>
                                    <td align="center">Cluster2</td>
                                </tr>
                                <tr>
                                    <td align="center">email</td>
                                    <td align="center">email_address</td>
                                    <td align="center">yu8108@naver.com</td>
                                    <td align="center">2019.04.25 16:45</td>
                                    <td>
                                        <div class="flex items-center justify-center">
                                            <span class="inline-block mr-2 bg-orange-light border border-orange-light rounded-sm text-xs text-white" 
                                                style="padding: .15rem;line-height:8px;"><small>보통위험</small>
                                            </span> 
                                            62.17
                                        </div>
                                    </td>
                                    <td align="center">2019.04.26 12:24</td>
                                    <td>의심스러운 패턴의 email-address로 중복30건</td>
                                    <td align="center">Cluster3</td>
                                </tr>
                                <tr>
                                    <td align="center">email</td>
                                    <td align="center">email_address</td>
                                    <td align="center">yu8108@naver.com</td>
                                    <td align="center">2019.04.25 16:45</td>
                                    <td align="center">
                                        <div class="flex items-center justify-center">
                                            <span class="inline-block mr-2 bg-red-light border border-red-light rounded-sm text-xs text-white" 
                                                style="padding: .15rem;line-height:8px;"><small>매우위험</small>
                                            </span> 
                                            92.84
                                        </div>
                                    </td>
                                    <td align="center">2019.04.26 12:24</td>
                                    <td>의심스러운 패턴의 email-address로 중복30건</td>
                                    <td align="center">Cluster2</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <!-- #####
                total cluster list 
            ##### -->

            <div class="p-6 pl-0 flex">
                <div style="width:350px" class="h-full bg-white shadow p-4 overflow-y-auto">
                    <div class="border-b border-grey p-2 text-sm">
                        <p>Cluster1</p>
                        <small class="text-grey-darker">Linked cluster Number: 2</small>
                    </div>
                    <div class="border-b border-grey p-2 text-sm">
                        <p>Cluster2</p>
                        <small class="text-grey-darker">Linked cluster Number: 1</small>
                    </div>
                    <div class="border-b border-grey p-2 text-sm">
                        <p>Cluster3</p>
                        <small class="text-grey-darker">Linked cluster Number: 1</small>
                    </div>
                </div>
            </div>
        </div>

        <div class="bg-white flex-1 hidden" style="background:#fbf8f1">
            <div class="p-6 mb-1 flex items-center justify-between">
                <div>
                    <h3 class="text-base flex items-center mb-1">
                        <svg aria-hidden="true" 
                            focusable="false" 
                            data-prefix="fas" 
                            data-icon="skull" 
                            class="w-4 mr-2 svg-inline--fa fa-skull fa-w-16" role="img" 
                            xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                            <path fill="#625955" d="M256 0C114.6 0 0 100.3 0 224c0 70.1 36.9 132.6 94.5 173.7 9.6 6.9 15.2 18.1 13.5 29.9l-9.4 66.2c-1.4 9.6 6 18.2 15.7 18.2H192v-56c0-4.4 3.6-8 8-8h16c4.4 0 8 3.6 8 8v56h64v-56c0-4.4 3.6-8 8-8h16c4.4 0 8 3.6 8 8v56h77.7c9.7 0 17.1-8.6 15.7-18.2l-9.4-66.2c-1.7-11.7 3.8-23 13.5-29.9C475.1 356.6 512 294.1 512 224 512 100.3 397.4 0 256 0zm-96 320c-35.3 0-64-28.7-64-64s28.7-64 64-64 64 28.7 64 64-28.7 64-64 64zm192 0c-35.3 0-64-28.7-64-64s28.7-64 64-64 64 28.7 64 64-28.7 64-64 64z">
                            </path>
                        </svg>
                        Black / White List 
                    </h3>
                    <span class="text-sm text-grey-darker"><small>
                    You can check information of registered white and black nodes.</small></span>
                </div>

                <div class="flex" style="height:40px">
                    <div class="flex items-center px-4 bg-grey" >
                        <h3 class="text-xs">Search</h3>
                    </div>
                    <div class="relative flex">
                        <input class="outline-none text-xs pl-4 pr-10 z-10" type="text" style="width:280px;height:calc(100% + 1px);" placeholder="Search labels by keyword" />
                        <span class="absolute m-auto pin-y z-10" style="width:14px;right:1rem;top:.7rem" alt="searchicon">
                            <svg id="Layer_1" 
                                data-name="Layer 1" 
                                xmlns="http://www.w3.org/2000/svg"
                                class="w-4"
                                viewBox="0 0 400 399.48">
                                <path fill="#aaa" d="M398.47,369.56l-96-96a5.17,5.17,0,0,0-3.26-1.51l-18.33-1.52a161.79,161.79,0,1,0-10.09,10.12l1.52,18.3a5.17,5.17,0,0,0,1.51,3.26l96,96a5.2,5.2,0,0,0,7.37,0l21.28-21.28A5.2,5.2,0,0,0,398.47,369.56Zm-237-82.79a125,125,0,1,1,125-125A125,125,0,0,1,161.49,286.77Z" 
                                transform="translate(0 -0.26)"/>
                            </svg>
                        </span>
                        <div class="border border-grey border-t-0 absolute overflow-y-auto outline-none">
                        </div>
                    </div>        
                </div>

            </div>

            <div class="px-6">
                <div class="bg-white p-4 pt-0">
                    <div class="bg-white p-4 px-6 flex items-center justify-between">

                        <ul class="list-reset flex items-center">
                            <li>
                                <div class="flex">
                                    <p class="text-sm text-grey-dark"><small>Total Registration Status :</small></p> 
                                    <span class="ml-2 text-sm">186</span>
                                </div>
                            </li>
                            <li class="ml-5">
                                <div class="flex">
                                    <p class="text-sm text-grey-dark"><small>Today Reg :</small></p>
                                    <span class="ml-2 text-sm">12</span>
                                </div>
                            </li>
                            <li class="ml-5">
                                <div class="flex">
                                    <p class="text-sm text-grey-dark"><small>Black :</small></p>
                                    <span class="ml-2 text-sm">160</span>
                                </div>
                            </li>
                            <li class="ml-5">
                                <div class="flex">
                                    <p class="text-sm text-grey-dark"><small>White :</small></p>
                                    <span class="ml-2 text-sm">26</span>
                                </div>
                            </li>
                        </ul>

                        <div class="flex items-center">
                            <button class="w-full flex items-center block mr-10 text-sm text-grey-darker">
                                <svg aria-hidden="true" 
                                    focusable="false" 
                                    data-prefix="fas" 
                                    data-icon="redo" 
                                    class="w-3-5 svg-inline--fa fa-redo fa-w-16" role="img" 
                                    xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                                    <path fill="#625955" d="M500.33 0h-47.41a12 12 0 0 0-12 12.57l4 82.76A247.42 247.42 0 0 0 256 8C119.34 8 7.9 119.53 8 256.19 8.1 393.07 119.1 504 256 504a247.1 247.1 0 0 0 166.18-63.91 12 12 0 0 0 .48-17.43l-34-34a12 12 0 0 0-16.38-.55A176 176 0 1 1 402.1 157.8l-101.53-4.87a12 12 0 0 0-12.57 12v47.41a12 12 0 0 0 12 12h200.33a12 12 0 0 0 12-12V12a12 12 0 0 0-12-12z">
                                    </path>
                                </svg>       
                            </button>
                            <button class="w-full flex items-center block mr-10 text-sm text-grey-darker">
                                <svg aria-hidden="true" 
                                    focusable="false" 
                                    data-prefix="fas" 
                                    data-icon="external-link-alt" 
                                    class="w-4 svg-inline--fa fa-external-link-alt fa-w-18" 
                                    role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512">
                                    <path fill="#625955" d="M576 24v127.984c0 21.461-25.96 31.98-40.971 16.971l-35.707-35.709-243.523 243.523c-9.373 9.373-24.568 9.373-33.941 0l-22.627-22.627c-9.373-9.373-9.373-24.569 0-33.941L442.756 76.676l-35.703-35.705C391.982 25.9 402.656 0 424.024 0H552c13.255 0 24 10.745 24 24zM407.029 270.794l-16 16A23.999 23.999 0 0 0 384 303.765V448H64V128h264a24.003 24.003 0 0 0 16.97-7.029l16-16C376.089 89.851 365.381 64 344 64H48C21.49 64 0 85.49 0 112v352c0 26.51 21.49 48 48 48h352c26.51 0 48-21.49 48-48V287.764c0-21.382-25.852-32.09-40.971-16.97z">
                                    </path>
                                </svg>           
                            </button>
                            <button class="w-full flex items-center block mr-10 text-sm text-grey-darker">
                                <svg aria-hidden="true" 
                                    focusable="false" 
                                    data-prefix="fas" 
                                    data-icon="save" 
                                    class="w-3-5 svg-inline--fa fa-save fa-w-14" 
                                    role="img" xmlns="http://www.w3.org/2000/svg" 
                                    viewBox="0 0 448 512">
                                    <path fill="#625955" d="M433.941 129.941l-83.882-83.882A48 48 0 0 0 316.118 32H48C21.49 32 0 53.49 0 80v352c0 26.51 21.49 48 48 48h352c26.51 0 48-21.49 48-48V163.882a48 48 0 0 0-14.059-33.941zM224 416c-35.346 0-64-28.654-64-64 0-35.346 28.654-64 64-64s64 28.654 64 64c0 35.346-28.654 64-64 64zm96-304.52V212c0 6.627-5.373 12-12 12H76c-6.627 0-12-5.373-12-12V108c0-6.627 5.373-12 12-12h228.52c3.183 0 6.235 1.264 8.485 3.515l3.48 3.48A11.996 11.996 0 0 1 320 111.48z">
                                    </path>
                                </svg>                    
                            </button>
                            <button class="w-full flex items-center block text-sm text-grey-darker">
                                <svg aria-hidden="true" 
                                    focusable="false" 
                                    data-prefix="far" 
                                    data-icon="trash-alt" 
                                    class="w-3-5 svg-inline--fa fa-trash-alt fa-w-14" role="img" 
                                    xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                                    <path fill="#625955" d="M268 416h24a12 12 0 0 0 12-12V188a12 12 0 0 0-12-12h-24a12 12 0 0 0-12 12v216a12 12 0 0 0 12 12zM432 80h-82.41l-34-56.7A48 48 0 0 0 274.41 0H173.59a48 48 0 0 0-41.16 23.3L98.41 80H16A16 16 0 0 0 0 96v16a16 16 0 0 0 16 16h16v336a48 48 0 0 0 48 48h288a48 48 0 0 0 48-48V128h16a16 16 0 0 0 16-16V96a16 16 0 0 0-16-16zM171.84 50.91A6 6 0 0 1 177 48h94a6 6 0 0 1 5.15 2.91L293.61 80H154.39zM368 464H80V128h288zm-212-48h24a12 12 0 0 0 12-12V188a12 12 0 0 0-12-12h-24a12 12 0 0 0-12 12v216a12 12 0 0 0 12 12z">
                                    </path>
                                </svg>
                            </button>
                        </div>
                        
                    </div>

                    <table class="bg-white w-full text-xs">
                        <thead class="bg-grey">
                            <tr>
                                <th><input type="checkbox" class="align-middle"></th>
                                <th>B/W</th>
                                <th>Label</th>
                                <th>Name</th>
                                <th>Value</th>
                                <th>생성날짜</th>
                                <th>위험도</th>
                                <th>등록날짜</th>
                                <th>비고</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td align="center"><input type="checkbox" class="align-middle"></td>
                                <td align="center">Black</td>
                                <td align="center">email</td>
                                <td align="center">email_address</td>
                                <td align="center">yu8108@naver.com</td>
                                <td align="center">2019.04.25 16:45</td>
                                <td align="center">
                                    <div class="flex items-center justify-center">
                                        <span class="inline-block mr-2 bg-red-light border border-red-light rounded-sm text-xs text-white" 
                                            style="padding: .15rem;line-height:8px;"><small>매우위험</small>
                                        </span> 
                                        92.84
                                    </div>
                                </td>
                                <td align="center">2019.04.26 12:24</td>
                                <td>의심스러운 패턴의 email-address로 중복30건</td>
                            </tr>
                            <tr>
                                <td align="center"><input type="checkbox" class="align-middle"></td>
                                <td align="center">White</td>
                                <td align="center">email</td>
                                <td align="center">email_address</td>
                                <td align="center">yu8108@naver.com</td>
                                <td align="center">2019.04.25 16:45</td>
                                <td>
                                    <div class="flex items-center justify-center">
                                        <span class="inline-block mr-2 bg-orange-light border border-orange-light rounded-sm text-xs text-white" 
                                            style="padding: .15rem;line-height:8px;"><small>보통위험</small>
                                        </span> 
                                        62.17
                                    </div>
                                </td>
                                <td align="center">2019.04.26 12:24</td>
                                <td>의심스러운 패턴의 email-address로 중복30건</td>
                                
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>        
    </div>
    
`


export default class SettingPage extends DomComponent{
    constructor(domSelector) {
        super(domSelector,'filter','label')
        this.domContainer = typeof domSelector == "string" ? document.querySelector(domSelector) : domSelector
        this.domContainer.innerHTML = _html

        this.$1('.globe-btn').addEventListener('click', ()=>{
            this.gw = new GlobeWidget(this.$1('.display-div'))

            this.gw.drawGlobe();
            this.gw.drawGraticule();
            this.gw.enableRotation();
        })
    }

}
