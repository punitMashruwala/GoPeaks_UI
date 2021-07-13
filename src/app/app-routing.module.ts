import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AnnotateComponent } from './annotate/annotate.component';
import { DownloadComponent } from './download/download.component';
import { FileComponent } from './file/file.component';

const routes: Routes = [
  { path: "", component: FileComponent },
  { path: "upload", component: FileComponent },
  { path: 'download', component: DownloadComponent },
  { path: 'annotate', component: AnnotateComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
