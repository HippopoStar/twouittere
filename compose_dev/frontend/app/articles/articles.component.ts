import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

//import { Promise } from 'rxjs';

import { AuthService } from '../auth.service';
import { ArticlesService } from './articles.service';

@Component({
  selector: 'app-articles',
  templateUrl: './articles.component.html',
  styleUrls: ['./articles.component.css']
})
export class ArticlesComponent implements OnInit {

  constructor(private router: Router, public auth: AuthService, public articles: ArticlesService) { }

  ngOnInit(): void {
    let logMessage: string = "Dans la fonction ngOnInit du composant 'articles': ";
    console.log(logMessage + "Appel");

    this.articles.displayRedact()
      .then(
        (param: boolean) => {
          console.log(logMessage + "promise (param): " + JSON.stringify(param));
          if (param === true) {
          }
          else {
          }
          this.articles.displayFeed(['refresh']);
        }
      ).catch(
        (err) => {
          console.log(logMessage + "promise (err): " + err);
        }
      );
    //setInterval(() => this.articles.displayFeed(), 3000); //Here for testing purpose

    this.articles.refreshArticles();

  }

}
