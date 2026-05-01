import { useState } from 'react'
import Icon from '../components/Icon'

const GUIDE = [
  {
    id: 'mindset',
    title: 'The Right Mindset',
    icon: 'brain',
    items: [
      { heading: 'Support, don\'t coach', body: 'Your child already has a coach. Your role courtside is emotional support, not tactical instruction. Cheering effort — not outcome — builds a healthier relationship with competition.' },
      { heading: 'The car ride home', body: 'Research shows the most impactful thing a sports parent can say after a match is: "I love watching you play." Save analysis for when your child asks.' },
      { heading: 'Process over results', body: 'Long-term athletic development favours enjoyment and skill building over early winning. Celebrate consistency, effort, and improvement rather than wins alone.' },
    ],
  },
  {
    id: 'nutrition',
    title: 'Nutrition for Young Players',
    icon: 'leaf',
    items: [
      { heading: 'Pre-match meal (2–3 h before)', body: 'High in carbohydrates, moderate protein, low fat and fibre. Good options: pasta, rice with chicken, oats with banana. Avoid heavy, greasy, or unfamiliar foods.' },
      { heading: 'During play', body: 'Offer water every changeover. For sessions over 90 minutes, a banana or sports drink helps maintain blood sugar. Avoid sugary sweets.' },
      { heading: 'Post-training recovery', body: 'Within 30–45 minutes of training: protein + carbs to kickstart muscle repair. Chocolate milk, a sandwich, or yoghurt with fruit are all practical options.' },
    ],
  },
  {
    id: 'sleep',
    title: 'Sleep & Recovery',
    icon: 'heart-pulse',
    items: [
      { heading: 'How much sleep?', body: 'Ages 6–12: 9–12 hours. Ages 13–18: 8–10 hours. Prioritise consistent bedtimes — even on weekends. Deep sleep is when growth hormone is released.' },
      { heading: 'Screen curfew', body: 'No screens 60 minutes before bed. Blue light suppresses melatonin and delays sleep onset. Replace with reading, stretching, or quiet conversation.' },
      { heading: 'Travel tournaments', body: 'Crossing time zones disrupts sleep cycles. Arrive at least one day early per time zone crossed. Adopt destination timezone from day one.' },
    ],
  },
  {
    id: 'burnout',
    title: 'Preventing Burnout',
    icon: 'activity',
    items: [
      { heading: 'Signs to watch for', body: 'Persistent fatigue, loss of motivation, frequent illness, emotional volatility around tennis. These are red flags — not signs of weakness.' },
      { heading: 'Scheduling rest', body: 'At minimum one full rest day per week and one rest month per year. Top junior programs build mandatory off-seasons into their calendars.' },
      { heading: 'Multiple sports', body: 'Until age 12–14, playing multiple sports reduces injury risk and develops athleticism. Early specialisation is linked to higher dropout rates.' },
    ],
  },
  {
    id: 'communication',
    title: 'Working with the Coach',
    icon: 'users',
    items: [
      { heading: 'Respect the process', body: 'Coaches have a long-term development plan. Short-term losses may be intentional while new skills are embedded. Trust the programme.' },
      { heading: 'Schedule check-ins', body: 'Request a monthly 10-minute conversation to understand current goals and how you can support at home. Avoid interrupting coaching time.' },
      { heading: 'Your child\'s voice', body: 'Encourage your child to communicate directly with their coach. Self-advocacy is a crucial life skill and a key part of athletic independence.' },
    ],
  },
]

export default function ParentGuide({ onBack }) {
  const [open, setOpen] = useState(null)

  return (
    <div className="section-screen">
      <div className="section-screen-header">
        <button className="back-btn" onClick={onBack}><Icon name="chevron-left" size={18} /></button>
        <span className="section-screen-title">Parent Guide</span>
      </div>

      <div className="guide-intro">
        <div className="guide-intro-title">Supporting your athlete</div>
        <div className="guide-intro-body">
          Evidence-based guidance on how to help your young tennis player thrive on and off the court.
        </div>
      </div>

      <div className="guide-accordion">
        {GUIDE.map(s => (
          <div key={s.id} className={`guide-card${open === s.id ? ' guide-card--open' : ''}`}>
            <button className="guide-card-header" onClick={() => setOpen(open === s.id ? null : s.id)}>
              <div className="guide-card-icon"><Icon name={s.icon} size={18} /></div>
              <span className="guide-card-title">{s.title}</span>
              <div className={`guide-chevron${open === s.id ? ' guide-chevron--open' : ''}`}>
                <Icon name="chevron-right" size={16} />
              </div>
            </button>
            {open === s.id && (
              <div className="guide-card-body">
                {s.items.map(item => (
                  <div className="guide-item" key={item.heading}>
                    <div className="guide-item-heading">{item.heading}</div>
                    <div className="guide-item-body">{item.body}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
