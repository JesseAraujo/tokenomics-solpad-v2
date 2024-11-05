import { Injectable } from '@angular/core';
import html2canvas from 'html2canvas';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FunctionService {
  //name
  private cryotoName = new Subject();
  public cryotoName$ = this.cryotoName.asObservable();
  //solana
  private cryotoValue = new Subject();
  public cryotoValue$ = this.cryotoValue.asObservable();
  //tron
  private cryotoTronValue = new Subject();
  public cryotoTronValue$ = this.cryotoTronValue.asObservable();
  //Bnb
  private cryotoBnbValue = new Subject();
  public cryotoBnbValue$ = this.cryotoBnbValue.asObservable();

  donwloadImage(id: string, name: string) {
    const containerFile = document.getElementById(id)!;
    const fileName = `${name}.jpg`;

    html2canvas(containerFile, { allowTaint: true }).then(function (canvas) {
      var img = document.createElement('a');
      document.body.appendChild(img);
      img.download = fileName;
      img.href = canvas.toDataURL();
      img.target = '_blank';
      img.click();
    });
  }

  cryotoValueObservable(value: any) {
    this.cryotoValue.next(value);
  }

  cryotoTronValueObservable(value: any) {
    this.cryotoTronValue.next(value);
  }

  cryotoBnbValueObservable(value: any) {
    this.cryotoBnbValue.next(value);
  }

  cryotoNameObservable(value: any) {
    this.cryotoName.next(value);
  }
}
