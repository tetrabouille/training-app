import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-validation',
  templateUrl: './validation.component.html',
  styleUrls: ['./validation.component.scss'],
})
export class ValidationComponent {
  public title: string;
  public content: string;
  public positive: string;
  public negative: string;

  constructor(
    @Inject(MAT_DIALOG_DATA)
    private data: {
      title: string;
      content: string;
      positive: string;
      negative: string;
    }
  ) {
    this.title = data.title;
    this.content = data.content;
    this.positive = data.positive;
    this.negative = data.negative;
  }
}
