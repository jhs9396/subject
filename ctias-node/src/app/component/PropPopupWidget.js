import {toggleClass, hasClass, removeClass, addClass, findParent, convertGraphPath} from "../util/Common";
import EventEmitter, {DomComponent} from "../util/EventEmitter";
import {ICON_DICT} from "./resource/icon";
import ContextMenu from "./ContextMenu"
const _template = require('lodash.template');
import PocApiClient from '../util/PocApiClient'
import {ATTACK_DETECTION_PATTERN} from './resource/pattern'



require('./PropPopup.styl')


const _html = `
    <div class="propview flex flex-col h-full bg-white border border-grey relative">

        <!-- ################
            keyword search input 입니다. 
        ################ --> 

        <div class="absolute hidden" style="top:.75rem; left:.75rem; right:.75rem; margin:auto">
            <div class="flex border border-grey">
                <div class="flex items-center px-4 bg-grey border-r border-grey">
                    <h3 class="text-xs">Search</h3>
                </div>
                <div class="relative flex-1">
                    <input class="w-full block outline-none border-grey border-b text-xs pl-2 pr-8 relative z-10" type="text" style="height: 36px; bottom: -1px;" placeholder="search labels by keyword" />
                    <img src="/icon/search.svg" class="absolute m-auto pin-y z-10" style="width:14px; right:10px;" alt="searchicon" />
                    
                    <div tabindex="1" class="candidates border border-grey border-t-0 absolute overflow-y-auto outline-none">
                    </div>
                </div>        
            </div>
            <div class="bg-white flex p-2 border border-t-0 border-grey">
                <a href="#" class="text-xs no-underline text-blue hover:underline">Back to previous page</a>
                <!--<label class="flex items-center text-xs"><input type="checkbox" class="mr-2">Search within results</label>-->
            </div>
        </div>

        <div class="opacity-0 m-3 mb-0 hidden" >

            <div class="flex border border-grey">
                <div class="flex items-center px-4 bg-grey border-r border-grey">
                    <h3 class="text-xs">Search</h3>
                </div>
                <div class="relative flex-1">
                    <input class="w-full block outline-none border-grey border-b text-xs pl-2 pr-8 relative z-10" type="text" style="height: 36px; bottom: -1px;" placeholder="search labels by keyword" />
                    <img src="/icon/search.svg" class="absolute m-auto pin-y z-10" style="width:14px; right:10px;" alt="searchicon" />
                    
                    <div tabindex="1" class="candidates border border-grey border-t-0 absolute overflow-y-auto outline-none">
                    </div>
                </div>        
            </div>
            <div class="bg-white flex p-2 border border-t-0 border-grey">
                <a href="#" class="text-xs no-underline text-blue hover:underline">Back to previous page</a>
                <!--<label class="flex items-center text-xs"><input type="checkbox" class="mr-2">Search within results</label>-->
            </div>
        </div>
        
        <!-- ################
            해시태그 형태의 button 그룹입니다. 
        ################ -->        
        <div class="m-3 mt-2 mb-0 hidden">
            <button class="inline-block mt-1 p-1 px-3 border border-grey rounded text-xs"><span ></span> yu8108@naver.com <span class="ml-2">+</span> </button>
            <button class="inline-block mt-1 p-1 px-3 border border-grey rounded text-xs">211.10.19, 홍길 <span class="ml-2">+</span> </button>
            <button class="inline-block mt-1 p-1 px-3 border border-grey rounded text-xs">seoul <span class="ml-2">+</span> </button>
        </div>

        <!-- ################
            color palette 입니다.             
            (tailwindcss에서 hidden 보다 flex가 적용순위가 높아 
            hidden이 추가되면 flex는 삭제되어야합니다. 
            만일, 두 가지를 모두 가지고 있을 경우 hidden 적용안됩니다.)
        ################ -->         
        <div class="mt-3 hidden border-t border-b border-grey">
            <div class="flex items-center px-3 border-r border-grey bg-grey">
                <h3 class="text-xs">Node<br/>Color</h3>
            </div>
            <div class="p-3 pr-2" style="width: calc(100% - 56px)">
                <ul class="list-reset flex color-box overflow-hidden">
                    <li><button class="bg-red rounded-full"></button></li>
                    <li><button class="bg-orange-lighter rounded-full"></button></li>
                    <li><button class="bg-orange rounded-full"></button></li>
                    <li><button class="bg-orange-dark rounded-full"></button></li>
                    <li><button class="bg-yellow rounded-full"></button></li>
                    <li><button class="bg-yellow-dark rounded-full"></button></li>
                    <li><button class="bg-blue-lighter rounded-full"></button></li>
                    <li><button class="bg-blue rounded-full"></button></li>
                    <li><button class="bg-blue-dark rounded-full"></button></li>
                    <li><button class="bg-blue-dark rounded-full"></button></li>
                </ul>
            </div>
        </div>
        
        <!-- ################
            keyword 검색결과 ( 1번화면 )
        ################ -->

<!--        <div class="flex-col flex-1 flex hidden">-->
<!--            <div class="bg-grey p-2 pl-3 border-t border-b border-grey">-->
<!--                <h3 class="text-xs">Keyword Result List</h3>-->
<!--            </div>-->

<!--            <div class="flex-1 h-full overflow-y-auto">-->
<!--                &lt;!&ndash; ################-->
<!--                    keyword 검색결과 리스트 목록 (카드형태) -->
<!--                ################ &ndash;&gt;-->

<!--                <div class="card flex justify-between items-center p-3 border-b border-grey-light hover:bg-pink-lightest cursor-pointer">-->
<!--                    <div class="bg-white w-10 h-10 border border-grey rounded-full align-middle flex items-center justify-center">-->
<!--                        <svg aria-hidden="true" -->
<!--                            focusable="false" -->
<!--                            data-prefix="far" -->
<!--                            data-icon="star" -->
<!--                            class="w-5 align-middle vg-inline&#45;&#45;fa fa-star fa-w-18" role="img" -->
<!--                            xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512">-->
<!--                            <path fill="grey" d="M528.1 171.5L382 150.2 316.7 17.8c-11.7-23.6-45.6-23.9-57.4 0L194 150.2 47.9 171.5c-26.2 3.8-36.7 36.1-17.7 54.6l105.7 103-25 145.5c-4.5 26.3 23.2 46 46.4 33.7L288 439.6l130.7 68.7c23.2 12.2 50.9-7.4 46.4-33.7l-25-145.5 105.7-103c19-18.5 8.5-50.8-17.7-54.6zM388.6 312.3l23.7 138.4L288 385.4l-124.3 65.3 23.7-138.4-100.6-98 139-20.2 62.2-126 62.2 126 139 20.2-100.6 98z">-->
<!--                            </path>-->
<!--                        </svg>-->
<!--                    </div>-->
<!--                    <div class="flex-1">-->
<!--                        <ul class="w-full pl-3 list-reset">-->
<!--                            <li class="flex items-center justify-end mb-1">-->
<!--                                <div class="text-right">-->
<!--                                    <small class="bg-grey inline-block px-2 mb-2 border border-grey">mail</small>-->
<!--                                    <h3 class="text-base">A20394GD9124</h3>-->
<!--                                </div>-->
<!--                            </li>-->
<!--                            <li class="flex items-center justify-end text-sm">-->
<!--                                <small>"mail_address"</small><p class="ml-2">yu8108@naver.com</p>-->
<!--                            </li>-->
<!--                        </ul>-->
<!--                    </div>-->
<!--                </div>-->

<!--                <div class="card flex justify-between items-center p-3 border-b border-grey-light hover:bg-pink-lightest cursor-pointer">-->
<!--                    <div class="bg-white w-10 h-10 border border-grey rounded-full align-middle flex items-center justify-center">-->
<!--                        <svg aria-hidden="true" -->
<!--                            focusable="false" -->
<!--                            data-prefix="far" -->
<!--                            data-icon="star" -->
<!--                            class="w-5 align-middle vg-inline&#45;&#45;fa fa-star fa-w-18" role="img" -->
<!--                            xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512">-->
<!--                            <path fill="grey" d="M528.1 171.5L382 150.2 316.7 17.8c-11.7-23.6-45.6-23.9-57.4 0L194 150.2 47.9 171.5c-26.2 3.8-36.7 36.1-17.7 54.6l105.7 103-25 145.5c-4.5 26.3 23.2 46 46.4 33.7L288 439.6l130.7 68.7c23.2 12.2 50.9-7.4 46.4-33.7l-25-145.5 105.7-103c19-18.5 8.5-50.8-17.7-54.6zM388.6 312.3l23.7 138.4L288 385.4l-124.3 65.3 23.7-138.4-100.6-98 139-20.2 62.2-126 62.2 126 139 20.2-100.6 98z">-->
<!--                            </path>-->
<!--                        </svg>-->
<!--                    </div>-->
<!--                    <div class="flex-1">-->
<!--                        <ul class="w-full pl-3 list-reset">-->
<!--                            <li class="flex items-center justify-end mb-1">-->
<!--                                <div class="text-right">-->
<!--                                    <small class="bg-grey inline-block px-2 mb-2 border border-grey">mail</small>-->
<!--                                    <h3 class="text-base">A20394GD9124</h3>-->
<!--                                </div>-->
<!--                            </li>-->
<!--                            <li class="flex items-center justify-end text-sm">-->
<!--                                <small>"mail_address"</small><p class="ml-2">yu8108@naver.com</p>-->
<!--                            </li>-->
<!--                        </ul>-->
<!--                    </div>-->
<!--                </div>-->

<!--            </div>-->
<!--        </div>-->
        
        <!-- ################
            card 상세정보 화면 ( 2번 화면 )
        ################--> 

        <div class="flex flex-col h-full flex-1">
            <div class="mt-4 vertex_toolbar">
                <!-- ################
                    node/edge id 
                ################ -->
                <div class="flex justify-between px-4 simpleVtxInfo">
                </div>

                <!-- ################
                    line-border
                ################ -->

                <!-- <div class="w-full px-3">
                    <div class="w-full border-b border-grey border-dotted"></div>
                </div> -->

                <!-- ################
                    node/edge button list 
                ################ -->
                
                <ul class="w-full p-4 list-reset flex items-center border-b border-grey btn-bar">
                    <li class="flex-1 bookmark">
                        <button class="w-full border-r border-white flex items-center justify-center hover:bg-grey-lighter" 
                            style="height:35px;background:#f9f8f5"
                            title="현재 선택된 데이터를 북마크로 추가합니다.">
                            <svg aria-hidden="true" 
                                focusable="false" 
                                data-prefix="fas" 
                                data-icon="thumbtack" 
                                class="w-3 svg-inline--fa fa-thumbtack fa-w-12" 
                                role="img" xmlns="http://www.w3.org/2000/svg" 
                                viewBox="0 0 384 512">
                                <path fill="#625955" d="M298.028 214.267L285.793 96H328c13.255 0 24-10.745 24-24V24c0-13.255-10.745-24-24-24H56C42.745 0 32 10.745 32 24v48c0 13.255 10.745 24 24 24h42.207L85.972 214.267C37.465 236.82 0 277.261 0 328c0 13.255 10.745 24 24 24h136v104.007c0 1.242.289 2.467.845 3.578l24 48c2.941 5.882 11.364 5.893 14.311 0l24-48a8.008 8.008 0 0 0 .845-3.578V352h136c13.255 0 24-10.745 24-24-.001-51.183-37.983-91.42-85.973-113.733z">
                                </path>
                            </svg>
                            <span class="text-xs ml-2 bookmarkcaption" style="color:#625955">Markers</span>
                        </button>
                    </li>
                    <li class="flex-1 attack_detection">
                        <button class="w-full border-r border-white flex items-center justify-center hover:bg-grey-lighter" 
                            style="height:35px;background:#f9f8f5"
                            title="선택한 위협정보에서 발생된 이벤트를 보여주며,&#13;같은 공격자원을 이용한 다른 위협정보를 확인할 수 있습니다.">
                            <svg aria-hidden="true" 
                                focusable="false" 
                                data-prefix="fas" 
                                data-icon="exchange-alt" 
                                class="w-4 svg-inline--fa fa-exchange-alt fa-w-16" role="img" 
                                xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                                <path fill="#625955" d="M0 168v-16c0-13.255 10.745-24 24-24h360V80c0-21.367 25.899-32.042 40.971-16.971l80 80c9.372 9.373 9.372 24.569 0 33.941l-80 80C409.956 271.982 384 261.456 384 240v-48H24c-13.255 0-24-10.745-24-24zm488 152H128v-48c0-21.314-25.862-32.08-40.971-16.971l-80 80c-9.372 9.373-9.372 24.569 0 33.941l80 80C102.057 463.997 128 453.437 128 432v-48h360c13.255 0 24-10.745 24-24v-16c0-13.255-10.745-24-24-24z">
                                </path>
                            </svg>
                            <span class="text-xs ml-2" style="color:#625955">Attacks</span>
                        </button>
                    </li>
                    <li class="flex-1 rank" data-isblacklist="">
                        <button class="w-full border-r border-white flex items-center justify-center hover:bg-grey-lighter" 
                            style="height:35px;background:#f9f8f5"
                            title="선택한 IoC 정보 기준으로 5단계 이하의 패스 중 중요도가 높은 IoC를 찾아줍니다.">
                            <svg aria-hidden="true" 
                                focusable="false" 
                                data-prefix="fas" 
                                data-icon="skull" 
                                class="w-4 svg-inline--fa fa-skull fa-w-16" role="img" 
                                xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                                <path fill="#625955" d="M256 0C114.6 0 0 100.3 0 224c0 70.1 36.9 132.6 94.5 173.7 9.6 6.9 15.2 18.1 13.5 29.9l-9.4 66.2c-1.4 9.6 6 18.2 15.7 18.2H192v-56c0-4.4 3.6-8 8-8h16c4.4 0 8 3.6 8 8v56h64v-56c0-4.4 3.6-8 8-8h16c4.4 0 8 3.6 8 8v56h77.7c9.7 0 17.1-8.6 15.7-18.2l-9.4-66.2c-1.7-11.7 3.8-23 13.5-29.9C475.1 356.6 512 294.1 512 224 512 100.3 397.4 0 256 0zm-96 320c-35.3 0-64-28.7-64-64s28.7-64 64-64 64 28.7 64 64-28.7 64-64 64zm192 0c-35.3 0-64-28.7-64-64s28.7-64 64-64 64 28.7 64 64-28.7 64-64 64z">
                                </path>
                            </svg>
                            <span class="text-xs ml-2" style="color:#625955">Rank</span>
                        </button>
                    </li>
<!--                    <li class="text-center flex-1 similar relative">-->
<!--                        <button class="btn-favorite border rounded-full inline-flex items-center justify-center hover:bg-grey-lighter hover:bg-grey-lighter" style="border-color:#625955">-->
<!--                            <svg aria-hidden="true" -->
<!--                                ocusable="false" data-prefix="far" -->
<!--                                data-icon="object-ungroup" -->
<!--                                class="w-4 svg-inline&#45;&#45;fa fa-object-ungroup fa-w-18" role="img" -->
<!--                                xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512">-->
<!--                                <path fill="#625955" d="M564 224c6.627 0 12-5.373 12-12v-72c0-6.627-5.373-12-12-12h-72c-6.627 0-12 5.373-12 12v12h-88v-24h12c6.627 0 12-5.373 12-12V44c0-6.627-5.373-12-12-12h-72c-6.627 0-12 5.373-12 12v12H96V44c0-6.627-5.373-12-12-12H12C5.373 32 0 37.373 0 44v72c0 6.627 5.373 12 12 12h12v160H12c-6.627 0-12 5.373-12 12v72c0 6.627 5.373 12 12 12h72c6.627 0 12-5.373 12-12v-12h88v24h-12c-6.627 0-12 5.373-12 12v72c0 6.627 5.373 12 12 12h72c6.627 0 12-5.373 12-12v-12h224v12c0 6.627 5.373 12 12 12h72c6.627 0 12-5.373 12-12v-72c0-6.627-5.373-12-12-12h-12V224h12zM352 64h32v32h-32V64zm0 256h32v32h-32v-32zM64 352H32v-32h32v32zm0-256H32V64h32v32zm32 216v-12c0-6.627-5.373-12-12-12H72V128h12c6.627 0 12-5.373 12-12v-12h224v12c0 6.627 5.373 12 12 12h12v160h-12c-6.627 0-12 5.373-12 12v12H96zm128 136h-32v-32h32v32zm280-64h-12c-6.627 0-12 5.373-12 12v12H256v-12c0-6.627-5.373-12-12-12h-12v-24h88v12c0 6.627 5.373 12 12 12h72c6.627 0 12-5.373 12-12v-72c0-6.627-5.373-12-12-12h-12v-88h88v12c0 6.627 5.373 12 12 12h12v160zm40 64h-32v-32h32v32zm0-256h-32v-32h32v32z">-->
<!--                                </path>-->
<!--                            </svg>-->
<!--                        </button>-->
<!--                        <p class="text-xs mt-2" style="color:#625955">유사정보</p>-->
<!--                        <div class="absolute bg-white border border-grey" style="top:0;left:0">-->
<!--                            <input type="range" min="0" max="100" />-->
<!--                        </div>-->
<!--                    </li>-->
                    <li class="flex-1 attracts">
                        <button class="w-full border-r border-white flex items-center justify-center hover:bg-grey-lighter" 
                            style="height:35px;background:#f9f8f5"
                            title="현재화면 내에서 선택된 위협 정보와 동일한 클러스터에 포함된 위협정보를 찾습니다.">
                            <svg aria-hidden="true" 
                                focusable="false" data-prefix="far" 
                                data-icon="object-group" 
                                class="w-4 svg-inline--fa fa-object-group fa-w-16" role="img" 
                                xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                                <path fill="#625955" d="M500 128c6.627 0 12-5.373 12-12V44c0-6.627-5.373-12-12-12h-72c-6.627 0-12 5.373-12 12v12H96V44c0-6.627-5.373-12-12-12H12C5.373 32 0 37.373 0 44v72c0 6.627 5.373 12 12 12h12v256H12c-6.627 0-12 5.373-12 12v72c0 6.627 5.373 12 12 12h72c6.627 0 12-5.373 12-12v-12h320v12c0 6.627 5.373 12 12 12h72c6.627 0 12-5.373 12-12v-72c0-6.627-5.373-12-12-12h-12V128h12zm-52-64h32v32h-32V64zM32 64h32v32H32V64zm32 384H32v-32h32v32zm416 0h-32v-32h32v32zm-40-64h-12c-6.627 0-12 5.373-12 12v12H96v-12c0-6.627-5.373-12-12-12H72V128h12c6.627 0 12-5.373 12-12v-12h320v12c0 6.627 5.373 12 12 12h12v256zm-36-192h-84v-52c0-6.628-5.373-12-12-12H108c-6.627 0-12 5.372-12 12v168c0 6.628 5.373 12 12 12h84v52c0 6.628 5.373 12 12 12h200c6.627 0 12-5.372 12-12V204c0-6.628-5.373-12-12-12zm-268-24h144v112H136V168zm240 176H232v-24h76c6.627 0 12-5.372 12-12v-76h56v112z">
                                </path>
                            </svg>
                            <span class="text-xs ml-2" style="color:#625955">Cluster</span>
                        </button>
                    </li>
                </ul>

                <div class="w-full p-4 border-b border-grey similar-bar">
                    <div class="pb-1">
                        <h3 class="text-sm">Similar Info</h3>
                    </div>
                    <div class="flex items-center">
                        <input class="flex-1 mr-4 similar_range" type="range" min="-1.0" max="-0.75" step="0.05" value="-1.0" /> 
                        <span class="border border-r-0 border-grey similar_text text-center text-sm" value="0" style="min-width:55px;height:32px;line-height:30px"><span class="text-grey">1</span></span>
                        <button class="bg-grey-light text-white p-1 px-2 text-xs border border-blue-light similar" style="background:#f9f8f5;height:32px">
                            <svg aria-hidden="true" focusable="false" 
                                data-prefix="far" 
                                data-icon="play-circle" 
                                class="w-4 svg-inline--fa fa-play-circle fa-w-16" 
                                role="img" xmlns="http://www.w3.org/2000/svg" 
                                viewBox="0 0 512 512">
                                <path fill="black" d="M371.7 238l-176-107c-15.8-8.8-35.7 2.5-35.7 21v208c0 18.4 19.8 29.8 35.7 21l176-101c16.4-9.1 16.4-32.8 0-42zM504 256C504 119 393 8 256 8S8 119 8 256s111 248 248 248 248-111 248-248zm-448 0c0-110.5 89.5-200 200-200s200 89.5 200 200-89.5 200-200 200S56 366.5 56 256z">
                                </path>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            <div class="flex-1 h-full overflow-y-auto overflow-x-hidden">
                    
                <!-- ################
                    property list
                ################-->

                <div class="p-4 border-b border-grey">
                    <div class="pb-2">
                        <h3 class="text-sm">Property List</h3>
                    </div>
                    <table class="w-full table-fixed text-xs border border-grey border-t-2 bg-white">
                        <thead class="bg-grey">
                            <tr>
                                <th width="125">NAME</th>
                                <th>VALUE</th>
                            </tr>
                        </thead>
                        <tbody class="proplist">
<!--                            <tr>-->
<!--                                <td class="bg-pink-lightest" align="center"><h3 class="text-xs">"email-address"</h3></td>-->
<!--                                <td><p>yu8108@naver</p></td>-->
<!--                            </tr>-->
<!--                            <tr>-->
<!--                                <td class="bg-pink-lightest" align="center"><h3 class="text-xs">"message"</h3></td>-->
<!--                                <td><p>금일오전중으로</p></td>-->
<!--                            </tr>-->
<!--                            <tr>-->
<!--                                <td class="bg-pink-lightest" align="center"><h3 class="text-xs">"IP"</h3></td>-->
<!--                                <td><p>211.192.0.25</p></td>-->
<!--                            </tr>-->
<!--                            <tr>-->
<!--                                <td class="bg-pink-lightest" align="center"><h3 class="text-xs">"location"</h3></td>-->
<!--                                <td><p>seoul</p></td>-->
<!--                            </tr>-->
<!--                            <tr>-->
<!--                                <td class="bg-pink-lightest" align="center"><h3 class="text-xs">"date"</h3></td>-->
<!--                                <td><p>2019.04.25</p></td>-->
<!--                            </tr>-->
                        </tbody>
                    </table>
                </div>

                <!-- ################
                    expand list 
                ################ --> 

                <div class="p-4 explist empty">

                    <!-- ################
                        expand label list 
                    ################ --> 

                    <div>
                        <div class="pb-2 flex items-center justify-between">
                            <h3 class="text-sm">Expand List</h3>
                            <button class="bg-blue-light p-1 px-2 text-xs border expand_btn">
                                EXPAND
                            </button>
                        </div>
                        <div class="flex">
                            <!-- <div class="bg-grey flex items-center px-3 border border-t-2 border-r-0 border-grey">
                                <h3 class="text-xs text-center">Label<br/>List</h3>
                            </div> -->
                            <div class="flex  flex-1 items-center pl-2 border border-grey border-t-2 overflow-x-auto bg-grey" style="height:45px">
                                <ul class="list-reset flex label-box tvllist">
<!--                                    <li><button class="bg-pink-lighter shadow border border-grey rounded text-xs px-2">email_id</button></li>-->
<!--                                    <li><button class="bg-pink-lighter shadow border border-grey rounded text-xs px-2">loaction</button></li>-->
<!--                                    <li><button class="bg-pink-lighter shadow border border-grey rounded text-xs px-2">address</button></li>-->
<!--                                    <li><button class="border border-dashed border-grey rounded text-xs px-2 text-grey-dark">browser</button></li>-->
                                </ul>
                            </div>
                        </div>
                    </div>

                    <!-- ################
                        expand node/edge list 
                    ################ -->

                    <div class="flex-1">
                        
                        <div class="p-2 px-3 flex items-center justify-between border border-t-0 border-grey">
                            <label class="text-xs">
                            
                            <input type="checkbox" class="allSelectCheckbox  align-middle mr-2"></label>
                            
                            <div class="relative">
                                <input type="text" class="bg-transparent border-b border-grey text-xs p-1 px-2 filterinput" placeholder="SEARCH">
                                <img src="/icon/search.svg" class="absolute m-auto pin-y z-10" style="width:12px;top:8px;right:6px;" alt="searchicon" />
                            </div>
                        </div>

                        <div class="vlist">
                            <!--<div class="p-2-5 px-3 flex items-center text-xs border border-t-0 border-grey">-->
                                <!--<input type="checkbox" class="mr-2"><p class="text-xs">yu8108@naver.com</p>-->
                            <!--</div>-->
                            <!--<div class="p-2-5 px-3 flex items-center text-xs border border-t-0 border-grey">-->
                                <!--<input type="checkbox" class="mr-2"><p class="text-xs">yu8108@naver.com</p>-->
                            <!--</div>-->
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="absolute px-2 text-white folding-btn" style="right:-25px;top:13px;height:36px;line-height:36px;background:#625955">
            <button>
                <svg aria-hidden="true" focusable="false" 
                    data-prefix="fas" data-icon="chevron-left" 
                    class="w-2 svg-inline--fa fa-chevron-left fa-w-10" 
                    role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512">
                    <path fill="#fff" d="M34.52 239.03L228.87 44.69c9.37-9.37 24.57-9.37 33.94 0l22.67 22.67c9.36 9.36 9.37 24.52.04 33.9L131.49 256l154.02 154.75c9.34 9.38 9.32 24.54-.04 33.9l-22.67 22.67c-9.37 9.37-24.57 9.37-33.94 0L34.52 272.97c-9.37-9.37-9.37-24.57 0-33.94z"></path>
                </svg>
            </button>
        </div>

        <div class="hidden absolute bg-white border border-grey shadow p-2 px-3 text-left rounded-sm" style="top: -12px; left: 150px" >
            <div class="flex items-center">
                <label for="lableFilter">
                    <svg aria-hidden="true" 
                        focusable="false" 
                        data-prefix="fas" 
                        data-icon="filter" 
                        class="w-3 svg-inline--fa fa-filter fa-w-16" role="img" 
                        xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                        <path fill="currentColor" d="M487.976 0H24.028C2.71 0-8.047 25.866 7.058 40.971L192 225.941V432c0 7.831 3.821 15.17 10.237 19.662l80 55.98C298.02 518.69 320 507.493 320 487.98V225.941l184.947-184.97C520.021 25.896 509.338 0 487.976 0z">
                        </path>
                    </svg>
                </label>
                <input id="lableFilter" type="text" class="border-b border-grey flex-1 ml-3">
            </div>                        
        </div>
    </div>
`



const MAIN_ATTR_INFO = {
    /*vertex : {
        domain : 'value',
        ip: 'value',
        url: 'value',
        email_message : 'subject',
        email_address : 'value',
        file: 'name',
        threat_event : null,
        groups: 'dtime',
        malware_type: 'value',
        location: 'value',
        times: null
    },*/
    vertex : {
        kisa_spamsniper: 'dtime',
        kisa_ddei: 'dtime',
        kisa_waf: 'dtime',
        kisa_osint: 'dtime',
        network_info: 'dtime',
        url: 'value',
        file: 'value',
        //email: 'source_ip',
        indicator: 'name',
        intrusion_set: 'name',
        malware: 'md5',
        attack_pattern: 'name',
        ip: 'value',
        domain: 'value',
        email: 'value',
        md5_hash: 'value'
    },
    edge:{
    }
}


let simpleVtxInfoTmpl =  _template(`
<h3 class="flex items-center rounded text-sm">
    <svg aria-hidden="true" 
        focusable="false" 
        data-prefix="far" 
        data-icon="envelope" 
        class="w-6 mr-4 svg-inline--fa fa-envelope fa-w-16" role="img" 
        xmlns="http://www.w3.org/2000/svg" viewBox="0 0 <%=width%> <%=height%>">
        <path fill="currentColor" d="<%=icon%>">
        </path>
    </svg>
    <span class="label" style="line-height:1.1rem">
        <%=label%>
        <br/>
        <!--<small>2019.04.24 16:52:39</small>-->
    </span>
</h3> 
<!-- <span class="bg-red-light rounded inline-block text-xs ml-2 p-1"><small class="text-white">
    매우위험</small> --> 
</span>
<!-- <p class="text-xs mt-2" style="color:#625955"><%=value%></p> -->
`)



export default class PropPopupWidget extends DomComponent{
    constructor(domSelector) {
        super(domSelector, 'expandSelectedPath','detectedAttack','similar','cluster_members','rank', 'showProgress', 'hideProgress')
        this.pocApi = new PocApiClient('/')
        this.handleTargetVertexLabelClick = this.handleTargetVertexLabelClick.bind(this);
        this.handleBookmarkClick = this.handleBookmarkClick.bind(this);
        this.handleContextMenuSelected = this.handleContextMenuSelected.bind(this);
        this.handleBlacklistClick = this.handleBlacklistClick.bind(this);
        this.handleSimilarBar = this.handleSimilarBar.bind(this)

        this.hide()
        this.domContainer.innerHTML = _html
        this.clusterInfo = {};

        // this.selectedTargetVertexLabel = null

        this.domContainer.addEventListener('click',(event)=>{
            event.stopPropagation()
        })

        let element = this.domContainer.querySelector('.tvllist');
        element.addEventListener('click',event=>{
            // console.log(event,  event.target.dataset.label)
            this.selectedTargetVLabel = event.target.dataset.label
            this.handleTargetVertexLabelClick(this.selectedTargetVLabel)
        });

        this.$1('.bookmark').addEventListener('click', this.handleBookmarkClick)
        this.$1('.rank').addEventListener('click', this.handleBlacklistClick)

        this.domContainer.querySelector('.filterinput').addEventListener('keyup',event=>{

            this.setExpandFilter(event.target.value)
        })

        this.domContainer.querySelector('.allSelectCheckbox').addEventListener('click',event=>{
            let alCheckBoxlElem = this.domContainer.querySelectorAll('.vlist input[type=checkbox]')
            //console.log('alCheckBoxlElem', alCheckBoxlElem)
            Array.from(alCheckBoxlElem).forEach(el=>el.checked = event.target.checked)
        })

        this.domContainer.querySelector('.expand_btn').addEventListener('click',event=>{
            let checkedElem = this.domContainer.querySelectorAll('.vlist input[type=checkbox]:checked')
            // console.log('checkedElem', checkedElem)

            let checkedIndex = {}

            Array.from(checkedElem).forEach(el=>{
                checkedIndex[el.dataset.pathindex] = true
                el.parentElement.parentElement.removeChild(el.parentElement)
                el.parentElement.remove()
            })

            // allSelectCheckbox 채크해제
            this.domContainer.querySelector('.allSelectCheckbox').checked = false;
            // allSelectCheckbox 비활성화
            if ( this.domContainer.querySelectorAll('.vlist input[type=checkbox]').length === 0 ) {
                this.domContainer.querySelector('.allSelectCheckbox').disabled = true;
            }

            let selectedPathArr = this.expandData
                .filter((p,idx)=> checkedIndex[idx])

            this.expandData = this.expandData
                .filter((p,idx)=> !checkedIndex[idx])

            this.fire('expandSelectedPath', selectedPathArr)

            // expand data 중 cluster 여부 확인
            let enc = [];
            selectedPathArr.forEach(spa => {
                spa.p.vertices.forEach(vo => {
                    Object.keys(this.clusterInfo).forEach( k => {
                        this.clusterInfo[k].forEach(nid => {
                            if ( vo.id === nid ) enc.push(vo.id);
                        });
                    });
                })
            });
            if ( enc.length > 0 ) {
                this.setClusterMembers();
            }
        })

        this.$1('.folding-btn').addEventListener('click', ()=>{
            this.hide()
        })

        this.$1('.similar_range').addEventListener('mouseup', (evt)=>{
            this.similarRangeValue = evt.target.value
            this.handleSimilarBar()
            this.dragstart = false
        })

        this.$1('.similar_range').addEventListener('mousedown', (evt)=>{
            this.dragstart = true
            // this.similarRangeValue = evt.target.value
            // this.handleSimilarBar()
        })

        this.$1('.similar_range').addEventListener('mousemove', (evt)=>{
            this.similarRangeValue = evt.target.value
            this.handleSimilarBar()
        })

        this.$1('.similar').addEventListener('click', ()=>{
            // this.pocApi.findSimilar(this.targetObj.id)
            // .then(pathArr=>{
            //     this.fire('similar',pathArr)
            // })

            // 기본값이 없을경우 기본값 적용
            this.similarRangeValue = this.similarRangeValue ? this.similarRangeValue : this.$1('.similar_range').value;

            this.pocApi.findSimilar2(this.targetObj.id, (+this.similarRangeValue)*-1, convertGraphPath).then(pathArr=>{
                this.fire('similar', pathArr)
            })
        })

        this.$1('.attracts').addEventListener('click', ()=>{
            this.setClusterMembers();
            // if ( confirm("The node position is initialized. Do you want to proceed?") ) {
            //     this.pocApi.findClusterMembers(this.targetObj.id)
            //     .then(gidArr=>{
            //         if( !this.clusterInfo[gidArr[0].cluster_id] ){
            //             this.clusterInfo[gidArr[0].cluster_id] = gidArr[0].nodes;
            //         }
            //         this.fire('cluster_members', gidArr)
            //     })
            // }
        })

        this.$1('.attack_detection').addEventListener('click', ()=>{
            // 공격탐색을 눌렀을 시
            // 1. vertex label 필요 (label에 따라 공격탐지 패턴이 달라짐)
            // 2. 만들어진 패턴으로 cypher 조회
            // 3. 결과 리턴
            // let pattern = ATTACK_DETECTION_PATTERN(this.targetObj.id)[this.targetObj.label]
            let pattern = Object.values(ATTACK_DETECTION_PATTERN(this.targetObj.id))

            this.pocApi.findByPatternAndStartNode(pattern, this.targetObj.id, convertGraphPath)
            .then(pathArr=>{
                this.fire('detectedAttack',pathArr)
            })

        })

    }
    // 0:
    //     group_id: 1
    // group_name: "bookmark"
    async handleBookmarkClick(event) {
        let groups = await this.pocApi.getCustomGroups('sglee', this.targetObj.id)

        let menues = groups.map(m=>{
            return {menu_id:m.group_id, menu_name:m.group_name, checked: m.gid != null }
        })

        this.ctxMenu = new ContextMenu(this.$1('li.bookmark') ,'Markers Group', menues)
        this.ctxMenu.on('contextMenuSelected',this.handleContextMenuSelected)
        this.ctxMenu.on('canceled', this.ctxMenu.closeContextMenu);
    }

    async handleBlacklistClick(event) {
        // let elem = findParent(event.target , 'li')
        // let isblacklist = elem.dataset.isblacklist == 'true' ? 'remove' : 'add'
        //
        // await this.pocApi.appendBlackListHistory(this.targetObj.id, 'sglee', 'description ... 이놈은 나쁜놈이여 ~', isblacklist)
        // let extraInfo = await this.pocApi.getGraphElemExtraInfo(this.targetObj.id, 'sglee')
        // this.setToolbarInfo(extraInfo)

        let menues = []
        menues.push({
            menu_id:1,
            menu_name:'PageRank',
            // checked: false
        })
        menues.push({
            menu_id:2,
            menu_name:'BetweennessCentrality',
            // checked: false
        })

        this.ctxMenu = new ContextMenu(this.$1('li.rank') ,'Algorithm', menues)
        this.ctxMenu.on('contextMenuSelected',this.handleContextMenuSelected)
        this.ctxMenu.on('canceled', this.ctxMenu.closeContextMenu);
    }

    setTargetObj(obj) {
        this.show()
        let el = this.$1('.propview')
        // if(obj.data.label == 'sender' || obj.data.label == 'receiver') {
        //     if(hasClass(el,'is-email')){
        //         removeClass(el, 'is-email')
        //     }
        //     toggleClass(el, 'is-email')
        // }else {
        //     removeClass(el, 'is-email')
        // }
        if(obj.data.fake) {
            if(hasClass(el,'is-fake')){
                removeClass(el, 'is-fake')
            }
            toggleClass(el, 'is-fake')
        }else {
            removeClass(el, 'is-fake')
        }

        let simpleVtxInfoElem = this.domContainer.querySelector('.simpleVtxInfo')

        if(obj == null) {
            this.domContainer.style.display = 'none'
            return
        }

        // print label,icon value
        simpleVtxInfoElem.innerHTML = simpleVtxInfoTmpl({
            label:obj.label,
            value:obj.data.props[MAIN_ATTR_INFO.vertex[obj.label]],
            icon: ICON_DICT[obj.label].path,
            width: ICON_DICT[obj.label].iw,
            height: ICON_DICT[obj.label].ih
        })

        this.targetObj = obj

        // print prop list
        //console.log('prop_obj',obj)
        obj.props['count'] = obj.inDegree + obj.outDegree

        this.domContainer.querySelector('.proplist').innerHTML = Object.keys(obj.props).map(k=>{
            return `
                <tr>
                    <td align="center"><span class="text-xs">"${k}"</span></td>
                    <td><p title="${obj.props[k]}">${obj.props[k]}</p></td>
                </tr>
             
            `
        }).join('\n')

        // this.domContainer.querySelector('.mainlabel').innerHTML = obj.label +'(' + obj.id + ')
        // ICON_DICT[d].path)
    }

    show() {
        this.domContainer.style.left = '24px'
    }

    hide() {
        this.domContainer.style.left = '-10000px'
    }

    handleTargetVertexLabelClick() {
        // this.selectedTargetVertexLabel = label;
        this.changeTargetVertexLabel()
    }

    async handleContextMenuSelected(dataset) {
        //gid , user_id , group_id

        // console.log('ContextMenu dataset', dataset)
        // {menuid: "1", menuname: "PageRank", checked: "false"}
        // menuid, menuname
        if(dataset.menuname=='PageRank'){
            this.fire('showProgress');
            let res = await this.pocApi.findRank(this.targetObj.data.props.value, 0)
            res = res.embedded.reduce((memo,key)=>{
                return memo.rank_value > key.rank_value ? memo : key
            })
            this.fire('rank', res)
            this.fire('hideProgress');
        }else if(dataset.menuname == 'BetweennessCentrality'){
            this.fire('showProgress');
            let res = await this.pocApi.findRank(this.targetObj.data.props.value, 1)
            res = res.embedded.reduce((memo,key)=>{
                return memo.rank_value > key.rank_value ? memo : key
            })
            this.fire('rank', res)
            this.fire('hideProgress');
        }else{
            if(dataset.checked === 'true') {
                await this.pocApi.removeBookmark(this.targetObj.id, 'sglee', +dataset.menuid)
            }else {
                await this.pocApi.addBookmark(this.targetObj.id, 'sglee', +dataset.menuid)
            }

            let extraInfo = await this.pocApi.getGraphElemExtraInfo(this.targetObj.id, 'sglee')
            this.setToolbarInfo(extraInfo)
        }
    }

    changeTargetVertexLabel() {
        let distinctTargetVertexLabels = {}
        this.expandData.forEach(p=>{

            if(distinctTargetVertexLabels[p.p.vertices[1].label] ) {
                distinctTargetVertexLabels[p.p.vertices[1].label]++
            }else {
                distinctTargetVertexLabels[p.p.vertices[1].label] = 1
            }
        })

        this.resetTargetVertexLabel(distinctTargetVertexLabels);

        let element = this.domContainer.querySelector('.tvllist');

        element.innerHTML = Object.keys(distinctTargetVertexLabels).map((k, idx)=>{
            return `
                <li class="w-auto"><button class="${this.selectedTargetVLabel == k ? 'bg-white' : 'bg-grey-light'}  hover:shadow text-xs px-2" 
                    data-label="${k}"> ${k} (${distinctTargetVertexLabels[k]}) </button></li>
            `
        }).join('\n');

        this.domContainer.querySelector('.filterinput').value = ''
        this.setExpandFilter('')
    }

    handleSimilarBar() {
        if(this.dragstart) {
            this.$1('.similar_text').innerHTML = (+this.similarRangeValue)*-1
        }
    }

    /**
     * array of path from targetNode
     * @param expanData
     */
    setTargetExpandData(expandData) {
        // console.log('expandData', expandData)
        this.expandData = expandData;

        if(expandData.length >= 1) {
            removeClass(this.$1('.explist'), 'empty'  )
            // this.$1('.explist').style.display = 'block'
            this.selectedTargetVLabel = expandData[0].p.vertices[1].label
        }else {
            addClass(this.$1('.explist'), 'empty' )
            // this.$1('.explist').style.display = 'none'
        }

        this.changeTargetVertexLabel()
    }

    setExpandFilter(str) {
        this.domContainer.querySelector('.vlist').innerHTML = this.expandData
            .map((p,idx)=>{let v = p.p.vertices[1]; v.mainAttrVal =  v.props[MAIN_ATTR_INFO.vertex[v.label]]; v.pathIndex = idx ; return v  })
            .filter(v=>v.label == this.selectedTargetVLabel)
            .filter(v=> str == '' ? true : v.mainAttrVal.indexOf(str) != -1  )
            .map(v=>{
                return `
                    <div class="p-3 flex items-center text-xs border border-t-0 border-grey">
                        <input type="checkbox" class="mr-2" data-pathindex="${v.pathIndex}"><p class="text-xs">${v.mainAttrVal}</p>
                    </div>
                   
                `
            }).join('\n')
    }

    setToolbarInfo(extraInfo) {
        // console.log('extraInfo', extraInfo)
        // if(extraInfo.isblacklist == 'true') {
        //     this.$1('.blacklist button').style.backgroundColor = 'azure'
        //     this.$1('.blacklist').dataset.isblacklist = 'true'
        //
        // }else {
        //     this.$1('.blacklist button').style.backgroundColor = 'white'
        //     this.$1('.blacklist').dataset.isblacklist = 'false'
        // }

        if(extraInfo.bookmark_count > 0) {
            this.$1('.bookmarkcaption').textContent = `Markers (${extraInfo.bookmark_count})`
        }else {
            this.$1('.bookmarkcaption').textContent = `Markers`
        }

    }

    canceledContextMenu() {
        if ( this.ctxMenu ) {
            this.ctxMenu.fire('canceled');
            this.ctxMenu = undefined;
        }
    }

    resetTargetVertexLabel(distinctTargetVertexLabels) {
        this.domContainer.querySelector('.allSelectCheckbox').checked = false;
        if ( Object.keys(distinctTargetVertexLabels).length ) {
            this.domContainer.querySelector('.allSelectCheckbox').disabled = false;
        } else { 
            this.domContainer.querySelector('.allSelectCheckbox').disabled = true;
        }
    }

    setClusterMembers() {
        if ( confirm("The node position is initialized. Do you want to proceed?") ) {
            this.pocApi.findClusterMembers(this.targetObj.id)
            .then(gidArr=>{
                if( !this.clusterInfo[gidArr[0].cluster_id] ){
                    this.clusterInfo[gidArr[0].cluster_id] = gidArr[0].nodes;
                }
                this.fire('cluster_members', gidArr)
            })
        }
    }

    clearClusterInfo() {
        this.clusterInfo = {};
    }
}
