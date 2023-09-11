export default class InteractableView {
    constructor() { }

    static addMouseEnter(element, callback = () => { }) {
        element.interactive = true;
        element.buttonMode = true;
        element.on('pointerover', callback);
        element.on('touchstart', callback);
    }
    static addMouseOut(element, callback = () => { }) {
        element.interactive = true;
        element.buttonMode = true;
        element.on('pointerout', callback);
        element.on('touchend', callback);
    }
    static addMouseClick(element, callback = () => { }) {
        element.interactive = true;
        element.buttonMode = true;
        element.on('pointertap', callback);//.on('tap', callback);
        //element.on('tap', callback);//.on('tap', callback);
    }
    static addMouseDown(element, callback = () => { }) {
        element.interactive = true;
        element.buttonMode = true;
        element.on('pointerdown', callback);//.on('tap', callback);
        //element.on('touchstart', callback);//.on('tap', callback);
    }
    static addMouseUp(element, callback = () => { }) {
        element.interactive = true;
        element.buttonMode = true;
        element.on('pointerup', callback);//.on('tap', callback);
        //element.on('touchend', callback);
        return callback;
    }
    static addMouseMove(element, callback = () => { }) {
        element.interactive = true;
        element.buttonMode = true;
        element.on('pointermove', callback);//.on('tap', callback);
        element.on('touchmove', callback);//.on('tap', callback);
    }
    static addMouseUpOutside(element, callback = () => { }) {
        element.interactive = true;
        element.buttonMode = true;
        element.on('pointerupoutside', callback);//.on('tap', callback);
        //element.on('touchendoutside', callback);//.on('tap', callback);
    }
}