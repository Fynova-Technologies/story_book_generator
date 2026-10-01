import {useState} from 'react'
import DraftSection from '../section/Dashboard/DraftSection'
import CompletedSection from '../section/Dashboard/CompletedSection'
import { StorySort } from '../services/storyService'

function Collection() {
    const [query, setQuery] = useState('')
    const [sort, setSort] = useState<StorySort>('newest')
  return (
    <div className='w-full px-4 sm:px-7 py-6 sm:py-7 space-y-8'>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* searchbox */}
        <label className="flex items-center gap-3 w-full sm:max-w-[507px] h-11 px-4 rounded-full bg-white focus-within:ring-2 focus-within:ring-light-primary/40">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="shrink-0 text-light-outline" aria-hidden>
            <circle cx="11" cy="11" r="7" /><path d="M20 20l-4-4" />
          </svg>
          <input
            type="search"
            placeholder="Search by title..."
            aria-label="Search stories"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 min-w-0 bg-transparent font-body text-base font-semibold text-light-text placeholder:text-light-outline focus:outline-none"
          />
        </label>

        <label className="relative flex items-center gap-2 self-start sm:self-auto h-11 pl-4 pr-10 rounded-full bg-white font-body text-xs focus-within:ring-2 focus-within:ring-light-primary/40">
          <span className="font-semibold text-light-outline">SORT:</span>
          <select
            aria-label="Sort stories"
            value={sort}
            onChange={(e) => setSort(e.target.value as StorySort)}
            className="appearance-none bg-transparent font-bold text-light-text focus:outline-none cursor-pointer">
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="title">Title (A–Z)</option>
          </select>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="pointer-events-none absolute right-4 text-light-outline" aria-hidden>
            <path d="M6 9l6 6 6-6" />
          </svg>
        </label>
      </div>
      <DraftSection query={query} sort={sort} hideViewAll />
      <CompletedSection query={query} sort={sort} hideViewAll />
    </div>
  )
}

export default Collection
