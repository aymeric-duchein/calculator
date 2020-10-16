import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { By } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { DebugElement } from '@angular/core';

const typeIn = (ref: DebugElement) => (selector: string, value: string) => {
  const target = ref.query(By.css(selector));
  target.nativeElement.value = value;
  target.triggerEventHandler('input', { target: target.nativeElement });
  target.nativeElement.blur();
};

describe('AppComponent', () => {

  let fixture;
  let component;
  let typeInFixture;
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppComponent,
      ],
      imports: [
        ReactiveFormsModule,
        CommonModule,
        NoopAnimationsModule,
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.debugElement.componentInstance;
    fixture.detectChanges();

    typeInFixture = typeIn(fixture.debugElement);
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it(`should have as title 'calculator'`, () => {
    const title = fixture.debugElement.query(By.css('h1'));
    expect(title.nativeElement.innerHTML).toContain('calculator');
  });

  it('should calculate addition', () => {
    typeInFixture('input', '6+6');
    const input = fixture.debugElement.query(By.css('input'));

    fixture.detectChanges();

    const output = fixture.debugElement.query(By.css('p'));
    expect(output.nativeElement.innerHTML).toEqual('12');
  });

  it('should calculate subtracttion', () => {
    typeInFixture('input', '6-6');
    const input = fixture.debugElement.query(By.css('input'));

    fixture.detectChanges();

    const output = fixture.debugElement.query(By.css('p'));
    expect(output.nativeElement.innerHTML).toEqual('0');
  });

  it('should calculate multiplication', () => {
    typeInFixture('input', '6*6');
    const input = fixture.debugElement.query(By.css('input'));

    fixture.detectChanges();

    const output = fixture.debugElement.query(By.css('p'));
    expect(output.nativeElement.innerHTML).toEqual('36');
  });

  it('should calculate division', () => {
    typeInFixture('input', '6/6');
    const input = fixture.debugElement.query(By.css('input'));

    fixture.detectChanges();

    const output = fixture.debugElement.query(By.css('p'));
    expect(output.nativeElement.innerHTML).toEqual('1');
  });

  it('should remove useless parenthesis', () => {
    typeInFixture('input', '(6)');
    const input = fixture.debugElement.query(By.css('input'));

    fixture.detectChanges();

    const output = fixture.debugElement.query(By.css('p'));
    expect(output.nativeElement.innerHTML).toEqual('6');
  });

  it('should compute parenthesis', () => {
    typeInFixture('input', '(6+6)');
    const input = fixture.debugElement.query(By.css('input'));

    fixture.detectChanges();

    const output = fixture.debugElement.query(By.css('p'));
    expect(output.nativeElement.innerHTML).toEqual('12');
  });

  it('should prioritize division over addition', () => {
    typeInFixture('input', '6+6/6');
    const input = fixture.debugElement.query(By.css('input'));

    fixture.detectChanges();

    const output = fixture.debugElement.query(By.css('p'));
    expect(output.nativeElement.innerHTML).toEqual('7');
  });

  it('should prioritize division over substraction', () => {
    typeInFixture('input', '6-6/6');
    const input = fixture.debugElement.query(By.css('input'));

    fixture.detectChanges();

    const output = fixture.debugElement.query(By.css('p'));
    expect(output.nativeElement.innerHTML).toEqual('5');
  });

  it('should prioritize multiplication over addition', () => {
    typeInFixture('input', '6+6*6');
    const input = fixture.debugElement.query(By.css('input'));

    fixture.detectChanges();

    const output = fixture.debugElement.query(By.css('p'));
    expect(output.nativeElement.innerHTML).toEqual('42');
  });

  it('should prioritize multiplication over substraction', () => {
    typeInFixture('input', '6-6*6');
    const input = fixture.debugElement.query(By.css('input'));

    fixture.detectChanges();

    const output = fixture.debugElement.query(By.css('p'));
    expect(output.nativeElement.innerHTML).toEqual('-30');
  });

  it('should prioritize power over division', () => {
    typeInFixture('input', '2^4/2');
    const input = fixture.debugElement.query(By.css('input'));

    fixture.detectChanges();

    const output = fixture.debugElement.query(By.css('p'));
    expect(output.nativeElement.innerHTML).toEqual('8');
  });

  it('should prioritize power over multiplication', () => {
    typeInFixture('input', '2^4*2');
    const input = fixture.debugElement.query(By.css('input'));

    fixture.detectChanges();

    const output = fixture.debugElement.query(By.css('p'));
    expect(output.nativeElement.innerHTML).toEqual('32');
  });

  it('should prioritize power over addition', () => {
    typeInFixture('input', '2^4+2');
    const input = fixture.debugElement.query(By.css('input'));

    fixture.detectChanges();

    const output = fixture.debugElement.query(By.css('p'));
    expect(output.nativeElement.innerHTML).toEqual('18');
  });

  it('should prioritize power over subtraction', () => {
    typeInFixture('input', '2^4-2');
    const input = fixture.debugElement.query(By.css('input'));

    fixture.detectChanges();

    const output = fixture.debugElement.query(By.css('p'));
    expect(output.nativeElement.innerHTML).toEqual('14');
  });

  it('should prioritize parenthesis', () => {
    typeInFixture('input', '(6-6)*6');
    const input = fixture.debugElement.query(By.css('input'));

    fixture.detectChanges();

    const output = fixture.debugElement.query(By.css('p'));
    expect(output.nativeElement.innerHTML).toEqual('0');
  });

  it('should reject invalid input', () => {
    typeInFixture('input', '5++5');
    const input = fixture.debugElement.query(By.css('input'));

    fixture.detectChanges();

    const output = fixture.debugElement.query(By.css('p'));
    expect(output.nativeElement.innerHTML).toEqual('invalid input');
  });

  it('should reject invalid parenthesis 0', () => {
    typeInFixture('input', '5(5)');
    const input = fixture.debugElement.query(By.css('input'));

    fixture.detectChanges();

    const output = fixture.debugElement.query(By.css('p'));
    expect(output.nativeElement.innerHTML).toEqual('invalid input');
  });

  it('should reject invalid parenthesis 1', () => {
    typeInFixture('input', '(5)(5+5)');
    const input = fixture.debugElement.query(By.css('input'));

    fixture.detectChanges();

    const output = fixture.debugElement.query(By.css('p'));
    expect(output.nativeElement.innerHTML).toEqual('invalid input');
  });

  it('should reject invalid input', () => {
    typeInFixture('input', '()5+5');
    const input = fixture.debugElement.query(By.css('input'));

    fixture.detectChanges();

    const output = fixture.debugElement.query(By.css('p'));
    expect(output.nativeElement.innerHTML).toEqual('invalid input');
  });

  it('should reject invalid input', () => {
    typeInFixture('input', '(5)5+5');
    const input = fixture.debugElement.query(By.css('input'));

    fixture.detectChanges();

    const output = fixture.debugElement.query(By.css('p'));
    expect(output.nativeElement.innerHTML).toEqual('invalid input');
  });

  it('should prioritize everything together', () => {
    typeInFixture('input', '-((6-4)*6/3+(5*6)/2)');
    const input = fixture.debugElement.query(By.css('input'));

    fixture.detectChanges();

    const output = fixture.debugElement.query(By.css('p'));
    expect(output.nativeElement.innerHTML).toEqual('-19');
  });
});
