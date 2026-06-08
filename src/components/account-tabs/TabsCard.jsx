import { useState } from 'react'

export default function TabsCard({ tabs, defaultTab }) {
  const [active, setActive] = useState(defaultTab || tabs[0]?.id)

  const activeTab = tabs.find(t => t.id === active)

  return (
    <div className="tabs-card">
      <div className="tabs-card-header">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`tabs-card-tab${active === tab.id ? ' active' : ''}`}
            onClick={() => setActive(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="tabs-card-body">
        {activeTab?.content}
      </div>
    </div>
  )
}
