import {
  API_STATUS,
  EMPLOYEE_PROPERTIES_ALIAS, IEditedEmployees, IEmployee, IEmployeeDto, STATUS,
} from '@/types/employee';
import axios from 'axios';
import moment from 'moment';
import { defineStore } from 'pinia';

const API_ENDPOINT = {
  GetEmployees: `${process.env.VUE_APP_API_ENDPOINT}Employee`,
  ImportEmployees: `${process.env.VUE_APP_API_ENDPOINT}Employee/ImportEmployees`,
  UpdateEmployees: `${process.env.VUE_APP_API_ENDPOINT}Employee/UpdateEmployees`,

};

// eslint-disable-next-line import/prefer-default-export
export const useEmployeeStore = defineStore('employee', {
  state: () => ({
    employees: [] as IEmployee[],
    editedEmployees: {} as IEditedEmployees,
    originEmployees: {} as IEditedEmployees,
    numberOfEmployeesDb: 0,
    currentPage: 1,
    itemPerPage: 100,
    status: STATUS.NORMAL,
    csvMode: true,
    csvFileName: '',
    errorMessage: '',
  }),
  getters: {
    viewedEmployees: (state) => {
      if (state.csvMode) {
        const start = (state.currentPage - 1) * state.itemPerPage;
        const end = state.currentPage * state.itemPerPage;
        return state.employees.slice(start, end);
      }
      const employees = state.employees.map((employee) => {
        if (employee.id && employee.id in state.editedEmployees) {
          return { ...employee, ...state.editedEmployees[employee.id] };
        }
        return { ...employee };
      });
      return employees;
    },
    totalEmployee: (state) => (state.csvMode ? state.employees.length : state.numberOfEmployeesDb),
    disableStatus: (state) => state.status === STATUS.PARSING_FILE
      || state.status === STATUS.UPLOADING_EMPLOYEE
      || state.status === STATUS.FETCHING_EMPLOYEE,
    showUploadButton(state): boolean {
      return (Object.keys(state.editedEmployees).length > 0
      || state.csvMode) && this.totalEmployee > 0;
    },
    showPaging(): boolean {
      return this.totalEmployee > 0;
    },
    showTable: (state) => state.status === STATUS.NORMAL,
  },
  actions: {
    UpdateStatus(status: STATUS) {
      this.status = status;
      if (this.status === STATUS.PARSING_FILE) {
        this.employees = [];
        this.errorMessage = '';
        this.currentPage = 1;
        this.csvMode = true;
        return;
      }
      if (this.status === STATUS.FETCHING_EMPLOYEE) {
        this.errorMessage = '';
        this.csvMode = false;
        return;
      }
      if (this.status === STATUS.UPLOADED_EMPLOYEE) {
        this.employees = [];
        this.editedEmployees = {};
        this.originEmployees = {};
        this.errorMessage = '';
        if (this.csvMode) {
          this.currentPage = 1;
        }
      }
    },
    updateCsvFileName(csvFileName: string) {
      this.csvFileName = csvFileName;
    },
    UpdatePaging(currentPage: number) {
      this.currentPage = currentPage;
      if (this.csvMode) {
        return;
      }
      this.FetchEmployees();
    },
    AddEmployee(employees: IEmployee) {
      this.employees.push(employees);
    },
    UpdateErrorMessage(errorMessage: string) {
      this.errorMessage = errorMessage;
    },
    EditEmployee(row: number, empProp: EMPLOYEE_PROPERTIES_ALIAS, value: string) {
      if (this.csvMode) {
        if (empProp === EMPLOYEE_PROPERTIES_ALIAS.dateOfBirth) {
          this.employees[row][empProp] = moment(value, 'M/D/yyyy').toDate();
          return;
        }
        this.employees[row][empProp] = value;
        return;
      }
      const employee = this.employees[row];
      const employeeId = employee.id;
      if (!employeeId) {
        return;
      }
      if (employeeId in this.editedEmployees) {
        if (empProp === EMPLOYEE_PROPERTIES_ALIAS.dateOfBirth) {
          this.editedEmployees[employeeId][empProp] = moment(value, 'M/D/yyyy').toDate();
        } else {
          this.editedEmployees[employeeId][empProp] = value;
        }
        if (Object.keys(this.editedEmployees[employeeId]).length
        === Object.keys(this.originEmployees[employeeId]).length
        && Object.values(EMPLOYEE_PROPERTIES_ALIAS).every(
          (key) => {
            if ((key === EMPLOYEE_PROPERTIES_ALIAS.dateOfBirth)) {
              const editedDobTime = this.editedEmployees[employeeId][key].getTime();
              const originDobTime = new Date(this.originEmployees[employeeId][key]).getTime();
              const editedDobValid = moment(this.editedEmployees[employeeId][key]).isValid();
              const originDobNull = this.originEmployees[employeeId][key] == null;
              return (editedDobTime === originDobTime) || (!editedDobValid && originDobNull);
            }
            return this.editedEmployees[employeeId][key] === this.originEmployees[employeeId][key];
          },
        )) {
          delete this.editedEmployees[employeeId];
          delete this.originEmployees[employeeId];
        }
        return;
      }
      this.originEmployees[employeeId] = { ...employee };
      if (empProp === EMPLOYEE_PROPERTIES_ALIAS.dateOfBirth) {
        this.editedEmployees[employeeId] = {
          ...employee,
          ...{
            [empProp]: moment(value, 'M/D/yyyy').toDate(),
          },
        };
      } else {
        this.editedEmployees[employeeId] = {
          ...employee,
          ...{
            [empProp]: value,
          },
        };
      }
    },
    async UploadEmployees() {
      try {
        this.UpdateStatus(STATUS.UPLOADING_EMPLOYEE);
        let employeeDto;
        if (this.csvMode) {
          employeeDto = await axios.post<IEmployeeDto>(
            API_ENDPOINT.ImportEmployees,
            this.employees,
          );
        } else {
          employeeDto = await axios.post<IEmployeeDto>(
            API_ENDPOINT.UpdateEmployees,
            Object.values(this.editedEmployees),
          );
        }
        this.UpdateStatus(STATUS.UPLOADED_EMPLOYEE);
        if (employeeDto.data.status !== API_STATUS.SUCCESS) {
          this.UpdateErrorMessage(employeeDto.data.errorMessage);
        }
      } catch (e) {
        this.UpdateErrorMessage((<Error>e).message);
        this.UpdateStatus(STATUS.NORMAL);
      }
    },
    async FetchEmployees() {
      try {
        this.UpdateStatus(STATUS.FETCHING_EMPLOYEE);
        const employeeDto = await axios.get<IEmployeeDto>(
          API_ENDPOINT.GetEmployees,
          {
            params: {
              currentPage: this.currentPage,
              itemPerPage: this.itemPerPage,
            },
          },
        );
        if (employeeDto.data.status === API_STATUS.SUCCESS) {
          this.employees = employeeDto.data.employees;
          this.numberOfEmployeesDb = employeeDto.data.numberOfEmployees;
        } else {
          this.UpdateErrorMessage(employeeDto.data.errorMessage);
        }
      } catch (e) {
        this.UpdateErrorMessage((<Error>e).message);
      } finally {
        this.UpdateStatus(STATUS.NORMAL);
      }
    },
  },
});
