<template>
  <div v-if="errorMessage">
    <div> {{ errorMessage }} </div>
    <button @click="close">X</button>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';
import { useEmployeeStore } from '@/stores/employee-store';

export default defineComponent({
  name: 'EmployeeError',
  setup() {
    const employeeStore = useEmployeeStore();
    const errorMessage = computed(() => employeeStore.errorMessage);
    const close = () => {
      employeeStore.UpdateErrorMessage('');
    };
    return {
      errorMessage,
      close,
    };
  },
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
div {
  position: fixed;
  bottom: 0;
  width: 100%;
  background: #f44336;
  color: white;
  height: 40px;
  line-height: 40px;
  left: 0px;
}
button {
  position: fixed;
  bottom: 18px;
  right: 0px;
  background: #f44336;
  color: white;
  height: 20px;
  width: 20px;
  border: 0px;
}
</style>
