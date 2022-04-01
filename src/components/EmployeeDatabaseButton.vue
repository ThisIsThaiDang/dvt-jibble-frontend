<template>
  <button :disabled="disabled" @click="fetchEmployees">Database Mode</button>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';
import { useEmployeeStore } from '@/stores/employee-store';

export default defineComponent({
  name: 'EmployeeDatabaseButton',
  setup() {
    const employeeStore = useEmployeeStore();
    const disabled = computed(() => employeeStore.disableStatus);
    const fetchEmployees = async () => {
      await employeeStore.FetchEmployees();
    };
    return {
      fetchEmployees,
      disabled,
    };
  },
});
</script>

<style scoped lang="scss">
button {
  float: left;
}
</style>
