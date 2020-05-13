<template>
  <div class="contain">
    <div class="head">
      <el-input v-model="input" placeholder="查询公司" class="input" />
      <el-button type="primary" icon="el-icon-search" @click="find">搜索</el-button>
    </div>
    <el-table v-loading="loading" :data="companys" stripe>
      <el-table-column type="index" width="50" />
      <el-table-column label="公司照片" width="100">
        <template slot-scope="scope">
          <el-avatar shape="square" :size="50" :src="scope.row.companyAvatar" />
        </template>
      </el-table-column>
      <el-table-column prop="companyName" label="公司名" />
      <el-table-column prop="isPass" label="审核进度">
        <template slot-scope="scope">
          <p v-if="scope.row.isPass === 1">已审核</p>
          <p v-else-if="scope.row.isPass === 2">不通过</p>
          <p v-else>待审核</p>
        </template>
      </el-table-column>
      <el-table-column prop="companySize" label="公司人数" />
      <el-table-column prop="companyType" label="公司类型" />
      <el-table-column prop="financingType" label="融资情况" />
      <el-table-column label="公司简介">
        <template slot-scope="scope">
          <el-popover placement="left" title="公司简介" width="250" trigger="hover">
            <slot>
              <div style="height:400px;">
                <el-scrollbar style="height:100%;" class="scroll">
                  <p>{{ scope.row.companyIntroduction }}</p>
                </el-scrollbar>
              </div>
            </slot>
            <el-button slot="reference">详情</el-button>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column label="公司主页" min-width="90%">
        <template slot-scope="scope">
          <el-link :href="scope.row.officeWeb" target="_blank">{{ scope.row.officeWeb }}</el-link>
        </template>
      </el-table-column>

      <el-table-column label="操作" min-width="100%">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="onPass(scope.row)">审核</el-button>
          <el-button size="mini" type="danger" @click="onDel(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 审核是否通过的对话框 -->
    <el-dialog title="提示" :visible.sync="passDialogVisible" width="30%">
      <span>审核是否通过</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="doPass(2)">拒绝</el-button>
        <el-button type="primary" @click="doPass(1)">同意</el-button>
      </span>
    </el-dialog>

    <!-- 确认删除的对话框 -->
    <el-dialog title="提示" :visible.sync="delDialogVisible" width="30%">
      <span>确定删除该公司吗</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="delDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="doDel">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { fetchList, del, fetchByName, updatePass } from '@/api/company'
import scroll from '@/utils/scroll'
export default {
  data() {
    return {
      companys: [],
      count: 50,
      loading: false,
      input: '',
      // 与审核相关的
      passDialogVisible: false,
      passInfo: {},
      // 删除应聘者的对话框是否显示
      delDialogVisible: false,
      info: {}
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.loading = true
      fetchList({
        start: this.companys.length,
        count: this.count
      }).then(res => {
        console.log(res)
        this.loading = false
        var companys = res.data
        this.companys = this.companys.concat(companys)
        if (companys.length < this.count) {
          scroll.end()
        }
      })
    },
    onPass(row) {
      this.passDialogVisible = true
      this.passInfo.id = row._id
      console.log(this.passInfo)
    },
    doPass(n) {
      // console.log(typeof n)// number
      console.log(this.passInfo.id)
      console.log(n)
      updatePass({
        id: this.passInfo.id,
        n: n
      }).then((res) => {
        console.log(res)
        console.log(res)
        console.log(res)
        this.passDialogVisible = false
        // if (res.data.modified > 0) {
        //   this.$message({
        //     message: '审核成功',
        //     type: 'success'
        //   })
        //   this.companys = []
        //   this.getList()
        // } else {
        //   this.$message.error('审核失败')
        // }
      })
    },
    onDel(row) {
      this.delDialogVisible = true
      this.info.id = row._id
      console.log(this.info)
    },
    doDel() {
      del({
        id: this.info.id
      }).then((res) => {
        this.delDialogVisible = false
        if (res.data.deleted > 0) {
          this.applicants = []
          this.getList()
          this.$message({
            message: '删除成功',
            type: 'success'
          })
        } else {
          this.$message.error('删除失败')
        }
      })
    }
    // 对数据格式进行处理
    // filter(applicants) {
    //   for (let i = 0, len = applicants.length; i < len; i++) {
    //     if (applicants[i].gender === 1) {
    //       applicants[i].gender = '男'
    //     } else {
    //       applicants[i].gender = '女'
    //     }
    //     if (applicants[i].applicantType === 0) {
    //       applicants[i].applicantType = '应届生'
    //     } else if (applicants[i].applicantType === 1) {
    //       applicants[i].applicantType = '在校生'
    //     } else if (applicants[i].applicantType === 2) {
    //       applicants[i].applicantType = '职场人'
    //     }
    //   }
    //   return applicants
    // }
  }
}
</script>

<style scoped>
.contain{
  width: 98%;
  margin:auto;
}
.head{
  margin-top: 15px;
  margin-bottom: 30px;
}
.input{
  width: 20%;
}
.scroll{
  overflow-y: hidden;
  overflow-x: hidden;
}
.scroll p{
    padding:0 15px 0 0;
}
</style>
