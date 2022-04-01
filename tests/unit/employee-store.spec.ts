// employee-store.spec.ts
import { EMPLOYEE_PROPERTIES_ALIAS, STATUS } from '@/types/employee';
import moment from 'moment';
import { setActivePinia, createPinia } from 'pinia';
import { useEmployeeStore } from '../../src/stores/employee-store';

describe('employee Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it('UpdateStatus', () => {
    const employee = useEmployeeStore();
    expect(employee.status).toBe(STATUS.NORMAL);
    employee.UpdateStatus(STATUS.PARSING_FILE);
    expect(employee.status).toBe(STATUS.PARSING_FILE);
    expect(employee.showTable).toBe(false);
    expect(employee.disableStatus).toBe(true);
    expect(employee.showUploadButton).toBe(false);
    employee.UpdateStatus(STATUS.UPLOADING_EMPLOYEE);
    expect(employee.status).toBe(STATUS.UPLOADING_EMPLOYEE);
    expect(employee.showTable).toBe(false);
    expect(employee.disableStatus).toBe(true);
    expect(employee.showUploadButton).toBe(false);
    employee.UpdateStatus(STATUS.UPLOADED_EMPLOYEE);
    expect(employee.status).toBe(STATUS.UPLOADED_EMPLOYEE);
    expect(employee.showTable).toBe(false);
    expect(employee.disableStatus).toBe(false);
    expect(employee.showUploadButton).toBe(false);
  });

  it('Show Hide Update Button', () => {
    const employeeStore = useEmployeeStore();
    employeeStore.UpdateStatus(STATUS.FETCHING_EMPLOYEE);
    expect(employeeStore.csvMode).toBe(false);
    employeeStore.AddEmployee({
      id: 'UUID1',
      empId: 'empId1',
      firstName: 'firstName1',
      lastName: 'lastName1',
      dateOfBirth: moment('11/1/1990', 'M/D/yyyy').toDate(),
    });
    employeeStore.AddEmployee({
      id: 'UUID2',
      empId: 'empId2',
      firstName: 'firstName2',
      lastName: 'lastName2',
      dateOfBirth: moment('12/2/1990', 'M/D/yyyy').toDate(),
    });
    employeeStore.numberOfEmployeesDb = 2;
    employeeStore.EditEmployee(0, EMPLOYEE_PROPERTIES_ALIAS.empId, '_empId1');
    employeeStore.EditEmployee(0, EMPLOYEE_PROPERTIES_ALIAS.firstName, '_firstName1');
    employeeStore.EditEmployee(0, EMPLOYEE_PROPERTIES_ALIAS.lastName, '_lastName1');
    employeeStore.EditEmployee(0, EMPLOYEE_PROPERTIES_ALIAS.dateOfBirth, '11/11/1990');
    expect(employeeStore.showUploadButton).toBe(true);
    employeeStore.EditEmployee(0, EMPLOYEE_PROPERTIES_ALIAS.empId, 'empId1');
    employeeStore.EditEmployee(0, EMPLOYEE_PROPERTIES_ALIAS.firstName, 'firstName1');
    employeeStore.EditEmployee(0, EMPLOYEE_PROPERTIES_ALIAS.lastName, 'lastName1');
    employeeStore.EditEmployee(0, EMPLOYEE_PROPERTIES_ALIAS.dateOfBirth, '11/1/1990');
    expect(employeeStore.showUploadButton).toBe(false);

    employeeStore.EditEmployee(0, EMPLOYEE_PROPERTIES_ALIAS.dateOfBirth, '11/11/1990');
    employeeStore.EditEmployee(1, EMPLOYEE_PROPERTIES_ALIAS.dateOfBirth, '12/12/1990');
    employeeStore.EditEmployee(0, EMPLOYEE_PROPERTIES_ALIAS.dateOfBirth, '11/1/1990');
    expect(employeeStore.showUploadButton).toBe(true);
    employeeStore.EditEmployee(1, EMPLOYEE_PROPERTIES_ALIAS.dateOfBirth, '12/2/1990');
    expect(employeeStore.showUploadButton).toBe(false);
  });
});
