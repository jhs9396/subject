import EventEmitter from "../util/EventEmitter";
const _template = require('lodash.template');
require('./NodeMenu.styl');

const _html = ` 
    <div class="nodeview relative flex z-10 propview">
        <div class="tab-component">
            <div class="items">
                <ul class="list-reset flex relative" style="bottom:-1px">
                    <li class="flex">
                        <a href="" class="bg-grey flex border border-grey bg-white no-underline p-2 px-3 text-xs">
                            Property List</a>
                    </li>
                    <li class="flex">
                        <a href="" class="flex border border-l-0 border-b-0 border-grey bg-white no-underline p-2 px-3 text-xs">
                            Expand List</a>
                    </li>
                </ul>
                <div class="w-full border-b border-grey"></div>
            </div>
            <table class="table-fixed text-xs bg-white border border-grey">
                <thead class="bg-grey">
                    <tr>
                        <th class="w-100">name</th>
                        <th>value</th>
                    </tr>
                </thead>
                <tbody class="proplist">
<!--                    <tr>-->
<!--                        <td class="w-100"><p>Attr</p></td>-->
<!--                        <td><p>123123141241251515asdfasdf</p></td>-->
<!--                    </tr>-->
                </tbody>
            </table>
<!--            <span class="arr" style="top:72px; right: -12px; transform: rotate(180deg)"></span>-->
        </div>

        <div class="tab-component flex absolute expview" style="width:702px; left: 352px">
            <div class="items bg-white overflow-x-hidden overflow-y-auto border border-r-0 border-grey">
                <div class="caption text-xs bg-grey border-b border-grey text-center uppercase">
                    Label
                </div>
                <ul class="list-reset">
                    <li>
                        <a href="" class="block border-b border-grey bg-white no-underline text-black flex items-center justify-center text-xs">
                            <span><svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="globe" class="w-3 svg-inline--fa fa-globe fa-w-16" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 496 512"><path fill="currentColor" d="M336.5 160C322 70.7 287.8 8 248 8s-74 62.7-88.5 152h177zM152 256c0 22.2 1.2 43.5 3.3 64h185.3c2.1-20.5 3.3-41.8 3.3-64s-1.2-43.5-3.3-64H155.3c-2.1 20.5-3.3 41.8-3.3 64zm324.7-96c-28.6-67.9-86.5-120.4-158-141.6 24.4 33.8 41.2 84.7 50 141.6h108zM177.2 18.4C105.8 39.6 47.8 92.1 19.3 160h108c8.7-56.9 25.5-107.8 49.9-141.6zM487.4 192H372.7c2.1 21 3.3 42.5 3.3 64s-1.2 43-3.3 64h114.6c5.5-20.5 8.6-41.8 8.6-64s-3.1-43.5-8.5-64zM120 256c0-21.5 1.2-43 3.3-64H8.6C3.2 212.5 0 233.8 0 256s3.2 43.5 8.6 64h114.6c-2-21-3.2-42.5-3.2-64zm39.5 96c14.5 89.3 48.7 152 88.5 152s74-62.7 88.5-152h-177zm159.3 141.6c71.4-21.2 129.4-73.7 158-141.6h-108c-8.8 56.9-25.6 107.8-50 141.6zM19.3 352c28.6 67.9 86.5 120.4 158 141.6-24.4-33.8-41.2-84.7-50-141.6h-108z"></path></svg></span>
                        </a> 
                    </li>
                    <li>
                        <a href="" class="block border-b border-grey bg-grey no-underline text-black flex items-center justify-center text-xs">
                            <span><svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="globe" class="w-3 svg-inline--fa fa-globe fa-w-16" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 496 512"><path fill="currentColor" d="M336.5 160C322 70.7 287.8 8 248 8s-74 62.7-88.5 152h177zM152 256c0 22.2 1.2 43.5 3.3 64h185.3c2.1-20.5 3.3-41.8 3.3-64s-1.2-43.5-3.3-64H155.3c-2.1 20.5-3.3 41.8-3.3 64zm324.7-96c-28.6-67.9-86.5-120.4-158-141.6 24.4 33.8 41.2 84.7 50 141.6h108zM177.2 18.4C105.8 39.6 47.8 92.1 19.3 160h108c8.7-56.9 25.5-107.8 49.9-141.6zM487.4 192H372.7c2.1 21 3.3 42.5 3.3 64s-1.2 43-3.3 64h114.6c5.5-20.5 8.6-41.8 8.6-64s-3.1-43.5-8.5-64zM120 256c0-21.5 1.2-43 3.3-64H8.6C3.2 212.5 0 233.8 0 256s3.2 43.5 8.6 64h114.6c-2-21-3.2-42.5-3.2-64zm39.5 96c14.5 89.3 48.7 152 88.5 152s74-62.7 88.5-152h-177zm159.3 141.6c71.4-21.2 129.4-73.7 158-141.6h-108c-8.8 56.9-25.6 107.8-50 141.6zM19.3 352c28.6 67.9 86.5 120.4 158 141.6-24.4-33.8-41.2-84.7-50-141.6h-108z"></path></svg></span>
                        </a> 
                    </li>
                    <li>
                        <a href="" class="block border-b border-grey bg-grey no-underline text-black flex items-center justify-center text-xs">
                            <span><svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="globe" class="w-3 svg-inline--fa fa-globe fa-w-16" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 496 512"><path fill="currentColor" d="M336.5 160C322 70.7 287.8 8 248 8s-74 62.7-88.5 152h177zM152 256c0 22.2 1.2 43.5 3.3 64h185.3c2.1-20.5 3.3-41.8 3.3-64s-1.2-43.5-3.3-64H155.3c-2.1 20.5-3.3 41.8-3.3 64zm324.7-96c-28.6-67.9-86.5-120.4-158-141.6 24.4 33.8 41.2 84.7 50 141.6h108zM177.2 18.4C105.8 39.6 47.8 92.1 19.3 160h108c8.7-56.9 25.5-107.8 49.9-141.6zM487.4 192H372.7c2.1 21 3.3 42.5 3.3 64s-1.2 43-3.3 64h114.6c5.5-20.5 8.6-41.8 8.6-64s-3.1-43.5-8.5-64zM120 256c0-21.5 1.2-43 3.3-64H8.6C3.2 212.5 0 233.8 0 256s3.2 43.5 8.6 64h114.6c-2-21-3.2-42.5-3.2-64zm39.5 96c14.5 89.3 48.7 152 88.5 152s74-62.7 88.5-152h-177zm159.3 141.6c71.4-21.2 129.4-73.7 158-141.6h-108c-8.8 56.9-25.6 107.8-50 141.6zM19.3 352c28.6 67.9 86.5 120.4 158 141.6-24.4-33.8-41.2-84.7-50-141.6h-108z"></path></svg></span>
                        </a> 
                    </li>
                </ul>
            </div>
            <div class="panels w-full flex-1" style="width: 650px">
                <div>
                    <h2 id="" class="screen_out">ip</h2>     
                    <div class="absolute" style="right: 0; top: -30px">
                        <button type="button" class="bg-white p-2 px-3 text-xs border border-grey" >EXPAND</button>
                    </div>              
                    <div class="overflow-auto">
                        <div class="caption px-4 text-xs bg-grey border border-b-0 border-grey uppercase">
                            Expand list
                        </div>
                        <table class="w-full table-fixed text-xs border border-grey bg-white">
                            <thead class="bg-grey">
                                <tr>
                                    <th class="first"><input type="checkbox"></th>
                                    <th class="relative">
                                        <div class="flex items-center justify-center">
                                            <h4>mail_address</h4>
                                            <button type="button" class="align-middle">
                                                <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="filter" class="w-2-5 svg-inline--fa fa-filter fa-w-16" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M487.976 0H24.028C2.71 0-8.047 25.866 7.058 40.971L192 225.941V432c0 7.831 3.821 15.17 10.237 19.662l80 55.98C298.02 518.69 320 507.493 320 487.98V225.941l184.947-184.97C520.021 25.896 509.338 0 487.976 0z"></path></svg>
                                            </button>
                                        </div>
                                    </th>
                                    <th>
                                        <div class="flex items-center justify-center">
                                            <h4>mail_idasdfasdfasdfasdf</h4>
                                            <button type="button" class="align-middle">
                                                <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="filter" class="w-2-5 svg-inline--fa fa-filter fa-w-16" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M487.976 0H24.028C2.71 0-8.047 25.866 7.058 40.971L192 225.941V432c0 7.831 3.821 15.17 10.237 19.662l80 55.98C298.02 518.69 320 507.493 320 487.98V225.941l184.947-184.97C520.021 25.896 509.338 0 487.976 0z"></path></svg>
                                            </button>
                                        </div>
                                    </th>
                                    <th>
                                        <div class="flex items-center justify-center">
                                            <h4>browser_attr</h4>
                                            <button type="button" class="align-middle">
                                                <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="filter" class="w-2-5 svg-inline--fa fa-filter fa-w-16" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M487.976 0H24.028C2.71 0-8.047 25.866 7.058 40.971L192 225.941V432c0 7.831 3.821 15.17 10.237 19.662l80 55.98C298.02 518.69 320 507.493 320 487.98V225.941l184.947-184.97C520.021 25.896 509.338 0 487.976 0z"></path></svg>
                                            </button>
                                        </div>
                                    </th>
                                    <th>
                                        <div class="flex items-center justify-center">
                                            <h4>browser</h4>
                                            <button type="button" class="align-middle">
                                                <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="filter" class="w-2-5 svg-inline--fa fa-filter fa-w-16" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M487.976 0H24.028C2.71 0-8.047 25.866 7.058 40.971L192 225.941V432c0 7.831 3.821 15.17 10.237 19.662l80 55.98C298.02 518.69 320 507.493 320 487.98V225.941l184.947-184.97C520.021 25.896 509.338 0 487.976 0z"></path></svg>
                                            </button>
                                        </div>
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                
                                <tr>
                                    <td align="center" class="first"><input type="checkbox"></td>
                                    <td><p>123.123.1.12123123123123123</p></td>
                                    <td><p>123.123.1.12</p></td>
                                    <td><p>123.123.1.12</p></td>
                                    <td><p>123.123.1.12</p></td>
                                </tr>
                                
                            </tbody>
                        </table>
                    </div>
                </div>
                <div>
                    <h2 id="" class="screen_out">Expand</h2>    
                    <div class="tab-component flex">
                        <div class="items bg-white overflow-x-hidden overflow-y-auto border-r border-grey">
                            <ul class="list-reset bg-grey h-full" style="box-shadow: inset -1px 0px 3px rgba(0,0,0,0.15)">
                                <li>
                                    <a href="" class="block no-underline text-black flex items-center justify-center text-sm">
                                        <span><svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="globe" class="w-3-5 svg-inline--fa fa-globe fa-w-16" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 496 512"><path fill="currentColor" d="M336.5 160C322 70.7 287.8 8 248 8s-74 62.7-88.5 152h177zM152 256c0 22.2 1.2 43.5 3.3 64h185.3c2.1-20.5 3.3-41.8 3.3-64s-1.2-43.5-3.3-64H155.3c-2.1 20.5-3.3 41.8-3.3 64zm324.7-96c-28.6-67.9-86.5-120.4-158-141.6 24.4 33.8 41.2 84.7 50 141.6h108zM177.2 18.4C105.8 39.6 47.8 92.1 19.3 160h108c8.7-56.9 25.5-107.8 49.9-141.6zM487.4 192H372.7c2.1 21 3.3 42.5 3.3 64s-1.2 43-3.3 64h114.6c5.5-20.5 8.6-41.8 8.6-64s-3.1-43.5-8.5-64zM120 256c0-21.5 1.2-43 3.3-64H8.6C3.2 212.5 0 233.8 0 256s3.2 43.5 8.6 64h114.6c-2-21-3.2-42.5-3.2-64zm39.5 96c14.5 89.3 48.7 152 88.5 152s74-62.7 88.5-152h-177zm159.3 141.6c71.4-21.2 129.4-73.7 158-141.6h-108c-8.8 56.9-25.6 107.8-50 141.6zM19.3 352c28.6 67.9 86.5 120.4 158 141.6-24.4-33.8-41.2-84.7-50-141.6h-108z"></path></svg></span>
                                    </a> 
                                </li>
                                <li>
                                    <a href="" class="block no-underline text-black flex items-center justify-center text-sm" style="opacity:.3">
                                        <span><svg aria-hidden="true" focusable="false" data-prefix="far" data-icon="angry" class="w-3-5 svg-inline--fa fa-angry fa-w-16" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 496 512"><path fill="currentColor" d="M248 8C111 8 0 119 0 256s111 248 248 248 248-111 248-248S385 8 248 8zm0 448c-110.3 0-200-89.7-200-200S137.7 56 248 56s200 89.7 200 200-89.7 200-200 200zm0-144c-33.6 0-65.2 14.8-86.8 40.6-8.5 10.2-7.1 25.3 3.1 33.8s25.3 7.2 33.8-3c24.8-29.7 75-29.7 99.8 0 8.1 9.7 23.2 11.9 33.8 3 10.2-8.5 11.5-23.6 3.1-33.8-21.6-25.8-53.2-40.6-86.8-40.6zm-48-72c10.3 0 19.9-6.7 23-17.1 3.8-12.7-3.4-26.1-16.1-29.9l-80-24c-12.8-3.9-26.1 3.4-29.9 16.1-3.8 12.7 3.4 26.1 16.1 29.9l28.2 8.5c-3.1 4.9-5.3 10.4-5.3 16.6 0 17.7 14.3 32 32 32s32-14.4 32-32.1zm199-54.9c-3.8-12.7-17.1-19.9-29.9-16.1l-80 24c-12.7 3.8-19.9 17.2-16.1 29.9 3.1 10.4 12.7 17.1 23 17.1 0 17.7 14.3 32 32 32s32-14.3 32-32c0-6.2-2.2-11.7-5.3-16.6l28.2-8.5c12.7-3.7 19.9-17.1 16.1-29.8z"></path></svg></span>
                                    </a> 
                                </li>
                                <li>
                                    <a href="" class="block no-underline text-black flex items-center justify-center text-sm" style="opacity:.3">
                                        <span><svg aria-hidden="true" focusable="false" data-prefix="far" data-icon="envelope" class="w-3-5 svg-inline--fa fa-envelope fa-w-16" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M464 64H48C21.49 64 0 85.49 0 112v288c0 26.51 21.49 48 48 48h416c26.51 0 48-21.49 48-48V112c0-26.51-21.49-48-48-48zm0 48v40.805c-22.422 18.259-58.168 46.651-134.587 106.49-16.841 13.247-50.201 45.072-73.413 44.701-23.208.375-56.579-31.459-73.413-44.701C106.18 199.465 70.425 171.067 48 152.805V112h416zM48 400V214.398c22.914 18.251 55.409 43.862 104.938 82.646 21.857 17.205 60.134 55.186 103.062 54.955 42.717.231 80.509-37.199 103.053-54.947 49.528-38.783 82.032-64.401 104.947-82.653V400H48z"></path></svg></span>
                                    </a> 
                                </li>
                            </ul>
                        </div>
                        <div class="panels flex-1">
                            <div>
                                <h2 id="" class="screen_out">ip</h2>    
                                <div class="flex items-center justify-between p-2 border-b border-grey">
                                    <div class="flex items-center">
                                        <input type="checkbox" class="mr-2">
                                        <h3 class="text-xs inline-block">All</h3>
                                    </div>
                                    <button class="text-xs p-1 px-2 rounded-sm bg-black text-white">Expand</button>
                                </div>
                                <div class="accordian">
                                    <div class="head bg-grey flex items-center justify-between p-2">
                                        <div class="flex items-center">
                                            <input type="checkbox" class="mr-2">
                                            <h3 class="text-xs inline-block">Date</h3>
                                        </div>
                                        <button>
                                            <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="angle-down" class="w-2 svg-inline--fa fa-angle-down fa-w-10" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path fill="currentColor" d="M143 352.3L7 216.3c-9.4-9.4-9.4-24.6 0-33.9l22.6-22.6c9.4-9.4 24.6-9.4 33.9 0l96.4 96.4 96.4-96.4c9.4-9.4 24.6-9.4 33.9 0l22.6 22.6c9.4 9.4 9.4 24.6 0 33.9l-136 136c-9.2 9.4-24.4 9.4-33.8 0z"></path></svg>
                                        </button>
                                    </div>
                                    <ul class="content list-reset text-xs">
                                        <li class="border-t border-b border-grey p-2 flex">
                                            <input type="checkbox" class="mr-2">
                                            <p class="inline-block"> 2019.01.25</p>
                                        </li>
                                        <li class="border-b border-grey p-2 flex">
                                            <input type="checkbox" class="mr-2">
                                            <p class="inline-block"> 2019.01.25</p>
                                        </li>
                                        <li class="border-b border-grey p-2 flex">
                                            <input type="checkbox" class="mr-2">
                                            <p class="inline-block"> 2019.01.25</p>
                                        </li>
                                    </ul>
                                </div> 
                                <div class="accordian">
                                    <div class="head bg-grey flex items-center justify-between p-2">
                                        <div class="flex items-center">
                                            <input type="checkbox" class="mr-2">
                                            <h3 class="text-xs inline-block">Date</h3>
                                        </div>
                                        <button> 
                                            <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="angle-down" class="w-2 svg-inline--fa fa-angle-down fa-w-10" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path fill="currentColor" d="M143 352.3L7 216.3c-9.4-9.4-9.4-24.6 0-33.9l22.6-22.6c9.4-9.4 24.6-9.4 33.9 0l96.4 96.4 96.4-96.4c9.4-9.4 24.6-9.4 33.9 0l22.6 22.6c9.4 9.4 9.4 24.6 0 33.9l-136 136c-9.2 9.4-24.4 9.4-33.8 0z"></path></svg>
                                        </button>
                                    </div>
                                    <ul class="content list-reset text-xs hidden">
                                        <li class="border-t border-b border-grey p-2 flex">
                                            <input type="checkbox" class="mr-2">
                                            <p class="inline-block"> 2019.01.25</p>
                                        </li>
                                        <li class="border-b border-grey p-2 flex">
                                            <input type="checkbox" class="mr-2">
                                            <p class="inline-block"> 2019.01.25</p>
                                        </li>
                                        <li class="border-b border-grey p-2 flex">
                                            <input type="checkbox" class="mr-2">
                                            <p class="inline-block"> 2019.01.25</p>
                                        </li>
                                    </ul>
                                </div> 
                            </div>
                            <div>
                                <h2 id="" class="screen_out">domain</h2>
                            </div>
                            <div>
                                <h2 id="" class="screen_out">Location</h2>
                            </div>
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
                            <span class="arr" style="bottom: -12px; left:60px; transform: rotate(-90deg);">
                                <span class="arr_inner"></span>
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <span class="arr" style="top:72px; left:-12px"></span>
        </div>
    </div>
`


export default class NodeMenuWidget extends EventEmitter{
    constructor(domSelector) {
        super('next','prev','expand')
        this.domContainer = typeof domSelector == "string" ? document.querySelector(domSelector) : domSelector
        this.domContainer.innerHTML = _html

        /** method class bind area **/
        this.handleNodeViewClick = this.handleNodeViewClick.bind(this)
        this.setExpandViewHeader = this.setExpandViewHeader.bind(this)
        this.setExpandViewLabels = this.setExpandViewLabels.bind(this)
        this.setExpandViewTbody = this.setExpandViewTbody.bind(this)
        this.handleExpandTabClick = this.handleExpandTabClick.bind(this)

        /** event listener area **/
        this.domContainer.addEventListener('click', this.handleNodeViewClick)
        // this.domContainer.querySelector('.label-list').addEventListener('click', this.handleExpandTabClick)

        this._expandListTmpl = _template(`
            <tr>
                
                <td><p></p></td>
                
                <td align="center" class="first"><input type="checkbox"></td>
            </tr>
        `)

    }

    handleNodeViewClick(evt) {
        this.fire('click',evt)
    }

    handleExpandTabClick(evt) {
        console.log('evt',evt)
    }

    hide() {
        this.domContainer.style.display = 'none'

        this.domContainer.querySelector('.propview').style.display = 'none'
        this.domContainer.querySelector('.expview').style.display = 'none'
    }



    setNodeInfo(obj) {
        this.domContainer.style.display = 'block'

        this.domContainer.querySelector('.propview').style.display = 'block'
        this.domContainer.querySelector('.expview').style.display = 'flex'

        this.domContainer.style.left = '148px';
        this.domContainer.style.top = (window.innerHeight/2 - 200) + 'px';


        this.domContainer.querySelector('.proplist').innerHTML = Object.keys(obj.props).map(k=>{
            return `
                <tr class="text-xs">
                    <td class="w-100 px-2"><p title="${k}">${k}</p></td>
                    <td class="px-2"><p title="${obj.props[k]}">${obj.props[k]}</p></td>
                </tr>
            `
        }).join('\n')

    }

    setExpandInfo(obj) {
        let labels = obj.vertices.map(v=>v.label).filter((value, index, self) => self.indexOf(value) === index)

        // {label1 :[], label2:[], label3:[]... }
        let lists = {}
        labels.forEach(label=>{
            lists[`${label}`] = []
        })

        Object.keys(lists).forEach(label=>{
            obj.vertices.forEach(v=>{
                if(label==v.label) {
                    lists[`${label}`].push(v)
                }
            })
        })

        // label
        this.setExpandViewLabels(lists)

    }

    showPropOnly(obj) {
        this.domContainer.style.display = 'block'

        this.domContainer.querySelector('.propview').style.display = 'block'
        this.domContainer.querySelector('.expview').style.display = 'none'


        this.domContainer.style.left = '148px';
        this.domContainer.style.top = (window.innerHeight/2 - 200) + 'px';


        this.domContainer.querySelector('.proplist').innerHTML = Object.keys(obj.props).map(k=>{
            return `
                <tr class="text-xs">
                    <td class="w-100 px-2"><p title="${k}">${k}</p></td>
                    <td class="px-2"><p title="${obj.props[k]}">${obj.props[k]}</p></td>
                </tr>
            `
        }).join('\n')
    }

    setExpandViewLabels(labelsObj) {
        // label
        this.domContainer.querySelector('.label-list').innerHTML = Object.keys(labelsObj).map((label,i)=>{
            let classT = _template(`<% if(i==0) {%> bg-white <%} else {%> bg-grey <%}%>`)
            this.expandTab = label
            return `
                 <li>
                    <a class="block border-b border-grey ${classT({i:i})} no-underline text-black flex items-center justify-center text-xs" label=${label}>
                        <span><svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="globe" class="w-3 svg-inline--fa fa-globe fa-w-16" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 496 512"><path fill="currentColor" d="M336.5 160C322 70.7 287.8 8 248 8s-74 62.7-88.5 152h177zM152 256c0 22.2 1.2 43.5 3.3 64h185.3c2.1-20.5 3.3-41.8 3.3-64s-1.2-43.5-3.3-64H155.3c-2.1 20.5-3.3 41.8-3.3 64zm324.7-96c-28.6-67.9-86.5-120.4-158-141.6 24.4 33.8 41.2 84.7 50 141.6h108zM177.2 18.4C105.8 39.6 47.8 92.1 19.3 160h108c8.7-56.9 25.5-107.8 49.9-141.6zM487.4 192H372.7c2.1 21 3.3 42.5 3.3 64s-1.2 43-3.3 64h114.6c5.5-20.5 8.6-41.8 8.6-64s-3.1-43.5-8.5-64zM120 256c0-21.5 1.2-43 3.3-64H8.6C3.2 212.5 0 233.8 0 256s3.2 43.5 8.6 64h114.6c-2-21-3.2-42.5-3.2-64zm39.5 96c14.5 89.3 48.7 152 88.5 152s74-62.7 88.5-152h-177zm159.3 141.6c71.4-21.2 129.4-73.7 158-141.6h-108c-8.8 56.9-25.6 107.8-50 141.6zM19.3 352c28.6 67.9 86.5 120.4 158 141.6-24.4-33.8-41.2-84.7-50-141.6h-108z"></path></svg></span>
                    </a> 
                </li>
            `
        }).join('')
    }

    setExpandViewHeader(labelsObj) {
        this.domContainer.querySelector('.expand-header').innerHTML = `<th class="first"><input type="checkbox"></th>`+Object.keys(labelsObj[`${this.expandTab}`][0].props).map(k=>{
            return `
                <th class="relative">
                    <div class="flex items-center justify-center">
                        <h4>${k}</h4>
                        <button type="button" class="align-middle">
                            <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="filter" class="w-2-5 svg-inline--fa fa-filter fa-w-16" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M487.976 0H24.028C2.71 0-8.047 25.866 7.058 40.971L192 225.941V432c0 7.831 3.821 15.17 10.237 19.662l80 55.98C298.02 518.69 320 507.493 320 487.98V225.941l184.947-184.97C520.021 25.896 509.338 0 487.976 0z"></path></svg>
                        </button>
                    </div>
                </th>
            `
        }).join('')
    }

    setExpandViewTbody(labelsObj) {
        this.domContainer.querySelector('.expand-list').innerHTML = labelsObj[`${this.expandTab}`].map(k=>{
            let tdTempl = _template(`
                <% Object.keys(props).forEach(v=>{ %><td><p><%= props[v] %></p></td><% }) %>
            `)
            return `
                <tr>
                    <td align="center" class="first"><input type="checkbox"></td>`
                +tdTempl(k)+
                `</tr>
            `
        }).join('')
    }
}
