import { HttpErrorResponse } from '@angular/common/http';
import { listLazyRoutes } from '@angular/compiler/src/aot/lazy_routes';
import { Component, OnInit, ChangeDetectorRef, ElementRef, HostListener } from '@angular/core';
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
  // loading = true; // Flag variable
  loading = false; // Flag variable
  file!: File; // Variable to store file
  // Variable to store file
  defaultFlag = true;
  addYourOwn = false; // Flag variable
  temp = ["hence"];
  triggerword: string = '';
  stoppedword: string = "";
  stopWordList: Array<string> = [];
  // userName: string = '';
  // triggrlist = [
  //   "because of",
  //   "as a result",
  //   "thus",
  //   "hence",
  //   "so",
  //   "as",
  //   "provided that",
  //   "in order to"
  // ];

  // triggerList = [
  //   "given that",
  //   "cause",
  //   "led to",
  //   "leads to",
  //   "leading to",
  //   "contribute to",
  //   "contributed to",
  //   "contributing to"
  // ]

  // triggerLst = [
  //   "consequently",
  //   "therefore",
  //   "thus",
  //   "accordingly",
  //   "as a consequence",
  //   "due to",
  //   "owing to",
  //   "result from"
  // ]

  triggrlist = [
    "accordingly",
    "as",
    "as a consequence",
    "as a result",
    "because of",
    "cause",
    "consequently",
    "contribute to",
    "contributed to",
    "contributing to",
    "due to",
    "given that",
    "hence",
    "in order to",
    "leading to",
    "leads to",
    "led to",
    "owing to",
    "provided that",
    "so",
    "result from",
    "therefore",
    "thus"
  ];


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
    if (!this.defaultFlag) {
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
    if (!this.triggerword || /^\s*$/.test(this.triggerword)) {
      // do nothing
    } else {
      if (this.triggerword.indexOf(",") != -1) {
        let list = this.triggerword.split(",");

        list.map(e => {
          if (!e || /^\s*$/.test(e)) {
            // do nothing
          } else {
            if (this.temp.indexOf(e) == -1) {
              this.temp.push(e)
            }
          }
        })
      } else {
        if (this.temp.indexOf(this.triggerword) == -1) {
          this.temp.push(this.triggerword)
        }
      }
      document.getElementById('triggerword');
      this.triggerword = "";
      this.changeDetectorRefs.detectChanges();
    }
  }

  onAddToStopListClick() {
    if (!this.stoppedword || /^\s*$/.test(this.stoppedword)) {
      // do nothing
    } else {
      if (this.stoppedword.indexOf(",") != -1) {
        let list = this.stoppedword.split(",");

        list.map(e => {
          if (!e || /^\s*$/.test(e)) {
            // do nothing
          } else {
            if (this.stopWordList.indexOf(e) == -1) {
              this.stopWordList.push(e)
            }
          }
        })
      } else {
        if (this.stopWordList.indexOf(this.stoppedword) == -1) {
          this.stopWordList.push(this.stoppedword)
        }
      }
      document.getElementById('stoppedword');
      this.stoppedword = "";
      this.changeDetectorRefs.detectChanges();
    }
  }

  // OnClick of button Upload
  onUpload() {
    this.loading = !this.loading;
    if (this.file) {
      if (!this.fileModelData.userName) {
        alert("Please enter name before clicking upload button!")
      } else {
        if (!this.fileModelData.radioBoolean) {
          alert("Please Select anyone of the radio button")
        } else {
          if (this.file.name) {
            if (this.file.name.split(".")[this.file.name.split(".").length - 1] == "docx" ||
              this.file.name.split(".")[this.file.name.split(".").length - 1] == "pdf" ||
              this.file.name.split(".")[this.file.name.split(".").length - 1] == "doc") {
              this.fileService.upload(this.file).subscribe(
                (event: any) => {
                  if (event.fileName) {
                    this.fileModelData.fileName = event.fileName;
                    // debugger
                    if (this.defaultFlag) {
                      this.fileModelData.list = "Default"
                      this.postprocessCall()
                    } else {
                      this.fileModelData.list = "Add your own";
                      if (!this.temp.length) {
                        alert("Trigger List is Empty");
                      } else {
                        this.temp.map(x => {
                          if (!this.fileModelData.listArray) {
                            this.fileModelData.listArray = [x]
                          } else {
                            this.fileModelData.listArray.push(x);
                          }
                          this.postprocessCall()
                        })
                      }
                    }

                  } else {
                    alert("Something went wrong");
                  }
                },
                (error: HttpErrorResponse) => {
                  console.log(error);
                  alert("Something went worng! Please try again later");
                  // Handle error
                  // Use if conditions to check error code, this depends on your api, how it sends error messages
                }
              );
            } else {
              alert("Please Select Only PDF or Docx file!")
            }
          } else {
            alert("Please Select Only PDF or Docx file!")
          }

        }
      }
    } else {
      alert("Please Select file and then click upload")
    }

  }

  postprocessCall() {
    if (this.stopWordList.length) {
      this.stopWordList.map(x => {
        if (!this.fileModelData.stopWordListArray) {
          this.fileModelData.stopWordListArray = [x.trim()];
        } else {
          this.fileModelData.stopWordListArray.push(x.trim())
        }
      });
    } else {
      if (!this.fileModelData.stopWordListArray) {
        this.fileModelData.stopWordListArray = ["as well"];
        this.fileModelData.stopWordListArray.push("as well as")
      } else {
        if (this.fileModelData.stopWordListArray.indexOf("as well") == -1) this.fileModelData.stopWordListArray.push("as well")
        this.fileModelData.stopWordListArray.push("as well as")
      }
    }
    if (this.fileModelData.radioBoolean !== "Download") {
      console.log("File Download")
      this.fileModelData.download = false;
      this.fileModelData.editable = true;

    }
    if (this.fileModelData.radioBoolean !== "Display") {
      // if (!this.fileModelData.editable) {
      console.log("File editable")
      this.fileModelData.editable = false;
      this.fileModelData.download = true;
    }
    this.fileService.process(this.fileModelData)
      .subscribe((response: any) => {
        this.loading = !this.loading;
        // to navigate on next page
        if (response.downloadFileName && !response.editableFileName) {
          this.router.navigate(['/download/'], {
            queryParams: { "fileName": response.downloadFileName }
          })
        } else if (response.editableFileName && !response.downloadFileName) {
          // console.log(fileN)
          this.router.navigate(['/annotate/'], {
            queryParams: { "fileName": response.editableFileName }
          })
        } else {
          console.log("TO DOOO");
          alert("Something went worng! Please try again later");
        }
      }, (error: HttpErrorResponse) => {
        console.log(error);
        alert("Something went worng! Please try again later");
        // Handle error
        // Use if conditions to check error code, this depends on your api, how it sends error messages
      })
  }

  onTextClick(events: any) {
    var selObj = window.getSelection();
    console.log(selObj!.toString())
  };




}

