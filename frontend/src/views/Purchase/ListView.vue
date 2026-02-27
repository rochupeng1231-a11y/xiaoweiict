<template>
  <div class="purchase-list">
    <el-page-header @back="goBack" title="返回">
      <template #content>
        <span class="text-large font-600">采购订单管理</span>
      </template>
    </el-page-header>

    <!-- 统计卡片 -->
    <el-row :gutter="16" class="stats-row">
      <el-col :xs="24" :sm="12" :md="6">
        <el-card shadow="hover">
          <el-statistic title="总订单数" :value="stats.totalOrders || 0" />
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="12" :md="6">
        <el-card shadow="hover">
          <el-statistic title="待确认" :value="stats.pendingOrders || 0" />
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="12" :md="6">
        <el-card shadow="hover">
          <el-statistic title="本月采购金额" :value="stats.thisMonthAmount || 0" :precision="2" prefix="¥" />
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="12" :md="6">
        <el-card shadow="hover">
          <el-statistic title="已完成" :value="stats.completedOrders || 0" />
        </el-card>
      </el-col>
    </el-row>

    <!-- 筛选栏 -->
    <el-card class="filter-card" shadow="never">
      <el-form :inline="true" :model="filters" class="filter-form">
        <el-form-item label="项目">
          <el-select v-model="filters.projectId" placeholder="全部项目" clearable style="width: 200px">
            <el-option v-for="project in projects" :key="project.id" :label="project.projectName" :value="project.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="供应商">
          <el-select v-model="filters.supplierId" placeholder="全部供应商" clearable style="width: 180px">
            <el-option v-for="supplier in suppliers" :key="supplier.id" :label="supplier.name" :value="supplier.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="filters.status" placeholder="全部状态" clearable style="width: 140px">
            <el-option v-for="(item, key) in purchaseStatusMap" :key="key" :label="item.text" :value="key" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="loadOrders" :icon="Search">查询</el-button>
          <el-button @click="resetFilters" :icon="RefreshLeft">重置</el-button>
        </el-form-item>
        <el-form-item style="float: right">
          <el-button type="primary" @click="openCreateDialog" :icon="Plus">新建采购单</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 采购单列表 -->
    <el-card shadow="never">
      <el-table v-loading="loading" :data="orders" stripe>
        <el-table-column prop="orderNo" label="采购单号" min-width="160" />
        <el-table-column prop="project.projectName" label="项目名称" min-width="180" />
        <el-table-column prop="supplier.name" label="供应商" min-width="160" />
        <el-table-column prop="totalAmount" label="采购金额" min-width="120" align="right">
          <template #default="{ row }">
            <span class="amount-text">¥{{ formatAmount(row.totalAmount) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="orderDate" label="下单日期" min-width="120">
          <template #default="{ row }">
            {{ formatDate(row.orderDate) }}
          </template>
        </el-table-column>
        <el-table-column prop="expectedDate" label="预计到货" min-width="120">
          <template #default="{ row }">
            {{ row.expectedDate ? formatDate(row.expectedDate) : '-' }}
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100" align="center">
          <template #default="{ row }">
            <el-tag :type="purchaseStatusMap[row.status]?.type || 'info'">
              {{ purchaseStatusMap[row.status]?.text || row.status }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" size="small" @click="viewOrder(row)">查看</el-button>
            <el-button link type="primary" size="small" @click="editOrder(row)" :disabled="row.status === 'completed' || row.status === 'cancelled'">编辑</el-button>
            <el-button link type="danger" size="small" @click="deleteOrder(row)" :disabled="row.status === 'completed'">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <el-pagination
        v-model:current-page="pagination.page"
        v-model:page-size="pagination.pageSize"
        :page-sizes="[10, 20, 50, 100]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="pagination.total"
        @size-change="loadOrders"
        @current-change="loadOrders"
      />
    </el-card>

    <!-- 新建/编辑对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="isEdit ? '编辑采购单' : '新建采购单'"
      width="900px"
      :close-on-click-modal="false"
      @close="resetForm"
    >
      <el-form ref="formRef" :model="formData" :rules="formRules" label-width="100px">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="项目" prop="projectId">
              <el-select v-model="formData.projectId" placeholder="请选择项目" style="width: 100%">
                <el-option v-for="project in projects" :key="project.id" :label="project.projectName" :value="project.id" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="供应商" prop="supplierId">
              <el-select v-model="formData.supplierId" placeholder="请选择供应商" style="width: 100%" filterable>
                <el-option v-for="supplier in suppliers" :key="supplier.id" :label="supplier.name" :value="supplier.id" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="预计到货日期" prop="expectedDate">
              <el-date-picker v-model="formData.expectedDate" type="date" placeholder="选择日期" style="width: 100%" value-format="YYYY-MM-DD" />
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 采购明细 -->
        <el-form-item label="采购明细">
          <el-button type="primary" size="small" @click="addItem" :icon="Plus">添加项目</el-button>
        </el-form-item>

        <el-table :data="formData.items" border style="margin-bottom: 20px">
          <el-table-column label="物料编码" min-width="140">
            <template #default="{ row, $index }">
              <el-input v-model="row.itemCode" placeholder="物料编码" size="small" />
            </template>
          </el-table-column>
          <el-table-column label="物料名称" min-width="150">
            <template #default="{ row }">
              <el-input v-model="row.itemName" placeholder="物料名称" size="small" />
            </template>
          </el-table-column>
          <el-table-column label="规格型号" min-width="120">
            <template #default="{ row }">
              <el-input v-model="row.specification" placeholder="规格型号" size="small" />
            </template>
          </el-table-column>
          <el-table-column label="单位" width="90">
            <template #default="{ row }">
              <el-input v-model="row.unit" placeholder="单位" size="small" />
            </template>
          </el-table-column>
          <el-table-column label="数量" width="110">
            <template #default="{ row }">
              <el-input-number v-model="row.quantity" :min="1" size="small" controls-position="right" style="width: 100%" @change="calculateSubtotal(row)" />
            </template>
          </el-table-column>
          <el-table-column label="单价" width="130">
            <template #default="{ row }">
              <el-input-number v-model="row.unitPrice" :min="0" :precision="2" size="small" controls-position="right" style="width: 100%" @change="calculateSubtotal(row)" />
            </template>
          </el-table-column>
          <el-table-column label="小计" width="120" align="right">
            <template #default="{ row }">
              <span class="amount-text">¥{{ formatAmount(row.subtotal) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="60" fixed="right">
            <template #default="{ $index }">
              <el-button link type="danger" size="small" @click="removeItem($index)" :icon="Delete" />
            </template>
          </el-table-column>
        </el-table>

        <!-- 合计金额 -->
        <div class="total-amount">
          <span class="label">采购金额合计：</span>
          <span class="value">¥{{ formatAmount(totalAmount) }}</span>
        </div>

        <el-form-item label="备注" prop="notes">
          <el-input v-model="formData.notes" type="textarea" :rows="3" placeholder="请输入备注" />
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitForm" :loading="submitting">确定</el-button>
      </template>
    </el-dialog>

    <!-- 查看详情对话框 -->
    <el-dialog v-model="detailVisible" title="采购单详情" width="800px">
      <el-descriptions v-if="currentOrder" :column="2" border>
        <el-descriptions-item label="采购单号">{{ currentOrder.orderNo }}</el-descriptions-item>
        <el-descriptions-item label="状态">
          <el-tag :type="purchaseStatusMap[currentOrder.status]?.type || 'info'">
            {{ purchaseStatusMap[currentOrder.status]?.text || currentOrder.status }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="项目名称">{{ currentOrder.project?.projectName }}</el-descriptions-item>
        <el-descriptions-item label="供应商">{{ currentOrder.supplier?.name }}</el-descriptions-item>
        <el-descriptions-item label="采购金额">¥{{ formatAmount(currentOrder.totalAmount) }}</el-descriptions-item>
        <el-descriptions-item label="下单日期">{{ formatDate(currentOrder.orderDate) }}</el-descriptions-item>
        <el-descriptions-item label="预计到货">
          {{ currentOrder.expectedDate ? formatDate(currentOrder.expectedDate) : '-' }}
        </el-descriptions-item>
        <el-descriptions-item label="创建时间">{{ formatDateTime(currentOrder.createdAt) }}</el-descriptions-item>
        <el-descriptions-item label="备注" :span="2">{{ currentOrder.notes || '-' }}</el-descriptions-item>
      </el-descriptions>

      <h4 style="margin: 20px 0 10px;">采购明细</h4>
      <el-table :data="currentOrder?.items" border>
        <el-table-column prop="itemCode" label="物料编码" min-width="140" />
        <el-table-column prop="itemName" label="物料名称" min-width="150" />
        <el-table-column prop="specification" label="规格型号" min-width="120" />
        <el-table-column prop="unit" label="单位" width="80" />
        <el-table-column prop="quantity" label="数量" width="90" align="right" />
        <el-table-column prop="unitPrice" label="单价" width="110" align="right">
          <template #default="{ row }">¥{{ formatAmount(row.unitPrice) }}</template>
        </el-table-column>
        <el-table-column prop="subtotal" label="小计" width="120" align="right">
          <template #default="{ row }">¥{{ formatAmount(row.subtotal) }}</template>
        </el-table-column>
      </el-table>

      <template #footer>
        <el-button type="primary" @click="detailVisible = false">关闭</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox, type FormInstance, type FormRules } from 'element-plus'
import { Search, RefreshLeft, Plus, Delete } from '@element-plus/icons-vue'
import { getPurchaseOrders, createPurchaseOrder, updatePurchaseOrder, deletePurchaseOrder, getPurchaseStats, purchaseStatusMap, type PurchaseOrder, type PurchaseOrderForm } from '@/api/purchase'
import { getProjects } from '@/api/project'
import { getSuppliers } from '@/api/supplier'
import dayjs from 'dayjs'

const router = useRouter()

// 数据
const loading = ref(false)
const orders = ref<PurchaseOrder[]>([])
const projects = ref<any[]>([])
const suppliers = ref<any[]>([])
const stats = ref({
  totalOrders: 0,
  pendingOrders: 0,
  thisMonthAmount: 0,
  completedOrders: 0
})

// 筛选
const filters = reactive({
  projectId: '',
  supplierId: '',
  status: ''
})

// 分页
const pagination = reactive({
  page: 1,
  pageSize: 20,
  total: 0
})

// 对话框
const dialogVisible = ref(false)
const detailVisible = ref(false)
const isEdit = ref(false)
const submitting = ref(false)
const formRef = ref<FormInstance>()
const currentOrder = ref<PurchaseOrder | null>(null)

// 表单数据
const formData = reactive<PurchaseOrderForm>({
  projectId: '',
  supplierId: '',
  expectedDate: '',
  notes: '',
  items: []
})

// 表单验证规则
const formRules: FormRules = {
  projectId: [{ required: true, message: '请选择项目', trigger: 'change' }],
  supplierId: [{ required: true, message: '请选择供应商', trigger: 'change' }],
  expectedDate: [{ required: true, message: '请选择预计到货日期', trigger: 'change' }]
}

// 计算合计金额
const totalAmount = computed(() => {
  return formData.items.reduce((sum, item) => sum + (item.subtotal || 0), 0)
})

// 加载数据
const loadOrders = async () => {
  loading.value = true
  try {
    const params: any = {
      page: pagination.page,
      pageSize: pagination.pageSize
    }
    if (filters.projectId) params.projectId = filters.projectId
    if (filters.supplierId) params.supplierId = filters.supplierId
    if (filters.status) params.status = filters.status

    const res = await getPurchaseOrders(params)
    orders.value = res.data?.data || []
    pagination.total = res.data?.pagination?.total || 0
  } catch (error: any) {
    ElMessage.error(error.message || '加载采购单失败')
  } finally {
    loading.value = false
  }
}

const loadProjects = async () => {
  try {
    const res = await getProjects({ page: 1, pageSize: 1000 })
    projects.value = res.data?.data || res.data || []
  } catch (error) {
    console.error('加载项目失败:', error)
  }
}

const loadSuppliers = async () => {
  try {
    const res = await getSuppliers({ page: 1, pageSize: 1000 })
    suppliers.value = res.data?.data || res.data || []
  } catch (error) {
    console.error('加载供应商失败:', error)
  }
}

const loadStats = async () => {
  try {
    const res = await getPurchaseStats()
    if (res.data?.success && res.data?.data) {
      stats.value = res.data.data
    }
  } catch (error) {
    console.error('加载统计数据失败:', error)
  }
}

// 重置筛选
const resetFilters = () => {
  filters.projectId = ''
  filters.supplierId = ''
  filters.status = ''
  pagination.page = 1
  loadOrders()
}

// 打开新建对话框
const openCreateDialog = () => {
  isEdit.value = false
  dialogVisible.value = true
  if (formData.items.length === 0) {
    addItem()
  }
}

// 查看详情
const viewOrder = (order: PurchaseOrder) => {
  currentOrder.value = order
  detailVisible.value = true
}

// 编辑订单
const editOrder = async (order: PurchaseOrder) => {
  isEdit.value = true
  currentOrder.value = order

  // 加载详情
  try {
    const res = await getPurchaseOrder(order.id)
    const detail = res.data.data

    formData.projectId = detail.projectId
    formData.supplierId = detail.supplierId
    formData.expectedDate = detail.expectedDate || ''
    formData.notes = detail.notes || ''
    formData.items = detail.items?.map((item: any) => ({
      itemCode: item.itemCode,
      itemName: item.itemName,
      specification: item.specification || '',
      unit: item.unit,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      notes: item.notes || '',
      subtotal: item.subtotal
    })) || []

    dialogVisible.value = true
  } catch (error: any) {
    ElMessage.error(error.message || '加载采购单详情失败')
  }
}

// 删除订单
const deleteOrder = async (order: PurchaseOrder) => {
  try {
    await ElMessageBox.confirm('确定要删除该采购单吗？', '提示', {
      type: 'warning'
    })
    await deletePurchaseOrder(order.id)
    ElMessage.success('删除成功')
    loadOrders()
    loadStats()
  } catch (error: any) {
    if (error !== 'cancel') {
      ElMessage.error(error.message || '删除失败')
    }
  }
}

// 添加明细项
const addItem = () => {
  formData.items.push({
    itemCode: '',
    itemName: '',
    specification: '',
    unit: '',
    quantity: 1,
    unitPrice: 0,
    notes: '',
    subtotal: 0
  })
}

// 移除明细项
const removeItem = (index: number) => {
  formData.items.splice(index, 1)
}

// 计算小计
const calculateSubtotal = (item: any) => {
  item.subtotal = (item.quantity || 0) * (item.unitPrice || 0)
}

// 重置表单
const resetForm = () => {
  formData.projectId = ''
  formData.supplierId = ''
  formData.expectedDate = ''
  formData.notes = ''
  formData.items = []
  formRef.value?.resetFields()
}

// 提交表单
const submitForm = async () => {
  if (!formRef.value) return

  // 验证明细
  if (formData.items.length === 0) {
    ElMessage.warning('请至少添加一项采购明细')
    return
  }

  const hasEmptyItem = formData.items.some(item => !item.itemCode || !item.itemName || !item.unit)
  if (hasEmptyItem) {
    ElMessage.warning('请完善采购明细信息')
    return
  }

  try {
    await formRef.value.validate()
    submitting.value = true

    const data = { ...formData, items: formData.items.map(item => ({ ...item, subtotal: item.quantity * item.unitPrice })) }

    if (isEdit.value && currentOrder.value) {
      await updatePurchaseOrder(currentOrder.value.id, data)
      ElMessage.success('更新成功')
    } else {
      await createPurchaseOrder(data)
      ElMessage.success('创建成功')
    }

    dialogVisible.value = false
    loadOrders()
    loadStats()
  } catch (error: any) {
    if (error !== false) {
      ElMessage.error(error.message || '操作失败')
    }
  } finally {
    submitting.value = false
  }
}

// 格式化金额
const formatAmount = (amount: number) => {
  return (amount || 0).toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

// 格式化日期
const formatDate = (date: string) => {
  return dayjs(date).format('YYYY-MM-DD')
}

// 格式化日期时间
const formatDateTime = (date: string) => {
  return dayjs(date).format('YYYY-MM-DD HH:mm')
}

// 返回
const goBack = () => {
  router.push('/')
}

onMounted(() => {
  loadOrders()
  loadProjects()
  loadSuppliers()
  loadStats()
})
</script>

<style scoped>
.purchase-list {
  padding: 20px;
}

.stats-row {
  margin: 20px 0;
}

.filter-card {
  margin-bottom: 20px;
}

.filter-form {
  margin-bottom: 0;
}

.amount-text {
  color: #f56c6c;
  font-weight: 600;
}

.total-amount {
  text-align: right;
  padding: 15px;
  background-color: #f5f7fa;
  border-radius: 4px;
  margin-bottom: 20px;
}

.total-amount .label {
  font-size: 14px;
  color: #606266;
}

.total-amount .value {
  font-size: 20px;
  font-weight: 600;
  color: #f56c6c;
  margin-left: 10px;
}

.text-large {
  font-size: 18px;
}

.font-600 {
  font-weight: 600;
}
</style>
