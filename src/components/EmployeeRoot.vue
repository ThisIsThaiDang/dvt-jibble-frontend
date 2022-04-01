<template>
  <h3>You are in {{csvMode ? `CSV MODE ${csvFileName}` : "DATABASE MODE"}}</h3>
  <div class="employee-function">
    <EmployeeDatabaseButton />
    <EmployeeReadCsv />
  </div>
  <EmployeeInfor />
  <EmployeeTable v-if="showTable" />
  <EmployeeStatus v-else/>
  <EmployeeError />
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';
import EmployeeReadCsv from '@/components/EmployeeReadCsv.vue';
import EmployeeTable from '@/components/EmployeeTable.vue';
import EmployeeError from '@/components/EmployeeError.vue';
import { useEmployeeStore } from '@/stores/employee-store';
import EmployeeInfor from '@/components/EmployeeInfor.vue';
import EmployeeStatus from '@/components/EmployeeStatus.vue';
import EmployeeDatabaseButton from '@/components/EmployeeDatabaseButton.vue';

export default defineComponent({
  name: 'EmployeeRoot',
  components: {
    EmployeeDatabaseButton,
    EmployeeReadCsv,
    EmployeeInfor,
    EmployeeStatus,
    EmployeeTable,
    EmployeeError,
  },
  setup() {
    const employeeStore = useEmployeeStore();
    const showTable = computed(() => employeeStore.showTable);
    const csvMode = computed(() => employeeStore.csvMode);
    const csvFileName = computed(() => employeeStore.csvFileName);
    return {
      showTable,
      csvMode,
      csvFileName,
    };
  },
});
</script>
<style scoped lang="scss">
.employee-function {
  display: flex;
}
</style>
