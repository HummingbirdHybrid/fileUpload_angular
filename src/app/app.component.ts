import { Component } from '@angular/core';
import {UploadService} from './app.service';

@Component({
  selector: 'my-app',
  template: `    
    <label class="upload-file">
      <input type="file" (change)="onChange($event)" (click)="onClick($event)"/>
      <span class="control">Choose file...</span>
    </label>
    <div id="myModal" class="modal">
      
      <div class="modal-content">
        <span class="close">&times;</span>
        <p>Warning</p>
      </div>

    </div>
    <div id="progress-bar"></div>
  `,
  styleUrls: [ './app.component.css' ],
  providers: [ UploadService ]
})
export class AppComponent {
  constructor(private service:UploadService) {
    this.service.progress$.subscribe(
      data => {
        console.log('progress = '+data);
      });
  }

  onChange(event) {
    console.log(event);
    var files = event.srcElement.files;
    var control = <HTMLElement>document.querySelector('.control');
    control.innerText = files[0].name;
    console.log(files);

    this.service.makeFileRequest('http://localhost:4200/upload', [], files).subscribe(() => {
      console.log('sent');
    });
  }
  onClick(event) {
    document.querySelector('input').onfocus = this.onClosed;
  }
  onClosed(event){
    document.querySelector('input').onfocus = null;
    setTimeout(function () {
      var files = event.srcElement.files.length;
      console.log(files);
      if(!files) {
        var modal = <HTMLElement>document.getElementById('myModal');
        var span = <HTMLElement>document.getElementsByClassName("close")[0];
        modal.style.display = "block";
        span.onclick = function() {
          modal.style.display = "none";
        };
        window.onclick = function(event) {
          if (event.target == modal) {
            modal.style.display = "none";
          }
        }
      }
      else {
      }
    },100)


  }
}

