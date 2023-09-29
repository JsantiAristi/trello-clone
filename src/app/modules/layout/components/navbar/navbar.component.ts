import { Component } from '@angular/core';
import { Router } from '@angular/router';
import {
  faBell,
  faInfoCircle,
  faClose,
  faAngleDown
} from '@fortawesome/free-solid-svg-icons';
import { Colors, NAVBARBACKGROUNDS } from '@models/colors.model';

import { AuthService } from '@services/auth.service';
import { BoardsService } from '@services/boards.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
})
export class NavbarComponent {
  faBell = faBell;
  faInfoCircle = faInfoCircle;
  faClose = faClose;
  faAngleDown = faAngleDown;

  isOpenOverlayAvatar = false;
  isOpenOverlayBoards = false;
  isOpenOverlayCreateBoard = false;

  navBackgroundColor: Colors = 'sky';
  navBarColors = NAVBARBACKGROUNDS;
  user$ = this.authService.user$;

  constructor(
    private authService: AuthService,
    private router: Router,
    private boardService: BoardsService
  ) {
    this.boardService.backgroundColor$.subscribe(color => {
      this.navBackgroundColor = color;
    })
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  close(event: boolean){
    this.isOpenOverlayCreateBoard = event;
  }

  get colors(){
    const classes = this.navBarColors[this.navBackgroundColor]
    return classes ? classes : {};
  }

}
