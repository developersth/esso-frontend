export interface User {
  id: number;
  _id: string;
  username: string;
  password: string;
  name: string;
  email: string;
  isActive:boolean;
  role:{
    name:string
  }
}
