export interface NavItem {
  name: string;
  href: string;
  icon: string;
}

export const ADMIN_NAV_ITEMS: NavItem[] = [
  {
    name: 'Authors',
    href: '/authors',
    icon: 'pi-home',
  },
  {
    name: 'Add Author',
    href: '/admin/new-author',
    icon: 'pi-home',
  },
];

export const USER_NAV_ITEMS: NavItem[] = [
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
