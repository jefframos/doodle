export default {
	width: 750,
	height: 1334,
	mobileRes:{
		width: 750 *0.9,
		height: 1334 *0.9
	},
	desktopRes:{
		width: 1024*0.9,
		height: 768*0.9
	},
	webgl: true,
	effectsLayer: null,
	colors: {
		background: 0x000000,
	},
	rendererOptions: {
		//pixi rendererOptions
		resolution: 2,//window.devicePixelRatio,
		antialias: true,
		backgroundColor: 0x000000
	},
	levels: [],
	assets: {
		button: {
			primarySquareOLD: 'square_0001',
			secondarySquareOLD: 'square_0002',
			tertiarySquareOLD: 'square_0003',
			warningSquareOLD: 'square_0004',
			extraSquareOLD: 'square_0005',
			greySquareOLD: 'square_0006',

			squarePadding: [35, 35, 35, 35],

			primaryLong: 'square_0001',
			secondaryLong: 'square_0002',
			tertiaryLong: 'square_0003',
			warningLong: 'square_0004',
			extraLong: 'square_0005',
			greyLong: 'square_0006',

			longPadding: [35, 35, 35, 35],
		},
		box: {
			square: 'square_0006s',
			squareExtra: 'square_0005',
			squareWarning: 'square_0004',
			padding: [20, 20, 20, 20],
			squareSmall: 'square_0007s',
			paddingSmall: [35/2, 35/2, 35/2, 35/2],
		},
		bars: {
			background: 'square_0006s',
			backgroundPadding: [35/2, 35/2, 35/2, 35/2],
			primary: 'square_0001s',
			secondary: 'square_0002s',
			tertiary: 'square_0003s',
			warning: 'square_0004s',
			extra: 'square_0005s',

			barPadding: [35/2, 0, 35/2, 0],

		},
		panel: {
			primary: 'square_0001',
			secondary: 'square_0002',
			tertiary: 'square_0003',
			grey: 'square_0006',
			extra: 'square_0005',
			padding: [35, 35, 35, 35],

		},
		popup: {
			primary: 'square_0001',
			secondary: 'square_0002',
			tertiary: 'square_0003',
			extra: 'square_0005',
			grey: 'square_0006',
			darkGrey: 'square_0007',
			warning: 'square_0004',
			padding: [35, 35, 35, 35],

		}
	},
	addPaddingSquareButton: function (nineSlice) {
		this.addPadding(nineSlice, this.assets.button.squarePadding)
	},
	addPaddingLongButton: function (nineSlice) {
		this.addPadding(nineSlice, this.assets.button.longPadding)
	},
	addPaddingPopup: function (nineSlice) {
		this.addPadding(nineSlice, this.assets.popup.padding)
	},
	addPaddingPanel: function (nineSlice) {
		this.addPadding(nineSlice, this.assets.panel.padding)
	},
	addPaddingBackBar: function (nineSlice) {
		this.addPadding(nineSlice, this.assets.bars.backgroundPadding)
	},
	addPaddingBar: function (nineSlice) {
		this.addPadding(nineSlice, this.assets.bars.barPadding)
	},
	addPaddingBoxSmall: function (nineSlice) {
		this.addPadding(nineSlice, this.assets.box.paddingSmall)
	},
	addPaddingBox: function (nineSlice) {
		this.addPadding(nineSlice, this.assets.box.padding)
	},
	addPadding: function (nineSlice, padding) {
		let order = ['leftWidth', 'topHeight', 'rightWidth', 'bottomHeight']

		for (let index = 0; index < order.length; index++) {
			const element = order[index];
			nineSlice[element] = padding[index]
		}
	}

}
