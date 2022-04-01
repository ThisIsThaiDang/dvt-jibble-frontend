<template>
  <form>
    <label for="file">
      <input :disabled="disabled" type="file" @change="readFile" ref="inpReadFile"/>
    </label>
  </form>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue';
import Papa from 'papaparse';
import moment from 'moment';
import { IEmployee, STATUS } from '@/types/employee';
import { useEmployeeStore } from '@/stores/employee-store';

interface Row {
  [key: string]: string,
}

export default defineComponent({
  name: 'EmployeeReadCsv',
  setup() {
    const employeeStore = useEmployeeStore();
    const disabled = computed(() => employeeStore.disableStatus);
    const inpReadFile = ref(null);
    const readFile = (event: Event) => {
      const { files } = event.target as HTMLInputElement;
      if (files && files.length > 0) {
        employeeStore.UpdateStatus(STATUS.PARSING_FILE);
        employeeStore.updateCsvFileName(files[0].name);
        Papa.parse<Row>(files[0], {
          header: true,
          dynamicTyping: false,
          skipEmptyLines: true,
          step: (results) => {
            if (results.errors.length > 0) {
              employeeStore.UpdateStatus(STATUS.NORMAL);
              employeeStore.UpdateErrorMessage(results.errors[0].message);
            } else if (typeof results.data === 'object' && results.data !== null) {
              const data: IEmployee = {
                empId: results.data['Emp ID'],
                firstName: results.data['First Name'],
                lastName: results.data['Last Name'],
                dateOfBirth: moment(results.data['Date of Birth'], 'M/D/yyyy').toDate(),
              };
              employeeStore.AddEmployee(data);
            }
          },
          complete: () => {
            employeeStore.UpdateStatus(STATUS.NORMAL);
            if (inpReadFile.value) {
              (inpReadFile.value as HTMLInputElement).value = '';
            }
          },
          error(errors) {
            employeeStore.UpdateStatus(STATUS.NORMAL);
            employeeStore.UpdateErrorMessage(errors.message);
          },
        });
      }
    };
    return {
      readFile,
      disabled,
      inpReadFile,
    };
  },
});
</script>

<style scoped lang="scss">
input {
  margin-left: 10px;
  float: left;
}
</style>
