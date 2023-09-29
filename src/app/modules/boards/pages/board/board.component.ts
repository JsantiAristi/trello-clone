import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { Dialog } from '@angular/cdk/dialog';
import { TodoDialogComponent } from '@boards/components/todo-dialog/todo-dialog.component';

// import { ToDo, Column } from '@models/todo.model';
import { BoardsService } from '@services/boards.service';
import { ActivatedRoute } from '@angular/router';
import { Board } from '@models/board.models';
import { Card, List } from '@models/list.model';
import { CardsService } from '@services/cards.service';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ListService } from '@services/list.service';
import { BACKGROUNDS } from '@models/colors.model';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styles: [
    `
      .cdk-drop-list-dragging .cdk-drag {
        transition: transform 250ms cubic-bezier(0, 0, 0.2, 1);
      }
      .cdk-drag-animating {
        transition: transform 300ms cubic-bezier(0, 0, 0.2, 1);
      }
    `,
  ],
})
export class BoardComponent implements OnInit, OnDestroy {

  board: Board | null = null;
  id: string = '';
  showListForm = false;
  colorBackgrounds = BACKGROUNDS

  inputCard = new FormControl<string>('', {
    nonNullable: true,
    validators: Validators.required
  })

  inputList = new FormControl<string>('', {
    nonNullable: true,
    validators: Validators.required
  })

  constructor(
    private dialog: Dialog,
    private boardsService: BoardsService,
    private route: ActivatedRoute,
    private cardService: CardsService,
    private listService: ListService
  ) {
    this.route.paramMap.subscribe( params => {
      this.id = params.get('id')!;
    })
  }

  ngOnInit(): void {
    if (this.id) {
      this.boardsService.getBoard(this.id).subscribe({
        next: (board) => {
          this.board = board;
          this.boardsService.setBackgroundColor(board.backgroundColor);
        }
      });
    }
  }

  ngOnDestroy(): void {
    this.boardsService.setBackgroundColor('sky');
  }

  drop(event: CdkDragDrop<Card[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }
    //after
    const position = this.boardsService.getPosition(event.container.data, event.currentIndex);
    const card = event.container.data[event.currentIndex];
    const listId = event.container.id;
    this.updateCard(card, position, listId);
  }

  addList() {
    const title = this.inputList.value;
    if (this.board) {
      this.listService.createList({
        title,
        boardId: this.board.id,
        position: this.boardsService.getPositionNewItem(this.board.lists)
      }).subscribe({
        next: (list) => {
          this.board?.lists.push({
            ...list,
            cards: []
          });
          this.showListForm = false;
          this.inputList.setValue('');
        }
      })
    }
  }

  openDialog(card: Card) {
    const dialogRef = this.dialog.open(TodoDialogComponent, {
      minWidth: '300px',
      maxWidth: '50%',
      data: {
        card,
      },
    });
    dialogRef.closed.subscribe((output) => {
      if (output) {
        console.log(output);
      }
    });
  }

  private updateCard(card: Card, position: number, listId: string | number ){
    this.cardService.updateCard(card.id, {position, listId }).subscribe({
      next: (update) => {
        console.log(update);
      }
    })
  }

  openFormCard(list: List){
    // list.showCardForm = !list.showCardForm;
    if (this.board?.lists) {
      this.board.lists = this.board.lists.map( iteratorList => {
        if (iteratorList.id === list.id) {
          return {
            ...iteratorList,
            showCardForm: true
          }
        }
        return {
          ...iteratorList,
          showCardForm: false
        }
      })
    }
  }

  createCard(list: List){
    const title = this.inputCard.value;
    if (this.board) {
      this.cardService.createCard({
        title,
        listId: list.id,
        boardId: this.board.id,
        position: this.boardsService.getPositionNewItem(list.cards)
      }).subscribe({
        next: (card) => {
          list.cards.push(card);
          this.inputCard.setValue('');
          list.showCardForm = false;
        }
      });
    }
  }

  closeCardForm(list: List){
    list.showCardForm = false;
  }

  get colors(){
    if (this.board) {
      const classes = this.colorBackgrounds[this.board.backgroundColor];
      return classes ? classes : {};
    }
    return {};
  }
}


