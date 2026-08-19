# Vegas Travel Intelligence

An area-first Las Vegas travel website for planning neighborhoods, understanding time-of-day activity patterns, and reviewing clearly labeled situational-awareness information.

## Run

```bash
npm test
npm start
```

Open `http://localhost:3000`.

## Experience

- Old Strip and New Strip are separate starting points.
- Downtown/Fremont, Arts District, Chinatown, Airport Corridor, Summerlin, and Henderson are included as distinct area guides.
- The map changes modeled activity colors by hour.
- Demo events are visibly marked as not live.
- The site includes itinerary concepts for neon, desert, and food-focused days.

## Safety-data boundary

The current event list is fixture data. It must not be presented as current attacks or threats. Before connecting a live feed, add:

- Official source provenance and timestamps
- Feed freshness and outage states
- Deduplication and geolocation confidence
- Human review for ambiguous reports
- Emergency links and clear `call 911` messaging
- Privacy and data-retention rules

The activity map is an aggregate planning model, not a crime prediction system and not emergency guidance.

## Data adapters

Potential official or licensed integrations include:

- Las Vegas and Clark County open-data portals
- LVMPD/public-safety data where legally available
- RTC transit and service alerts
- Licensed hotel, event, restaurant, and ticket providers
- Weather, heat, air-quality, and road-closure feeds

Keep provider credentials server-side and retain raw-source timestamps in every normalized event.
