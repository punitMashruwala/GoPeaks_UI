import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, SecurityContext } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { FileService } from '../file.service';


@Component({
  selector: 'app-annotate',
  templateUrl: './annotate.component.html',
  styleUrls: ['./annotate.component.css']
  // ,
  // encapsulation: ViewEncapsulation.None
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
  outputFlag = false; // Flag variable

  constructor(private fileService: FileService, private route: ActivatedRoute, private _sanitizer: DomSanitizer) {
    console.log('Called Constructor');
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
      this.dataArray.forEach(x => {

        x = x.replace(/\\"/g, '"');
        x = this.sanitizedHtmlProperty(x);
      })
      this.dataArray_backup = this.dataArray;
    });
  }

  public sanitizedHtmlProperty(_originalHtmlProperty: any): any {
    return this._sanitizer.sanitize(SecurityContext.HTML, _originalHtmlProperty);
  }

  onClick(event: any) {
    this.data = event.srcElement.outerHTML;

    let target = event.currentTarget;
    let idAttr = target.attributes.id;
    let id = Number(idAttr.nodeValue);
    console.log(typeof id);
    this.id = id;

  }


  onTextClick(events: any) {
    var selObj = window.getSelection();
    console.log(selObj!.toString())
    this.old_sentence = selObj!.toString();
    console.log(this.causeFlag)
    console.log(this.outputFlag)

    if (this.causeFlag) {
      this.word = "cause";
      this.new_sentence = `<font style="color:green;"> &lt;${this.word}&gt ${this.old_sentence}&lt/${this.word}&gt </font>`;
    } else if (this.outputFlag) {
      this.word = "output";
      this.new_sentence = `<font style="color:blue;"> &lt;${this.word}&gt ${this.old_sentence}&lt/${this.word}&gt </font>`;
    }
    this.word = "";
    this.data = this.data.replace(this.old_sentence, this.new_sentence);
  
  };


  onCauseClick() {
    if (!this.causeFlag) {
      this.causeFlag = true;
      this.outputFlag = false;
    }
  }

  onOutputClick() {
    if (!this.outputFlag) {
      this.causeFlag = false;
      this.outputFlag = true;
    }
  }

  onSaveClick(){
    console.log("-----------", this.id)
    this.dataArray[this.id] = this.data;
    console.log(this.dataArray)
  }

}
