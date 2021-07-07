import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FileService } from '../file.service';

@Component({
  selector: 'app-download',
  templateUrl: './download.component.html',
  styleUrls: ['./download.component.css']
})
export class DownloadComponent implements OnInit {
  param1: string = "";
  constructor(private fileService: FileService, private route: ActivatedRoute) {
    console.log('Called Constructor');
    this.route.queryParams.subscribe(params => {
      console.log("======", params)
      this.param1 = params['fileName'];
    });
  }

  ngOnInit(): void {
    console.log(typeof this.param1)
    this.param1 = this.param1.split("/")[2];
    this.param1 = this.param1.split(".")[0];
    console.log(this.param1)
    this.fileService.download(this.param1).subscribe((response) => {
      console.log("File is being downloaded");
      // this.downLoadFile(response, "application/vnd.openxmlformats-officedocument.wordprocessingml.document");
      // let dataType = response.type;
      let binaryData = [];
      binaryData.push(response);
      let downloadLink = document.createElement('a');
      downloadLink.href = window.URL.createObjectURL(new Blob(binaryData, { type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" }));
      if (this.param1)
        downloadLink.setAttribute('download', this.param1);
      document.body.appendChild(downloadLink);
      downloadLink.click();
    },
      (error: HttpErrorResponse) => {
        console.log(error)
        // Handle error
        // Use if conditions to check error code, this depends on your api, how it sends error messages
      })
  }

  /**
    * Method is use to download file.
    * @param data - Array Buffer data
    * @param type - type of the document.
    */
  downLoadFile(data: any, type: string) {
    console.log("herer")
    let blob = new Blob([data], { type: type });
    let url = window.URL.createObjectURL(blob);
    let pwa = window.open(url);
    if (!pwa || pwa.closed || typeof pwa.closed == 'undefined') {
      alert('Please disable your Pop-up blocker and try again.');
    }
  }

}
