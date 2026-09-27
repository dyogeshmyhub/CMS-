export type MarketplaceCategory =
  | 'classified'
  | 'renting'
  | 'housing'
  | 'events'
  | 'gold'
  | 'community'
  | 'ethnicity'
  | 'membership'
  | 'funding'

export interface MarketplaceServiceItem {
  id: string
  title: string
  description: string
  category: MarketplaceCategory
  location?: string
  contact?: string
  availability?: string
  status?: 'available' | 'limited' | 'coming-soon'
}

export interface ExternalSource {
  id: string
  name: string
  sourceUrl: string
  apiEndpoint?: string
  syncStatus: 'idle' | 'syncing' | 'success' | 'error'
  lastSyncedAt?: string
  importedRecords: number
  errorStatus?: string
}

export const marketplaceServices: MarketplaceServiceItem[] = [
  { id: 'svc-1', title: 'Membership = For All Purposes', description: 'Members can access general business, social and community support.', category: 'membership', location: 'Global', contact: 'support@marketplace.local', availability: '24/7', status: 'available' },
  { id: 'svc-2', title: 'Funding', description: 'Business funding support, sponsorships and initiative backing.', category: 'funding', location: 'Global', contact: 'funding@marketplace.local', availability: 'Business hours', status: 'limited' },
  { id: 'svc-3', title: 'Classified = Hiring – Jobs Available', description: 'Event-driven hiring and work opportunities across countries.', category: 'classified', location: 'Remote & Local', contact: 'jobs@marketplace.local', availability: 'Open now', status: 'available' },
  { id: 'svc-4', title: 'Renting = Looking To Rent – Giving For Rent', description: 'Rental listings and placement assistance for houses and apartments.', category: 'renting', location: 'Global', contact: 'rentals@marketplace.local', availability: 'Updated daily', status: 'available' },
  { id: 'svc-5', title: 'Housing = Selling – Owning – Leasing', description: 'Real estate sales, ownership and lease opportunities.', category: 'housing', location: 'Citywide', contact: 'housing@marketplace.local', availability: 'Live', status: 'available' },
  { id: 'svc-6', title: 'Gold = 22k – 18k – 10k', description: 'Gold listings and pricing guidance for buyers and sellers.', category: 'gold', location: 'Regional', contact: 'gold@marketplace.local', availability: 'Live pricing', status: 'available' },
  { id: 'svc-7', title: 'Lottery = Hard Cash – Gifts – Free Tickets – Free Coupons', description: 'Prize and promotional community events.', category: 'community', location: 'Local & Global', contact: 'community@marketplace.local', availability: 'Seasonal', status: 'limited' },
  { id: 'svc-8', title: 'Community = Domestic & Global Groups', description: 'Groups and connections for local and international communities.', category: 'community', location: 'Global', contact: 'groups@marketplace.local', availability: 'Open', status: 'available' },
  { id: 'svc-9', title: 'Ethnicity = Global Culture & Connection', description: 'Cultural and heritage-driven community networking.', category: 'ethnicity', location: 'Global', contact: 'culture@marketplace.local', availability: 'Open', status: 'available' },
  { id: 'svc-10', title: 'Education = Online Certified Classes / Courses / Tutoring', description: 'Learning opportunities and certification guidance.', category: 'membership', location: 'Online', contact: 'education@marketplace.local', availability: 'Live', status: 'available' },
  { id: 'svc-11', title: 'News = Latest News – Immigration – Business – Etcetera', description: 'Curated business, immigration and local community updates.', category: 'classified', location: 'Global', contact: 'news@marketplace.local', availability: 'Updated daily', status: 'available' },
  { id: 'svc-12', title: 'Technical Services = Call and ask for 24/7', description: 'Technical assistance for troubleshooting and setup support.', category: 'classified', location: 'Remote', contact: 'tech@marketplace.local', availability: '24/7', status: 'available' },
  { id: 'svc-13', title: 'Daily Services = Call and ask for 27/7', description: 'Daily help for household and practical service needs.', category: 'classified', location: 'Local', contact: 'daily@marketplace.local', availability: '27/7', status: 'available' },
  { id: 'svc-14', title: 'E-Commerce = Accessories + Training', description: 'Product sales and guidance for accessories and commerce support.', category: 'membership', location: 'Global', contact: 'commerce@marketplace.local', availability: 'Live', status: 'available' },
  { id: 'svc-15', title: 'Shipment labels = USPS – DHL – UPS – Others', description: 'Shipping and courier coordination for various providers.', category: 'funding', location: 'Global', contact: 'shipping@marketplace.local', availability: 'On demand', status: 'limited' },
]

export const rightSideServices: MarketplaceServiceItem[] = [
  { id: 'rs-1', title: 'Pure Knowledge', description: 'Research and practical guidance for everyday questions.', category: 'membership', location: 'Global', availability: 'By request' },
  { id: 'rs-2', title: 'Health', description: 'Support and wellness guidance from trusted experts.', category: 'community', location: 'Local', availability: 'By request' },
  { id: 'rs-3', title: 'Beauty', description: 'Hair, grooming and beauty service recommendations.', category: 'community', location: 'Local', availability: 'By request' },
  { id: 'rs-4', title: 'Transportation / Rides', description: 'Personal, work and business transportation support.', category: 'renting', location: 'Citywide', availability: 'Available' },
  { id: 'rs-5', title: 'Currency Exchange', description: '$ – € – ₹ – ¥ – £ – ₩ – AED – Etcetera', category: 'funding', location: 'Global', availability: 'Live' },
  { id: 'rs-6', title: 'Money Transfer', description: 'Direct transfers and support for immediate transactions.', category: 'funding', location: 'Global', availability: '24/7' },
  { id: 'rs-7', title: 'Taxes', description: 'Direct guidance for tax filing and financial support.', category: 'funding', location: 'Global', availability: 'By appointment' },
  { id: 'rs-8', title: 'Stress Issue', description: 'Problem solving and emotional support coordination.', category: 'community', location: 'Remote', availability: 'Available' },
  { id: 'rs-9', title: 'Consultation', description: 'Any kind of consultation and expert support.', category: 'membership', location: 'Global', availability: 'By request' },
  { id: 'rs-10', title: 'Travel Packages', description: 'Travel planning and best-value holiday packages.', category: 'events', location: 'Global', availability: 'Seasonal' },
  { id: 'rs-11', title: 'Insurance', description: 'Coverage options with best benefits and guidance.', category: 'funding', location: 'Regional', availability: 'Available' },
  { id: 'rs-12', title: 'Lawyers', description: 'Legal support across all types of cases.', category: 'community', location: 'Regional', availability: 'By appointment' },
  { id: 'rs-13', title: 'Janitorial', description: 'Residential and commercial cleaning services.', category: 'classified', location: 'Local', availability: 'Open' },
  { id: 'rs-14', title: 'Any Questions', description: 'Representative available 24/7 for support.', category: 'community', location: 'Global', availability: '24/7' },
]

export const entertainmentCards = [
  { id: 'ent-1', title: 'Jokes For The Day', category: 'entertainment', description: 'Light humor and daily smile content.' },
  { id: 'ent-2', title: 'Thought For The Day', category: 'entertainment', description: 'Daily encouragement and reflection.' },
  { id: 'ent-3', title: 'General Knowledge', category: 'knowledge', description: 'Fun facts and quick learning snippets.' },
  { id: 'ent-4', title: 'Midday Girl', category: 'community', description: 'Lifestyle, advice and cultural inspiration.' },
  { id: 'ent-5', title: 'Horoscope', category: 'knowledge', description: 'Daily guidance and fun reading.' },
]

export const socialProfiles = [
  { id: 'person-1', name: 'Aisha', interests: ['Travel', 'Events', 'Culture'], location: 'Dubai', community: 'Global Friends', status: 'Open to connect' },
  { id: 'person-2', name: 'Mason', interests: ['Tech', 'Business', 'Fitness'], location: 'Toronto', community: 'Business Circle', status: 'Looking to network' },
  { id: 'person-3', name: 'Sara', interests: ['Community', 'Health', 'Education'], location: 'Lahore', community: 'Support Circle', status: 'Available to chat' },
]

export const externalSources: ExternalSource[] = [
  { id: 'source-1', name: 'Craigslist Feed', sourceUrl: 'https://example.com/craigslist', apiEndpoint: '/api/external/craigslist', syncStatus: 'success', lastSyncedAt: '2026-09-27T08:00:00.000Z', importedRecords: 1240, errorStatus: '' },
  { id: 'source-2', name: 'Khabar News Feed', sourceUrl: 'https://example.com/khabar', apiEndpoint: '/api/external/khabar', syncStatus: 'syncing', lastSyncedAt: '2026-09-27T07:30:00.000Z', importedRecords: 480 },
  { id: 'source-3', name: 'Community Directory', sourceUrl: 'https://example.com/communities', apiEndpoint: '/api/external/communities', syncStatus: 'error', lastSyncedAt: '2026-09-26T12:00:00.000Z', importedRecords: 210, errorStatus: 'Rate limit exceeded' },
]
