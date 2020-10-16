import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

const tokenPattern = /(-?\d+(\.\d*)?)/;
const completeTokenPattern = /^(-?\d+(\.\d*)?)$/;
const startingTokenPattern = /((^-)?\d+(\.\d*)?)/;
const operatorPattern = /[\/\*\+-\^]/;

const divideRegex = new RegExp(startingTokenPattern.source + '\\/' + tokenPattern.source);
const multRegex = new RegExp(startingTokenPattern.source + '\\*' + tokenPattern.source);
const subRegex = new RegExp(startingTokenPattern.source + '-' + tokenPattern.source);
const addRegex = new RegExp(startingTokenPattern.source + '\\+' + tokenPattern.source);
const powRegex = new RegExp(startingTokenPattern.source + '\\^' + tokenPattern.source);

const completedParenthesisGroupRegex = new RegExp('\\((' + tokenPattern.source + ')\\)');
const baseParenthesisGroupRegex =
  new RegExp('\\(((' + tokenPattern.source + operatorPattern.source + ')+' + tokenPattern.source + ')\\)');

const invalidParenthesisPatterns = [ /\(\)/, /\)\(/, /\)\d/, /\d\(/ ];

const step = (regex: RegExp, calcFn: ((match: any[]) => string)) => (input: string) => {
  let out = input;
  let match = out.match(regex);
  while (match) {
    const result = calcFn(match);
    out = out.replace(match[0], result);
    match = out.match(regex);
  }
  return out;
};

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'calculator';
  output$: Observable<string>;
  form: FormControl;

  parenthesisGroupStep = step(baseParenthesisGroupRegex, match => this.calc(match[1]));
  completeParenthesisGroupStep = step(completedParenthesisGroupRegex, match => match[1]);
  divideStep = step(divideRegex, match => (+match[1] / +match[4]).toString());
  multStep = step(multRegex, match => (+match[1] * +match[4]).toString());
  subStep = step(subRegex, match => (+match[1] - +match[4]).toString());
  addStep = step(addRegex, match => (+match[1] + +match[4]).toString());
  powStep = step(powRegex, match => (Math.pow(+match[1], +match[4])).toString());

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.form = this.fb.control('');
    this.output$ = this.form.valueChanges.pipe( map(v => this.calc(v)) );
  }

  calc(input: string): string {
    input = input.replace(/\s/g, '');
    if (invalidParenthesisPatterns.some(pattern => !!input.match(pattern))) {
      return 'invalid input';
    }

    // Step 0 remove every starting complete parenthesis ie: (2) => 2;
    input = this.completeParenthesisGroupStep(input);

    // Step 1 process every parenthesis down to complete parenthesis ie: (3+2) => (3);
    input = this.parenthesisGroupStep(input);

    // Step 2  process every division ie: 6^2 => 36;
    input = this.powStep(input);

    // Step 3 process every division ie: 6/3 => 2;
    input = this.divideStep(input);

    // Step 4 process every multiplication ie: 6*3 => 18;
    input = this.multStep(input);

    // Step 5 process every subtraction ie: 6-3 => 3;
    input = this.subStep(input);

    // Step 6 process every addition ie: 6+3 => 9;
    input = this.addStep(input);

    if (!input.match(completeTokenPattern)) {
      return 'invalid input';
    }

    return input;
  }
}
