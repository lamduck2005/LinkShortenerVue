<script setup>
import LoadingSpinner from '@/components/common/LoadingSpinner.vue';
import router from '@/router';
import { showError, showToast } from '@/services/alert-service';
import authService from '@/services/auth-service';
import { onMounted } from 'vue';
import { useRoute } from 'vue-router';
const route = useRoute();

const failed = route.query.failed;

const handleFailed = () => {
    showToast('error', 'Đăng nhập thất bại, vui lòng thử lại.');
    router.push('/login');
    return;
}

const handleSuccess = () => {
    showToast('success', 'Đăng nhập thành công!');
    if (authService.isAdmin()) {
        router.push('/admin');
    } else {
        router.push('/');
    }
}

onMounted(() => {
    if (failed) {
        handleFailed();
        return;
    }

    const token = route.query.token;
    const userInfoStr = route.query.userInfo;

    if (!token || !userInfoStr) {
        handleFailed();
        return;
    }

    try {
        const userInfo = JSON.parse(decodeURIComponent(userInfoStr));
        authService.setToken(token, userInfo);
        handleSuccess();
    } catch (error) {
        console.error('Error parsing userInfo:', error);
        handleFailed();
    }
});

</script>

<template>
    <LoadingSpinner message="Đang xử lý đăng nhập..." :showText="true" />
</template>