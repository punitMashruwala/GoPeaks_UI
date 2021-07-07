import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DownloadComponent } from './download/download.component';
import { FileComponent } from './file/file.component';

const routes: Routes = [{ path: "upload", component: FileComponent }, { path: 'download', component: DownloadComponent }];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
