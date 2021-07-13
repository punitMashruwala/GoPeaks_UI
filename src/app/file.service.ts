import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { fileModel } from './file/fileModel';

let url_host = "http://localhost:10010/";
let url_base_path = "annotate/"

@Injectable({
  providedIn: 'root'
})
export class FileService {

  // API url

  uploadApiUrl = url_host + url_base_path + "upload";
  processApiUrl = url_host + url_base_path + "process";
  downloadApiUrl = url_host + url_base_path + "download/";
  getAnnotateDataApiUrl = url_host + url_base_path + "getAnnotateData/";
  constructor(private http: HttpClient) { }

  // Returns an observable
  upload(file: File): Observable<any> {
    // Create form data
    const formData = new FormData();

    // Store form name as "file" with file data
    formData.append("file", file, file.name);

    // Make http post request over api
    // with formData as req
    return this.http.post(this.uploadApiUrl, formData)
  }

  process(data: fileModel): Observable<any> {
    // Create form data
    // const formData = new FormData();

    // Store form name as "file" with file data
    const body = JSON.stringify(data);
    console.log("-----body", body)
    // Make http post request over api
    // with formData as req
    const config = { headers: new HttpHeaders().set('Content-Type', 'application/json') };
    return this.http.post(this.processApiUrl, body, config)
  }

  download(id: string): Observable<any> {
    // Create form data
    // const formData = new FormData();

    // Store form name as "file" with file data
    // const body = JSON.stringify(data);

    // Make http post request over api
    // with formData as req
    // const config = { headers: new HttpHeaders().set('Content-Type', 'application/json') };
    return this.http.get(this.downloadApiUrl + id, { responseType: 'blob' })
  }

  getData(id: string): Observable<any> {
    // Create form data
    // const formData = new FormData();

    // Store form name as "file" with file data
    // const body = JSON.stringify(data);

    // Make http post request over api
    // with formData as req
    // const config = { headers: new HttpHeaders().set('Content-Type', 'application/json') };
    return this.http.get(this.getAnnotateDataApiUrl + id)
  }
}
