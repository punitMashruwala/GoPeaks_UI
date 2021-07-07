import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {MatSidenavModule} from '@angular/material/sidenav';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// import { HighlightDirective } from './highlight.directive';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FileComponent } from './file/file.component';
import { HttpClientModule } from '@angular/common/http';
import { DownloadComponent } from './download/download.component';
// import { HighlightDirective } from './highlight.directive';

@NgModule({
  declarations: [
    AppComponent,
    FileComponent,
    DownloadComponent,
    // HighlightDirective
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    MatTableModule,
    MatSidenavModule,
    AppRoutingModule,
    CommonModule,
    BrowserAnimationsModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { 
  
}
