
export default class EventEmitter {
    constructor(...evtNames) {
        this.listeners = {};
        this.supportEvents = {};

        this.addSupportEvent(evtNames)
    }
    /**
     *
     * @param {string|string[]} evtName
     */
    addSupportEvent(evtName) {
        if (evtName instanceof Array)
            evtName.forEach(evtnm => this.addSupportEvent(evtnm));
        else
            this.supportEvents[evtName] = true;
    }
    /**
     *
     * @param {string} evtName event name
     * @returns {boolean} 이벤트 지원 여부.
     */
    checkSupport(evtName) {
        return !!this.supportEvents[evtName];
    }
    /**
     *
     * @param {string} eventName
     * @param {Callback} callback
     * @param ctx
     */
    on(eventName, callback, ctx) {
        if (!this.checkSupport(eventName)) {
            console.error(`${eventName}은 지원하지 않는 event 입니다. 제공되는 이벤트는 ${Object.keys(this.supportEvents).join(',')} 입니다.`);
            return;
        }
        ctx = ctx ? ctx : this;
        let evtListeners = this.listeners[eventName];
        if (evtListeners) {
            evtListeners.push({ cb: callback, ctx: ctx });
        }
        else {
            this.listeners[eventName] = [{ cb: callback, ctx: ctx }];
        }
    }

    off(eventName, callback) {
        let evtListeners = this.listeners[eventName];
        if (!evtListeners)
            return;
        let idx = evtListeners.findIndex((v) => v.cb == callback);
        if (idx < 0)
            return;
        evtListeners.splice(idx, 1);
    }

    fire(eventName, ...param) {
        let evtListeners = this.listeners[eventName];
        if (!evtListeners)
            return;
        evtListeners.forEach((v) => v.cb.apply(v.ctx, param));
    }
}




export class DomComponent extends EventEmitter {
    constructor(domSelector, ...evtNames) {
        super(...evtNames)
        this.domContainer = typeof domSelector == "string" ? document.querySelector(domSelector) : domSelector
    }


    $(selector) {
        return this.domContainer.querySelectorAll(selector)
    }

    $1(selector) {
        return this.domContainer.querySelector(selector)
    }

}
