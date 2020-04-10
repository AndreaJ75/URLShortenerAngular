import {Directive,Input, TemplateRef, ViewContainerRef} from '@angular/core';

@Directive({
  selector: '[myAdminIf]'
})

export class MyAdminIfDirective {

  constructor(private templateRef: TemplateRef<any>,
              private viewContainer: ViewContainerRef) {
  }

  @Input() set myAdminIf(isAdmin:boolean) {
    if (isAdmin) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    } else {
      this.viewContainer.clear();
    }
  }
}
