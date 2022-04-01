<template>
  <table>
    <tr>
      <th v-if="!csvMode">ID</th>
      <th>Emp ID</th>
      <th>First Name</th>
      <th>Last Name</th>
      <th>Date of Birth</th>
    </tr>
    <EmployeeRow
      v-for="(viewedEmployee, index) in viewedEmployees"
      :index="index"
      v-bind:key="viewedEmployee.id || index">
    </EmployeeRow>
  </table>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';
import { useEmployeeStore } from '@/stores/employee-store';
import EmployeeRow from '@/components/EmployeeRow.vue';

export default defineComponent({
  name: 'EmployeeTable',
  components: {
    EmployeeRow,
  },
  setup() {
    const employeeStore = useEmployeeStore();
    const viewedEmployees = computed(() => employeeStore.viewedEmployees);
    const csvMode = computed(() => employeeStore.csvMode);
    const status = computed(() => employeeStore.status);
    return {
      csvMode,
      status,
      viewedEmployees,
    };
  },
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
table {
  font-family: arial, sans-serif;
  border-collapse: collapse;
  width: 100%;
}

th {
  border: 1px solid #dddddd;
  text-align: left;
  padding: 8px;
}
</style>
