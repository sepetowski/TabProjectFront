import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '../../../core/services/auth/auth.service';
import { SidebarModule } from 'primeng/sidebar';
import { ButtonModule } from 'primeng/button';
import { AvatarModule } from 'primeng/avatar';
import { StyleClassModule } from 'primeng/styleclass';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { BadgeModule } from 'primeng/badge';
import { Subscription } from 'rxjs';
import { User } from '../../../models/user.model';
import { NAV_ITEMS, NavItem } from './nav.constants';

@Component({
  selector: 'app-admin-nav',
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
  templateUrl: './admin-nav.component.html',
  styleUrl: './admin-nav.component.css',
})
export class AdminNavComponent implements OnInit, OnDestroy {
  private authService = inject(AuthService);

  private userSub: Subscription | null = null;
  user: User | null = null;

  sidebarVisible: boolean = false;
  navItems: NavItem[] = NAV_ITEMS;

  ngOnInit() {
    this.userSub = this.authService.user.subscribe(
      (user) => (this.user = user)
    );
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
