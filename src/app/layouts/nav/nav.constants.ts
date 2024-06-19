export interface NavItem {
  name: string;
  href: string;
  icon: string;
}

export const ADMIN_NAV_ITEMS: NavItem[] = [
  {
    name: 'Books',
    href: '/',
    icon: 'pi-book',
  },
  {
    name: 'Authors',
    href: '/authors',
    icon: 'pi-palette',
  },
  {
    name: 'Categories',
    href: '/admin/categories',
    icon: 'pi-tag',
  },
  {
    name: 'Reservation History',
    href: '/admin/reservation-history',
    icon: 'pi-database',
  },
  {
    name: 'Loans History',
    href: '/admin/loans-history',
    icon: 'pi-database',
  },
  {
    name: 'Add Author',
    href: '/admin/new-author',
    icon: 'pi-user-plus',
  },
  {
    name: 'Add Book',
    href: '/admin/new-book',
    icon: 'pi-file-plus',
  },
  {
    name: 'Add Category',
    href: '/admin/new-category',
    icon: 'pi-plus',
  },
];

export const USER_NAV_ITEMS: NavItem[] = [
  {
    name: 'Books',
    href: '/',
    icon: 'pi-book',
  },
  {
    name: 'Authors',
    href: '/authors',
    icon: 'pi-palette',
  },
  {
    name: 'My Loans',
    href: '/my-loans',
    icon: 'pi-bookmark',
  },
  {
    name: 'My Reservations',
    href: '/my-reservations',
    icon: 'pi-bookmark',
  },
];

export const NOT_SIGN_NAV_ITEMS: NavItem[] = [
  {
    name: 'Sign in',
    href: '/auth/sign-in',
    icon: 'pi-sign-in',
  },
  {
    name: 'Sign up',
    href: '/auth/sign-up',
    icon: 'pi-user-plus',
  },
];
