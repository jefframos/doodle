import * as PIXI from 'pixi.js';

import config from './config';
import conversionUtils from './conversionUtils';

export default
    {
        resizeToFitMaxAR(size, element, res) {
            if (!res) {
                res = element
            }
            let sclX = (size.width) / (res.width / res.scale.x);
            let sclY = (size.height) / (res.height / res.scale.y);
            let min = Math.max(sclX, sclY);
            element.scale.set(min)
        },
        resizeToFitAR(size, element, res) {
            if (!res) {
                res = element
            }
            let sclX = (size.width) / (res.width / res.scale.x);
            let sclY = (size.height) / (res.height / res.scale.y);
            let min = Math.min(sclX, sclY);
            element.scale.set(min)
        },
        resizeToFitARCap(size, element, res, cap = 1) {
            if (!res) {
                res = element
            }
            let sclX = (size.width) / (res.width / res.scale.x);
            let sclY = (size.height) / (res.height / res.scale.y);
            let min = Math.min(sclX, sclY);
            min = Math.min(min, cap);
            element.scale.set(min)
        },
        resizeToFit(size, element) {
            let sclX = (size.width) / (element.width / element.scale.x);
            let sclY = (size.height) / (element.height / element.scale.y);
            let min = Math.min(sclX, sclY);
            element.scale.set(sclX, sclY)
        },
        cloneMatrix(target) {
            let matrix = []
            for (let index = 0; index < target.length; index++) {
                let temp = []
                for (let j = 0; j < target[index].length; j++) {
                    temp.push(target[index][j])
                }
                matrix.push(temp)
            }
            return matrix
        },
        findMax(target) {
            let matrix = []
            for (let index = 0; index < target.length; index++) {
                for (let j = 0; j < target[index].length; j++) {
                    if (target[index][j] && target[index][j].tileData) {

                        matrix.push(target[index][j].tileData.getID())
                    }
                }
            }
            return Math.max(...matrix)
        },
        findDPS(target) {
            let max = 0;
            for (let index = 0; index < target.length; index++) {
                for (let j = 0; j < target[index].length; j++) {
                    if (target[index][j] && target[index][j].tileData) {
                        let data = target[index][j].tileData
                        max += data.getRawDamage() / data.getGenerateDamageTime();
                    }
                }
            }
            if (Number.isNaN(max)) {
                return 0
            }
            return max * window.gameModifyers.getDamageMultiplier()
        },
        findRPS2(target) {
            let max = 0;
            for (let index = 0; index < target.length; index++) {
                if (target[index] && target[index].tileData) {
                    let data = target[index].tileData
                    max += Math.round(data.getRawResources() / data.getGenerateResourceTime());

                }
            }
            if (Number.isNaN(max)) {
                return 0
            }
            return max * window.gameModifyers.getResourcesMultiplier()
        },
        findRPS(target) {
            let max = 0;
            for (let index = 0; index < target.length; index++) {
                for (let j = 0; j < target[index].length; j++) {
                    if (target[index][j] && target[index][j].tileData) {
                        let data = target[index][j].tileData
                        max += Math.round(data.getRawResources() / data.getGenerateResourceTime());
                    }
                }
            }
            if (Number.isNaN(max)) {
                return 0
            }
            return max * window.gameModifyers.getResourcesMultiplier()
        },
        findRPS3(target) {
            let max = 0;
            for (let index = 0; index < target.length; index++) {
                for (let j = 0; j < target[index].length; j++) {
                    if (target[index][j] && target[index][j].tileData && target[index][j].visible && !target[index][j].showingGift) {
                        let data = target[index][j].tileData
                        max += data.getRPS();
                    }
                }
            }
            if (Number.isNaN(max)) {
                return 0
            }
            return max//* window.gameModifyers.getResourcesMultiplier()
        },
        convertNumToTime(number) {
            // Check sign of given number
            var hours = Math.floor(number / 60);
            var minutes = number % 60;
            if(minutes == 0){
                minutes += '0'
            }
            return hours + ":" + minutes;
        },
        generateTextureFromContainer(id, content, list) {
            if (list[id]) {
                return list[id]
            }
            let texture = renderer.renderer.generateTexture(content);
            list[id] = texture;

            return texture;

        },
        generateSpriteFromContainer(id, content, list) {
            if (list[id]) {
                return list[id]
            }
            console.log(renderer)
            let texture = renderer.renderer.generateTexture(content);
            let gridSprite = new PIXI.Sprite()
            gridSprite.texture = texture
            list[id] = gridSprite;

            return gridSprite;

        },
        getRandomValue(array, exception) {
            let value = array[Math.floor(Math.random() * array.length)];
            if (exception) {
                let equal = true;
                while (equal) {
                    equal = false;
                    for (let i = 0; i < exception.length; i++) {
                        if (exception[i] == value) {
                            equal = true;
                        }
                    }
                    if (equal) {
                        value = array[Math.floor(Math.random() * array.length)]
                    }
                }
            }
            return value
        },
        trimMatrix2(piecesOP, ignoreBlocker = false) {
            if (piecesOP.length <= 0) {
                return;
            }
            let pieces = this.cloneMatrix(piecesOP)
            let colCounters = [];
            let lineCounters = [];
            for (let i = 0; i < pieces.length; i++) {
                colCounters.push(0);
            }
            for (let i = 0; i < pieces[0].length; i++) {
                lineCounters.push(0);
            }
            for (let i = 0; i < pieces.length; i++) {
                for (let j = 0; j < pieces[i].length; j++) {
                    const element = pieces[i][j];
                    if (element && element.visible) {
                        lineCounters[j]++;
                        colCounters[i]++;
                    }
                }
            }

            let padding = { left: 0, right: 0, top: 0, bottom: 0 }


            for (let i = 0; i < lineCounters.length; i++) {
                const element = lineCounters[i];
                if (!element) {
                    padding.left++;
                } else {
                    break;
                }
            }
            for (let i = lineCounters.length - 1; i >= 0; i--) {
                const element = lineCounters[i];
                if (!element) {
                    padding.right++;
                } else {
                    break;
                }
            }

            for (let i = 0; i < colCounters.length; i++) {
                const element = colCounters[i];
                if (!element) {
                    padding.top++;
                } else {
                    break;
                }
            }
            for (let i = colCounters.length - 1; i >= 0; i--) {
                const element = colCounters[i];
                if (!element) {
                    padding.bottom++;
                } else {
                    break;
                }
            }

            pieces.splice(0, padding.top);
            pieces.splice(pieces.length - padding.bottom, padding.bottom);

            for (let i = 0; i < pieces.length; i++) {
                pieces[i].splice(0, padding.left);
                pieces[i].splice(pieces[i].length - padding.right, padding.right);
            }


            return padding
        },
        trimMatrix(piecesOP, ignoreBlocker = false) {
            if (piecesOP.length <= 0) {
                return;
            }
            let pieces = this.cloneMatrix(piecesOP)
            let colCounters = [];
            let lineCounters = [];
            for (let i = 0; i < pieces.length; i++) {
                colCounters.push(0);
            }
            for (let i = 0; i < pieces[0].length; i++) {
                lineCounters.push(0);
            }
            for (let i = 0; i < pieces.length; i++) {
                for (let j = 0; j < pieces[i].length; j++) {
                    const element = pieces[i][j];
                    if (element) {
                        lineCounters[j]++;
                        colCounters[i]++;
                    }
                }
            }

            let padding = { left: 0, right: 0, top: 0, bottom: 0 }


            for (let i = 0; i < lineCounters.length; i++) {
                const element = lineCounters[i];
                if (!element) {
                    padding.left++;
                } else {
                    break;
                }
            }
            for (let i = lineCounters.length - 1; i >= 0; i--) {
                const element = lineCounters[i];
                if (!element) {
                    padding.right++;
                } else {
                    break;
                }
            }

            for (let i = 0; i < colCounters.length; i++) {
                const element = colCounters[i];
                if (!element) {
                    padding.top++;
                } else {
                    break;
                }
            }
            for (let i = colCounters.length - 1; i >= 0; i--) {
                const element = colCounters[i];
                if (!element) {
                    padding.bottom++;
                } else {
                    break;
                }
            }

            pieces.splice(0, padding.top);
            pieces.splice(pieces.length - padding.bottom, padding.bottom);

            for (let i = 0; i < pieces.length; i++) {
                pieces[i].splice(0, padding.left);
                pieces[i].splice(pieces[i].length - padding.right, padding.right);
            }


            return padding
        },
        // formatPointsLabel2(tempPoints){
        //     let abv = ['','K','M','B','T','aa','bb','cc','dd','ee'];

        //     let currentAbv = abv[Math.floor((tempPoints - 1).toString().length / 3)]

        //     tempPoints = Math.round(tempPoints * MAX_NUMBER);
        //     let lenght = Math.floor((tempPoints - 1).toString().length / 3) + 2;
        //     // console.log(tempPoints, lenght);
        //     let max = Math.pow(10, lenght)
        //     // console.log(max);

        //     console.log(tempPoints, max, 'div');
        //     tempPoints /= max;
        //     if (tempPoints.toString().length < 4)
        //     {
        //         let fix = 2
        //         tempPoints = tempPoints.toFixed(fix).toString()
        //         // console.log(tempPoints + temp);
        //     }
        //     else if (tempPoints.toString().length > 4)
        //     {
        //         let tempRound = Math.floor(tempPoints)
        //         console.log(tempRound);
        //         tempPoints = tempPoints.toFixed(4 - tempRound.toString().length - 1)
        //     }

        //     tempPoints = this.cleanString(tempPoints)

        //     console.log(tempPoints + currentAbv);
        // },
        formatPointsLabel(tempPoints, debug = false) {
            return conversionUtils.formatPointsLabel(tempPoints, debug)
        },
        cleanString(str) {
            if (str.toString().indexOf('.') == -1) {
                return str
            }
            for (var i = str.length - 1; i >= 0; i--) {
                if (str[i] == 0) {
                    str = str.slice(0, -1);
                }
                else {
                    break
                }
            }
            if (str[str.length - 1] == '.') {
                str = str.slice(0, -1);
            }
            return str
        },
        stringToObject(str, type) {
            type = type || "object"; // can pass "function"
            var arr = str.split(".");

            var fn = (window || this);
            for (var i = 0, len = arr.length; i < len; i++) {
                fn = fn[arr[i]];
            }
            if (typeof fn !== type) {
                throw new Error(type + " not found: " + str);
            }

            return fn;
        },
        centerObject(target, parent) {
            target.x = parent.width / 2 - target.width * 0.5;
            target.y = parent.height / 2 - target.height * 0.5;
        },
        shuffle(a) {
            for (let i = a.length; i; i--) {
                let j = Math.floor(Math.random() * i);
                [a[i - 1], a[j]] = [a[j], a[i - 1]];
            }
        },
        lerp(x, y, a) {
            return x * (1 - a) + y * a;
        },
        clamp(a, min = 0, max = 1) {
            return Math.min(max, Math.max(min, a));
        },
        invlerp(x, y, a) {
            return clamp((a - x) / (y - x));
        },
        range(x1, y1, x2, y2, a) {
            return lerp(x2, y2, invlerp(x1, y1, a));
        },
        distance(x1, y1, x2, y2) {
            return Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2));
        },
        killColorTween(target) {
            for (var i = this.tweenList.length - 1; i >= 0; i--) {
                if (this.tweenList[i].target == target) {
                    this.tweenList[i].tween.kill();
                    this.tweenList.splice(i, 1);
                }
            }
        },
        addColorTween(target, currentColor, targetColor, time = 2, delay = 0) {
            if (!this.tweenList) {
                this.tweenList = [];
            }
            let currentColorData = this.toRGB(currentColor);
            let targetColorData = this.toRGB(targetColor);
            let black = this.toRGB(0x000000);
            let tweenObj = {
                tween: TweenLite.to(currentColorData, time,
                    {
                        delay: delay,
                        r: targetColorData.r,
                        g: targetColorData.g,
                        b: targetColorData.b,
                        onUpdate: function (targ) {
                            currentColorData.r = Math.floor(currentColorData.r)
                            currentColorData.g = Math.floor(currentColorData.g)
                            currentColorData.b = Math.floor(currentColorData.b)
                            targ.tint = this.rgbToColor(currentColorData.r, currentColorData.g, currentColorData.b);
                        }.bind(this),
                        onUpdateParams: [target]
                    }),
                target: target
            }
            this.tweenList.push(tweenObj);
            return tweenObj;
        },
        toRGB(rgb) {
            var r = rgb >> 16 & 0xFF;
            var g = rgb >> 8 & 0xFF;
            var b = rgb & 0xFF;
            return {
                r: r,
                g: g,
                b: b
            };
        },
        rgbToColor(r, g, b) {
            return r << 16 | g << 8 | b;
        },
        getRect(size = 4, color = 0xFFFFFF) {
            return new PIXI.Graphics().beginFill(color).drawRect(0, 0, size, size);
        },
        shuffleText(label) {
            return label
            let rnd1 = String.fromCharCode(Math.floor(Math.random() * 20) + 65);
            let rnd2 = Math.floor(Math.random() * 9);
            let rnd3 = String.fromCharCode(Math.floor(Math.random() * 20) + 65);
            let tempLabel = label.split('');
            let rndPause = Math.random();
            if (rndPause < 0.2) {
                let pos1 = Math.floor(Math.random() * tempLabel.length);
                let pos2 = Math.floor(Math.random() * tempLabel.length);
                if (tempLabel[pos1] != '\n')
                    tempLabel[pos1] = rnd2;
                if (tempLabel[pos2] != '\n')
                    tempLabel[pos2] = rnd3;
            }
            else if (rndPause < 0.5) {
                let pos3 = Math.floor(Math.random() * tempLabel.length);
                if (tempLabel[pos3] != '\n')
                    tempLabel[pos3] = rnd3;
            }
            let returnLabel = '';
            for (var i = 0; i < tempLabel.length; i++) {
                returnLabel += tempLabel[i];
            }
            return returnLabel
        },
        generateImage(level) {
            let container = new PIXI.Container();
            let tempRect = null;
            let size = 16;
            for (var i = 0; i < this.level.length; i++) {
                for (var j = 0; j < this.level[i].length; j++) {
                    if (this.level[i][j] >= 0) {
                        // this.cardsContainer.addChild(this.placeCard(j, i, ENEMIES.list[this.level[i][j]].life));
                        tempRect = this.getRect(size, ENEMIES.list[this.level[i][j]].color)
                        container.addChild(tempRect)
                        tempRect.x = j * size;
                        tempRect.y = i * size;
                    }
                    else if (this.level[i][j] == -2) {
                        tempRect = this.getRect(size, 0x333333)
                        container.addChild(tempRect)
                        tempRect.x = j * size;
                        tempRect.y = i * size;
                    }
                    else {
                        tempRect = this.getRect(size, 0x000000)
                        container.addChild(tempRect)
                        tempRect.x = j * size;
                        tempRect.y = i * size;
                    }
                }
            }
            return container;
        },
        alphabetCompare(a, b) {
            var yA = a.type;
            var yB = b.type;
            if (yA < yB) {
                return -1;
            }
            if (yA > yB) {
                return 1;
            }
            return 0;
        },
        xCompare(a, b) {
            var yA = a.x;
            var yB = b.x;
            if (yA > yB) {
                return -1;
            }
            if (yA < yB) {
                return 1;
            }
            return 0;
        },
        distSort(point, array){

            array.forEach(element => {
                element._playerDist = this.distance(element.transform.position.x,element.transform.position.z,point.x, point.z)
            });

            array.sort(this.playerDistCompare)
        },
        playerDistCompare(a, b) {
            var yA = a._playerDist;
            var yB = b._playerDist;
            if (yA === yB) {
                return 0;
            }
            if (yA < yB) {
                return -1;
            }
            if (yA > yB) {
                return 1;
            }
            return 0;
        },
        distCompare(a, b) {
            var yA = a.dist;
            var yB = b.dist;
            if (yA === yB) {
                return 0;
            }
            if (a.noDepth || b.noDepth) {
                return 0;
            }
            if (yA < yB) {
                return -1;
            }
            if (yA > yB) {
                return 1;
            }
            return 0;
        },
        depthCompare(a, b) {
            var yA = a.y;
            var yB = b.y;
            if (yA === yB) {
                return 0;
            }
            if (a.noDepth || b.noDepth) {
                return 0;
            }
            if (yA < yB) {
                return -1;
            }
            if (yA > yB) {
                return 1;
            }
            return 0;
        },
        createNoiseTexture(config) {

            var params = config ? config :
                {};

            var canvas = document.createElement('canvas');
            canvas.width = params.width ? params.width : 32
            canvas.height = params.height ? params.height : 32

            var ctx = canvas.getContext('2d'),
                x, y,
                number,
                opacity = params.opacity ? params.opacity : 0.2

            for (x = 0; x < canvas.width; x++) {
                for (y = 0; y < canvas.height; y++) {
                    number = Math.floor(Math.random() * 60);
                    ctx.fillStyle = "rgba(" + number + "," + number + "," + number + "," + opacity + ")";
                    ctx.fillRect(x, y, 1, 1);
                }
            }

            var sprite = new PIXI.Sprite(PIXI.Texture.fromCanvas(canvas))
            sprite.anchor.set(0.5);
            return sprite;
        },

        createDotTexture(config) {

            var params = config ? config :
                {};

            var canvas = document.createElement('canvas');
            canvas.width = params.width ? params.width : 32
            canvas.height = params.height ? params.height : 32

            var ctx = canvas.getContext('2d');



            var x = canvas.width / 2,
                y = canvas.height / 2,
                // Radii of the white glow.
                innerRadius = config.innerRadius ? config.innerRadius : 0,
                outerRadius = config.outerRadius ? config.outerRadius : canvas.width * 0.3,
                // Radius of the entire circle.
                radius = canvas.width;

            var gradient = ctx.createRadialGradient(x, y, innerRadius, x, y, outerRadius);
            gradient.addColorStop(0, 'white');
            gradient.addColorStop(0.5, '#333');
            // gradient.addColorStop(0.75, '#030303');
            gradient.addColorStop(0.75, '#020202');
            gradient.addColorStop(0.95, '#010101');
            gradient.addColorStop(0.7, 'black');

            ctx.arc(x, y, radius, 0, 2 * Math.PI);

            ctx.fillStyle = gradient;
            ctx.fill();

            var sprite = new PIXI.Sprite(PIXI.Texture.fromCanvas(canvas))
            sprite.anchor.set(0.5);
            return sprite;
        },

        perlinNoise(config) {
            var params = config ? config :
                {};

            var canvas = document.createElement('canvas');
            canvas.width = params.width ? params.width : 32
            canvas.height = params.height ? params.height : 32

            var noise = this.randomNoise(canvas);
            var ctx = canvas.getContext('2d');
            ctx.save();

            /* Scale random iterations onto the canvas to generate Perlin noise. */
            for (var size = 4; size <= noise.width; size *= 2) {
                var x = (Math.random() * (noise.width - size)) | 0,
                    y = (Math.random() * (noise.height - size)) | 0;
                ctx.globalAlpha = 4 / size;
                ctx.drawImage(noise, x, y, size, size, 0, 0, canvas.width, canvas.height);
            }

            ctx.restore();
            var sprite = new PIXI.Sprite(PIXI.Texture.fromCanvas(canvas))
            sprite.anchor.set(0.5);
            return sprite;
        },

        randomNoise(canvas, x, y, width, height, alpha) {
            var canvas = document.createElement('canvas');
            x = x || 0;
            y = y || 0;
            width = width || canvas.width;
            height = height || canvas.height;
            alpha = alpha || 255;
            var g = canvas.getContext("2d"),
                imageData = g.getImageData(x, y, width, height),
                random = Math.random,
                pixels = imageData.data,
                n = pixels.length,
                i = 0;
            while (i < n) {
                pixels[i++] = pixels[i++] = pixels[i++] = (random() * 256) | 0;
                pixels[i++] = alpha;
            }
            g.putImageData(imageData, x, y);
            return canvas;
        },

        getSprite(frame) {
            let texture = PIXI.Texture.from(frame);
            return new PIXI.Sprite(texture);
        },

        shuffle(a) {
            for (let i = a.length; i; i--) {
                let j = Math.floor(Math.random() * i);
                [a[i - 1], a[j]] = [a[j], a[i - 1]];
            }
        },

        distance(x1, y1, x2, y2) {
            return Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2));
        },

        linearTween(t, b, c, d) {
            return c * t / d + b;
        },
        // decelerating to zero velocity 
        easeOutCubic(t, b, c, d) {
            t /= d;
            t--;
            return c * (t * t * t + 1) + b;
        },
        easeInExpo(t, b, c, d) {
            return c * Math.pow(2, 10 * (t / d - 1)) + b;
        },

        easeInCirc(t, b, c, d) {
            t /= d;
            return -c * (Math.sqrt(1 - t * t) - 1) + b;
        },

    }