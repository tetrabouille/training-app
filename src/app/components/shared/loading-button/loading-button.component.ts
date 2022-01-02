import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-loading-button',
  templateUrl: './loading-button.component.html',
  styleUrls: ['./loading-button.component.scss'],
})
export class LoadingButtonComponent implements OnInit {
  @Input() disabled: boolean;
  @Input() text: string;
  @Input() color: string;
  @Input() type: string;
  @Input() loading: boolean;

  constructor() {}

  ngOnInit(): void {}
}
