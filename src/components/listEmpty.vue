<template>
  <div class="list-empty">
    <image class="image" :src="imageSrc"/>
    <div class="message" v-if="messageText">
      {{message || '暂无数据'}}
    </div>
    <view 
      v-if="buttonText"
      class="button"  
      hover-class="touch-highlight"
      @click="onClickButton"
    >
      {{buttonText}}
    </view>
  </div>
</template>

<script>
export default {
  props:{
    networkError:{
      type:Boolean,
      default:false,
    },
    message:{
      type:String,
      default:''
    },
    button:{
      type:String,
      default:''
    },
    src:{
      type:String,
      default:require('images/placeholder/img_data_default.png')
    }
  },
  computed: {
    buttonText() {
      if (this.networkError) {
        return '点击重试';
      } else {
        return this.button;
      }
    },
    messageText() {
      if (this.networkError) {
        return '';
      } else {
        return this.message;
      }
    },
    imageSrc() {
      if(this.networkError) {
        return require('images/placeholder/img_default_network.png');
      } else {
        if (this.src) {
          return this.src;
        } else {
          return require('images/placeholder/img_data_default.png');
        }
      }
    }
  },
  methods:{
    onClickButton() {
      this.$emit('clickButton');
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~css/public.scss";
.list-empty {
  position: absolute;
  top:0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: $bg;
  z-index: 1;
  .image {
    width: 130px;
    height: 130px;
  }
  .message {
    font-size: 14px;
    margin: 0 30px;
    margin-top: 10px;
    color: $grayText;
    text-align: center;
    line-height: 25px;
  }
  .button {
    margin-top: 15px;
    width: 150px;
    height: 30px;
    text-align: center;
    line-height: 30px;
    color:white;
    background-color: $main;
    font-size: 12px;
    border-radius: 15px;
    &.touch-highlight {
      opacity: 0.8;
    }
  }
}
</style>