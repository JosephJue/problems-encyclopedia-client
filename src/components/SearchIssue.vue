<template>
  <div>
    <div class="issueInputArea" v-if="isDisplayInput">
          <p class="issueInputTitle">问题检索：</p>
          <!-- <p>问题检索：</p> -->
          <el-input class="issueInput" v-model="inputContent" placeholder="请输入内容"></el-input>
          <el-select v-model="platform" placeholder="请选择" @change="plateformChane">
            <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
            </el-option>
          </el-select>
      <div>
        <el-button class="submit" :plain="true" type="success" @click="submit">查询</el-button>
      </div>
      <div class="hotSearch" v-if="isDisplayHotSearchList">
        <h3 style="margin-left: 5%;margin-top: 5%;">热门搜索：</h3>
        <ul style="margin-top: -2%;">
          <li class="hotSearchLine" v-for="(item, index) in hotSearchList" @click="tapHotSearch(index)" >{{ item["issueDescription"] }}</li>
        </ul>
      </div>
    </div>
    
    <div class="searchResultList" v-if="isDisplayResultList">
      <el-table
      :data="responseContents"
      border
      style="width: 80%"
      @row-click="clickCell"
      :header-cell-style="tableHeaderColor">
        <el-table-column
        prop="issueDescription"
        label="错误描述"
        >
        </el-table-column>
      </el-table>
      <el-button class="resetInList" type="danger" @click="reset">重置结果</el-button>
    </div>
    <div class="searchResultArea" v-if="isDisplayResult">
      <h2 class="searchTitle">查询结果</h2>
      <el-collapse v-model="activeNames" @change="handleChange" style="margin-left: 3%">
        <el-collapse-item title="问题描述" name="1">
          <div class="displayContent">{{ issueDescription }}</div>
        </el-collapse-item>
        <el-collapse-item title="问题原因" name="2">
          <div class="displayContent">{{ issueReason }}</div>
        </el-collapse-item>
        <el-collapse-item title="排查思路" name="3">
          <div class="displayContent">{{ checkThinking }}</div>
        </el-collapse-item>
        <el-collapse-item title="回复内容" name="4">
          <div class="displayContent">{{ replyContents }}</div>
          <div>
            <el-button type="success"
              v-clipboard:copy="replyContents"
              v-clipboard:success="onCopy"
              v-clipboard:error="onError">Copy!
            </el-button>
          </div>
        </el-collapse-item>
        <el-collapse-item title="相关知识库" name="5">
          <div class="displayContent" >
            <div v-if="relevantContents[0] == '无'">无</div>
            <div v-for=" (relevant, index) in relevantContents" v-if="relevantContents[0] != '无'">
              <el-button 
              icon="el-icon-document-copy" 
              v-clipboard:copy="relevant"
              v-clipboard:success="onCopy"
              v-clipboard:error="onError"
              circle>
              </el-button>{{ relevant }}<p></p></div>
          </div>
        </el-collapse-item>
        <el-collapse-item title="解决案例" name="6">
          <div class="displayContent">{{ resolvedCase }}</div>
        </el-collapse-item>
     </el-collapse>
     <div>
       <el-button-group class="btnGrp">
        <el-button type="danger" @click="reset">重置结果</el-button>
        <el-button type="warning" @click="displaySearchResultList" v-if="responseContents.length > 1">返回列表</el-button>
      </el-button-group>
     </div>
     </div>
  </div>
</template>

<script>
   import httpManager from "../util/httpManager"; 
    export default {
      data() {
        return {
          active: '',
          inputContent: "",
          isDisplayInput: true,
          isDisplayResult:false,
          isDisplayResultList:false,
          isDisplayHotSearchList:false,
          responseContents:[],
          hotSearchList:{},
          issueDescription: "",
          issueReason: "",
          checkThinking: "",
          replyContents: "",
          relevantContents: {},
          resolvedCase: "",
          activeNames: ['1','4'],
          options: [{
          value: 'iOS',
          label: 'iOS'
          }, {
          value: 'Android',
          label: 'Android'
          }, {
          value: 'Web',
          label: 'Web'
          }],
          platform: ''

          }
      },
      methods: {
        submit (){
          if (this.inputContent == "") {
            this.$message.error('请输入要查询的内容');
            return;
          }
          if (this.platform == "") {
            this.$message.error('请选择平台');
            return;
          }
          var subResult = { "type":this.platform, "key":this.inputContent};
          var api = "searchIssue";
          var that = this;
          httpManager.axiosPost(api, subResult, function (res) {
            if (res.status === 200) {
              if (res.data == "None") {
                that.$message.error('暂无相关问题的记录');
                return;
              }
              // console.log(res);
              that.responseContents = res.data;
              if (that.responseContents.length == 1) {
                var result = res.data[0];
                that.displaySearchResult (result);
                that.doReviewCount(result["issueDescription"])
              } else {
                that.displaySearchResultList();
              }
              
            }
          });
        },
        plateformChane (value){
          this.hotSearchList = {};
          //  console.log(value);
          var subResult = { "hotSearch":value};
          var api = "searchIssue";
          var that = this;
          httpManager.axiosPost(api, subResult, function (res) {
            if (res.status === 200) {
              if (res.data == "None") {
                // that.$message.error('暂无热门搜索');
                that.isDisplayHotSearchList = false;
                return;
              }
              that.hotSearchList = res.data;
              that.isDisplayHotSearchList = true;
            }
          });
        },
        tapHotSearch (index){
          var hotSearchData = this.hotSearchList[index];
          this.displaySearchResult (hotSearchData);
          this.doReviewCount(hotSearchData["issueDescription"]);
        },
        reset (){
          this.isDisplayInput = true;
          this.isDisplayResult = false;
          this.isDisplayResultList = false;
          this.inputContent = "";
          this.issueDescription = "";
          this.issueReason = "";
          this.checkThinking = "";
          this.replyContents = "";
          this.resolvedCase = "";
          this.relevantContents = {};
          this.activeNames = ['1','4'];
          this.responseContents = {};
        },
        onCopy: function (e) {
          this.$message({
                    message: '复制成功',
                    type: 'success'
                  });
        },
        onError: function (e) {
          console.log(e)
          this.$message.error('复制失败');
        },
        handleChange (val) {
          // console.log(val);
        },
        displaySearchResult (data) {
          this.issueDescription = data["issueDescription"];
          this.issueReason = data["issueReason"];
          this.checkThinking = data["checkThinking"];
          this.replyContents = data["replyContents"];
          this.relevantContents = data["relevantContents"];
          this.resolvedCase = data["resolvedCase"];
          var str= new String(); 
          str = data["relevantContents"];
          this.relevantContents = str.split(";");
          this.isDisplayInput = false;
          this.isDisplayResult = true;
          this.isDisplayResultList = false;
        },
        displaySearchResultList(){
          this.isDisplayInput = false;
          this.isDisplayResult = false;
          this.isDisplayResultList = true;
          this.activeNames = ['1','4'];
        },
        clickCell(row, column, cell, event) {
          for (var i=0; i<this.responseContents.length; i++) {
            var tempData = this.responseContents[i];
            if (row["issueDescription"] == tempData["issueDescription"]) {
              this.displaySearchResult(tempData)
              this.doReviewCount(tempData["issueDescription"])
              break;
            }
          }
        },
        tableHeaderColor({row,column,rowIndex,columnIndex}){
          return 'background-color:#87CEFA;color:#696969;font-wight:500;font-size:20px;text-align:center'
        },
        doReviewCount(issueDescription){
          var subResult = { "type":this.platform, "key":issueDescription};
          var api = "reviewCount";
          var that = this;
          httpManager.axiosPost(api, subResult, function (res) {
            if (res.status === 200) {
              if (res.data == "None") {
                that.$message.error('阅读数记录失败');
                return;
              }
            } 
          });
        },

      },
}
</script>

<style scoped>

.issueInputArea, .searchResultArea {
  margin-top: 40px;
  white-space: pre-wrap;
}

.issueInputTitle {

  margin-left: 5%;
  display: inline;
}

.issueInput {
  margin-left: 5%;
  width: 50%;
}

.submit {
  margin-top: 80px;
  margin-left: 45%;
}

.el-button+.el-button {
    margin-left: 5% !important; 
}

.btnGrp {
  width:100%;
  margin-left: 40%;
  margin-top: 80px;
}

.searchTitle {
  text-align: center;
}

.searchContent {
  margin-left: 5%;
}

.displayContent {
  white-space: pre-wrap;
  color: rgb(67, 156, 252);
  font-size:15px;
  font-weight:bold;
  margin-left: 3%;
}

.searchResultList {
  margin-top: 40px;
  margin-left: 10%;
}

.resetInList {
  margin-left: 40%;
  margin-top: 80px;
}

.hotSearchLine {
  margin-left: 8%;
  line-height:40px;
  cursor:pointer;
}

ul li:hover{
    color: #0C96FC;
}

</style>