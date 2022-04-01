<template>
  <h2>{{ status }}</h2>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';
import { useEmployeeStore } from '@/stores/employee-store';
import { STATUS } from '@/types/employee';

const STATUS_MESSAGE = {
  [STATUS.NORMAL]: '',
  [STATUS.PARSING_FILE]: 'Parsing file...',
  [STATUS.FETCHING_EMPLOYEE]: 'Fetching employees...',
  [STATUS.UPLOADING_EMPLOYEE]: 'Uploading employees...',
  [STATUS.UPLOADED_EMPLOYEE]: 'Employees was uploaded.',
};

export default defineComponent({
  name: 'EmployeeStatus',
  setup() {
    const employeeStore = useEmployeeStore();
    const status = computed(() => STATUS_MESSAGE[employeeStore.status]);
    return {
      status,
    };
  },
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
a {
  color: #42b983;
}
</style>
