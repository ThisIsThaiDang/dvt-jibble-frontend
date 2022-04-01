<template>
  <div class="home">
    <EmployeeRoot/>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import EmployeeRoot from '@/components/EmployeeRoot.vue';

export default defineComponent({
  name: 'HomeView',
  components: {
    EmployeeRoot,
  },
});
</script>
