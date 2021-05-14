import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { AuthService } from '../../auth.service';
import { ArticlesService, ArticleInterface } from '../articles.service';

//import { NamedOutletDirective } from '../named-outlet.directive';

@Component({
  selector: 'app-articles-edit',
  templateUrl: './articles-edit.component.html',
  styleUrls: ['./articles-edit.component.css']
})
export class ArticlesEditComponent implements OnInit {

  constructor(public auth: AuthService, public articles: ArticlesService, public router: Router, public route: ActivatedRoute) {
    const logMessage: string = "Dans le constructeur du composant 'articles-edit': ";
    console.log(logMessage + "Appel");
  }

  ngOnInit(): void {
    const logMessage: string = "Dans la fonction 'ngOnInit' du composant 'articles-edit': ";
    console.log(logMessage + "Appel");
  }

}
