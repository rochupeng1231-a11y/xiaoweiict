<template>
  <div class="financial-list">
    <div class="page-header">
      <h2>财务记录</h2>
      <el-button type="primary" @click="showCreateDialog">
        <el-icon><Plus /></el-icon>
        新建记录
      </el-button>
    </div>

    <!-- 筛选栏 -->
    <el-card class="filter-card">
      <el-form :model="filters" inline>
        <el-form-item label="项目">
          <el-select v-model="filters.projectId" placeholder="全部" clearable style="width: 200px">
            <el-option
              v-for="project in projects"
              :key="project.id"
              :label="project.projectName"
              :value="project.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="记录类型">
          <el-select v-model="filters.recordType" placeholder="全部" clearable style="width: 120px">
            <el-option label="收入" value="income" />
            <el-option label="支出" value="expense" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="filters.status" placeholder="全部" clearable style="width: 120px">
            <el-option label="待确认" value="pending" />
            <el-option label="已确认" value="confirmed" />
            <el-option label="已取消" value="cancelled" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="loadRecords">查询</el-button>
          <el-button @click="resetFilters">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 财务统计卡片 -->
    <el-row :gutter="20" class="stats-row">
      <el-col :span="6">
        <el-card class="stat-card">
          <div class="stat-label">总收入</div>
          <div class="stat-value income">¥{{ stats.totalIncome.toLocaleString() }}</div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="stat-card">
          <div class="stat-label">总支出</div>
          <div class="stat-value expense">¥{{ stats.totalExpense.toLocaleString() }}</div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="stat-card">
          <div class="stat-label">利润</div>
          <div class="stat-value" :class="stats.profit >= 0 ? 'income' : 'expense'">
            ¥{{ stats.profit.toLocaleString() }}
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="stat-card">
          <div class="stat-label">利润率</div>
          <div class="stat-value">{{ stats.profitMargin }}%</div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 记录列表 -->
    <el-card>
      <el-table :data="records" v-loading="loading" stripe>
        <el-table-column prop="transactionDate" label="日期" width="120" />
        <el-table-column prop="project.projectName" label="项目" width="200" />
        <el-table-column label="类型" width="80">
          <template #default="{ row }">
            <el-tag :type="row.recordType === 'income' ? 'success' : 'danger'">
              {{ row.recordType === 'income' ? '收入' : '支出' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="description" label="描述" />
        <el-table-column label="金额" width="120" align="right">
          <template #default="{ row }">
            <span :class="row.recordType === 'income' ? 'text-income' : 'text-expense'">
              {{ row.recordType === 'income' ? '+' : '-' }}¥{{ row.amount.toLocaleString() }}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)">
              {{ getStatusText(row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" size="small" @click="viewRecord(row)">查看</el-button>
            <el-button link type="primary" size="small" @click="editRecord(row)">编辑</el-button>
            <el-popconfirm title="确定删除这条记录吗？" @confirm="deleteRecord(row.id)">
              <template #reference>
                <el-button link type="danger" size="small">删除</el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        v-model:current-page="pagination.page"
        v-model:page-size="pagination.pageSize"
        :total="pagination.total"
        :page-sizes="[10, 20, 50, 100]"
        layout="total, sizes, prev, pager, next, jumper"
        @current-change="loadRecords"
        @size-change="loadRecords"
        style="margin-top: 20px; justify-content: flex-end"
      />
    </el-card>

    <!-- 创建/编辑对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="isEdit ? '编辑财务记录' : '新建财务记录'"
      width="600px"
    >
      <el-form :model="form" :rules="rules" ref="formRef" label-width="100px">
        <el-form-item label="记录类型" prop="recordType">
          <el-radio-group v-model="form.recordType">
            <el-radio value="income">收入</el-radio>
            <el-radio value="expense">支出</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="项目" prop="projectId">
          <el-select v-model="form.projectId" placeholder="请选择项目" style="width: 100%">
            <el-option
              v-for="project in projects"
              :key="project.id"
              :label="project.projectName"
              :value="project.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="金额" prop="amount">
          <el-input-number v-model="form.amount" :min="0" :precision="2" style="width: 100%" />
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input v-model="form.description" placeholder="请输入描述" />
        </el-form-item>
        <el-form-item label="交易日期" prop="transactionDate">
          <el-date-picker
            v-model="form.transactionDate"
            type="date"
            placeholder="选择日期"
            value-format="YYYY-MM-DD"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="form.status" placeholder="请选择状态" style="width: 100%">
            <el-option label="待确认" value="pending" />
            <el-option label="已确认" value="confirmed" />
            <el-option label="已取消" value="cancelled" />
          </el-select>
        </el-form-item>
        <el-form-item v-if="form.recordType === 'expense'" label="成本分类" prop="costCategory">
          <el-select v-model="form.costCategory" placeholder="请选择成本分类" style="width: 100%">
            <el-option label="材料成本" value="material" />
            <el-option label="人工成本" value="labor" />
            <el-option label="设备成本" value="equipment" />
            <el-option label="运输成本" value="transport" />
            <el-option label="外包成本" value="subcontract" />
            <el-option label="其他成本" value="other" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit" :loading="submitting">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import { getFinancialRecords, createFinancialRecord, updateFinancialRecord, deleteFinancialRecord, getAllFinancialStats } from '@/api'
import { getProjects } from '@/api'

const loading = ref(false)
const submitting = ref(false)
const dialogVisible = ref(false)
const isEdit = ref(false)
const formRef = ref<FormInstance>()

const records = ref<any[]>([])
const projects = ref<any[]>([])
const stats = ref({ totalIncome: 0, totalExpense: 0, profit: 0, profitMargin: 0 })

const filters = reactive({
  projectId: '',
  recordType: '',
  status: ''
})

const pagination = reactive({
  page: 1,
  pageSize: 20,
  total: 0
})

const form = reactive({
  id: '',
  projectId: '',
  recordType: 'income',
  amount: 0,
  description: '',
  transactionDate: '',
  status: 'pending',
  costCategory: ''
})

const rules: FormRules = {
  projectId: [{ required: true, message: '请选择项目', trigger: 'change' }],
  recordType: [{ required: true, message: '请选择记录类型', trigger: 'change' }],
  amount: [{ required: true, message: '请输入金额', trigger: 'blur' }],
  description: [{ required: true, message: '请输入描述', trigger: 'blur' }],
  transactionDate: [{ required: true, message: '请选择日期', trigger: 'change' }]
}

const loadRecords = async () => {
  loading.value = true
  try {
    // 构建查询参数，只包含有值的字段
    const params: any = {
      page: pagination.page,
      pageSize: pagination.pageSize
    }
    if (filters.projectId) params.projectId = filters.projectId
    if (filters.recordType) params.recordType = filters.recordType
    if (filters.status) params.status = filters.status

    const res = await getFinancialRecords(params)
    records.value = res.data || []
    pagination.total = res.pagination?.total || 0
  } catch (error: any) {
    console.error('加载财务记录失败:', error)
    ElMessage.error(error?.response?.data?.error || '加载财务记录失败')
  } finally {
    loading.value = false
  }
}

const loadProjects = async () => {
  try {
    const res = await getProjects({ page: 1, pageSize: 1000 })
    // 项目API返回的是 { data: { data: [...], total: ... } }
    projects.value = res.data?.data || res.data || []
    console.log('加载到的项目数量:', projects.value.length)
  } catch (error: any) {
    console.error('加载项目列表失败:', error)
    ElMessage.error(error?.response?.data?.error || '加载项目列表失败')
  }
}

const loadStats = async () => {
  try {
    const res = await getAllFinancialStats()
    const data = res.data || []
    const totalStats = data.reduce((acc: any, project: any) => ({
      totalIncome: acc.totalIncome + (project.totalIncome || 0),
      totalExpense: acc.totalExpense + (project.totalExpense || 0),
      profit: acc.profit + (project.profit || 0)
    }), { totalIncome: 0, totalExpense: 0, profit: 0 })

    stats.value = {
      ...totalStats,
      profitMargin: totalStats.totalIncome > 0
        ? Math.round((totalStats.profit / totalStats.totalIncome) * 100)
        : 0
    }
  } catch (error: any) {
    console.error('加载统计失败:', error)
  }
}

const showCreateDialog = () => {
  isEdit.value = false
  Object.assign(form, {
    id: '',
    projectId: '',
    recordType: 'income',
    amount: 0,
    description: '',
    transactionDate: new Date().toISOString().split('T')[0],
    status: 'pending',
    costCategory: ''
  })
  dialogVisible.value = true
}

const viewRecord = (record: any) => {
  ElMessage.info('查看功能开发中')
}

const editRecord = (record: any) => {
  isEdit.value = true
  Object.assign(form, {
    ...record,
    transactionDate: record.transactionDate?.split('T')[0] || ''
  })
  dialogVisible.value = true
}

const deleteRecord = async (id: string) => {
  try {
    await deleteFinancialRecord(id)
    ElMessage.success('删除成功')
    loadRecords()
    loadStats()
  } catch (error) {
    ElMessage.error('删除失败')
  }
}

const handleSubmit = async () => {
  if (!formRef.value) return
  await formRef.value.validate(async (valid) => {
    if (!valid) return
    submitting.value = true
    try {
      if (isEdit.value) {
        await updateFinancialRecord(form.id, form)
        ElMessage.success('更新成功')
      } else {
        await createFinancialRecord(form)
        ElMessage.success('创建成功')
      }
      dialogVisible.value = false
      loadRecords()
      loadStats()
    } catch (error) {
      ElMessage.error(isEdit.value ? '更新失败' : '创建失败')
    } finally {
      submitting.value = false
    }
  })
}

const resetFilters = () => {
  Object.assign(filters, {
    projectId: '',
    recordType: '',
    status: ''
  })
  loadRecords()
}

const getStatusType = (status: string) => {
  const map: any = { pending: 'warning', confirmed: 'success', cancelled: 'info' }
  return map[status] || ''
}

const getStatusText = (status: string) => {
  const map: any = { pending: '待确认', confirmed: '已确认', cancelled: '已取消' }
  return map[status] || status
}

onMounted(async () => {
  console.log('=== 财务页面已加载 ===')
  try {
    await loadProjects()
    console.log('项目加载完成')
  } catch (e) {
    console.error('项目加载失败:', e)
  }
  try {
    await loadRecords()
    console.log('记录加载完成')
  } catch (e) {
    console.error('记录加载失败:', e)
  }
  try {
    await loadStats()
    console.log('统计加载完成')
  } catch (e) {
    console.error('统计加载失败:', e)
  }
})
</script>

<style scoped>
.financial-list {
  padding: 20px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.filter-card {
  margin-bottom: 20px;
}

.stats-row {
  margin-bottom: 20px;
}

.stat-card {
  text-align: center;
}

.stat-label {
  font-size: 14px;
  color: #666;
  margin-bottom: 10px;
}

.stat-value {
  font-size: 24px;
  font-weight: bold;
}

.stat-value.income {
  color: #67c23a;
}

.stat-value.expense {
  color: #f56c6c;
}

.text-income {
  color: #67c23a;
}

.text-expense {
  color: #f56c6c;
}
</style>
