export const STATS = [
  {
    id: 'faster-apply',
    value: '3x',
    label: 'FASTER TO APPLY',
    position: 'left-top'
  },
  {
    id: 'replies-24h',
    value: '87%',
    label: 'REPLIES IN 24H',
    position: 'left-bottom'
  },
  {
    id: 'local-shops',
    value: '1,420+',
    label: 'LOCAL SHOPS',
    position: 'right-top'
  },
  {
    id: 'shifts-filled',
    value: '28.5K',
    label: 'SHIFTS FILLED',
    position: 'right-bottom'
  }
];

export const PANEL_JOBS = [
  {
    id: 1,
    initials: 'AK',
    role: 'Barista',
    shop: 'Blue Tokai Cafe',
    status: 'Hiring',
    badgeType: 'filled', // lime filled
    distance: '0.4 km',
    wage: '₹220/hr'
  },
  {
    id: 2,
    initials: 'MS',
    role: 'Store Cashier',
    shop: 'Metro Supermart',
    status: 'New',
    badgeType: 'lime-outline', // lime border
    distance: '0.8 km',
    wage: '₹190/hr'
  },
  {
    id: 3,
    initials: 'JL',
    role: 'Floor Assistant',
    shop: 'Decathlon Sport',
    status: 'Mornings',
    badgeType: 'muted-outline', // grey border
    distance: '1.2 km',
    wage: '₹240/hr'
  },
  {
    id: 4,
    initials: 'RP',
    role: 'Dispatch Associate',
    shop: 'Express Hub',
    status: 'Evenings',
    badgeType: 'muted-outline',
    distance: '1.6 km',
    wage: '₹210/hr'
  },
  {
    id: 5,
    initials: 'TS',
    role: 'Bookstore Helper',
    shop: 'Higginbothams',
    status: 'Weekend',
    badgeType: 'muted-outline',
    distance: '2.1 km',
    wage: '₹180/hr'
  }
];

export const CATEGORIES = [
  { id: 'all', name: 'All Roles', count: '142' },
  { id: 'delivery', name: 'Delivery', count: '38' },
  { id: 'retail', name: 'Retail', count: '45' },
  { id: 'cafe', name: 'Cafe & Barista', count: '29' },
  { id: 'event', name: 'Event Help', count: '14' },
  { id: 'tutoring', name: 'Tutoring', count: '12' },
  { id: 'warehouse', name: 'Warehouse', count: '22' }
];

export const HIRING_JOBS = [
  {
    id: 'job-1',
    role: 'Espresso Barista & Cashier',
    shop: 'Roast & Toast Coffee Studio',
    category: 'cafe',
    badge: 'Urgent hiring',
    rate: '₹240',
    rateUnit: 'per hour',
    distance: '0.5 km away',
    timing: 'Morning shift · 07:30 - 13:30',
    days: 'Wed, Fri, Sat',
    tags: ['Daily Payout', 'Free Coffee', 'No Experience Needed'],
    openings: 2,
    rating: '4.9',
    reviews: 28,
    verified: true,
    initials: 'RT',
    address: 'Indiranagar 12th Main'
  },
  {
    id: 'job-2',
    role: 'Weekend Retail Sales Assistant',
    shop: 'FabIndia Flagship Store',
    category: 'retail',
    badge: 'Popular',
    rate: '₹220',
    rateUnit: 'per hour',
    distance: '1.1 km away',
    timing: 'Weekend shift · 11:00 - 18:00',
    days: 'Saturday & Sunday',
    tags: ['Staff Discount', 'Air Conditioned', 'Weekly Payout'],
    openings: 3,
    rating: '4.8',
    reviews: 42,
    verified: true,
    initials: 'FI',
    address: 'Commercial Street'
  },
  {
    id: 'job-3',
    role: 'Neighborhood Courier & Dispatcher',
    shop: 'Blinkit Local Fulfillment',
    category: 'delivery',
    badge: 'Instant approval',
    rate: '₹280',
    rateUnit: 'per hour',
    distance: '0.8 km away',
    timing: 'Evening shift · 17:00 - 22:00',
    days: 'Flexible · 3-5 days/wk',
    tags: ['EV Provided', 'Bonus Pay', 'Fuel Allowance'],
    openings: 5,
    rating: '4.7',
    reviews: 64,
    verified: true,
    initials: 'BL',
    address: 'Koramangala 4th Block'
  },
  {
    id: 'job-4',
    role: 'Weekend Tech & Music Event Crew',
    shop: 'The Humming Tree Experiences',
    category: 'event',
    badge: 'Weekend gig',
    rate: '₹350',
    rateUnit: 'per hour',
    distance: '2.4 km away',
    timing: 'Night gig · 18:00 - 23:30',
    days: 'Fri & Sat nights',
    tags: ['Dinner Provided', 'Music Backstage', 'Cash on Spot'],
    openings: 4,
    rating: '5.0',
    reviews: 19,
    verified: true,
    initials: 'HT',
    address: 'HSR Layout Sector 2'
  },
  {
    id: 'job-5',
    role: 'Evening High School Math Tutor',
    shop: 'Vidya Learning Pods',
    category: 'tutoring',
    badge: 'Flexible hours',
    rate: '₹400',
    rateUnit: 'per hour',
    distance: '1.5 km away',
    timing: 'Evening · 16:30 - 19:30',
    days: 'Mon to Thu',
    tags: ['Quiet Workspace', 'Hourly Pay', 'Study Materials Inc'],
    openings: 2,
    rating: '4.9',
    reviews: 15,
    verified: true,
    initials: 'VL',
    address: 'Jayanagar 4th T Block'
  },
  {
    id: 'job-6',
    role: 'Stockroom Inventory Associate',
    shop: 'Decathlon Sports Hub',
    category: 'warehouse',
    badge: 'Immediate start',
    rate: '₹210',
    rateUnit: 'per hour',
    distance: '2.8 km away',
    timing: 'Morning shift · 06:30 - 12:30',
    days: 'Mon, Wed, Fri',
    tags: ['Sports Gear Perk', 'Team Breakfast', 'Fast Track'],
    openings: 4,
    rating: '4.8',
    reviews: 37,
    verified: true,
    initials: 'DS',
    address: 'Whitefield Main Rd'
  }
];

export const HOW_IT_WORKS_STEPS = [
  {
    step: '01',
    title: 'Spot Jobs in Your Pin Code',
    description: 'Set your neighborhood radius. Discover verified openings at neighborhood cafes, boutiques, bookstores and warehouses within walking distance.'
  },
  {
    step: '02',
    title: '1-Tap Apply With Matched Fit',
    description: 'No lengthy CVs or formal cover letters. Select your free time slots, match with owner requirements, and apply directly in under 30 seconds.'
  },
  {
    step: '03',
    title: 'Start This Week & Get Paid',
    description: 'Hear back directly from owners in under 24 hours. Clock in your shifts and receive transparent hourly payments with zero commission deduction.'
  }
];

export const TESTIMONIALS = [
  {
    quote: "I found a barista role 500 meters from my apartment in Indiranagar. I pick 3 morning shifts a week around my college schedule and get paid ₹14,000 every month without disrupting exams.",
    author: "Rohan V.",
    role: "Computer Science Undergrad & Weekend Barista",
    shop: "Roast & Toast Studio",
    avatar: "RV"
  },
  {
    quote: "Finding dependable local help for our bakery weekend rushes used to take weeks of posting in neighborhood groups. With PartBase, we found two verified students in 4 hours.",
    author: "Meera K.",
    role: "Founder & Master Baker",
    shop: "The Crust Collective",
    avatar: "MK"
  },
  {
    quote: "The auto-apply and shift timeline match gave me 3 shift offers in my first 48 hours. Clear hourly rates with no hidden agency fees.",
    author: "Kavya S.",
    role: "Retail Floor Specialist",
    shop: "FabIndia Store",
    avatar: "KS"
  }
];
