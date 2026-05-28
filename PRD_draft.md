# Product Requirements Document (PRD)
## Project: RoamCraft (AI-Powered Custom Itinerary & Travel Companion)

- **Course**: Introduction to AI Programming (2026 Spring Semester)
- **Document**: Final Project Task 1 - Service Idea & PRD Draft
- **Due Date**: 2026-06-02
- **Date of Submission**: 2026-05-28

---

## 1. Team Information
* **Team Name**: Team A2
* **Team Members**:
  * **Eunseo** (Lead Developer & UI/UX Designer) - Department of Computer Science / AI Engineering
  * **[Team Member 2 Name]** (Backend API & AI Integration) - [Department/Major]
  * **[Team Member 3 Name]** (Database & QA Engineer) - [Department/Major]

---

## 2. Service Name
* **Service Name**: **RoamCraft**
* **Tagline**: *Crafting Your Perfect Journey, Guided by AI.*

---

## 3. Product Overview
**RoamCraft** is a premium, AI-driven travel planning web application that solves the fragmented and stressful nature of travel preparation. By leveraging generative AI (Google Gemini API), RoamCraft automatically synthesizes custom day-by-day itineraries, generates localized expense forecasts with visual budget charts, and curates contextual, climate-aware packing checklists.

Instead of browsing dozens of blogs, maps, and spreadsheets, users input their destination, dates, budget level, and preferred pacing to receive a unified, highly polished dashboard showing their complete custom-made travel experience in seconds.

---

## 4. Target Users
1. **Busy Professionals & Students**: Users who want to experience high-quality travel but lack the time to spend hours researching and planning.
2. **Value-Oriented Travelers**: Individuals who need realistic cost estimates and live budget tracking to avoid overspending in foreign destinations.
3. **Pace-Conscious Explorers**: Travelers who want custom tailoring over their physical exertion level, ranging from "relaxed cafe-hopping" to "active outdoor adventure."

---

## 5. Problem or Need
Traditional travel planning is highly fragmented and causes decision fatigue:
- **Scattered Information**: Travelers must cross-reference hotel locations, transportation routes, local weather, and restaurant reviews across different platforms.
- **Budgeting Uncertainty**: Estimating local expenses (meals, transit, sightseeing) in unfamiliar cities is difficult, often leading to financial surprises.
- **Packing Anxiety**: People frequently overpack or forget essential items because standard checklists do not account for both local weather forecasts and specific scheduled activities (e.g., bringing hiking boots only if a trail is scheduled).

---

## 6. Core User Scenario
### Scenario: Planning a Weekend in Jeju Island
1. **Inputting Preferences**: Sarah, a 28-year-old marketing manager in Seoul, wants to plan a 3-day weekend trip to Jeju Island. She opens **RoamCraft**, inputs her destination (Jeju), travel dates (June 5–7), budget level (Moderate), and travel style (Relaxing, Nature-focused, Foodie).
2. **AI-Generation**: Sarah clicks "Craft My Journey." In seconds, the Gemini-powered backend parses her choices and outputs a complete, styled schedule.
3. **Exploring the Itinerary**: Sarah sees a beautiful glassmorphic dashboard. Day 1 is dedicated to the Aewol Coastal Walk and local seafood cafes, matching her "Relaxing & Foodie" preferences. Each activity shows estimated travel times, transit tips, and visual card overlays.
4. **Analyzing the Budget**: She navigates to the "Budget Tracker" tab. The app displays an interactive pie chart predicting costs: Accommodation (40%), Food (30%), Activities (20%), and Transit (10%). It estimates her total trip cost at 450,000 KRW, allowing her to log expenses on the fly.
5. **Smart Packing**: In the "Packing List" tab, the AI has compiled a checklist containing light clothing (matching Jeju's warm June forecast) and comfortable walking shoes (since a coastal hike is on the itinerary). 
6. **Vercel Save & Go**: She saves the link, bookmarked on her mobile browser via the Vercel-deployed web app, ready for her trip.

---

## 7. Key Features
RoamCraft will implement three primary features, satisfying the core project requirements:

### Feature 1: AI-Driven Visual Itinerary Planner
* **Description**: Custom timeline generation matching destination, pacing, and preferences.
* **Details**:
  * Users can adjust travel pacing: **Relaxed** (2-3 spots/day), **Moderate** (3-4 spots/day), or **Active** (5+ spots/day).
  * Timelines include precise scheduling hours, transit time estimations, activity tags (e.g., #Nature, #Historical, #Foodie), and helpful tips (e.g., "Book tickets in advance").
  * Interactivity: Expandable cards showing detailed descriptions of spots.

### Feature 2: Smart Budget Estimator & Analytics
* **Description**: Pre-departure expense forecasting and live trip budgeting.
* **Details**:
  * Estimates localized costs for accommodation, meals, activities, and transport based on the user's budget tier (Budget, Mid-range, Luxury).
  * Provides a visually premium analytics dashboard (interactive SVG donut/pie charts) representing budget categories.
  * Allows users to add, edit, and categorize actual expenses during their trip to compare against the AI forecast.

### Feature 3: Weather & Activity-Driven Packing Checklist
* **Description**: Context-aware checklist generation based on destination weather and scheduled activities.
* **Details**:
  * The AI cross-references the destination's climate data for the travel month with the generated activities.
  * Generates organized checklists categorized by Essentials, Apparel, Gear (e.g., "Rain jacket" if rainy weather is expected, "Swimwear" for beach visits), and Electronics.
  * Checklist items can be checked off in real-time with responsive UI check animations.

---

## 8. AI Usage Plan
To deliver high service value and ensure academic transparency, our AI strategy covers both the product operations and development stages:

### A. In-Service AI Operations
* **LLM API Integration**: We will utilize the **Google Gemini API** (via Next.js serverless API routes) to perform structured travel planning.
* **Prompt Engineering**: We will design specialized prompts with strict JSON schemas to ensure the AI returns reliably structured responses. Example prompt format:
  ```json
  {
    "itinerary": [
      {
        "day": 1,
        "activities": [{"time": "10:00 AM", "spotName": "...", "description": "..."}]
      }
    ],
    "budgetEstimate": {"accommodation": 150000, "food": 100000, "activities": 50000, "transit": 30000},
    "packingItems": ["Item 1", "Item 2"]
  }
  ```

### B. AI-Assisted Development Flow
* **UI Design & Code Generation**: Use AI coding assistants (Gemini, Claude, Cursor) to construct highly aesthetic layouts, write clean Vanilla CSS components, and eliminate CSS styling bottlenecks.
* **Debugging & Refactoring**: Utilize AI tools for reviewing terminal errors, optimizing Next.js state management, and refactoring API calls.
* **Documentation**: Log the development process in the required `AI_USAGE.md` format.

---

## 9. Page Structure
RoamCraft will be a modern Single Page Application (SPA) dashboard structure built with React/Next.js, offering a seamless, app-like feel:

1. **Home / Landing Section**
   - Sleek header, glowing modern hero banner.
   - Beautiful input form: Destination search, date picker, pacing slider, budget selectors, and style tags.
   - Interactive CTA (Call-to-Action) button with transition effects.
2. **Dashboard / Result Section** (Visible after itinerary generation)
   - **Main Panel**: Side-by-side tabs containing:
     * **Itinerary Tab**: Vertical chronological timeline of cards.
     * **Budget Tab**: Visual expense breakdown charts and expense addition forms.
     * **Packing Tab**: Interactive checklist grid.
3. **Saved Trips Section**
   - Simple list of previously planned trips stored locally in the browser's `localStorage` for instant reload.
4. **About & Methodology Section**
   - Explains the system architecture, the technology stack, and prompt engineering methods to demonstrate technical mastery.

---

## 10. Development Plan & Work Division
We will execute our development in four structured sprints to ensure code quality and milestone compliance:

```
[Sprint 1: Plan] ---> [Sprint 2: Core Itinerary] ---> [Sprint 3: Budget & Packing] ---> [Sprint 4: Deploy & Report]
```

### Team Member Roles & Work Division
- **Eunseo (Lead Developer & UI/UX Designer)**
  - *Responsibilities*: Next.js architecture setup, Vanilla CSS premium design system creation (Glassmorphism layout, color schemes, responsive grid), UI components (Itinerary Timeline, Packing list grid), and Vercel Deployment setup.
- **[Team Member 2 Name] (Backend API & AI Integration)**
  - *Responsibilities*: Serverless Next.js API configuration, Google Gemini API prompt integration, structure parsing, and error-handling pipelines.
- **[Team Member 3 Name] (Data & QA Engineer)**
  - *Responsibilities*: Browser storage (localStorage/SessionStorage) state management, charting integration (interactive budget charts), writing unit tests, and preparing the Technical Report.

### Sprint Schedule
* **Sprint 1 (May 28 - Jun 2)**: Complete Task 1 PRD. Draft wireframe layout concepts.
* **Sprint 2 (Jun 3 - Jun 10)**: Initialize Next.js project. Implement UI shell. Integrate Gemini API for itinerary timeline (Milestone 2 Prototype).
* **Sprint 3 (Jun 11 - Jun 20)**: Implement expense charts, expense logs, and interactive packing lists. Persist travel records in `localStorage`.
* **Sprint 4 (Jun 21 - Submission)**: Complete Vercel deployment, verify all features on active staging environment, write `AI_USAGE.md` and complete the final 11-section Technical Report PDF.
