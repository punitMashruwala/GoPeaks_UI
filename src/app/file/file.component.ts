import { HttpErrorResponse } from '@angular/common/http';
import { listLazyRoutes } from '@angular/compiler/src/aot/lazy_routes';
import { Component, OnInit, ChangeDetectorRef, ElementRef } from '@angular/core';
import { FileService } from './../file.service';
import { fileModel } from './fileModel';
import { Router } from '@angular/router';

@Component({
  selector: 'app-file',
  templateUrl: './file.component.html',
  styleUrls: ['./file.component.css']
})
export class FileComponent implements OnInit {

  fileModelData = new fileModel();
  displayedColumns = ['name'];
  // Variable to store shortLink from api response
  shortLink: string = "";
  loading = false; // Flag variable
  file!: File; // Variable to store file
  // Variable to store file
  defaultFlag = true;
  addYourOwn = false; // Flag variable
  temp = [{ "name": "hence" }];
  triggerword: string = '';
  // userName: string = '';
  triggrlist = [
    { "name": "because of" },
    { "name": "as a result" },
    { "name": "thus" },
    { "name": "hence" },
    { "name": "because" },
    { "name": "so" },
    { "name": "as" },
    { "name": "provided that" },
    { "name": "in order to" }
  ];

  triggerList = [{ "name": "given that" },
  { "name": "cause" },
  { "name": "causing" },
  { "name": "led to" },
  { "name": "leads to" },
  { "name": "leading to" },
  { "name": "contribute to" },
  { "name": "contributed to" },
  { "name": "contributing to" }]

  triggerLst = [{ "name": "Because of" },
  { "name": "consequently" },
  { "name": "therefore" },
  { "name": "thus" },
  { "name": "accordingly" },
  { "name": "as a consequence" },
  { "name": "due to" },
  { "name": "owing to" },
  { "name": "result from" }]

  tableValue = this.triggrlist.length / 9;
  // Inject service 
  constructor(private fileService: FileService, private changeDetectorRefs: ChangeDetectorRef, private elRef: ElementRef, private router: Router) {
    this.elRef.nativeElement
  }

  ngOnInit(): void {
    var el = this.elRef.nativeElement;
    console.log(el);
  }

  // On file Select
  onChange(event: any) {
    this.file = event.target.files[0];
  }

  onDefaultClick() {
    console.log("herere")
    if (!this.defaultFlag) {
      console.log("hereressssss")
      this.defaultFlag = true;
      this.addYourOwn = false;
    }
  }
  onAddClick() {
    if (!this.addYourOwn) {
      this.defaultFlag = false;
      this.addYourOwn = true;
      this.temp.length = 0
    }
  }


  onAddToListClick() {
    // this.temp.push({ "name": this.triggerword })
    var currentElement = { "name": this.triggerword };
    this.temp.splice(this.temp.length, 0, currentElement);
    console.log(this.temp)
    this.changeDetectorRefs.detectChanges();
  }

  // OnClick of button Upload
  onUpload() {
    this.loading = !this.loading;
    console.log(this.file);
    this.fileService.upload(this.file).subscribe(
      (event: any) => {
        // console.log(event)
        if (event.fileName) {
          this.fileModelData.fileName = event.fileName;
          if (this.defaultFlag) {
            this.fileModelData.list = "Default"
          } else {
            this.fileModelData.list = "Add your own";
            this.temp.map(x => {
              this.fileModelData.listArray.push(x.name);
            })
          }
          this.fileService.process(this.fileModelData)
            .subscribe((response: any) => {
              // to navigate on next page
              console.log(response);

              // console.log(response.FileName.split("/"))
              if (response.FileName) {
                // console.log(fileN)
                this.router.navigate(['/download/'], {

                  queryParams: { "fileName": response.FileName }
                })
              } else {
                console.log("TO DOOO")
              }
            }, (error: HttpErrorResponse) => {
              // Handle error
              // Use if conditions to check error code, this depends on your api, how it sends error messages
            })
        }
      },
      (error: HttpErrorResponse) => {
        // Handle error
        // Use if conditions to check error code, this depends on your api, how it sends error messages
      }
    );
  }

  onTextClick = function (events: any) {
    console.log(events.target.select());
  };

  onClickMe() {
    console.log(this.elRef.nativeElement.querySelector('newInput'))
  }


}

