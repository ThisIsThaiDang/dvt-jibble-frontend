<template>
  <button v-if="showUploadButton" :disabled="disabled" @click="upload">
    {{ csvMode ? "Import" : "Update" }}
  </button>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';
import { useEmployeeStore } from '@/stores/employee-store';

export default defineComponent({
  name: 'EmployeeUploadButton',
  setup() {
    const employeeStore = useEmployeeStore();
    const disabled = computed(() => employeeStore.disableStatus);
    const csvMode = computed(() => employeeStore.csvMode);
    const showUploadButton = computed(() => employeeStore.showUploadButton);
    const upload = async () => {
      await employeeStore.UploadEmployees();
    };
    return {
      upload,
      disabled,
      csvMode,
      showUploadButton,
    };
  },
});
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
button {
  float: right;
}
</style>
