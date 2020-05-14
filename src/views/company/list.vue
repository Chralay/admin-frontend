<template>
  <div class="contain">
    <el-row :gutter="20" class="head">
      <el-col :span="6">
        <el-input v-model="input" placeholder="查询公司" />
      </el-col>
      <el-col :span="2">
        <el-button type="primary" icon="el-icon-search" @click="find">搜索</el-button>
      </el-col>
    </el-row>
    <!-- jobList -->
    <el-table v-loading="loading" :data="companys" stripe @row-click="showJobList">
      <!-- @click="dialogFormVisible = true" -->
      <!-- <template slot-scope="scope">
      </template>-->
      <!-- <el-button type="text" @click="dialogTableVisible = true">打开嵌套表格的 Dialog</el-button> -->
      <el-table-column type="index" width="50" />
      <el-table-column label="公司照片" width="100">
        <template slot-scope="scope">
          <el-avatar shape="square" :size="50" :src="scope.row.companyAvatar" />
        </template>
      </el-table-column>
      <el-table-column prop="companyName" label="公司名" />
      <el-table-column prop="isPass" label="审核进度">
        <template slot-scope="scope">
          <p v-if="scope.row.isPass === 1" class="pass">已通过</p>
          <p v-else-if="scope.row.isPass === 2" class="noPass">不通过</p>
          <p v-else class="passing">待审核</p>
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
          <el-button
            size="mini"
            type="primary"
            @click.stop="showJobList"
            @click="onPass(scope.row)"
          >审核</el-button>
          <el-button
            size="mini"
            type="danger"
            @click.stop="showJobList"
            @click="onDelCompany(scope.row)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--v-if="pageshow" <el-pagination layout="prev, pager, next" :total="50" /> -->
    <el-pagination
      :current-page="page"
      :page-sizes="[10, 20, 50]"
      :page-size="limit"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
    <!-- 点击某一行，显示对应公司的所有职位 -->
    <el-dialog title="已发布的职位" :visible.sync="jobListTableVisible" width="60%">
      <el-table :data="jobList">
        <el-table-column property="jobName" label="职位名称" />
        <el-table-column property="isStop" label="招聘进度" width="100">
          <template slot-scope="scope">
            <p v-if="scope.row.isStop === true" class="isStop">已停止</p>
            <p v-else class="noStop">招聘中</p>
          </template>
        </el-table-column>
        <el-table-column label="职位详情">
          <template slot-scope="scope">
            <el-popover placement="left" title="职位" width="250" trigger="hover">
              <slot>
                <div style="height:400px;">
                  <el-scrollbar style="height:100%;" class="scroll">
                    <p>{{ scope.row.jobDetail }}</p>
                  </el-scrollbar>
                </div>
              </slot>
              <el-button slot="reference" size="mini">职位详情</el-button>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column property="workPlace" label="工作地址" />
        <el-table-column property="publisherName" label="发布人" width="80" />
        <el-table-column property="publisherPosition" label="发布人职位" width="110" />
        <el-table-column label="操作" min-width="100%">
          <template slot-scope="scope">
            <el-button size="mini" type="danger" @click="onDelJob(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>

    <!-- 审核是否通过的对话框 -->
    <el-dialog title="提示" :visible.sync="passDialogVisible" width="30%">
      <span>审核是否通过</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="doPass(2)">拒绝</el-button>
        <el-button type="primary" @click="doPass(1)">同意</el-button>
      </span>
    </el-dialog>

    <!-- 确认删除公司的对话框 -->
    <el-dialog title="提示" :visible.sync="delDialogVisible" width="30%">
      <span>确定删除该公司吗</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="delDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="doDelCompany">确定</el-button>
      </span>
    </el-dialog>

    <!-- 确认删除职位的对话框 -->
    <el-dialog title="提示" :visible.sync="delJobDialogVisible" width="30%">
      <span>确定删除该职位吗</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="delJobDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="doDelJob">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { fetchList, del, fetchByName, updatePass, fetchJobsByName } from '@/api/company'
// import scroll from '@/utils/scroll'
export default {
  data() {
    return {
      data: [],
      limit: 10,
      total: null,
      page: 1,
      hasData: true,
      // 下面是原先的
      companys: [],
      count: 30,
      loading: false,
      input: '',
      // 与审核相关的
      passDialogVisible: false,
      passInfo: {},
      // 删除公司的对话框是否显示
      delDialogVisible: false,
      info: {},
      // 与公司相对应的职位
      jobList: [],
      jobListTableVisible: false,
      delJobDialogVisible: false,
      jobInfo: {}
    }
  },
  created() {
    this.pageList()
  },
  methods: {
    async pageList() {
    // 发请求拿到数据并暂存全部数据,方便之后操作
      this.loading = true
      await fetchList({
        start: this.total ? this.total : this.companys.length, // this.total用于再次查询数据库时从哪个数据开始查起
        count: this.count
      }).then(res => {
        this.loading = false
        if (res.data.length === 0) {
          // console.log('云数据库也没有数据了')
          this.hasData = false
          return
        } else {
          this.data = this.data.concat(...res.data)
        }
      })
      this.getList()
    },
    getList() {
      this.companys = this.data.filter((item, index) =>
        index < this.page * this.limit && index >= this.limit * (this.page - 1)
      )
      this.total = this.data.length
      // console.log('limit:' + this.limit)
      // console.log('length:' + this.companys.length)
      const max_page = Math.ceil(this.total / this.limit)
      // 当处于最后一页，并且limit == companys.length，就要去数据库看看还有没有数据
      if (this.page === max_page && this.companys.length === this.limit) {
        if (this.hasData) {
          // console.log('需要再去向数据库获取数据了')
          this.pageList()
        } else {
          // console.log('数据库没数据了，暂停请求')
          this.$message({
            message: '数据已全部列出',
            type: 'success'
          })
        }
      } else if (this.companys.length < this.limit) {
        this.$message({
          message: '数据已全部列出',
          type: 'success'
        })
      }
    },
    // 每页数量改变
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`)
      this.limit = val
      this.getList()
    },
    // 当前页改变
    handleCurrentChange(val) {
      console.log(`当前页： ${val}`)
      this.page = val
      this.getList()
    },
    onPass(row) {
      this.passDialogVisible = true
      this.passInfo.id = row._id
      console.log(this.passInfo)
    },
    doPass(n) {
      console.log(this.passInfo.id)
      console.log(n)
      updatePass({
        id: this.passInfo.id,
        n: n
      }).then((res) => {
        // console.log(res)
        this.passDialogVisible = false
        if (res.data.modified > 0) {
          this.$message({
            message: '审核成功',
            type: 'success'
          })
          this.companys = []
          this.pageList()
        } else {
          this.$message.error('审核失败')
        }
      })
    },
    onDelCompany(row) {
      this.delDialogVisible = true
      this.info.id = row._id
      console.log(this.info)
    },
    doDelCompany() {
      del({
        id: this.info.id
      }).then((res) => {
        this.delDialogVisible = false
        if (res.data.deleted > 0) {
          this.companys = []
          this.pageList()
          this.$message({
            message: '删除成功',
            type: 'success'
          })
        } else {
          this.$message.error('删除失败')
        }
      })
    },
    onDelJob(row) {
      this.delJobDialogVisible = true
      this.jobInfo.id = row.jobId
      // console.log(this.jobInfo)//ok
    },
    doDelJob() {
      
    },
    // 查找公司名
    find() {
      this.loading = true
      var flag = true
      // 先在这里的数据组搜索，搜索不出来再调用云函数
      for (let i = 0, len = this.companys.length; i < len; i++) {
        if (this.companys[i].companyName === this.input) {
          this.companys = [].concat(this.companys[i])
          flag = false
          this.loading = false
          break
        }
      }
      if (flag) {
        // 去调用云函数
        fetchByName({
          companyName: this.input
        }).then((res) => {
          this.loading = false
          if (res.data.length === 0) {
            this.$message.error('不存在该公司')
          } else {
            this.companys = [].concat(...res.data)
          }
        })
      }
    },
    showJobList(row) {
      // console.log(row)
      this.jobListTableVisible = true
      fetchJobsByName({
        companyName: row.companyName
      }).then((res) => {
        this.jobList = res.data
        console.log(this.jobList)
      })
    }
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
.pass, .noStop{
  background-color: #67C23A;
  color: white;
  width:70%;
  text-align: center;
  border-radius: 3px;
  padding:2px 5px;
}
.noPass{
  background-color: #E6A23C;
  color: white;
  width:70%;
  text-align: center;
  border-radius: 3px;
  padding:2px 5px;
}
.passing{
  background-color: #409EFF;
  color: white;
  width:70%;
  text-align: center;
  border-radius: 3px;
  padding:2px 5px;
}
.isStop{
  background-color: #F56C6C;
  color: white;
  width:70%;
  text-align: center;
  border-radius: 3px;
  padding:2px 5px;
}
</style>
