<template>
  <div
    class="modal fade"
    :id="modalId"
    tabindex="-1"
    aria-labelledby="snippetClicksModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-xl">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="snippetClicksModalLabel">
            Chi tiết lượt click - Snippet #{{ snippetId }}
          </h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <LoadingSpinner v-if="isLoading" message="Đang tải..." />
          <EmptyState v-else-if="clicks.length === 0" message="Không có lượt click nào." />
          <div v-else class="table-responsive">
            <table class="table table-striped table-hover align-middle">
              <thead>
                <tr>
                  <th scope="col">ID</th>
                  <th scope="col">Thời gian click</th>
                  <th scope="col">IP Address</th>
                  <th scope="col">User Agent</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="click in clicks" :key="click.id">
                  <td>{{ click.id }}</td>
                  <td>{{ formatInstant(click.clickTime) }}</td>
                  <td>{{ click.ipAddress }}</td>
                  <td>
                    <span class="text-truncate d-inline-block" style="max-width: 400px;" :title="click.userAgent">
                      {{ click.userAgent }}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
            Đóng
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import snippetService from '@/services/snippet-service';
import { showError } from '@/services/alert-service';
import { formatInstant } from '@/others/utils';
import LoadingSpinner from '@/components/common/LoadingSpinner.vue';
import EmptyState from '@/components/common/EmptyState.vue';

const props = defineProps({
  modalId: {
    type: String,
    default: 'snippetClicksModal'
  },
  snippetId: {
    type: [Number, String],
    required: true
  }
});

const isLoading = ref(false);
const clicks = ref([]);

const loadClicks = async () => {
  if (!props.snippetId) return;
  
  isLoading.value = true;
  clicks.value = [];
  
  const response = await snippetService.getSnippetClicks(props.snippetId);
  
  if (response.success) {
    clicks.value = response.data || [];
  } else {
    showError(response.error.error || 'Lỗi', response.error.message);
  }
  
  isLoading.value = false;
};

watch(() => props.snippetId, (newId, oldId) => {
  if (newId && newId !== oldId) {
    loadClicks();
  }
});

defineExpose({
  loadClicks
});
</script>

