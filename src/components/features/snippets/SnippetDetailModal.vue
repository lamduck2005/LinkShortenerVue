<template>
  <div
    class="modal fade"
    :id="modalId"
    tabindex="-1"
    aria-labelledby="snippetDetailModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-lg">
      <div class="modal-content" v-if="snippet">
        <div class="modal-header">
          <h5 class="modal-title" id="snippetDetailModalLabel">
            Chi tiết snippet #{{ snippet.id }}
            <span v-if="snippet.shortCode"> - {{ snippet.shortCode }}</span>
          </h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <table class="table table-borderless align-middle mb-0">
            <tbody>
              <tr>
                <th style="width: 160px;" class="text-muted fw-semibold">Short URL</th>
                <td>
                  <a :href="snippet.shortUrl" target="_blank" rel="noopener noreferrer">
                    {{ snippet.shortUrl }}
                  </a>
                </td>
                <td>
                  <CopyButton :text="snippet.shortUrl" size="sm" title="Copy Short URL" />
                </td>
              </tr>
              <tr>
                <th class="text-muted fw-semibold">Loại</th>
                <td>{{ snippet.contentType }}</td>
                <td></td>
              </tr>
              <tr>
                <th class="text-muted fw-semibold">Mật khẩu</th>
                <td>
                  <StatusBadge type="password" :status="snippet.hasPassword" />
                </td>
                <td></td>
              </tr>
              <tr v-if="showOwner && snippet.ownerUsername">
                <th class="text-muted fw-semibold">Người tạo</th>
                <td>
                  <div><strong>{{ snippet.ownerUsername }}</strong></div>
                  <div v-if="snippet.ownerEmail" class="text-muted">{{ snippet.ownerEmail }}</div>
                </td>
                <td></td>
              </tr>
              <tr>
                <th class="text-muted fw-semibold">Ngày tạo</th>
                <td>{{ formatInstant(snippet.createdAt) }}</td>
                <td></td>
              </tr>
              <tr>
                <th class="text-muted fw-semibold">Hết hạn</th>
                <td>{{ formatInstant(snippet.expiresAt) }}</td>
                <td></td>
              </tr>
              <tr v-if="showStatus">
                <th class="text-muted fw-semibold">Trạng thái</th>
                <td>
                  <StatusBadge type="expired" :status="!snippet.isExpired" />
                </td>
                <td></td>
              </tr>
              <tr>
                <th class="text-muted fw-semibold">Lượt click</th>
                <td>{{ snippet.clickCount }}</td>
                <td>
                  <button
                    type="button"
                    class="btn btn-sm btn-outline-primary"
                    data-bs-toggle="modal"
                    :data-bs-target="`#${clicksModalId}`"
                    @click="$emit('show-clicks', snippet.id)"
                    title="Xem chi tiết clicks"
                  >
                    Chi tiết
                  </button>
                </td>
              </tr>
              <tr>
                <th class="text-muted fw-semibold align-top">Nội dung</th>
                <td>
                  <pre class="p-2 border rounded small mb-0" style="white-space:pre-wrap;">{{ contentText }}</pre>
                </td>
                <td>
                  <CopyButton :text="contentText" size="sm" title="Copy nội dung" />
                </td>
              </tr>
            </tbody>
          </table>
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
import { computed } from 'vue';
import { formatInstant } from '@/others/utils';
import CopyButton from '@/components/common/CopyButton.vue';
import StatusBadge from '@/components/common/StatusBadge.vue';

const props = defineProps({
  modalId: {
    type: String,
    default: 'snippetDetailModal'
  },
  clicksModalId: {
    type: String,
    default: 'snippetClicksModal'
  },
  snippet: {
    type: Object,
    default: null
  },
  showOwner: {
    type: Boolean,
    default: false
  },
  showStatus: {
    type: Boolean,
    default: false
  }
});

const contentText = computed(() => {
  if (!props.snippet) return '';
  return props.snippet.contentData || props.snippet.originalContent || '';
});

defineEmits(['show-clicks']);
</script>

