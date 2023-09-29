export interface List {
  id: string;
  title: string;
  position: number;
  cards: Card[];
  showCardForm?: boolean;
}

export interface CreateListDto extends Omit<List, 'id' | 'cards'>{
  boardId: string;
}

export interface Card{
  id: string;
  title: string;
  position: number;
  list: List;
  description?: string;
}

export interface CreateCardDto extends Omit<Card, 'id' | 'list'>{
  listId: string;
  boardId: string;
}

export interface UpdateCardDto extends Partial<Omit<Card, 'id' | 'list'>> {
  listId?: number | string;
  boardId?: string;
}
