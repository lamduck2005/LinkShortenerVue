<template>
  <div class="mt-2">
    <div class="d-flex justify-content-between align-items-center mb-3">
      <h3 class="card-title mb-0">Tổng quan hệ thống</h3>
      <div class="d-flex align-items-center gap-2">
        <input
          v-model.number="days"
          type="number"
          min="1"
          class="form-control form-control-sm"
          style="width: 120px;"
          placeholder="Số ngày"
        />
        <button class="btn btn-outline-secondary btn-sm" type="button" @click="resetDays">
          Toàn thời gian
        </button>
        <button class="btn btn-primary btn-sm" type="button" @click="applyDays">
          Áp dụng
        </button>
      </div>
    </div>

    <LoadingSpinner v-if="isLoading" />

    <div v-else>
      <div class="row g-3 mb-3">
        <div class="col-md-4">
          <div class="card border-0 shadow-sm h-100">
            <div class="card-body">
              <h6 class="text-muted text-uppercase mb-1">Tổng người dùng</h6>
              <h3 class="mb-0">{{ dashboard?.totalUsers ?? 0 }}</h3>
            </div>
          </div>
        </div>
        <div class="col-md-4">
          <div class="card border-0 shadow-sm h-100">
            <div class="card-body">
              <h6 class="text-muted text-uppercase mb-1">Tổng liên kết được tạo</h6>
              <h3 class="mb-0">{{ dashboard?.totalSnippets ?? 0 }}</h3>
            </div>
          </div>
        </div>
        <div class="col-md-4">
          <div class="card border-0 shadow-sm h-100">
            <div class="card-body">
              <h6 class="text-muted text-uppercase mb-1">Tổng lượt truy cập liên kết</h6>
              <h3 class="mb-0">{{ dashboard?.totalClicks ?? 0 }}</h3>
            </div>
          </div>
        </div>
      </div>

      <div class="card mb-3">
        <div class="card-body">
          <div class="d-flex justify-content-between align-items-center mb-2">
            <h5 class="card-title mb-0">Thống kê theo khoảng thời gian</h5>
            <small class="text-muted">
              {{
                periodLabel
              }}
            </small>
          </div>
          <div class="row g-3">
            <div class="col-md-4">
              <div class="border rounded p-3 h-100">
                <div class="text-muted small mb-1">Người dùng mới</div>
                <div class="h4 mb-0">{{ dashboard?.periodStats?.newUsers ?? 0 }}</div>
              </div>
            </div>
            <div class="col-md-4">
              <div class="border rounded p-3 h-100">
                <div class="text-muted small mb-1">Liên kết mới</div>
                <div class="h4 mb-0">{{ dashboard?.periodStats?.newSnippets ?? 0 }}</div>
              </div>
            </div>
            <div class="col-md-4">
              <div class="border rounded p-3 h-100">
                <div class="text-muted small mb-1">Lượt truy cập liên kết</div>
                <div class="h4 mb-0">{{ dashboard?.periodStats?.clicks ?? 0 }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="card-body">
          <h5 class="card-title mb-3">Top 20 liên kết có lượt truy cập nhiều nhất</h5>
          <EmptyState v-if="!dashboard?.topSnippets || dashboard.topSnippets.length === 0" message="Không có dữ liệu liên kết trong khoảng này." />
          <div v-else class="table-responsive">
            <table class="table table-striped table-hover align-middle">
              <thead>
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">Short code</th>
                  <th scope="col">Short URL</th>
                  <th scope="col">Người tạo</th>
                  <th scope="col">Lượt truy cập liên kết</th>
                  <th scope="col">Ngày tạo</th>
                  <th scope="col">Hết hạn</th>
                  <th scope="col">Trạng thái</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, index) in dashboard.topSnippets" :key="item.id">
                  <td>{{ index + 1 }}</td>
                  <td>{{ item.shortCode }}</td>
                  <td>
                    <a :href="item.shortUrl" target="_blank" rel="noopener noreferrer">
                      {{ item.shortUrl }}
                    </a>
                  </td>
                  <td>
                    <div class="small">
                      <div><strong>{{ item.ownerUsername || 'Khách vãng lai' }}</strong></div>
                      <div class="text-muted" v-if="item.ownerEmail">{{ item.ownerEmail }}</div>
                    </div>
                  </td>
                  <td>{{ item.clicks }}</td>
                  <td>{{ formatInstant(item.createdAt) }}</td>
                  <td>{{ formatInstant(item.expiresAt) }}</td>
                  <td>
                    <StatusBadge type="expired" :status="!item.isExpired" />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import authService from '@/services/auth-service';
import adminDashboardService from '@/services/admin/admin-dashboard-service';
import { showError } from '@/services/alert-service';
import { formatInstant } from '@/others/utils';
import LoadingSpinner from '@/components/common/LoadingSpinner.vue';
import EmptyState from '@/components/common/EmptyState.vue';
import StatusBadge from '@/components/common/StatusBadge.vue';

const router = useRouter();

const isLoading = ref(false);
const days = ref(null);
const dashboard = ref(null);

const periodLabel = computed(() => {
  if (!dashboard.value || !dashboard.value.period) return 'Toàn bộ lịch sử';
  const period = dashboard.value.period;
  if (!period.days || !period.from || !period.to) {
    return 'Toàn bộ lịch sử';
  }
  return `Trong ${period.days} ngày gần nhất (${formatInstant(period.from)} → ${formatInstant(period.to)})`;
});

const loadData = async () => {
  if (!authService.isAuthenticated.value) {
    showError('Chưa đăng nhập', 'Vui lòng đăng nhập với tài khoản admin.');
    router.push('/login');
    return;
  }

  isLoading.value = true;

  const response = await adminDashboardService.getAdminDashboard(days.value);

  if (response.success) {
    dashboard.value = response.data;
  } else {
    showError(response.error.error || 'Lỗi', response.error.message);
  }

  isLoading.value = false;
};

const applyDays = () => {
  if (!days.value || Number(days.value) <= 0) {
    days.value = null;
  }
  loadData();
};

const resetDays = () => {
  days.value = null;
  loadData();
};

onMounted(loadData);
</script>
