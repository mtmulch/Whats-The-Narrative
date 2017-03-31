import { Component, OnInit } from '@angular/core';
import { Http, Response } from '@angular/http'; // required for getting products from JSON file
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map'; // required by the .map method

// Data
import { IQuiz } from '../models/qaa';
// Service
import { QuizService } from './questionsandanswers.service';

@Component({
  moduleId: module.id,
  selector: 'app-questions-answers',
  templateUrl: './questionsandanswers.component.html',
  styleUrls: ['./questionsandanswers.component.css']
})
export class QuestionsAnswersComponent implements OnInit {

  private _quizQAUrl = 'assets/qaa.json';
  private _quiz: IQuiz[];
  private _answers: Array<string> = [];

  errorMessage: string;
  questionIndex: number = 1;
  selectedOptions: Array<string> = [];
  activeOptions = document.getElementsByClassName('active');
  quizScore: number = 0;

  constructor(
    private _http: Http,
    private _quizService: QuizService) { }

  // get the list of the questions and answers as an observable
  getQAAList(): Observable<IQuiz[]> {
    return this._http.get(this._quizQAUrl)
      .map(response => <IQuiz[]>response.json().quizData)
  }

  // selected options
  selected(elem: any) {
    elem.classList.toggle('active'); // toggles "active" CSS class on elements that the user clicks on
    this.selectedOptions.length = 0;
    for (var i = 0; i < this.activeOptions.length; i++) {
      this.selectedOptions.push(this.activeOptions[i].innerHTML);
    }
  }

  // next question function
  nextQuestion() {
    if (this.questionIndex <= this._quiz.length) {
      for (let i = this.questionIndex - 1; i < this.questionIndex; i++) {
        let selectedAnswers = String(this.selectedOptions);
        console.log(selectedAnswers)
        let correctAnswer = String(this._quiz[i].answer);
        console.log(correctAnswer)
        if (selectedAnswers === correctAnswer) {
          this.quizScore++;
        }
        if (this.questionIndex === this._quiz.length) {
          this.calculateScore();
        }
      }
      this.questionIndex++;
      this.selectedOptions.length = 0;
    }
  }

  calculateScore() {
    this.quizScore = (this.quizScore / this._quiz.length) * 100;
    this._quizService.quizDone(true);
    this._quizService.quizScore(this.quizScore)
    console.log(this.quizScore)
  }

  ngOnInit(): void {
    this.getQAAList()
      .subscribe(
      quiz => this._quiz = quiz, // set our local _quiz array equal to the IQuiz[] data which arrive from our data stream
      error => this.errorMessage = <any>error);
  }
}
