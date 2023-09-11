export default
    {
        formatPointsLabel(tempPoints, debug = false) {
            let temp = ''
            let temp2 = ''


            //console.log(tempPoints)
            if (tempPoints < 10) {
                //tempPoints = tempPoints.toFixed(2)
                return tempPoints
            }
            if (tempPoints < 1000) {
                tempPoints = Math.round(tempPoints)
                if (tempPoints.toString().length < 2) {
                    tempPoints = tempPoints.toFixed(2)
                }
                return tempPoints
            }
            if (tempPoints < 100) {
                tempPoints = tempPoints.toFixed(2)
                return tempPoints
            }

            for (let index = 0; index < window.numberList.length; index++) {
                const element = window.numberList[index];
                if(tempPoints >= element.value){
                    temp = element.abv
                    if(debug){
                        console.log(tempPoints, element)
                    }
                }else{
                    tempPoints /= window.numberList[index - 1].value

                    if(debug){
                        console.log(tempPoints)
                    }

                    break
                }
            }
            //tempPoints = Math.floor(tempPoints)
            if (tempPoints.toString().length < 4) {
                let fix = 2
                //console.log(tempPoints)
                tempPoints = tempPoints.toFixed(fix).toString()
                // console.log(tempPoints + temp);
            }
            else if (tempPoints.toString().length > 4) {
                let tempRound = Math.floor(tempPoints)
                tempPoints = tempPoints.toFixed(Math.max(4 - tempRound.toString().length - 1, 0))
            }


            tempPoints = this.cleanString(tempPoints)
            return tempPoints + temp
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
        }
    }