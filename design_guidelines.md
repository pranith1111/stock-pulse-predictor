# StockPulse Predictor - Design Guidelines

## Design Approach

**Hybrid Approach**: Modern Fintech Aesthetic + Material Design System
- **Primary Inspiration**: Robinhood's clean data presentation, Webull's information hierarchy, Trading212's dashboard layouts
- **Foundation**: Material Design principles for data-heavy components, cards, and interactions
- **Key Principle**: Balance sophisticated financial credibility with approachable, modern interface design

## Typography System

**Font Families**:
- Primary: 'Inter' (Google Fonts) - All UI text, data, numbers
- Accent: 'JetBrains Mono' (Google Fonts) - Stock symbols, prices, numerical data

**Hierarchy**:
- Hero/Page Titles: text-4xl to text-5xl, font-bold
- Section Headings: text-2xl to text-3xl, font-semibold
- Card Titles: text-lg to text-xl, font-semibold
- Body Text: text-base, font-normal
- Captions/Metadata: text-sm, font-medium
- Stock Prices: text-2xl to text-3xl, font-mono (JetBrains Mono)
- Stock Symbols: text-sm, font-mono, uppercase, tracking-wider

## Layout System

**Spacing Primitives**: Use Tailwind units of 2, 4, 6, 8, 12, 16, 20, 24
- Card padding: p-6 to p-8
- Section spacing: py-12 to py-20
- Element gaps: gap-4 to gap-8
- Component margins: mb-6, mt-8, mx-4

**Container Strategy**:
- Maximum width: max-w-7xl for main content
- Dashboard grid: Full-width with internal max-width constraints
- Forms: max-w-md centered
- Data tables/charts: max-w-6xl

## Core Components

### Navigation Bar
- Sticky top navigation with blur backdrop effect (backdrop-blur-lg)
- Logo left, navigation center (Home, Dashboard, Reviews, Profile), user menu right
- Height: h-16
- Includes notification bell icon and dark mode toggle
- Mobile: Hamburger menu with slide-out drawer

### Authentication Pages (Login/Signup)
- Split-screen layout on desktop (lg:grid-cols-2)
- Left side: Branding with gradient background and value proposition text
- Right side: Authentication form (max-w-md, centered vertically)
- Form cards: Elevated with shadow-lg, rounded-xl, p-8
- Social proof element: "Join 10,000+ investors" badge near form
- Mobile: Single column, minimal branding at top

### Dashboard (Home Page)

**Hero Section**: 
- Height: min-h-[400px] not full viewport
- Contains: Welcome message, quick stats overview (3-column grid showing portfolio value, today's gain/loss, watchlist count)
- Large search bar prominently placed (w-full max-w-2xl) with icon and autocomplete styling

**Stock Search & Results**:
- Search input: Large, rounded-lg, with magnifying glass icon, placeholder "Search stocks (e.g., AAPL, TSLA)"
- Results card: Appears below search with stock name, symbol, current price, change percentage
- Stock data display: Grid layout showing key metrics (Open, High, Low, Volume, Market Cap)

**AI Prediction Panel**:
- Prominent card with gradient border indicating prediction type
- Buy (green accent), Sell (red accent), Hold (gray accent)
- Large confidence percentage display (text-4xl, font-bold)
- Supporting metrics grid below (2-3 columns)
- Visual indicator: Icon or badge showing prediction strength
- Disclaimer text at bottom (text-xs)

**Stock Chart Visualization**:
- Full-width chart container (rounded-lg border)
- Time range selector buttons above chart (1D, 1W, 1M, 3M, 1Y, All)
- Chart height: h-80 to h-96
- Clean grid lines, color-coded gain/loss areas
- Tooltip on hover showing exact values

**Watchlist Section**:
- Grid of stock cards (grid-cols-1 md:grid-cols-2 lg:grid-cols-3)
- Each card: Stock symbol, name, current price, percentage change, mini sparkline chart
- Add to watchlist button: Prominent, with star icon
- Empty state: Illustration with "Add your first stock" CTA

### Review Page

**Layout**:
- Two-column layout on desktop (2:1 ratio)
- Left: Review submission form (sticky positioning)
- Right: Reviews feed with infinite scroll

**Review Form Card**:
- Stock symbol selector dropdown
- Star rating input (large, interactive stars)
- Text area for comments (min-h-32)
- Submit button (full-width, prominent)
- Character counter for comment field

**Review Display**:
- Cards with user avatar, name, timestamp
- Star rating display prominently
- Stock symbol badge
- Review text with read more expansion
- Helpful/Like counter at bottom
- Own reviews: Edit/Delete options

### Profile Page

**Layout**: Two-column (1:2 ratio on desktop)

**Left Sidebar**:
- User profile card with avatar placeholder, name, email, join date
- Account stats: Total reviews, watchlist items, predictions viewed
- Edit profile button
- Logout button (outlined, red on hover)

**Main Content Area**:
- Tabbed interface: Watchlist | Review History | Account Settings
- Watchlist tab: Similar grid to dashboard watchlist
- Review History: List view of user's reviews with inline actions
- Settings: Form for updating password, notification preferences

## Interaction Patterns

**Buttons**:
- Primary: Filled, rounded-lg, px-6 py-3, font-semibold
- Secondary: Outlined, rounded-lg, px-6 py-3
- Text buttons: No background, underline on hover
- Icon buttons: Circular (rounded-full), p-2 to p-3

**Cards**:
- Standard: rounded-xl, border, shadow-sm
- Elevated: shadow-lg for important information
- Interactive: Hover lift effect (transform transition), cursor-pointer
- Consistent padding: p-6 to p-8

**Forms**:
- Input fields: rounded-lg, border-2, px-4 py-3, focus ring
- Labels: text-sm, font-medium, mb-2
- Error states: Red border, error text below (text-sm)
- Success states: Green border, checkmark icon
- Floating labels for modern feel

**Loading States**:
- Skeleton loaders for data tables and cards
- Spinner for form submissions (centered in button)
- Progress bar for page transitions
- Shimmer animation on placeholder content

**Toast Notifications**:
- Top-right positioning
- Success (green accent), Error (red accent), Info (blue accent)
- Auto-dismiss after 5 seconds
- Slide-in animation from right
- Close button (X icon)

## Data Visualization

**Stock Charts**:
- Line chart for price trends (smooth curves)
- Area fill with gradient (subtle opacity)
- Tooltip with crosshair on hover
- Responsive height scaling
- Clean axis labels with grid lines

**Metric Cards**:
- Large number display with label below
- Percentage change with arrow icon (up/down)
- Micro chart or sparkline when applicable
- Conditional styling for positive/negative values

**Stat Badges**:
- Pill-shaped (rounded-full)
- Distinct styling for Buy/Sell/Hold indicators
- Icon + text combination
- Appropriate spacing (px-3 py-1.5)

## Special Features

**Dark Mode**:
- Toggle in navbar (moon/sun icon)
- Smooth transition between modes
- Proper contrast ratios for both modes
- Chart colors adapt to theme

**Responsive Breakpoints**:
- Mobile: Single column layouts, stacked navigation
- Tablet (md): 2-column grids, expanded navigation
- Desktop (lg): 3-column grids, full layouts
- Large screens (xl): Wider containers, more horizontal space

**Empty States**:
- Centered illustration or icon
- Helpful message (text-lg, font-medium)
- Primary CTA to resolve empty state
- Light background with border

## Footer

**Layout**: 3-column grid on desktop
- Column 1: Logo, tagline, social links
- Column 2: Quick links (About, Contact, Privacy, Terms)
- Column 3: Newsletter signup (inline form with email input + button)
- Bottom bar: Copyright text, "Made with ❤️" attribution
- Spacing: py-12 with horizontal divider above

## Images

**Hero Image/Illustrations**:
- No large hero image on dashboard (data-focused interface)
- Authentication pages: Abstract financial/technology illustration on branding side
- Empty states: Simple line illustrations for watchlist, reviews
- Profile: User avatar placeholder (circular, with initials if no image)

**Icons**: Use Heroicons throughout (outline style for navigation, solid for actions)

This design creates a professional, trustworthy financial platform that balances data density with modern aesthetics, ensuring users can quickly access critical information while enjoying a polished, intuitive experience.