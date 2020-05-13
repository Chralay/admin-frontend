<template>
  <div>
    <el-table v-loading="loading" :data="applicants" stripe>
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column label="头像" width="100">
        <template slot-scope="scope">
          <img :src="scope.row.basicInfo.avatarUrl" alt height="50" />
        </template>
      </el-table-column>
      <el-table-column prop="basicInfo.nickName" label="姓名"></el-table-column>
      <el-table-column prop="basicInfo.gender" label="性别"></el-table-column>
      <el-table-column prop="basicInfo.birthday" label="生日"></el-table-column>
      <el-table-column prop="basicInfo.eduLevel" label="学历"></el-table-column>
      <el-table-column prop="basicInfo.applicantType" label="身份"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini" type="danger" @click="onDel(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 确认删除的对话框 -->
    <!-- <el-dialog title="提示" :visible.sync="delDialogVisible" width="30%">
      <span>确定删除该歌单吗</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="delDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="doDel">确 定</el-button>
      </span>
    </el-dialog>-->
  </div>
</template>

<script>
import { fetchList } from '@/api/applicant'
import scroll from '@/utils/scroll'
export default {
  data() {
    return {
      applicants: [],
      count: 50,
      loading: false
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
        start: this.applicants.length,
        count: this.count
      }).then(res => {
        console.log(res)
        var applicants = res.data
        for (let i = 0, len = applicants.length; i < len; i++) {
          if (applicants[i].basicInfo.gender === 1) {
            applicants[i].basicInfo.gender = '男'
          } else {
            applicants[i].basicInfo.gender = '女'
          }
          if (applicants[i].basicInfo.applicantType === 0) {
            applicants[i].basicInfo.applicantType = '应届生'
          } else if (applicants[i].basicInfo.applicantType === 1) {
            applicants[i].basicInfo.applicantType = '在校生'
          } else if (applicants[i].basicInfo.applicantType === 2) {
            applicants[i].basicInfo.applicantType = '职场人'
          }
        }
        this.applicants = this.applicants.concat(applicants)
        if (applicants.length < this.count) {
          scroll.end()
        }
        // console.log(this.applicants)
      })
      this.loading = false
    },
    onDel(row) {
        
    }
  }
}
</script>

<style>
</style>
