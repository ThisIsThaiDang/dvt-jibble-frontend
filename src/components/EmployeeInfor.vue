<template>
  <div class="employee-infor">
    <span>
      Number of employees: {{ totalEmployee }}.
    </span>
    <EmployeePaging />
    <EmployeeUploadButton />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';
import EmployeePaging from '@/components/EmployeePaging.vue';
import EmployeeUploadButton from '@/components/EmployeeUploadButton.vue';
import { useEmployeeStore } from '@/stores/employee-store';

export default defineComponent({
  name: 'EmployeeCount',
  components: {
    EmployeePaging,
    EmployeeUploadButton,
  },
  setup() {
    const employeeStore = useEmployeeStore();
    const totalEmployee = computed(() => employeeStore.totalEmployee);
    return {
      totalEmployee,
    };
  },
});

</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.employee-infor {
  margin-top: 10px;
  margin-bottom: 10px;
  text-align: left;
}
</style>
