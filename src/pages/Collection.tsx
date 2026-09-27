import {useState} from 'react'
import DraftSection from '../section/Dashboard/DraftSection'
import CompletedSection from '../section/Dashboard/CompletedSection'


type FilterTab = "All" | "Premium" | "Free";

const FILTER_TABS: FilterTab[] = ["All", "Premium", "Free"];
function Collection() {
    const[activeTab, setActiveTab]= useState<FilterTab>("All")
  return (
    <div className='p-6 bg-light-bg'>
      <div className="flex justify-between items-center gap-4 p-2 mb-2 ">
        {/* searchbox */}
        <input 
            type="text" 
            placeholder="Search..." 
            className="w-100 border bg-light-on-primary border-gray-300 rounded-3xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <div className="flex items-center gap-6">

            <div className="flex items-center gap-1 bg-dark-text dark:bg-dark-primary-10 border-light-outline-secondary
             dark:border-dark-primary-30 rounded-3xl p-1">
              {FILTER_TABS.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`font-body text-md font-medium px-3 py-1 rounded-2xl transition-all
                    ${activeTab === tab
                      ? "bg-light-on-primary dark:bg-dark-bg text-light-primary dark:text-dark-text shadow-sm"
                      : "text-light-outline dark:text-dark-text hover:text-light-text dark:hover:text-dark-primary"
                    }
                  `}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div>
            <select className="border border-gray-300 rounded-lg px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option>Newest First</option>
                <option>Oldest First</option>
            </select>
            </div>

        </div>

        </div>
        <DraftSection/>
        <CompletedSection/>
    </div>
  )
}

export default Collection
