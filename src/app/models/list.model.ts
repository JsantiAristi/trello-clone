export interface List {
  id: string;
  title: string;
  position: number;
  cards: Card[];
}

export interface Card{
  id: string;
  title: string;
  position: number;
  list: List;
  description: string;
}

export interface UpdateCardDTO{
  title?: string;
  description?: string;
  position?: number;
  listId?: string | number;
  boardId?: string
}
