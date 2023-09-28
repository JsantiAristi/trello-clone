import { Component, OnInit } from '@angular/core';
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
export class BoardComponent implements OnInit {
  board: Board | null = null;
  id: string = '';

  constructor(
    private dialog: Dialog,
    private boardsService: BoardsService,
    private route: ActivatedRoute,
    private cardService: CardsService
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
          // this.columns = board.lists;
        }
      });
    }
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

  addColumn() {
    // this.columns.push({
    //   title: 'New Column',
    //   cards: [],
    // });
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
}


