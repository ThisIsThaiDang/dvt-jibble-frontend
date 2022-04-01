<template>
    <tr>
      <td v-if="!csvMode">
        {{viewedEmployee.id?.substring(0, 8).toUpperCase()}}
      </td>
      <td>
        <input :value="viewedEmployee.empId"
          @blur="onCellChange($event, EMPLOYEE_PROPERTIES_ALIAS.empId)" />
      </td>
      <td>
        <input :value="viewedEmployee.firstName"
          @blur="onCellChange($event, EMPLOYEE_PROPERTIES_ALIAS.firstName)" />
      </td>
      <td>
        <input :value="viewedEmployee.lastName"
          @blur="onCellChange($event, EMPLOYEE_PROPERTIES_ALIAS.lastName)" />
      </td>
      <td>
        <input :value="formatedDob" ref="inpDateOfBirth"
          @blur="onCellChange($event, EMPLOYEE_PROPERTIES_ALIAS.dateOfBirth)" />
      </td>
    </tr>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue';
import { useEmployeeStore } from '@/stores/employee-store';
import { EMPLOYEE_PROPERTIES_ALIAS } from '@/types/employee';
import moment from 'moment';

export default defineComponent({
  name: 'EmployeeRow',
  props: {
    index: {
      type: Number,
      required: true,
    },
  },
  setup(props) {
    const employeeStore = useEmployeeStore();
    const viewedEmployee = computed(() => employeeStore.viewedEmployees[props.index]);
    const inpDateOfBirth = ref(null);
    const formatedDob = computed(() => {
      const dateOfBirth = moment(viewedEmployee.value.dateOfBirth);
      if (!dateOfBirth.isValid()) {
        return 'NULL';
      }
      return dateOfBirth.format('M/D/yyyy');
    });
    const csvMode = computed(() => employeeStore.csvMode);
    const onCellChange = (event: Event, employeeProperty: EMPLOYEE_PROPERTIES_ALIAS) => {
      const target = event.target as HTMLInputElement;
      if (employeeProperty === EMPLOYEE_PROPERTIES_ALIAS.dateOfBirth) {
        const valueDate = moment(target.value, 'M/D/yyyy');
        const valueDateValid = valueDate.isValid();
        const ValueDateTime = valueDate.toDate().getTime();
        const employeeDobTime = new Date(viewedEmployee.value[employeeProperty]).getTime();
        if (ValueDateTime === employeeDobTime
        || (!valueDateValid && viewedEmployee.value[employeeProperty] === null)) {
          if (inpDateOfBirth.value) {
            (inpDateOfBirth.value as HTMLInputElement).value = 'NULL';
          }
          return;
        }
      }
      if (target.value !== viewedEmployee.value[employeeProperty]) {
        employeeStore.EditEmployee(props.index, employeeProperty, target.value);
      }
    };

    return {
      csvMode,
      viewedEmployee,
      onCellChange,
      EMPLOYEE_PROPERTIES_ALIAS,
      formatedDob,
      inpDateOfBirth,
    };
  },
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
td {
  border: 1px solid #dddddd;
  text-align: left;
  padding: 8px;
}

tr:nth-child(even) {
  background-color: #dddddd;
}
input {
  width: 100%;
}
</style>
