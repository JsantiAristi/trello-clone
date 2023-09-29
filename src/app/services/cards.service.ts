import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { checkToken } from '@interceptors/token.interceptor';
import { Board } from '@models/board.models';
import { Card, CreateCardDto, UpdateCardDto } from '@models/list.model';

@Injectable({
  providedIn: 'root'
})
export class CardsService {
  apiUrl = environment.API_URL;
  bufferSpace = 65535;

  constructor(private http: HttpClient) {}

  updateCard(id: Card['id'], changes: UpdateCardDto){
    return this.http.put<Card>(`${this.apiUrl}/api/v1/cards/${id}`, changes, {
      context: checkToken(),
    });
  }

  createCard(dto: CreateCardDto){
    return this.http.post<Card>(`${this.apiUrl}/api/v1/cards`, dto, {
      context: checkToken(),
    });
  }
}
