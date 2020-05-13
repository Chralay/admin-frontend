<template>
  <div class="contain">
    <div class="head">
      <el-input v-model="input" placeholder="查询招聘者" class="input" />
      <el-button type="primary" icon="el-icon-search" @click="find">搜索</el-button>
    </div>
    <el-table v-loading="loading" :data="interviewers" stripe>
      <el-table-column type="index" width="50" />
      <el-table-column label="头像" width="100">
        <template slot-scope="scope">
          <!-- <img :src="scope.row.avatarUrl" alt height="50" /> -->
          <el-avatar :size="50" :src="scope.row.avatarUrl" />
        </template>
      </el-table-column>
      <el-table-column prop="nickName" label="姓名" />
      <el-table-column prop="gender" label="性别" />
      <el-table-column prop="company" label="所属公司" />
      <el-table-column prop="position" label="职位" />
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini" type="danger" @click="onDel(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 确认删除的对话框 -->
    <el-dialog title="提示" :visible.sync="delDialogVisible" width="30%">
      <span>确定删除该用户吗</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="delDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="doDel">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { fetchList, del, fetchByName } from '@/api/interviewer'
import scroll from '@/utils/scroll'
export default {
  data() {
    return {
      interviewers: [],
      count: 50,
      loading: false,
      input: '',
      // 删除应聘者的对话框是否显示
      delDialogVisible: false,
      info: {}
    }
  },
  created() {
    this.getList()
  },
  mounted() {
    scroll.start(this.getList)
  },
  methods: {
    getList() {
      this.loading = true
      fetchList({
        start: this.interviewers.length,
        count: this.count
      }).then(res => {
        console.log(res)
        var interviewers = res.data
        this.interviewers = this.interviewers.concat(this.filter(interviewers))
        if (interviewers.length < this.count) {
          scroll.end()
        }
        console.log(this.interviewers)
      })
      this.loading = false
    },
    // 对数据格式进行处理
    filter(interviewers) {
      for (let i = 0, len = interviewers.length; i < len; i++) {
        if (interviewers[i].gender === 1) {
          interviewers[i].gender = '男'
        } else {
          interviewers[i].gender = '女'
        }
      }
      return interviewers
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
          this.playlist = []
          this.getList()
          this.$message({
            message: '删除成功',
            type: 'success'
          })
        } else {
          this.$message.error('删除失败')
        }
      })
    },
    find() {
      this.loading = true
      var flag = true
      // 先在这里的数据组搜索，搜索不出来再调用云函数
      for (let i = 0, len = this.interviewers.length; i < len; i++) {
        if (this.interviewers[i].nickName === this.input) {
          this.interviewers = [].concat(this.interviewers[i])
          flag = false
          this.loading = false
          break
        }
      }
      if (flag) {
        // 去调用云函数
        fetchByName({
          nickName: this.input
        }).then((res) => {
          console.log(res)
          this.loading = false
          if (res.data.length === 0) {
            this.$message.error('不存在该招聘者')
          } else {
            this.interviewers = [].concat(this.filter(res.data))
          }
        })
      }
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
</style>
