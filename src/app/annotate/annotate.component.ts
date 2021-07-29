import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, SecurityContext } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { FileService } from '../file.service';
import { asBlob } from 'html-docx-js-typescript'
import { FileSaverService } from 'ngx-filesaver';

@Component({
  selector: 'app-annotate',
  templateUrl: './annotate.component.html',
  styleUrls: ['./annotate.component.css']
})
export class AnnotateComponent implements OnInit {

  dataArray = [''];
  dataArray_backup = [''];
  param1: string = "";

  data: string = "";
  old_sentence: string = '';
  new_sentence: string = '';
  id: any = '';

  word: string = "";
  causeFlag = true;
  outcomeFlag = false; // Flag variable

  arraylength = 0;

  constructor(private fileService: FileService, private route: ActivatedRoute, private _sanitizer: DomSanitizer, private fileSaverService: FileSaverService) {
    this.route.queryParams.subscribe(params => {
      this.param1 = params['fileName'];
    });

  }


  ngOnInit(): void {
    this.param1 = this.param1.split("/")[2];
    this.param1 = this.param1.split(".")[0];
    this.getData();

  }

  getData() {
    this.fileService.getData(this.param1).subscribe((response) => {
      this.dataArray = response.data;
      if (this.dataArray[0].indexOf("10K")) {
        this.dataArray.splice(0, 1);
      }
      this.arraylength = this.dataArray.length;
      this.dataArray.forEach(element => {
        element = element.replace("<p>", "");
        element = element.replace("</p>", "");
      });
      this.dataArray = this.dataArray;
    });
  }

  public sanitizedHtmlProperty(_originalHtmlProperty: any): any {
    return this._sanitizer.sanitize(SecurityContext.HTML, _originalHtmlProperty);
  }

  onClick(event: any) {
    // this.data = event.srcElement.outerHTML;

    let target = event.currentTarget;
    let idAttr = target.attributes.id;
    let id = Number(idAttr.nodeValue);
    console.log("debugger - ", id);
    this.id = id;
    this.data = this.dataArray[id]
  }

  onRemoveClick(id: any) {
    console.log("debugger id - ", id)
    this.dataArray.splice(id, 1);
    this.arraylength = this.dataArray.length;
  }


  onTextClick(events: any) {
    var selObj = window.getSelection();
    this.old_sentence = selObj!.toString();
    debugger;
    if (this.causeFlag) {
      this.word = "cause";
      this.new_sentence = `<font style="color:green;"> &lt;${this.word}&gt ${this.old_sentence} &lt/${this.word}&gt </font>`;
    } else if (this.outcomeFlag) {
      this.word = "outcome";
      this.new_sentence = `<font style="color:blue;"> &lt;${this.word}&gt ${this.old_sentence} &lt/${this.word}&gt </font>`;
    }
    this.word = "";
    this.data = this.data.replace(this.old_sentence, this.new_sentence);

  };


  onCauseClick() {
    if (!this.causeFlag) {
      this.causeFlag = true;
      this.outcomeFlag = false;
    }
  }

  onoutcomeClick() {
    if (!this.outcomeFlag) {
      this.causeFlag = false;
      this.outcomeFlag = true;
    }
  }

  onSaveClick() {
    this.dataArray[this.id] = this.data;
    this.data = "";
    this.id = "";
  }

  onDownloadClick() {
    let name = "download.docx";
    if (this.param1) {
      name = "annotated_" + this.param1.split("_")[0] + "_" + this.param1.split("_")[1] + ".docx";
    }
    let downloadLink = document.createElement('a');
    this.dataArray.splice(0, 0, `<!DOCTYPE html> <html lang="en">`);
    this.dataArray.push("</html>");
    asBlob(this.dataArray.join(" <br> ")).then(data => {
      downloadLink.href = window.URL.createObjectURL(data);
      downloadLink.setAttribute('download', name);
      document.body.appendChild(downloadLink);
      downloadLink.click();
    });


  }

}
