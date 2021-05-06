<template>
    <div class="pickerWrap">
        <picker v-if="mode=='selector'" mode="selector" :value="value" :rangeKey="selectorRangeKey" :range="range" :disabled="disabled" class="picker" @change="changeFn" @cancel="cancelFn">
            <div class="pickerText" v-if="!hideSlot">
                <span class="title">{{title||'普通选择器：'}}</span>
                <span v-if="selectorValue" class="value">{{selectorValue}}</span>
                <span v-else class="hint">{{placeholder}}</span>
            </div>
            <div class="picker selector" v-else></div>
        </picker>
        <picker v-if="mode=='multiSelector'" mode="multiSelector" :value="!ganged?value:gangedValue" :rangeKey="multiSelectorRangeKey" :range="range" :disabled="disabled" class="picker" @change="changeFn" @columnchange="columnchangeFn" @cancel="cancelFn">
            <div class="pickerText" v-if="!hideSlot">
                <span class="title">{{title||'多列选择器：'}}</span>
                <span v-if="!ganged?multiSelectorValue:cacheMultiSelectorValue" class="value">{{!ganged?multiSelectorValue:cacheMultiSelectorValue}}</span>
                <span v-else class="hint">{{placeholder}}</span>
            </div>
            <div class="picker multiSelector" v-else></div>
        </picker>
        <picker v-if="mode=='time'" mode="time" :value="value" :start="start" :end="end" :disabled="disabled" class="picker" @change="changeFn" @cancel="cancelFn">
            <div class="pickerText" v-if="!hideSlot">
                <span class="title">{{title||'时间选择器：'}}</span>
                <span v-if="timeValue" class="value">{{timeValue}}</span>
                <span v-else class="hint">{{placeholder}}</span>
            </div>
            <div class="picker time" v-else></div>
        </picker>
        <picker v-if="mode=='date'" mode="date" :value="value" :start="start" :end="end" :flieds="flieds" :disabled="disabled" class="picker" @change="changeFn" @cancel="cancelFn">
            <div class="pickerText" v-if="!hideSlot">
                <span class="title">{{title||'日期选择器：'}}</span>
                <span v-if="dateValue" class="value">{{dateValue}}</span>
                <span v-else class="hint">{{placeholder}}</span>
            </div>
            <div class="picker date" v-else></div>
        </picker>
        <picker v-if="mode=='region'" mode="region" :value="value" :join="join" :customItem="customItem" :disabled="disabled" class="picker" @change="changeFn" @cancel="cancelFn">
            <div class="pickerText" v-if="!hideSlot">
                <span class="title">{{title||'省市区选择器：'}}</span>
                <span v-if="regionValue" class="value">{{regionValue}}</span>
                <span v-else class="hint">{{placeholder}}</span>
            </div>
            <div class="picker region" v-else></div>
        </picker>
    </div>
</template>
<script>
import { resetData, Type, copyJson } from 'js/utils';

const resetDataFn = resetData({ //需要重置的data属性
    firstLoaded: false,
    gangedValue: [],
    cacheValue: [],
    cacheRange: [],
    cacheMultiSelectorValue: [],
});

export default {
    data() {
        return Object.assign({}, resetDataFn.data, {

        });
    },

    computed: {
        selectorRangeKey() {
            return this.selectorRangeKeyFn();
        },
        selectorValue() {
            return this.selectorValueFn();
        },
        multiSelectorRangeKey() {
            return this.multiSelectorRangeKeyFn();
        },
        multiSelectorValue() {
            return this.multiSelectorValueFn();
        },
        timeValue() {
            return this.timeValueFn();
        },
        dateValue() {
            return this.dateValueFn();
        },
        regionValue() {
            return this.regionValueFn();
        },
    },

    /*
        例子：
        <pickerWrap
            :mode="'selector'"
            :range="['美国','中国','巴西','日本']"
            :value="index1"
            :change="changeFn1"
        />

        <pickerWrap
            :mode="'selector'"
            :range="[{id:0,name:'美国'},{id:1,name:'中国'},{id:2,name:'巴西'},{id:3,name:'日本'}]"
            :value="index11"
            :change="changeFn11"
        />

        <pickerWrap
            :mode="'multiSelector'"
            :range="[['无脊柱动物','脊柱动物'],['扁性动物','线形动物','环节动物','软体动物','节肢动物'],['猪肉绦虫','吸血虫']]"
            :value="arrIndex2"
            :change="changeFn2"
        />

        <pickerWrap
            :mode="'multiSelector'"
            :range="gangedArr"
            :value="gangedArrIndex"
            :ganged="true"
            :change="gChangeFn"
            :cancel="gCancelFn"
            :columnchange="gColumnchangeFn"
        />

        <pickerWrap
            :mode="'time'"
            :value="time"
            :change="tChangeFn"
        />

        <pickerWrap
            :mode="'date'"
            :value="date"
            :change="dChangeFn"
        />

        <pickerWrap
            :mode="'region'"
            :value="region"
            :change="rChangeFn"
        />

        data:{
            dataList:[],
            index1:0,
            index11:0,
            arrIndex2:[],
            arrIndex22:[],
            gangedArr:[],
            gangedArrIndex:[],
            time:'',
            date:'',
            region:[],
        }

        methods:{
            clickFn(){
                wx.navigateTo({
                    url:'../test/test',
                });
            },
            changeFn1(changeValue){
                let res=changeValue(this,'index1');

                console.log(res);
            },
            changeFn11(changeValue){
                let res=changeValue(this,'index11');

                console.log(res);
            },
            changeFn2(changeValue){
                let res=changeValue(this,'arrIndex2');

                console.log(res);
            },
            changeFn22(changeValue){
                let res=changeValue(this,'arrIndex22');

                console.log(res);
            },
            mockGangedArr(id,endFn){
                let arr=[];

                switch(id){
                    case '1':
                            arr=[{id:'1-1',name:'扁性动物'},{id:'1-2',name:'线性动物'}];
                        break;
                    case '1-1':
                            arr=[{id:'1-1-1',name:'猪肉绦虫'},{id:'1-1-2',name:'吸血虫'},{id:'1-1-3',name:'尸蟞'}];
                        break;
                    case '1-2':
                            arr=[{id:'1-2-1',name:'蛔虫'},{id:'1-2-2',name:'线虫'}];
                        break;
                    case '2':
                            arr=[{id:'2-1',name:'鱼'},{id:'2-2',name:'两栖动物'}];
                        break;
                    case '2-1':
                            arr=[{id:'2-1-1',name:'鲫鱼'},{id:'2-1-2',name:'带鱼'}];
                        break;
                    case '2-2':
                            arr=[{id:'2-2-1',name:'青蛙'},{id:'2-2-2',name:'娃娃鱼'}];
                        break;
                    default:
                            arr=[{id:'1',name:'无脊柱动物'},{id:'2',name:'脊柱动物'}];
                }

                setTimeout(()=>{
                    endFn&&endFn(arr);
                },100);
            },
            gChangeFn(changeValue){
                let res=changeValue(this,'gangedArrIndex','gangedArr');

                console.log(res);
            },
            gCancelFn(cancelValue){
                cancelValue(this,'gangedArrIndex','gangedArr');
            },
            gColumnchangeFn(changeArray){
                changeArray(this,'gangedArrIndex','gangedArr',3,this.mockGangedArr);
            },
            tChangeFn(changeArray){
                let res=changeArray(this,'time');

                console.log(res);
            },
            dChangeFn(changeArray){
                let res=changeArray(this,'date');

                console.log(res);
            },
            rChangeFn(changeArray){
                let res=changeArray(this,'region');

                console.log(res);
            },
        }
    */

    props: {
        mode: { //分别是普通选择器('selector')，多列选择器('multiSelector')，时间选择器('time')，日期选择器('date')，省市区选择器('region')
            type: String,
            default: 'selector',
        },
        title: { //title名
            type: String,
            default: '',
        },
        range: {
            //普通选择器('selector')，mode为 selector 或 multiSelector 时，range 有效
            //多列选择器('multiSelector')，mode为 selector 或 multiSelector 时，range 有效。二维数组，长度表示多少列，数组的每项表示每列的数据，如[["a","b"], ["c","d"]]
            type: [Array, Object],
            default: [],
        },
        rangeKey: {
            //普通选择器('selector')，当 range 是一个 Object Array 时，通过 range-key 来指定 Object 中 key 的值作为选择器显示内容
            //多列选择器('multiSelector')，当 range 是一个 二维Object Array 时，通过 range-key 来指定 Object 中 key 的值作为选择器显示内容
            type: String,
            default: 'name',
        },
        value: {
            //普通选择器('selector')，value 的值表示选择了 range 中的第几个（下标从 0 开始），Number
            //多列选择器('multiSelector')，value 每一项的值表示选择了 range 对应项中的第几个（下标从 0 开始），Array
            //时间选择器('time')，表示选中的时间，格式为"hh:mm"，String
            //日期选择器('date')，表示选中的日期，格式为"YYYY-MM-DD"，String
            //省市区选择器('region')，表示选中的省市区，默认选中每一列的第一个值，Array
            type: [Number, String, Array],
            default: null,
        },
        placeholder: { //提示文字
            type: String,
            default: '请选择',
        },
        start: {
            //时间选择器('time')，表示有效时间范围的开始，字符串格式为"hh:mm"
            //日期选择器('date')，表示有效日期范围的开始，字符串格式为"YYYY-MM-DD"
            type: String,
            default: '',
        },
        end: {
            //时间选择器('time')，表示有效时间范围的结束，字符串格式为"hh:mm"
            //日期选择器('date')，表示有效日期范围的结束，字符串格式为"YYYY-MM-DD"
            type: String,
            default: '',
        },
        fields: {
            //日期选择器('date')，有效值 year,month,day，表示选择器的粒度
            type: String,
            default: 'day',
        },
        join: {
            //省市区选择器('region')，连接符号
            type: String,
            default: '',
        },
        customItem: {
            //省市区选择器('region')，可为每一列的顶部添加一个自定义的项
            type: String,
            default: '',
        },
        ganged: {
            //多列选择器('multiSelector')，是否是联动
            type: Boolean,
            default: false,
        },
        hideSlot: { //隐藏该组件的slot，需要设置高度，自己根据change事件的返回值设置显示的字段
            type: Boolean,
            default: false,
        },
        disabled: { //是否禁用
            type: Boolean,
            default: false,
        },
        change: { //value 改变时触发 change 事件，会返回一个函数changeFn，需要传入参数
            /*
                parent,//父组件的this
                valueName,//该组件绑定父组件的value名
                rangeName,//该组件绑定父组件的range名
            */
            type: Function,
            default: () => {},
        },
        cancel: { //取消选择时触发
            /*
                parent,//父组件的this
                valueName,//该组件绑定父组件的value名
                rangeName,//该组件绑定父组件的range名
            */
            type: Function,
            default: () => {},
        },
        columnchange: {
            //多列选择器('multiSelector')，某一列的值改变时触发 columnchange 事件
            /*
                parent,//父组件的this
                valueName,//该组件绑定父组件的value名
                rangeName,//该组件绑定父组件的range名
                rangeLength,//联动数组的长度
                apiFn,//根据业务进行改造，请求接口的封装，第一个参数为接收的id，第二个为获取数据成功的回调函数
            */
            type: Function,
            default: () => {},
        },
    },

    onLoad() { //为保证每次进入都触发，需写在enterFn
        this.enterFn();
    },

    onShow() { //为保证每次进入都触发，需写在enterFn
        this.enterFn();
    },

    onHide() { //为保证每次离开都触发，需写在leaveFn
        this.leaveFn();
    },

    onUnload() { //为保证每次离开都触发，需写在leaveFn
        this.leaveFn();
    },

    methods: {
        enterFn() { //onLoad和onShow可能会一起触发，所以需要防止重复触发
            if (this.isEnter) return '';
            this.isEnter = true;

            //多列选择器联动设置默认数据
            this.setDefaultData();
        },
        leaveFn() { //onHide和onUnload只会触发一个，如果是onHide可能需要重置data属性
            resetDataFn.reset(this);
        },
        setDefaultData() {
            if (this.ganged && !this.firstLoaded && this.range && this.range.length) {
                this.firstLoaded = true;
                this.gangedValue = copyJson(this.value);
                this.cacheValue = copyJson(this.value);
                this.cacheRange = copyJson(this.range);
                this.cacheMultiSelectorValue = copyJson(this.multiSelectorValue);
            }
        },
        selectorRangeKeyFn() {
            if (this.mode != 'selector') return '';
            let { range, rangeKey } = this;
            let type = range[0] ? Type(range[0]) : 'string';
            let selectorRangeKey = '';

            if (type == 'object') {
                selectorRangeKey = rangeKey || 'name';
            }
            return selectorRangeKey;
        },
        selectorValueFn(val) {
            if (this.mode != 'selector') return '';
            let { range, value, rangeKey } = this;
            let type = range[0] ? Type(range[0]) : 'string';
            let selectorValue = '';

            if (val) value = val;
            if (!value && value != 0) {
                value = 0;
            }

            if (type == 'string') {
                selectorValue = range[value];
            } else if (type == 'object') {
                selectorValue = range[value][rangeKey];
            }
            return selectorValue;
        },
        multiSelectorRangeKeyFn() {
            if (this.mode != 'multiSelector') return '';
            let { range, rangeKey } = this;
            let type = range[0] && range[0][0] ? Type(range[0][0]) : 'string';
            let multiSelectorRangeKey = '';

            if (type == 'object') {
                multiSelectorRangeKey = rangeKey || 'name';
            }
            return multiSelectorRangeKey;
        },
        multiSelectorValueFn(val) {
            if (this.mode != 'multiSelector') return '';
            let range = copyJson(this.range);
            let value = copyJson(this.value);
            let { rangeKey } = this;
            let type = range[0] && range[0][0] ? Type(range[0][0]) : 'string';
            let multiSelectorValue = '';

            if (val) value = val;
            if (!value.length) {
                value = range.map((item, index) => 0);
            }

            if (type == 'string') {
                value = value.map((item, index) => {
                    return range[index] ? range[index][item] : '';
                });
            } else if (type == 'object') {
                value = value.map((item, index) => {
                    return range[index] && range[index][item] && range[index][item][this.multiSelectorRangeKey] ? range[index][item][this.multiSelectorRangeKey] : '';
                });
            }

            multiSelectorValue = value.join('，');
            return multiSelectorValue;
        },
        timeValueFn(val) {
            if (this.mode != 'time') return '';
            let timeValue = '';
            let { value } = this;

            if (val) value = val;
            timeValue = value.split(':').join(this.join || ':');
            return timeValue;
        },
        dateValueFn(val) {
            if (this.mode != 'date') return '';
            let dateValue = '';
            let { value } = this;

            if (val) value = val;
            dateValue = value.split('-').join(this.join || '-');
            return dateValue;
        },
        regionValueFn(val) {
            if (this.mode != 'region') return '';
            let regionValue = '';
            let { value } = this;

            if (val) value = val;
            regionValue = value.join(this.join || '-');
            return regionValue;
        },
        changeFn(ev) {
            let { value } = ev.mp.detail;

            const changeValue = (parent, valueName, rangeName) => {
                if (parent && valueName) {
                    if (!this.ganged) {
                        parent[valueName] = value;
                    } else {
                        this.cacheValue = copyJson(this.gangedValue);
                        this.cacheRange = copyJson(this.range);
                        this.cacheMultiSelectorValue = copyJson(this.multiSelectorValue);
                    }
                }

                let resData = {};

                resData.value = Type(value) == 'string' && Type(+value) != 'nan' ? +value : copyJson(value);
                resData.range = copyJson(this.range);
                resData.detail = ev.mp.detail;
                resData.ev = ev;

                switch (this.mode) {
                    case 'selector':
                        resData.strValue = this.selectorValueFn(resData.value);
                        break;
                    case 'multiSelector':
                        if (this.ganged) {
                            resData.strValue = this.cacheMultiSelectorValue;
                            resData.range = copyJson(this.cacheRange);
                        } else {
                            resData.strValue = this.multiSelectorValueFn(resData.value);
                        }
                        break;
                    case 'time':
                        resData.strValue = this.timeValueFn(resData.value);
                        break;
                    case 'date':
                        resData.strValue = this.dateValueFn(resData.value);
                        break;
                    case 'region':
                        resData.strValue = this.regionValueFn(resData.value);
                        break;
                }
                return resData;
            };
            this.change && this.change(changeValue);
        },
        cancelFn() {
            const cancelValue = (parent, valueName, rangeName) => {
                if (parent && valueName) {
                    if (this.ganged) {
                        this.gangedValue = copyJson(this.cacheValue);
                        parent[valueName] = copyJson(this.cacheValue);
                        parent[rangeName] = copyJson(this.cacheRange);
                    }
                }
            };
            this.cancel && this.cancel(cancelValue);
        },
        columnchangeFn(ev) {
            let { column, value } = ev.mp.detail;

            const changeArray = (parent, valueName, rangeName, rangeLength = 0, apiFn) => {
                if (parent && rangeName && parent[rangeName] && apiFn && Type(apiFn) == 'function') {
                    let parentRange = copyJson(parent[rangeName]);
                    let parentValue = copyJson(parent[valueName]);
                    let id = parentRange[column][value].id;

                    const setParent = (value) => {
                        parentRange.length = rangeLength;
                        parentValue.length = rangeLength;

                        for (let i = 0; i < parentValue.length; i++) {
                            let item = parentValue[i];

                            if (!item && item != 0) {
                                parentValue[i] = 0;
                            }
                        }

                        this.gangedValue = copyJson(parentValue);

                        for (let i = 0; i < parentValue.length; i++) {
                            let item = parentValue[i];

                            if (!parentRange[i][item]) {
                                parentValue[i] = 0;
                            }
                        }

                        setTimeout(() => {
                            parent[valueName] = copyJson(parentValue);
                            parent[rangeName] = copyJson(parentRange);
                        }, 100);
                    };

                    if (parent[rangeName][column + 1]) {
                        const reqFn = (id, column, value) => {
                            apiFn(id, (res) => {
                                parentValue[column] = value;
                                parentRange[column + 1] = res;

                                if (column + 1 < rangeLength - 1 && Type(rangeLength) == 'number') {
                                    let valueIndex = parentValue[column + 1] || 0;
                                    let id = parentRange[column + 1][valueIndex].id;

                                    if (id) {
                                        reqFn(id, column + 1, valueIndex);
                                    }
                                } else {
                                    setParent(value);
                                }
                            });
                        };

                        reqFn(id, column, value);
                    } else {
                        parentValue[column] = value || 0;
                        setParent(value);
                    }
                }
            };
            this.columnchange && this.columnchange(changeArray);
        },
    },
}
</script>
<style lang="scss" scoped>
@import '~css/public.scss';

.pickerWrap {
    @include styleInit;
    /deep/ & {
        .picker, .pickerText {
            min-height: 60rpx;
        }
        .hint {
            color: #999;
        }
    }
}
</style>