export interface IEmployee {
  id?: string;
  empId: string;
  firstName: string;
  lastName: string,
  dateOfBirth: Date,
}

// eslint-disable-next-line no-shadow
export enum EMPLOYEE_PROPERTIES_ALIAS {
  id = 'id',
  empId = 'empId',
  firstName = 'firstName',
  lastName = 'lastName',
  dateOfBirth = 'dateOfBirth',
}

export interface IEditedEmployees {
  [key: string]: IEmployee,
}

export interface IRow {
  [key: string]: string,
}

export interface IPaging {
  currentPage: number,
  itemPerPage: number,
}

// eslint-disable-next-line no-shadow
export enum STATUS {
  NORMAL,
  PARSING_FILE,
  FETCHING_EMPLOYEE,
  UPLOADING_EMPLOYEE,
  UPLOADED_EMPLOYEE
}

// eslint-disable-next-line no-shadow
export enum API_STATUS {
  SUCCESS = 0,
  FALIED = 1,
}

export interface IEmployeeDto {
  status: API_STATUS;
  employees: IEmployee[];
  errorMessage: string;
  numberOfEmployees: number;
}
