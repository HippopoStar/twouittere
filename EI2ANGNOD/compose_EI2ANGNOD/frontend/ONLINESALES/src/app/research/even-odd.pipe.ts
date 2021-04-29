import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "evenOdd"
})
export class EvenOddPipe implements PipeTransform {

 transform(array:Array<Object>, rank:string) :Array<Object> {

    if(array === undefined || (rank !== "even" && rank !== "odd")) {
      return null;
    }
    if (rank == "even") return array.filter(function(item, index) { return index % 2 === 0; });
    else                return array.filter(function(item, index) { return index % 2 === 1; });
  }
}