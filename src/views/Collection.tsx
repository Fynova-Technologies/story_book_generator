import {useState} from 'react'
import DraftSection from '../section/Dashboard/DraftSection'
import CompletedSection from '../section/Dashboard/CompletedSection'
import { StorySort } from '../services/storyService'

function Collection() {
    const [query, setQuery] = useState('')
    const [sort, setSort] = useState<StorySort>('newest')
  return (
    <div className='p-6 bg-light-bg'>
      <div className="flex justify-between items-center gap-4 p-2 mb-2 ">
        {/* searchbox */}
        <input
            type="search"
            placeholder="Search..."
            aria-label="Search stories"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-100 border bg-light-on-primary border-gray-300 rounded-3xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <select
            aria-label="Sort stories"
            value={sort}
            onChange={(e) => setSort(e.target.value as StorySort)}
            className="border border-gray-300 rounded-lg px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="title">Title (A–Z)</option>
        </select>

        </div>
        <DraftSection query={query} sort={sort} hideViewAll />
        <CompletedSection query={query} sort={sort} hideViewAll />
    </div>
  )
}

export default Collection
