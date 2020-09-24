import amapFile from 'js/AMapWX_SDK_V1.2.1/amap-wx';

//判断数据类型的方法（对typeof的增强，7种常用类型的判断，返回小写字符串）
function Type(obj) {
    var arr = ['null', 'nan', 'function', 'number', 'string', 'array', 'object'];
    if (obj === null) {
        return 'null';
    }
    if (obj !== obj) {
        return 'nan';
    }
    if (typeof Array.isArray === 'function') {
        if (Array.isArray(obj)) { //浏览器支持则使用isArray()方法
            return 'array';
        }
    } else { //否则使用toString方法
        if (Object.prototype.toString.call(obj) === '[object Array]') {
            return 'array';
        }
    }
    return (typeof obj).toLowerCase();
}

//json克隆副本
function copyJson(json) {
    return json ? JSON.parse(JSON.stringify(json)) : json;
}

//时间变成两位数
function toTwo(n) {
    return +n < 10 ? '0' + n : n + '';
}

//补零函数
//value（需要补零的值）
//length（需要补零的长度(数量)）
//isBehind（是否在末尾补零）
function zeroFill(value, length, isBehind) {
    var value = value || '';
    var length = length > 0 ? length : 0;
    var zeroStr = '';

    for (var i = 0; i < length; i++) {
        zeroStr += '0';
    }

    return !isBehind ? zeroStr + value : value + zeroStr;
}

//算出本月天数
//getMonth获得的月份是从0开始，要加1
//下月第0天就是最后一天，-1=倒数第二天，国外月份从0开始,逗号隔开年月日new Date之后月份要大一个月，字符串是正常的
function manyDay(year, month) {
    var nextMonth = new Date(year, month, 0);

    return nextMonth.getDate();
}

//正常化日期
function normalDate(oDate) {
    var oDate = oDate;
    var reg = /\-+/g;

    if (Type(oDate) == 'string') {
        oDate = oDate.split('.')[0]; //解决ie浏览器对yyyy-MM-dd HH:mm:ss.S格式的不兼容
        oDate = oDate.replace(reg, '/'); //解决苹果浏览器对yyyy-MM-dd格式的不兼容性
    }

    oDate = new Date(oDate);
    return oDate;
}

//获取星期
function getWeekName(oDate, str) {
    var oDate = normalDate(oDate || new Date());
    var iWeek = oDate.getDay();
    var str = str || '星期';
    var arr = ['日', '一', '二', '三', '四', '五', '六'];

    return str + arr[iWeek];
}

//根据出生日期获取年龄
function getAge(date, real) {
    var bDate = normalDate(date);
    var bYear = bDate.getFullYear();
    var bMonth = bDate.getMonth();
    var bDay = bDate.getDate();
    var nDate = new Date();
    var nYear = nDate.getFullYear();
    var nMonth = nDate.getMonth();
    var nDay = nDate.getDate();
    var dYear = nYear - bYear;
    var dMonth = (nMonth - bMonth) / 12;
    var dDay = (nDay - bDay) / 365;
    var diff = dYear + dMonth + dDay;
    var age = diff > 0 ? (real ? diff : Math.floor(diff)) : 0;

    return age;
}

//根据身份证号码获取性别和生日
function getSexAndDob(identity) {
    var sexAndDob = {};

    var idcardReg = /^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$|^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/;
    if (idcardReg.test(identity)) {
        var sex = identity.substring(identity.length - 2, identity.length - 1);
        var dob = identity.substring(6, 14);

        sex = sex & 1 == 1 ? '1' : '2';
        dob = `${dob.substring(0,4)}-${dob.substring(4,6)}-${dob.substring(6)}`;

        sexAndDob = {
            sex: sex,
            dob: dob,
        };
    }

    return sexAndDob;
}

//身份证号码校验、获取身份证信息以及计算最后一位校验码、转换15位身份证为18位
/*
    校验码计算
    1、十七位数字本体码加权求和公式
    S = Sum(Ai * Wi), i = 0, ... , 16 ，先对前17位数字的权求和
    Ai：表示第i位置上的身份证号码数字值
    Wi：表示第i位置上的加权因子
    7 9 10 5 8 4 2 1 6 3 7 9 10 5 8 4 2

    2、计算模
    Y = mod(S, 11)

    3、通过模得到对应的校验码
    Y： 0 1 2 3 4 5 6 7 8 9 10
    校验码： 1 0 X 9 8 7 6 5 4 3 2
    也就是说，如果得到余数为1则最后的校验位p应该为对应的0。

    15位的号码：
    a a b b c c y y m m d d x x s
    18位的号码：
    a a b b c c y y y y m m d d x x s p
*/
var idCardNo = {
    citys: { 11: '北京', 12: '天津', 13: '河北', 14: '山西', 15: '内蒙古', 21: '辽宁', 22: '吉林', 23: '黑龙江', 31: '上海', 32: '江苏', 33: '浙江', 34: '安徽', 35: '福建', 36: '江西', 37: '山东', 41: '河南', 42: '湖北', 43: '湖南', 44: '广东', 45: '广西', 46: '海南', 50: '重庆', 51: '四川', 52: '贵州', 53: '云南', 54: '西藏', 61: '陕西', 62: '甘肃', 63: '青海', 64: '宁夏', 65: '新疆', 71: '台湾', 81: '香港', 82: '澳门', 91: '国外' }, //省,直辖市代码
    powers: ['7', '9', '10', '5', '8', '4', '2', '1', '6', '3', '7', '9', '10', '5', '8', '4', '2'], //每位加权因子
    lastCodes: ['1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2'], //第18位校检码
    normalIdCardNo: function (idCardNo) { //格式化15身份证号码为18位
        var id17 = idCardNo.substring(0, 6) + '19' + idCardNo.substring(6);

        return idCardNo.length == 15 ? id17 + this.getLastCode(id17) : idCardNo;
    },
    getLastCode: function (idCardNo) { //根据身份证前17位计算出最后一位校检码
        var idCardNo = this.normalIdCardNo(idCardNo);
        var id17 = idCardNo.substring(0, 17);
        var sum = 0;
        var codeIndex = 0;

        for (var i = 0; i < 17; i++) {
            sum += id17.charAt(i) * this.powers[i];
        }

        codeIndex = sum % 11;

        return this.lastCodes[codeIndex];
    },
    getIdCardNoInfo: function (idCardNo) { //获取身份证信息
        var idCardNo = this.normalIdCardNo(idCardNo);
        var cityCode = idCardNo.substring(0, 2);
        var dobCode = idCardNo.substring(6, 14);
        var sexCode = idCardNo.substring(idCardNo.length - 2, idCardNo.length - 1);
        var bYear = dobCode.substring(0, 4);
        var bMonth = dobCode.substring(4, 6);
        var bDay = dobCode.substring(6);
        var bDate = new Date(bYear, bMonth - 1, bDay);
        var dob = dateFormat0(bDate, 'yyyy-MM-dd');
        var ageCode = getAge(dob) + '';
        var idCardNoInfo = {
            city: this.citys[cityCode],
            dob: dob,
            sex: sexCode & 1 == 1 ? '男' : '女',
            age: getAge(dob) + '岁',
            cityCode: cityCode,
            dobCode: dobCode,
            sexCode: sexCode,
            ageCode: ageCode,
        };

        return this.checkIdCardNo(idCardNo) ? idCardNoInfo : this.getIdCardNoCheckInfo(idCardNo);
    },
    checkAddressCode: function (idCardNo) { //检查地址码
        var idCardNo = this.normalIdCardNo(idCardNo);
        var addressCode = idCardNo.substring(0, 6);
        var reg = /[1-8]\d{5}/;

        return reg.test(addressCode) && this.citys[addressCode.substring(0, 2)] ? true : false;
    },
    checkDobCode: function (idCardNo) { //检查日期码
        var idCardNo = this.normalIdCardNo(idCardNo);
        var dobCode = idCardNo.substring(6, 14);
        var reg = /[1-9]\d{3}(0[1-9]|1[0-2])(0[1-9]|[1-2]\d|3[0-1])/;
        var oDate = new Date();
        var bYear = dobCode.substring(0, 4);
        var bMonth = dobCode.substring(4, 6);
        var bDay = dobCode.substring(6);
        var bDate = new Date(bYear, bMonth - 1, bDay);
        var cYear = bDate.getFullYear();
        var cMonth = bDate.getMonth() + 1;
        var cDay = bDate.getDate();

        return reg.test(dobCode) && bDate <= oDate && cYear == bYear && cMonth == bMonth && cDay == bDay ? true : false;
    },
    checkLastCode: function (idCardNo) { //检查身份证最后一位校验码
        var idCardNo = this.normalIdCardNo(idCardNo);
        var lastCode = idCardNo.charAt(idCardNo.length - 1);

        return lastCode == this.getLastCode(idCardNo) ? true : false;
    },
    getIdCardNoCheckInfo: function (idCardNo) { //获取身份证号码校验信息
        var regTestResult = /^[1-8]\d{5}[1-9]\d{3}(0[1-9]|1[0-2])(0[1-9]|[1-2]\d|3[0-1])\d{3}[\dxX]$/.test(idCardNo);
        var idCardNo = this.normalIdCardNo(idCardNo);
        var checkResult = [
            regTestResult,
            this.checkAddressCode(idCardNo),
            this.checkDobCode(idCardNo),
            this.checkLastCode(idCardNo),
        ];
        var posIndex = checkResult.indexOf(false);
        var result = ~posIndex ? posIndex : true;
        var msgJson = {
            '-1': '身份证号码校验通过',
            '0': '身份证号码格式校验不通过',
            '1': '地址码校验不通过',
            '2': '日期码校验不通过',
            '3': '最后一位校验码校验不通过',
        };

        return {
            pass: result === true,
            code: posIndex,
            msg: msgJson[posIndex],
        };
    },
    checkIdCardNo: function (idCardNo) { //检查身份证号码
        var result = this.getIdCardNoCheckInfo(idCardNo);

        return result.pass;
    },
};

//时间格式化函数（根据秒数来格式化）
//seconds（多少秒）
//fmt（格式匹配）
//adjustFmt（是否自动调整格式，会删除无效的格式）
//年(y)、月(M)、日(d)、小时(h)、分(m)、秒(s)，都可以用1到任意位占位符
/*
    例子：
    secondFormat0(86400*365+86400*30+86400+3600+60+1,'yy/MM/dd hh:mm:ss'); //01/01/01 01:01:01
    secondFormat0(86400+3600+60+1,'hh:mm:ss'); //25:01:01
*/
function secondFormat0(seconds, fmt, adjustFmt) {
    var fmt = fmt || 'yy/MM/dd hh:mm:ss';
    var aMinute = 60;
    var aHour = aMinute * 60;
    var aDay = aHour * 24;
    var aMonth = aDay * 30;
    var aYear = aDay * 365;

    var iYears = Math.floor(seconds / aYear);
    var dMonth = seconds - iYears * aYear > 0 ? seconds - iYears * aYear : 0;
    dMonth = ~fmt.indexOf('y') ? dMonth : seconds;
    var iMonths = Math.floor(dMonth / aMonth);
    var dDay = dMonth - iMonths * aMonth > 0 ? dMonth - iMonths * aMonth : 0;
    dDay = ~fmt.indexOf('M') ? dDay : seconds;
    var iDays = Math.floor(dDay / aDay);
    var dHour = dDay - iDays * aDay > 0 ? dDay - iDays * aDay : 0;
    dHour = ~fmt.indexOf('d') ? dHour : seconds;
    var iHours = Math.floor(dHour / aHour);
    var dMinutes = dHour - iHours * aHour > 0 ? dHour - iHours * aHour : 0;
    dMinutes = ~fmt.indexOf('h') ? dMinutes : seconds;
    var iMinutes = Math.floor(dMinutes / aMinute);
    var dSeconds = dMinutes - iMinutes * aMinute ? dMinutes - iMinutes * aMinute : 0;
    dSeconds = ~fmt.indexOf('m') ? dSeconds : seconds;
    var iSeconds = Math.floor(dSeconds);

    var time = {
        'y+': iYears,
        'M+': iMonths,
        'd+': iDays,
        'h+': iHours,
        'm+': iMinutes,
        's+': iSeconds,
    };
    var result = '';
    var value = '';

    for (var attr in time) {
        if (new RegExp('(' + attr + ')').test(fmt)) {
            result = RegExp.$1;
            value = time[attr] + '';
            value = result.length == 1 ? value : zeroFill(value, result.length - value.length);

            if (adjustFmt && (+value) === 0) {
                var reg = new RegExp(attr + '([^a-zA-Z]+)[a-zA-Z]+');
                var matchStr = fmt.match(reg);

                if (matchStr) {
                    fmt = fmt.replace(matchStr[1], '');
                    value = '';
                }
            }

            fmt = fmt.replace(result, value);
        }
    }

    return fmt;
}

//日期格式化函数
//oDate（时间戳或字符串日期都支持）
//fmt（格式匹配）
//月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，
//年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
/*
    例子：
    dateFormat0(new Date(),'yyyy-MM-dd hh:mm:ss.S'); //2018-12-21 17:24:33.664
    dateFormat0(new Date(),'y-M-d h:m:s.S/q'); //2018-12-21 17:24:33.666/4
*/
function dateFormat0(oDate, fmt) {
    var fmt = fmt || 'yyyy/MM/dd hh:mm:ss';
    var oDate = normalDate(oDate || new Date());
    var date = {
        'y+': oDate.getFullYear(), //年
        'M+': oDate.getMonth() + 1, //月
        'd+': oDate.getDate(), //日
        'h+': oDate.getHours(), //时
        'm+': oDate.getMinutes(), //分
        's+': oDate.getSeconds(), //秒
        'S': oDate.getMilliseconds(), //毫秒
        'q+': Math.ceil((oDate.getMonth() + 1) / 3), //季度
    };
    var result = '';
    var value = '';

    for (var attr in date) {
        if (new RegExp('(' + attr + ')').test(fmt)) {
            result = RegExp.$1;
            value = date[attr] + '';
            fmt = fmt.replace(result, result.length == 1 ? value : (attr == 'y+' ? value.substring(4 - result.length) : toTwo(value)));
        }
    }

    return fmt;
}

//时间格式化(主要用于格式化历史时间到当前时间是多少秒到多少年前)
//oDate（时间戳或字符串日期都支持）
function dateFormat1(oDate) {
    var oDate = normalDate(oDate);

    if (+oDate >= +new Date()) {
        return '刚刚';
    }
    var lookTime = +new Date() - (+oDate);
    var seconds = Math.floor(lookTime / (1000));
    var minutes = Math.floor(lookTime / (1000 * 60));
    var hours = Math.floor(lookTime / (1000 * 60 * 60));
    var days = Math.floor(lookTime / (1000 * 60 * 60 * 24));
    var months = Math.floor(lookTime / (1000 * 60 * 60 * 24 * 30));
    var years = Math.floor(lookTime / (1000 * 60 * 60 * 24 * 30 * 12));

    if (seconds < 60) {
        lookTime = seconds + '秒前';
    } else if (minutes < 60) {
        lookTime = minutes + '分钟前';
    } else if (hours < 24) {
        lookTime = hours + '小时前';
    } else if (days < 30) {
        lookTime = days + '天前';
    } else if (months < 12) {
        lookTime = months + '个月前';
    } else {
        lookTime = years + '年前';
    }
    return lookTime;
}

//金额格式化
function amountFormat0(value, dLength, cLength) {
    var oldValue = value;
    var value = +value;
    var arr = [];
    var dLength = dLength || 2;
    var cLength = cLength || 3;
    var zero = '';

    for (var i = 0; i < dLength; i++) {
        zero += '0';
    }

    if (Type(value) == 'number') {
        value += '';
        value = value.split('.');
        value[0] = value[0].split('');
        value[1] = (value[1] || '') + zero;
        value[1] = value[1].substring(0, dLength);

        arr.unshift('.', value[1]);
        while (value[0].length > cLength) {
            arr.unshift(',', value[0].splice(value[0].length - cLength, cLength).join(''));
        }

        arr = value[0].join('') + arr.join('');
    } else {
        arr = oldValue;
    }

    if (arr && arr.length) arr = arr.replace('-,', '-');
    return arr;
}

//数字四舍五入为指定位数的数字
function toFixed0(value, length, closeRound) {
    var oldValue = value;
    var value = value + '';
    var arr = value.split('.');
    var length = Math.abs(length || 0);
    var zero = '';
    var rNum = '';

    for (var i = 0; i < length; i++) {
        zero += '0';
    }

    if (Type(oldValue) == 'number') {
        arr[1] = arr[1] ? arr[1] + zero : zero;
        rNum = arr[1].substring(0, length);
        arr[1] = rNum + '.' + arr[1].substring(length, arr[1].length);

        if (Type(+arr[1]) == 'number') {
            if (!closeRound) {
                arr[1] = Math.round(arr[1]);
            } else {
                arr[1] = arr[1].split('.')[0];
            }
        }

        if ((arr[1] + '').length == 1) {
            rNum = rNum.split('');
            rNum[length - 1] = arr[1];
            rNum = rNum.join('');
        } else {
            rNum = arr[1];
        }

        arr[1] = (rNum + zero).substring(0, length);
        arr = arr.join('.');
    } else {
        arr = oldValue;
    }

    return arr;
}

//格式化手机号为344
function formatMobile(val) {
    var reg = /^[1][3-9][0-9][ ][0-9]{4}[ ][0-9]{4}$/;
    var reg1 = /(\d{3})(?=\d)/;
    var reg2 = /(\d{4})(?=\d)/g;

    if (!reg.test(val)) {
        val = val.replace(/\s/g, '');
        val = val.replace(reg1, '$1 ');
        val = val.replace(reg2, '$1 ');
    }

    return val;
}

//科学运算（解决js处理浮点不正确的问题）
//num1（要进行运算的第一个数字）
//operator（运算符号,+、-、*、/）
//num2（要进行运算的第二个数字）
/*
    测试例子：
    console.log(19044.009 + 0.01, computed(19044.009, '+', 0.01));
    console.log(19044.002 - 0.01, computed(19044.002, '-', 0.01));
    console.log(19044.003 * 0.05, computed(19044.003, '*', 0.05));
    console.log(19044.001 / 0.05, computed(19044.001, '/', 0.05));
    console.log(11 + 22, computed(11, '+', 22));
*/
function computed(num1, operator, num2) {
    var numArr1 = (num1 + '').split('.');
    var numArr2 = (num2 + '').split('.');
    var numArr11 = numArr1[1] || 0;
    var numArr21 = numArr2[1] || 0;
    var length1 = numArr11 ? numArr11.length : 0;
    var length2 = numArr21 ? numArr21.length : 0;
    var integer1 = Math.pow(10, length1);
    var integer2 = Math.pow(10, length2);
    var iMax = Math.max(integer1, integer2);
    var diffInteger1 = iMax / integer1;
    var diffInteger2 = iMax / integer2;
    var decimals1 = +numArr11 * diffInteger1;
    var decimals2 = +numArr21 * diffInteger2;
    var result = '';

    num1 = numArr1[0] * iMax + decimals1;
    num2 = numArr2[0] * iMax + decimals2;
    switch (operator) {
        case '+':
            result = (num1 + num2) / iMax;
            break;
        case '-':
            result = (num1 - num2) / iMax;
            break;
        case '*':
            result = (num1 * num2) / (iMax * iMax);
            break;
        case '/':
            result = num1 / num2;
            break;
    }
    return result;
}

//生成32位唯一字符串(大小写字母数字组合)
function soleString32() {
    var str = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    var timestamp = +new Date() + Math.floor(Math.random() * 10);
    var resultStr = '';

    for (var i = 0; i < 19; i++) {
        resultStr += str.charAt(Math.floor(Math.random() * str.length));
    }
    resultStr += timestamp;

    resultStr = resultStr.split('');
    resultStr.sort(function (a, b) {
        return Math.random() - 0.5;
    });
    resultStr = resultStr.join('');
    return resultStr;
}

//生成添加boundary的字符串，用于小程序uni.request发送multipart/form-data请求的方法
function boundaryString(json) {
    var id = soleString32();
    var result = { id: id };
    var data = '';

    function createStr(key, value) {
        var str = '--' + id + '\r\nContent-Disposition: form-data; name="' + key + '"\r\n\r\n' + value + '\r\n';

        return str;
    };
    for (var attr in json) {
        data += createStr(attr, json[attr]);
    }
    data += '--' + id + '--';
    result.data = data;
    return result;
}

//自定义事件的实现
var customEvent = {
    json: {},
    on: function (evName, fn) {
        if (Type(this.json[evName]) != 'object') {
            this.json[evName] = {};
        }
        if (Type(fn) == 'function') {
            fn.id = soleString32();
            this.json[evName][fn.id] = fn;
        }
        return this;
    },
    emit: function (evName, data) {
        var evFnArr = this.json[evName];

        if (Type(evFnArr) == 'object') {
            for (var attr in this.json[evName]) {
                if (Type(this.json[evName][attr]) == 'function') {
                    this.json[evName][attr](data);
                }
            }
        }
        return this;
    },
    remove: function (evName, fn) {
        var evFnArr = this.json[evName];

        if (Type(evName) == 'string' && Type(evFnArr) == 'object') {
            if (Type(fn) == 'function') {
                if (fn.id) {
                    delete this.json[evName][fn.id];
                } else {
                    for (var attr in this.json[evName]) {
                        if (this.json[evName][attr] + '' === fn + '') {
                            delete this.json[evName][attr];
                            break;
                        }
                    }
                }
            } else {
                delete this.json[evName];
            }
        }
        return this;
    }
};

//重置data数据
function resetData(data) {
    var oData = copyJson(data);

    return {
        data: copyJson(oData),
        reset: function (parent) {
            var oData = copyJson(data);

            for (var attr in oData) {
                parent[attr] = oData[attr];
            }
        },
    };
}

//重置vue中的data数据
function resetVueData(vue) {
    if (vue.$initData$) {
        Object.assign(vue, JSON.parse(vue.$initData$));
    } else {
        vue.$initData$ = JSON.stringify(vue.$data);
    }
}

//json转换成字符串
function jsonToStr(json) {
    var str = '?';

    for (var attr in json) {
        str += `${attr}=${json[attr]}&`;
    }
    str = str.substring(0, str.length - 1);

    return str;
}

//根据后缀名判断文件类型
function fileType(suffix) {
    var suffix = suffix || '';
    var typeList = ['image', 'audio', 'video', 'file'];
    var length = typeList.length - 1;
    var suffixJson = {
        image: ['png', 'jpg', 'jpeg', 'gif', 'ico', 'bmp', 'pic', 'tif'],
        audio: ['mp3', 'ogg', 'wav', 'acc', 'vorbis', 'silk'],
        video: ['mp4', 'webm', 'avi', 'rmvb', '3gp', 'flv'],
    };
    var resultList = [];

    for (var attr in suffixJson) {
        resultList.push(!!~suffixJson[attr].indexOf(suffix));
    }

    var posIndex = resultList.indexOf(true);

    return posIndex != -1 ? typeList[posIndex] : typeList[length];
}

//uni小程序-本地存储
var lStore = {
    set: function () {
        let result = uni.setStorageSync.apply(this, arguments);

        return result;
    },
    get: function () {
        let result = uni.getStorageSync.apply(this, arguments);

        return result;
    },
    getAll: function () {
        let result = uni.getStorageInfoSync.apply(this, arguments);

        return result;
    },
    remove: function () {
        let result = uni.removeStorageSync.apply(this, arguments);

        return result;
    },
    clear: function () {
        let result = uni.clearStorageSync.apply(this, arguments);

        return result;
    },
};

//uni小程序-获取当前页面的信息
function getCurrentPage() {
    var pages = getCurrentPages();
    var length = pages.length - 1;

    return pages[length];
}

//uni小程序-动画
/*
    <div :animation="animationData" class="test">
        测试页面
    </div>
    uniAnimation({
        parent:this,//父组件的this
        animationName:'animationData',//animation绑定data中的值的名字
        animationConfig:{//动画属性配置
            scale:[2,2],
            rotate:45,
        },
    });
*/
function uniAnimation(option) {
    var option = option || {};
    var animation = uni.createAnimation({
        duration: option.duration || 300,
        timingFunction: option.timingFunction || 'ease',
    });

    for (var attr in option.animationConfig) {
        animation[attr][Type(option.animationConfig[attr]) == 'array' ? 'apply' : 'call'](animation, option.animationConfig[attr]);
    }
    animation.step();

    option.parent[option.animationName] = animation.export();
}

//uni小程序-toast
function uniToast(title, duration) {
    setTimeout(function () {
        uni.showToast({
            title: title,
            mask: true,
            icon: 'none',
            duration: duration || 2000,
        });
    });
}

//判断json是否有某个key，不管是否为空
function jsonHasKey(json, key) {
    if (Type(json) != 'object') {
        return false;
    }
    return key in json;
}

//所有积累正则
//reg（验证正则）
//iReg（输入正则）
//tReg（替换正则）
var regJson = {
    int: {
        name: '整型',
        reg: /^[0-9]+$/,
        iReg: /^[0-9]*$/,
        tReg: /[0-9]+/g,
    },
    number: {
        name: '数字',
        reg: /^[0-9]+\.?[0-9]*$/,
        iReg: /^[0-9]*\.?[0-9]*$/,
        tReg: /[0-9\.]+/g,
    },
    aa: {
        name: '小写字母',
        reg: /^[a-z]+$/,
        iReg: /^[a-z]*$/,
        tReg: /[a-z]+/g,
    },
    AA: {
        nmae: '大写字母',
        reg: /^[A-Z]+$/,
        iReg: /^[A-Z]*$/,
        tReg: /[A-Z]+/g,
    },
    aA: {
        name: '字母',
        reg: /^[a-zA-Z]+$/,
        iReg: /^[a-zA-Z]*$/,
        tReg: /[a-zA-Z]+/g,
    },
    aa1: {
        name: '小写字母或数字',
        reg: /^[a-z0-9]+$/,
        iReg: /^[a-z0-9]*$/,
        tReg: /[a-z0-9]+/g,
    },
    AA1: {
        name: '大写字母或数字',
        reg: /^[A-Z0-9]+$/,
        iReg: /^[A-Z0-9]*$/,
        tReg: /[A-Z0-9]+/g,
    },
    aA1: {
        name: '字母和数字',
        reg: /^\w+$/,
        iReg: /^\w*$/,
        tReg: /\w+/g,
    },
    zh: {
        name: '中文',
        reg: /^[\u2E80-\u9FFF]+$/,
        iReg: /^[\u2E80-\u9FFF]*$/,
        tReg: /[\u2E80-\u9FFF]+/g,
    },
    zhEn: {
        name: '中文或英文',
        reg: /^[\u2E80-\u9FFFa-zA-Z]+$/,
        iReg: /^[\u2E80-\u9FFFa-zA-Z]*$/,
        tReg: /[\u2E80-\u9FFFa-zA-Z]+/g,
    },
    mobile: {
        name: '手机号',
        reg: /^1[3-9]{1}\d{9}$/,
        iReg: /^[0-9]{0,11}$/,
        tReg: /[0-9]+/g,
    },
    identity: {
        name: '身份证号码',
        reg: /^[1-8]\d{5}[1-9]\d{3}(0[1-9]|1[0-2])(0[1-9]|[1-2]\d|3[0-1])\d{3}[\dxX]$/,
        iReg: /^[\dxX]{0,18}$/,
        tReg: /[\dxX]+/g,
    },
    bankCard: {
        name: '银行卡号',
        reg: /^[0-9]{8,28}$/,
        iReg: /^[0-9]{0,28}$/,
        tReg: /[0-9]+/g,
    },
    user: {
        name: '用户名',
        reg: /^[\w-]{3,16}$/,
        iReg: /^[\w-]{0,16}$/,
        tReg: /[\w-]+/g,
    },
    password: {
        name: '密码',
        reg: /^[^\u2E80-\u9FFF\s]{6,20}$/,
        iReg: /^[^\u2E80-\u9FFF\s]{0,20}$/,
        tReg: /[^\u2E80-\u9FFF\s]+/g,
    },
    email: {
        name: '邮箱',
        reg: /^([\w\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/,
        iReg: /^([\w\.-]*)@([\da-z\.-]*)\.([a-z\.]{0,6})$/,
        tReg: /[\w\.-@]+/g,
    },
    verifyCode: {
        name: '6位数字验证码',
        reg: /^[0-9]{6}$/,
        iReg: /^[0-9]{0,6}$/,
        tReg: /[0-9]+/g,
    },
};

//提示框带多条件阻止
//优先级reg>type>if（校验类型只生效一个）
//arr[{if:'','reg':/^$/,type:'number','value':,'hint':''}]
//if（提示触发的条件）
//reg（正则匹配）
//type（已定义类型正则匹配）
//value（正则验证的值）
//hint（提示的字符串）
//endFn（全部验证通过后才走的回调函数）
//errorFn（参数中返回错误条件的索引）
//msec（提示框消失的时间，默认3秒）
function uniToasts(arr, endFn, errorFn, msec) {
    var onOff = true;
    var errorIndex = -1;

    for (var i = 0; i < arr.length; i++) {
        var condition = !jsonHasKey(arr[i], 'if') || arr[i].if;

        if (arr[i].reg) {
            if (condition && !arr[i].reg.test(arr[i].value)) {
                uniToast(arr[i].hint, msec);
                onOff = false;
                errorIndex = i;
                break;
            }
        } else if (arr[i].type) {
            if (condition && regJson[arr[i].type] && !regJson[arr[i].type].reg.test(arr[i].value)) {
                uniToast(arr[i].hint || '请输入有效的' + regJson[arr[i].type].name, msec);
                onOff = false;
                errorIndex = i;
                break;
            }
        } else if (arr[i].if) {
            uniToast(arr[i].hint, msec);
            onOff = false;
            errorIndex = i;
            break;
        }
    }

    errorFn && errorFn(errorIndex);
    onOff && endFn && endFn();
}

//uni小程序-分享
function unixcxShare(option) {
    var option = option || {};

    return {
        title: option.title || '亿家健康预约挂号',
        desc: option.desc || '亿家健康预约挂号',
        // imageUrl: option.imageUrl || require('@/static/images/loading.gif'),
        path: option.path ? (typeof option.path == 'boolean' ? getCurrentPage().route : option.path) : '/pages/hospital/main',
        success: function (res) {
            option.success && option.success(res);
        },
        fail: function (res) {
            option.fail && option.fail(res);
        },
        complete: function (res) {
            option.complete && option.complete(res);
        },
    };
}

//uni小程序-用高德地图获取地理位置
/*
    uniGetLocation({
        success:function(res,detail){//成功回调
            console.log(res,detail);
        },
        fail:function(error){//失败回调
            console.log(error);
        },
    });
*/
function uniGetLocation(option) {
    var option = option || {};
    var myAmapFun = new amapFile.AMapWX({
        key: '836a3b19c3d3461705af9d8ea20efcc5', //高德小程序应用专用key
    });

    myAmapFun.getRegeo({
        success: function (detail) {
            var detail = detail[0] || {};
            var addressComponent = detail.regeocodeData && detail.regeocodeData.addressComponent || {};
            var res = {
                longitude: detail.longitude,
                latitude: detail.latitude,
                name: detail.name,
                desc: detail.desc,
                formatted_address: detail.regeocodeData && detail.regeocodeData.formatted_address,
                country: addressComponent.country,
                province: addressComponent.province,
                city: addressComponent.city,
                district: addressComponent.district,
                township: addressComponent.township,
                adcode: addressComponent.adcode,
                citycode: addressComponent.citycode,
                towncode: addressComponent.towncode,
            };
            option.success && option.success(res, detail);
        },
        fail: function (error) {
            option.fail && option.fail(error);
        },
    });
}

//uni小程序-订阅消息
//tmplIds（需要订阅的消息模板的id的集合）
//success（成功的回调函数）
function uniSubscribe(tmplIds, success) {
    uni.requestSubscribeMessage({
        tmplIds: tmplIds,
        success: success,
    });
}

//长期订阅消息
function uniSubscribe1(success) {
    let tmplIds = ['vZDcBbQjb-YrxaPe29rU9877Rz7neIuUIG95PoZ2zro', '4r2UFnoD3ApWYFqolqTx5mylWSbigOu-xUrve8xhZfk', 'q5YBqBvFtrUrNtXQODJ1_ek2USB6fLrnvR-NMaJ3Dno'];

    uniSubscribe(tmplIds, (res) => {
        console.log(res);
        success && success(res);
    });
}

//药品发货通知
function uniSubscribe2(success) {
    let tmplIds = ['SnMNUySb6QZIhuFIbfGXFa6zgKh2CAM_cChfZOT1YLs'];

    uniSubscribe(tmplIds, (res) => {
        success && success(res);
    });
}

//清除h5记住的密码
function clearRememberedPassword() {
    //#ifdef H5
    let oInput = document.querySelectorAll('input');

    if (oInput) {
        for (let i = 0; i < oInput.length; i++) {
            oInput[i].setAttribute('autocomplete', 'new-password');
        }
    }
    //#endif
}

//项目中用到的工具函数
export {
    Type,
    copyJson,
    toTwo,
    normalDate,
    getWeekName,
    getAge,
    getSexAndDob,
    idCardNo,
    secondFormat0,
    dateFormat0,
    dateFormat1,
    amountFormat0,
    toFixed0,
    computed,
    soleString32,
    customEvent,
    resetData,
    resetVueData,
    jsonToStr,
    fileType,
    lStore,
    getCurrentPage,
    boundaryString,

    uniAnimation,
    uniToast,
    uniToasts,
    unixcxShare,
    uniGetLocation,
    uniSubscribe,
    uniSubscribe1,
    uniSubscribe2,

    clearRememberedPassword,
};