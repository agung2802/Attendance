import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable, throwError } from 'rxjs';
import { catchError, map, retry } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  baseURL = 'https://dummy.restapiexample.com/api/v1/';
  
  constructor(private http: HttpClient) { }

  // getConfig() {
  //   const body = {
  //     "heroesUrl": "api/heroes",
  //     "textfile": "assets/textfile.txt",
  //     "date": "2020-01-29"
  //   }

  //   return this.http.get<Config>(body);
  // }

  getAllEmployee(): Observable<any> {
    const URL = `${this.baseURL}/employee`;
    // const options = {
    //   headers: this.setGlobalHeaderV2()
    // };
    const body = {
      method_api: 'GET',
      url_api: 'https://dummy.restapiexample.com/api/v1/employees',
      content_api: JSON.stringify("")
    };

    return this.http.get<any>('https://dummy.restapiexample.com/api/v1/employees').pipe(
      map(res => {
        const result = res;
        return result;
      }));
  }

  getEmployee(id: any): Observable<any>{
    return this.http.get<any>('	https://dummy.restapiexample.com/api/v1/employee/'+id).pipe(
      map(res => {
        return res;
      })
    )
  }

  deleteEmployee(id: any): Observable<any>{
    return this.http.delete<any>('https://dummy.restapiexample.com/api/v1/delete/'+id).pipe(
      map(res => {
        return res;
      })
    )
  }

}
