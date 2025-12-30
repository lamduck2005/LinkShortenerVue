<template>
  <div class="container mt-5">
    <div class="row">
      <div class="col-12">
        <UserInfoCard />
        <MySnippetsSection />
      </div>
    </div>
  </div>
</template>

<script setup>
import UserInfoCard from '@/components/features/user/UserInfoCard.vue';
import MySnippetsSection from '@/components/features/snippets/MySnippetsSection.vue';
</script>
