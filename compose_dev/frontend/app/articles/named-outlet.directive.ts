import { Directive, OnInit, OnDestroy, Input, ComponentFactoryResolver, ViewContainerRef, ChangeDetectorRef } from "@angular/core";
import { RouterOutlet, ChildrenOutletContexts } from "@angular/router";

@Directive({
    selector: 'named-outlet',
    exportAs: 'outlet'
})
export class NamedOutletDirective implements OnInit, OnDestroy {
    public outlet: RouterOutlet|null = null;
    @Input() public name: string|null = null;
    constructor(
        private parentContexts: ChildrenOutletContexts,
        private location: ViewContainerRef,
        private resolver: ComponentFactoryResolver, 
        private changeDetector: ChangeDetectorRef,
    ) {
      const logMessage: string = "Dans le constructeur de la directive 'named-outlet': ";
      console.log(logMessage + "Appel");
    }
    ngOnInit() {
      const logMessage: string = "Dans la fonction 'ngOnInit' de la directive 'named-outlet': ";
      console.log(logMessage + "Appel");
      console.log(logMessage + "name: " + JSON.stringify(this.name));
      if (!(this.name === null)) {
        this.outlet = new RouterOutlet(this.parentContexts, this.location, this.resolver, this.name, this.changeDetector);
        this.outlet.ngOnInit();
      }
    }
    ngOnDestroy() {
      const logMessage: string = "Dans la fonction 'ngOnDestroy' de la directive 'named-outlet': ";
      console.log(logMessage + "Appel");
      if(this.outlet)
        this.outlet.ngOnDestroy();
    }
  }

//use in your page template
//<named-outlet [name]="'outletname'">

