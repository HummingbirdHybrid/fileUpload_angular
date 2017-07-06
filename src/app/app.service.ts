import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Rx';
declare var $: any;
@Injectable()
export class UploadService {
  public progress$ : Observable<any>;
  public progressObserver : Observable<any>;
  public progress: Number;
  constructor (
  ) {
    this.progress$ = Observable.create(observer => {this.progressObserver = observer}).share();
  }
  makeFileRequest (url: string, params: string[], files: File[]): Observable<any> {
      return Observable.create(observer=>{
        let formData: FormData = new FormData(),
             xhr: XMLHttpRequest = new XMLHttpRequest();
        for (let i = 0; i < files.length; i++) {
          formData.append("uploads[]", files[i], files[i].name);

        }
        xhr.onreadystatechange = () => {
          if (xhr.readyState === 4) {
            if (xhr.status === 200) {
              observer.next(JSON.parse(xhr.response));
              observer.complete();
            } else {
              observer.error(xhr.response);
            }
          }
        };
        xhr.upload.onprogress = (event) => {
          let progress = 0;
          let bar = <HTMLElement>document.querySelector('#progress-bar');
          bar.style.width ='0.5%';
          let id = setInterval(function () {
            bar.style.width = progress.toString() + '%';
            progress += 10;
            if (progress > 100) {
              clearInterval(id);
              setTimeout(()=> bar.style.display = 'none',1000)
            }
          },1000);
          this.progress = Math.round(event.loaded / event.total * 100);
          console.log(this.progress);
        };
        xhr.open('POST', url, true);
        xhr.send(formData);
      })
  }

}

