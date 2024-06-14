import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '../../core/services/auth/auth.service';
import { SidebarModule } from 'primeng/sidebar';
import { ButtonModule } from 'primeng/button';
import { AvatarModule } from 'primeng/avatar';
import { StyleClassModule } from 'primeng/styleclass';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { BadgeModule } from 'primeng/badge';
import { Subscription } from 'rxjs';
import { User } from '../../models/user.model';
import {
  ADMIN_NAV_ITEMS,
  NavItem,
  NOT_SIGN_NAV_ITEMS,
  USER_NAV_ITEMS,
} from './nav.constants';
import { UserRole } from '../../interfaces/auth.interfaces';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [
    SidebarModule,
    ButtonModule,
    StyleClassModule,
    ScrollPanelModule,
    RouterLink,
    AvatarModule,
    BadgeModule,
    RouterLinkActive,
  ],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.css',
})
export class NavComponent implements OnInit, OnDestroy {
  private authService = inject(AuthService);

  private userSub: Subscription | null = null;
  user: User | null = null;

  sidebarVisible: boolean = false;
  navItems: NavItem[] = [];

  ngOnInit() {
    this.userSub = this.authService.user.subscribe((user) => {
      this.user = user;
      if (user) {
        const role = user.role;
        role === UserRole.admin
          ? (this.navItems = ADMIN_NAV_ITEMS)
          : (this.navItems = USER_NAV_ITEMS);
      } else {
        this.navItems = NOT_SIGN_NAV_ITEMS;
      }
    });
  }

  toggleSidebar() {
    this.sidebarVisible = !this.sidebarVisible;
  }

  handleLogOut() {
    this.authService.logOut();
  }

  ngOnDestroy() {
    this.userSub?.unsubscribe();
  }
}
