export interface NavItem {
  name: string;
  href: string;
  icon: string;
}

export const ADMIN_NAV_ITEMS: NavItem[] = [
  {
    name: 'Books',
    href: '/',
    icon: 'pi-home',
  },
  {
    name: 'Authors',
    href: '/authors',
    icon: 'pi-home',
  },
  {
    name: 'Categories',
    href: '/admin/categories',
    icon: 'pi-home',
  },
  {
    name: 'Add Author',
    href: '/admin/new-author',
    icon: 'pi-home',
  },
  {
    name: 'Add Book',
    href: '/admin/new-book',
    icon: 'pi-home',
  },
  {
    name: 'Add Category',
    href: '/admin/new-category',
    icon: 'pi-home',
  },
];

export const USER_NAV_ITEMS: NavItem[] = [
  {
    name: 'Books',
    href: '/',
    icon: 'pi-home',
  },
  {
    name: 'Authors',
    href: '/authors',
    icon: 'pi-home',
  },
];

export const NOT_SIGN_NAV_ITEMS: NavItem[] = [
  {
    name: 'Sign in',
    href: '/auth/sign-in',
    icon: 'pi-home',
  },
  {
    name: 'Sign up',
    href: '/auth/sign-up',
    icon: 'pi-home',
  },
];
