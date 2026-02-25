<template>
  <div class="supplier-list">
    <div class="page-header">
      <h2>供应商管理</h2>
      <el-button type="primary" @click="showCreateDialog">
        <el-icon><Plus /></el-icon>
        新建供应商
      </el-button>
    </div>

    <!-- 搜索栏 -->
    <el-card class="filter-card">
      <el-form inline>
        <el-form-item label="供应商名称">
          <el-input
            v-model="searchName"
            placeholder="输入供应商名称搜索"
            clearable
            style="width: 250px"
            @clear="loadSuppliers"
          >
            <template #append>
              <el-button icon="Search" @click="loadSuppliers" />
            </template>
          </el-input>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 供应商列表 -->
    <el-card>
      <el-table :data="suppliers" v-loading="loading" stripe>
        <el-table-column prop="name" label="供应商名称" width="200" />
        <el-table-column prop="contactPerson" label="联系人" width="120" />
        <el-table-column prop="contactPhone" label="联系电话" width="140" />
        <el-table-column prop="email" label="邮箱" width="200" />
        <el-table-column prop="address" label="地址" show-overflow-tooltip />
        <el-table-column prop="bankAccount" label="银行账号" width="180" />
        <el-table-column label="操作" width="180" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" size="small" @click="viewSupplier(row)">查看</el-button>
            <el-button link type="primary" size="small" @click="editSupplier(row)">编辑</el-button>
            <el-popconfirm title="确定删除该供应商吗？" @confirm="deleteSupplier(row.id)">
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
        layout="total, sizes, prev, pager, next"
        @current-change="loadSuppliers"
        @size-change="loadSuppliers"
        style="margin-top: 20px; justify-content: flex-end"
      />
    </el-card>

    <!-- 创建/编辑对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="isEdit ? '编辑供应商' : '新建供应商'"
      width="600px"
    >
      <el-form :model="form" :rules="rules" ref="formRef" label-width="100px">
        <el-form-item label="供应商名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入供应商名称" />
        </el-form-item>
        <el-form-item label="联系人" prop="contactPerson">
          <el-input v-model="form.contactPerson" placeholder="请输入联系人姓名" />
        </el-form-item>
        <el-form-item label="联系电话" prop="contactPhone">
          <el-input v-model="form.contactPhone" placeholder="请输入联系电话" />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="form.email" placeholder="请输入邮箱地址" />
        </el-form-item>
        <el-form-item label="地址" prop="address">
          <el-input v-model="form.address" placeholder="请输入地址" />
        </el-form-item>
        <el-form-item label="银行账号" prop="bankAccount">
          <el-input v-model="form.bankAccount" placeholder="请输入银行账号" />
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
import { getSuppliers, createSupplier, updateSupplier, deleteSupplier } from '@/api'

const loading = ref(false)
const submitting = ref(false)
const dialogVisible = ref(false)
const isEdit = ref(false)
const formRef = ref<FormInstance>()
const searchName = ref('')

const suppliers = ref<any[]>([])

const pagination = reactive({
  page: 1,
  pageSize: 20,
  total: 0
})

const form = reactive({
  id: '',
  name: '',
  contactPerson: '',
  contactPhone: '',
  email: '',
  address: '',
  bankAccount: ''
})

const rules: FormRules = {
  name: [{ required: true, message: '请输入供应商名称', trigger: 'blur' }]
}

const loadSuppliers = async () => {
  loading.value = true
  try {
    const res = await getSuppliers({
      name: searchName.value,
      page: pagination.page,
      pageSize: pagination.pageSize
    })
    suppliers.value = res.data
    pagination.total = res.pagination.total
  } catch (error) {
    ElMessage.error('加载供应商列表失败')
  } finally {
    loading.value = false
  }
}

const showCreateDialog = () => {
  isEdit.value = false
  Object.assign(form, {
    id: '',
    name: '',
    contactPerson: '',
    contactPhone: '',
    email: '',
    address: '',
    bankAccount: ''
  })
  dialogVisible.value = true
}

const viewSupplier = (supplier: any) => {
  ElMessage.info('查看详情功能开发中')
}

const editSupplier = (supplier: any) => {
  isEdit.value = true
  Object.assign(form, supplier)
  dialogVisible.value = true
}

const deleteSupplier = async (id: string) => {
  try {
    await deleteSupplier(id)
    ElMessage.success('删除成功')
    loadSuppliers()
  } catch (error: any) {
    ElMessage.error(error?.response?.data?.error || '删除失败')
  }
}

const handleSubmit = async () => {
  if (!formRef.value) return
  await formRef.value.validate(async (valid) => {
    if (!valid) return
    submitting.value = true
    try {
      if (isEdit.value) {
        await updateSupplier(form.id, form)
        ElMessage.success('更新成功')
      } else {
        await createSupplier(form)
        ElMessage.success('创建成功')
      }
      dialogVisible.value = false
      loadSuppliers()
    } catch (error: any) {
      ElMessage.error(error?.response?.data?.error || (isEdit.value ? '更新失败' : '创建失败'))
    } finally {
      submitting.value = false
    }
  })
}

onMounted(() => {
  loadSuppliers()
})
</script>

<style scoped>
.supplier-list {
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
</style>
