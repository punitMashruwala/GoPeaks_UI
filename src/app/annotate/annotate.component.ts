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
  dataArray_history = [""];
  param1: string = "";
  tagName: string = "";

  data: string = "";
  old_sentence: string = '';
  new_sentence: string = '';
  id: any = '';

  word: string = "";
  causeFlag = true;
  outcomeFlag = false; // Flag variable
  addYourOwn = false;

  arraylength = 0;
  totalArraylength = "0";
  undo_index = 0
  undoFlag = false;

  redo_index = 0
  redoFlag = false;
  tagFlag = false;

  causeButtonColor: string = "#007bff"
  outcomeButtonColor: string = "#007bff"
  addButtonColor: string = "#007bff"

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
      this.totalArraylength = this.dataArray[this.dataArray.length - 1]
      this.dataArray.splice(this.dataArray.length - 1, 1);
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
    this.id = Number(idAttr.nodeValue);
    this.data = this.dataArray[this.id]
    this.dataArray[this.id] = "<div style='background-color:silver;'>" + this.data + "</div>"
    console.log(this.dataArray[this.id])
    this.dataArray_history = [];
    this.undo_index = 0;
  }

  onRemoveClick(id: any) {
    this.dataArray.splice(id, 1);
    this.arraylength = this.dataArray.length;
  }


  onTextClick(events: any) {
    var selObj = window.getSelection();
    this.old_sentence = selObj!.toString();
    if (this.old_sentence != "") {
      if (this.causeFlag) {
        this.word = "cause";
        this.new_sentence = `<font style="color:green;"> &lt;${this.word}&gt ${this.old_sentence} &lt/${this.word}&gt </font>`;
      } else if (this.outcomeFlag) {
        this.word = "outcome";
        this.new_sentence = `<font style="color:blue;"> &lt;${this.word}&gt ${this.old_sentence} &lt/${this.word}&gt </font>`;
      } else if (this.addYourOwn) {
        if (this.tagName) {
          this.word = this.tagName
          this.tagName = "";
          this.new_sentence = `<font style="color:brown;"> &lt;${this.word}&gt ${this.old_sentence} &lt/${this.word}&gt </font>`;
        }
      }
      if (this.old_sentence != this.new_sentence) {

        if (this.undo_index == 0) {
          this.dataArray_history = [this.data];
          this.redoFlag = false
        }
        this.data = this.data.replace(this.old_sentence, this.new_sentence);
        this.dataArray_history.push(this.data);
        this.undo_index += 1;
        this.undoFlag = true;
      }
      this.word = "";
    }
  };


  onCauseClick() {
    this.causeFlag = true;
    this.outcomeFlag = false;
    this.addYourOwn = false;
    this.tagFlag = false;
    this.tagName = "";
    this.causeButtonColor = "green";
    this.addButtonColor = "#007bff";
    this.outcomeButtonColor = "#007bff";
  }

  onoutcomeClick() {
    this.outcomeFlag = true;
    this.causeFlag = false;
    this.tagFlag = false;
    this.addYourOwn = false;
    this.tagName = "";
    this.outcomeButtonColor = "green";
    this.causeButtonColor = "#007bff";
    this.addButtonColor = "#007bff";
  }

  onAddYourOwnClick() {
    this.addYourOwn = true;
    this.causeFlag = false;
    this.outcomeFlag = false;
    this.tagFlag = true;
    this.addButtonColor = "green";
    this.causeButtonColor = "#007bff";
    this.outcomeButtonColor = "#007bff";
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

  onUndoClick() {
    console.log(this.dataArray_history)
    this.undo_index = this.undo_index - 1;
    if (this.undo_index >= 0) {
      this.data = this.dataArray_history[this.undo_index];
      if (this.undo_index == 0) {
        this.undoFlag = false;
      }
      if (this.undo_index < this.dataArray_history.length) {
        this.redoFlag = true;
      }
    } else {
      this.undo_index = 0;
    }
  }

  onRedoClick() {
    if (this.undo_index < this.dataArray_history.length) {
      this.undo_index = this.undo_index + 1;
      this.data = this.dataArray_history[this.undo_index];
      if (this.undo_index == this.dataArray_history.length - 1) {
        this.redoFlag = false;
      }
      this.undoFlag = true;
    }
  }

}
