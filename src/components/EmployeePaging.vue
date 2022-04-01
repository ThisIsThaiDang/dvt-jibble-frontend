<template>
  <div class="paging" v-if="showPaging">
    <div>Page:</div>
    <input
      :value="currentPage"
      @blur="onPageChange"
      @keypress="handleKeypress"
      :disabled="disabled"
    >
  </div>
</template>

<script lang="ts">
import {
  computed, defineComponent,
} from 'vue';
import { useEmployeeStore } from '@/stores/employee-store';

export default defineComponent({
  name: 'EmployeePaging',
  setup() {
    const employeeStore = useEmployeeStore();
    const currentPage = computed(() => employeeStore.currentPage);
    const disabled = computed(() => employeeStore.disableStatus);
    const showPaging = computed(() => employeeStore.showPaging);
    const handleKeypress = (event: KeyboardEvent) => {
      if (event.key < '0' || event.key > '9') {
        event.preventDefault();
      }
    };
    const onPageChange = (event: Event) => {
      const target = Number((event.target as HTMLInputElement).value);
      if (target !== currentPage.value) {
        employeeStore.UpdatePaging(target);
      }
    };
    return {
      currentPage,
      onPageChange,
      handleKeypress,
      disabled,
      showPaging,
    };
  },
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
input {
  width: 50px;
}
div {
  display:inline-block;
  margin-left: 5px;
  margin-right: 5px;
}
</style>
