<template>
  <div id="title-tools">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <h2>随机生成标题的小工具</h2>
      </div>
      <!-- 标题123 start-->
      <div class="title-item" v-for="(item, index) in 3">
        <el-card class="box-card">
          <div slot="header" class="clearfix header">
            <span>标题{{item}}</span>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              circle
              class="button"
              @click="clear(item)"
            ></el-button>
          </div>
          <div class="text-item">
            <el-tag
              :key="tag"
              v-for="tag in dynamicTags(item)"
              closable
              hit
              :disable-transitions="false"
              @close="handleClose(tag, item)"
            >{{tag}}</el-tag>
            <el-input
              class="input-new-tag"
              v-if="currentItem === item && inputVisible"
              v-model="inputValue"
              :ref="`saveTagInput${item}`"
              size="small"
              @keyup.enter.native="handleInputConfirm(item)"
              @blur="handleInputConfirm(item)"
            ></el-input>
            <el-button v-else class="button-new-tag" size="small" @click="showInput(item)">+ New Tag</el-button>
          </div>
        </el-card>
      </div>
      <!-- 标题123 end-->

      <!-- 操作按钮 -->
      <el-alert class="alert" v-if="result" v-loading="loading" :title="result" type="success" center :closable="false"></el-alert>
      <div class="handle">
        <el-button type="primary" @click="random">随机生成</el-button>
        <el-button type="danger" @click="allResult">生成所有</el-button>
      </div>
      <!-- 所有内容 -->
      <div class="all-result" v-if="textarea">
        <el-input
          type="textarea"
          :autosize="{ minRows: 5}"
          placeholder="请输入内容"
          v-model="textarea"
          show-word-limit>
        </el-input>
      </div>
    </el-card>
  </div>
</template>
<script>
function randomStr(arr) {
  let n = Math.floor(Math.random() * arr.length + 1) - 1
  return arr[n] ? arr[n] : ''
}
export default {
  data() {
    return {
      dynamicTags1: [],
      dynamicTags2: [],
      dynamicTags3: [],
      inputVisible: false,
      currentItem: null,
      inputValue: '',
      result: '',
      loading: false,
      textarea: '',
    }
  },
  computed: {
    // 无数据
    isAllClear() {
      return !this.dynamicTags1.length && !this.dynamicTags2.length && !this.dynamicTags3.length
    }
  },
  watch: {
    // 清除结果
    isAllClear(val) {
      if(val) {
        this.result = ''
        this.textarea = ''
      }
    }
  },
  methods: {
    isHaveContent(){
      if (
        !this.dynamicTags1.length &&
        !this.dynamicTags2.length &&
        !this.dynamicTags3.length
      ){
        this.$message({
          message: '请输入内容',
          center: true
        })
        return
      }
    },
    // 生成所有 
    allResult() {
      this.isHaveContent()
      this.result = ''
      function compose(arr1, arr2) {
        let _allresult = []
        if(!arr1.length || !arr2.length) {
          _allresult = arr1.length ? arr1 : arr2.length ? arr2 : []
        } else {
          for(let i=0; i<arr1.length; i++) {
            for(let j=0; j<arr2.length; j++) {
              _allresult.push(`${arr1[i]}${arr2[j]}`)
            }
          }
        }
        return _allresult
      }
      let _pre = compose(this.dynamicTags1, this.dynamicTags2)
      let _all = compose(_pre, this.dynamicTags3).map(v => v + '\r\n').join('')
      this.textarea = _all
    },
    // 随机
    random() {
        this.isHaveContent()
        this.textarea = ''
        this.loading = true
        if(timer) clearTimeout(timer)
        let timer = setTimeout(() => {
          this.loading = false
          this.result =
            randomStr(this.dynamicTags1) +
            randomStr(this.dynamicTags2) +
            randomStr(this.dynamicTags3)
        }, 300)
    },
    clear(item) {
      if (typeof item !== 'number') {
        this.dynamicTags1 = []
        this.dynamicTags2 = []
        this.dynamicTags3 = []
      } else {
        this[`dynamicTags${item}`] = []
      }
    },
    dynamicTags(item) {
      return this[`dynamicTags${item}`]
    },
    handleClose(tag, item) {
      this[`dynamicTags${item}`].splice(this[`dynamicTags${item}`].indexOf(tag), 1)
    },

    showInput(item) {
      this.inputVisible = true
      this.currentItem = item
      this.$nextTick(_ => {
        this.$refs[`saveTagInput${item}`][0].$refs.input.focus()
      })
    },

    handleInputConfirm(item) {
      if(this[`dynamicTags${item}`].includes(this.inputValue)) {
        this.$message({
          message: '请勿输入重复内容',
          center: true
        })
        this.inputValue = ''
        return
      }
      let inputValue = this.inputValue
      if (inputValue) {
        this[`dynamicTags${item}`].push(inputValue)
      }
      this.inputVisible = false
      this.inputValue = ''
    }
  }
}
</script>
<style lang="scss">
#title-tools {
  min-width: 610px;
  margin: 1% 2%;
  .el-card__body {
    .title-item {
      width: 30%;
      display: inline-block;
      margin-right: 3%;
      vertical-align: top;
      .el-card__body{
        min-height: 400px;
        overflow-y: auto;
      }
      &:nth-child(3) {
        margin: 0;
      }
      .header {
        position: relative;
        .button {
          position: absolute;
          right: 5px;
          top: 50%;
          transform: translateY(-50%);
        }
      }
    }
    .el-tag {
      width: 100%;
      margin: 5px;
      height: 40px;
      line-height: 40px;
      font-size: 16px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      text-align: left;
      position: relative;
      .el-icon-close {
        position: absolute;
        right: 5px;
        top: 50%;
        transform: translateY(-50%);
      }
    }
    .handle {
      margin: 20px;
    }
    .el-alert__title {
      font-size: 28px;
      line-height: 30px;
      margin: 10px;
    }
    .alert{
      margin-top: 20px;
    }
    .el-textarea{
      width: 800px;
    }
    .all-result{
      text-align: center;
    }
  }
}
</style>
