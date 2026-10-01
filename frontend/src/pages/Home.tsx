import { Link } from 'react-router-dom'
import {
  ArrowRight,
  BadgeCheck,
  BriefcaseBusiness,
  CirclePlay,
  Compass,
  Globe2,
  MapPin,
  Rocket,
  ShieldCheck,
  Sparkles,
} from 'lucide-react'
import AdminSupportBoard from '../components/AdminSupportBoard'
import AdvertisementDisplay from '../components/AdvertisementDisplay'
import CategorySquare from '../components/CategorySquare'
import CommunityHighlights from '../components/CommunityHighlights'
import GlobalServiceBoard from '../components/GlobalServiceBoard'
import ListingCard from '../components/ListingCard'
import RotatingGlobe from '../components/RotatingGlobe'
import SearchAndBrowse from '../components/SearchAndBrowse'
import { useAppContext } from '../context/AppContext'

const mainCategories = [
  { title: 'Classified', subtitle: 'FOR ALL PURPOSES', route: '/classified', info: 'Hiring – Jobs Available' },
  { title: 'Renting', subtitle: 'LOOKING TO RENT', route: '/renting', info: 'Giving For Rent' },
  { title: 'Education', subtitle: 'LEARNING & DEVELOPMENT', route: '/category/education', info: 'Courses, education and learning opportunities' },
  { title: 'Selling', subtitle: 'BUY & SELL', route: '/category/selling', info: 'Products and items for sale' },
  { title: 'Lottery', subtitle: 'LOTTERY & DRAW', route: '/category/lottery', info: 'Lottery opportunities and draws' },
  { title: 'Winners', subtitle: 'WINNERS & RESULTS', route: '/category/winners', info: 'Latest winners and results' },
  { title: 'Relief Fund For The Victims', subtitle: 'SUPPORT & ASSISTANCE', route: '/category/relief-fund', info: 'Help and support for victims' },
  { title: 'Events', subtitle: 'WORKSHOPS & HAPPENINGS', route: '/events', info: 'Meetups and showcases' },
  { title: 'Stock Exchange', subtitle: 'MARKET & TRADING', route: '/category/stock-exchange', info: 'Stocks, markets and exchange information' },
  { title: 'Service Stations', subtitle: 'SERVICES & LOCATIONS', route: '/category/service-stations', info: 'Find available service stations' },
  { title: 'Free Gifts', subtitle: 'GIFTS & OFFERS', route: '/category/free-gifts', info: 'Free gifts and special offers' },
] as const

const serviceHighlights = [
  { label: 'Pure Knowledge', description: 'Guidance and information for all life decisions.', icon: Compass },
  { label: 'Health', description: 'Wellness, support and practical care guidance.', icon: ShieldCheck },
  { label: 'Beauty', description: 'Style, grooming and personal care services.', icon: Sparkles },
  { label: 'Transportation', description: 'Personal, work and business rides.', icon: BriefcaseBusiness },
  { label: 'Currency Exchange', description: '$ – € – ₹ – ¥ – £ – ₩ – AED', icon: Globe2 },
  { label: 'Money Transfer', description: 'Direct transfers with local support.', icon: Rocket },
]

const perks = [
  {
    icon: ShieldCheck,
    title: 'Verified & Secure',
    text: 'Every seller and service provider is checked before listing.',
  },
  {
    icon: Rocket,
    title: 'List in Seconds',
    text: 'Launch your ad or update with a guided, simple flow.',
  },
  {
    icon: BadgeCheck,
    title: 'Quality Guaranteed',
    text: 'A polished marketplace with thoughtful moderation and trust.',
  },
]

export default function Home() {
  const { listings: appListings } = useAppContext()
  const latestUpdates = [...appListings].sort((a, b) => b.views - a.views).slice(0, 4)
  const featured = appListings.filter((listing) => listing.featured).slice(0, 4)

  return (
    <div className="page-shell">
      <section className="hero-section">
        <div className="hero-overlay" />
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-8">
          <div className="grid items-center gap-x-6 gap-y-4 md:grid-cols-[minmax(0,1.1fr)_minmax(300px,0.9fr)]">
            <div className="hero-globe-position order-1 flex w-full items-center justify-center md:self-start">
              <div className="hero-visual-wrap">
                <RotatingGlobe />
              </div>
            </div>

            <div className="hero-featured-ad order-2 flex w-full justify-center self-start md:col-start-2 md:row-start-1">
              <AdvertisementDisplay />
            </div>

            <div className="order-3 max-w-4xl pl-1 text-left sm:pl-2 md:col-span-2 md:row-start-2 md:-mt-10 lg:-mt-16 lg:pl-6">
              <h1 className="mt-0 max-w-[800px] font-display text-3xl font-extrabold leading-tight text-[#071A3D] sm:text-4xl lg:text-5xl">
                Discover trusted services in one elegant platform
              </h1>

              <p className="mt-4 max-w-[850px] text-base leading-relaxed text-slate-600 sm:mt-5 sm:text-xl">
                Discover homes, jobs, community groups, events, memberships and trusted services across cities and countries in one elegant platform.
              </p>
            </div>

          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <span className="h-1.5 w-8 rounded-full bg-gradient-to-r from-brand-500 to-brand-700" />
              <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-brand-700">Featured</span>
            </div>
            <h2 className="font-display text-2xl font-bold text-slate-900 sm:text-3xl">Marketplace squares</h2>
          </div>
          <Link to="/listings" className="hidden items-center gap-2 rounded-full border border-brand-200 bg-brand-50 px-3 py-2 text-sm font-semibold text-brand-800 transition hover:bg-brand-100 sm:inline-flex">
            Browse all <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="marketplace-grid">
          {mainCategories.map((category) => (
            <CategorySquare key={category.title} {...category} />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <span className="h-1.5 w-8 rounded-full bg-gradient-to-r from-brand-500 to-brand-700" />
              <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-brand-700">Latest Updates</span>
            </div>
            <h2 className="font-display text-2xl font-bold text-slate-900 sm:text-3xl">All popping advertisement</h2>
          </div>
          <Link to="/listings" className="inline-flex items-center gap-2 text-sm font-semibold text-brand-700 hover:text-brand-800">
            View all ads <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {latestUpdates.map((listing) => (
            <div key={listing.id} className="latest-update-card">
              <img src={listing.image} alt={listing.title} className="latest-update-card__image" loading="lazy" />
              <div className="latest-update-card__content">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <span className="rounded-full bg-brand-100 px-2 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-brand-800">{listing.category}</span>
                  <span className="flex items-center gap-1 text-xs text-slate-500"><MapPin className="h-3.5 w-3.5 text-brand-600" /> {listing.location}</span>
                </div>
                <h3 className="font-display text-xl font-bold text-slate-900">{listing.title}</h3>
                <p className="mt-2 line-clamp-3 text-sm text-slate-600">{listing.description}</p>
                <div className="mt-4 flex items-center justify-between gap-3">
                  <div>
                    <p className="font-display text-xl font-bold text-brand-800">{listing.price === 0 ? 'Contact' : `$${listing.price.toLocaleString()}`}</p>
                    <p className="mt-1 text-xs text-slate-500">Posted by {listing.seller.name}</p>
                  </div>
                  <button type="button" className="inline-flex items-center gap-2 rounded-full border border-brand-200 bg-brand-50 px-3 py-2 text-xs font-semibold text-brand-800">
                    <CirclePlay className="h-3.5 w-3.5" /> Preview
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="mb-2 flex items-center gap-2">
            <span className="h-1.5 w-8 rounded-full bg-gradient-to-r from-brand-500 to-brand-700" />
            <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-brand-700">Services</span>
          </div>
          <h2 className="font-display text-2xl font-bold text-slate-900 sm:text-3xl">Knowledge, health & support</h2>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {serviceHighlights.map(({ label, description, icon: Icon }) => (
            <div key={label} className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-[0_20px_50px_rgba(30,58,138,0.08)]">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-100 to-brand-200 text-brand-800">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="font-display text-lg font-bold text-slate-900">{label}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
              <button type="button" className="mt-4 inline-flex items-center gap-2 rounded-full border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:border-brand-200 hover:text-brand-800">
                Request service <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
      </section>

      <SearchAndBrowse />
      <GlobalServiceBoard />
      <CommunityHighlights />
      <AdminSupportBoard />

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <span className="h-1.5 w-8 rounded-full bg-gradient-to-r from-brand-500 to-brand-700" />
              <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-brand-700">Trending</span>
            </div>
            <h2 className="font-display text-2xl font-bold text-slate-900 sm:text-3xl">Featured listings</h2>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {featured.map((listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-6 md:grid-cols-3">
          {perks.map((perk) => (
            <div key={perk.title} className="rounded-[28px] border border-slate-200 bg-white p-7 shadow-sm transition hover:shadow-lg">
              <span className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-brand-800 text-white">
                <perk.icon className="h-5 w-5" />
              </span>
              <h3 className="font-display text-lg font-bold text-slate-900">{perk.title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">{perk.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-20 pt-10 sm:px-6 lg:px-8">
        <div className="rounded-[30px] border border-brand-200 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.18),transparent_22%),linear-gradient(135deg,#1c3f7d_0%,#254d9f_30%,#d8b26d_100%)] p-8 text-center shadow-[0_30px_80px_rgba(23,63,138,0.22)] sm:p-12">
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-white/80">Presented By – Miss SSZP</p>
          <h2 className="mt-4 font-display text-3xl font-extrabold text-white sm:text-4xl">A trusted international connection hub</h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-white/80 sm:text-base">
            Connect communities, discover professionals, and explore fresh opportunities in a premium marketplace built for local trust and global reach.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link to="/listings" className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-brand-900 shadow-lg transition hover:bg-brand-50">
              Browse listings <ArrowRight className="h-4 w-4" />
            </Link>
            <Link to="/post-ad" className="inline-flex items-center justify-center gap-2 rounded-full border border-white/30 bg-white/10 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/15">
              Post an ad
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
