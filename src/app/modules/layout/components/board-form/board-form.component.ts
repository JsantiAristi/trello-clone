import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { Colors } from '@models/colors.model';
import { BoardsService } from '@services/boards.service';

@Component({
  selector: 'app-board-form',
  templateUrl: './board-form.component.html'
})
export class BoardFormComponent {

  @Output() closeOverlay = new EventEmitter<boolean>();

  faCheck = faCheck;

  form = this.formBuilder.nonNullable.group({
    title: ['', Validators.required],
    backgrundColor: new FormControl<Colors>('sky', {
      nonNullable: true,
      validators: [Validators.required]
    })
  })

  constructor(
    private formBuilder: FormBuilder,
    private boardService: BoardsService,
    private router: Router
  ){

  }

  doSave(){
    if (this.form.valid) {
      const { title, backgrundColor } = this.form.getRawValue();
      console.log(title, backgrundColor);
      this.boardService.createBoard(title, backgrundColor).subscribe({
        next: (board) => {
          this.router.navigate(['/app/boards', board.id]);
          this.closeOverlay.emit(false);
        }
      })
    } else {
      this.form.markAllAsTouched();
    }
  }

}
