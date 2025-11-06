export const NAVIGATION_ITEMS = [
  { name: 'Home', slug: 'home', icon: 'home' },
  { name: 'About', slug: 'about', icon: 'info' },
  { name: 'Team', slug: 'team', icon: 'group' },
  { name: 'Contact', slug: 'contact', icon: 'mail' },
];

export const FOOTER_LINKS = {
  club: [
    { name: 'About the Hawks', slug: 'about' },
    { name: 'Team Roster', slug: 'team' },
    { name: 'Contact', slug: 'contact' },
  ],
  resources: [
    { name: 'Practice Schedule', slug: 'team' },
    { name: 'Match Updates', slug: 'home' },
  ],
};

export const slugToParams = (slug) => {
  if (!slug || slug === 'home') {
    return null;
  }

  return { page: slug };
};
