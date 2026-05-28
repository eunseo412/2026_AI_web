# ParkingMate: Destination-Based Parking Finder

## 1. Team Information
* **Team Name:** ParkingMate
* **Team Members:** 이채민, [팀원 이름 1], [팀원 이름 2], [팀원 이름 3]

## 2. Service Name
ParkingMate: Destination-Based Parking Finder

## 3. Product Overview
ParkingMate is a web service that helps users find suitable parking lots near their destination.
When users enter their destination, arrival date, arrival time, and expected stay duration, the service displays nearby parking lots on a map.
The destination is shown with a blue marker, and nearby parking lots are shown with red markers. The service also provides useful parking information such as distance, operating hours, parking fee, parking type, payment method, number of parking spaces, and whether disabled parking spaces are available.
The service uses the National Standard Parking Lot Dataset, which includes information about public and private parking lots managed by local governments.

## 4. Target Users
The main target users are drivers who need to find parking near a destination before visiting.
Expected users include:
* People visiting unfamiliar places by car
* Drivers going to hospitals, schools, public offices, shopping areas, or tourist spots
* Users who want to compare parking fees before arrival
* Users who want to check whether a parking lot is open at their planned arrival time
* Users who need disabled parking space information

## 5. Problem or Need
When people drive to a destination, they often need to find a parking lot quickly. However, existing map services usually focus on location only. Users may still need to search separately for operating hours, parking fees, payment methods, and parking lot type.
This can be inconvenient, especially when users visit a place at a specific time and need to know whether a nearby parking lot is actually available.
ParkingMate solves this problem by combining destination search, map visualization, parking lot filtering, and useful parking information in one service.

## 6. Core User Scenario
A user plans to visit a hospital by car on Saturday at 2:00 PM and expects to stay for three hours.
The user opens ParkingMate and enters the hospital name, arrival date, arrival time, stay duration, and search radius.
The service finds the destination location and displays nearby parking lots within the selected radius.
On the result page, the user sees the destination as a blue marker and nearby parking lots as red markers. The user can compare parking lots by distance, operating status, estimated fee, number of parking spaces, and payment method.
Finally, the user selects the most suitable parking lot before leaving.

## 7. Key Features
* **Feature 1. Destination Search:** Users can enter a destination name or address. The service converts the destination into latitude and longitude using a map or geocoding API.
* **Feature 2. Nearby Parking Lot Map:** The service shows the destination and nearby parking lots on a map. The destination is marked in blue, and parking lots are marked in red.
* **Feature 3. Parking Lot Information Cards:** For each parking lot, the service displays important information such as:
  * Parking lot name
  * Distance from destination
  * Public or private parking type
  * Roadside, off-street, or attached parking type
  * Number of parking spaces
  * Operating days and hours
  * Basic parking fee and additional fee
  * Payment method
  * Phone number
  * Disabled parking space availability
* **Feature 4. Availability Check:** The service checks whether each parking lot is likely to be open based on the user’s arrival date, arrival time, and stay duration.
* **Feature 5. Estimated Parking Fee:** The service calculates an estimated parking fee using the basic parking time, basic fee, additional unit time, and additional fee. If the parking lot is free, the fee is shown as 0 won. If fee data is missing, the service displays “Fee information unavailable.”

## 8. AI Usage Plan
AI tools will be used mainly during the development process.
The team plans to use AI tools for:
* Organizing the service idea and PRD
* Designing the user flow
* Creating initial frontend components
* Generating data processing code
* Debugging JavaScript or Python errors
* Improving UI text and layout
* Writing README.md
* Writing AI_USAGE.md
* Preparing presentation materials

*If time allows, the service may also include an AI-generated recommendation message. For example, the AI can explain why a certain parking lot is recommended based on distance, fee, and operating status.*

## 9. Page Structure
1. **Home Page:** The Home page introduces the service and provides the main input form.
   Input fields include:
   * Destination
   * Arrival date
   * Arrival time
   * Stay duration
   * Search radius
2. **Result Page:** The Result page shows the parking search results.
   It includes:
   * Map section
   * Blue destination marker
   * Red parking lot markers
   * Parking lot information cards
   * Recommended parking lots
   * Sorting or filtering options
3. **About Page:** The About page explains the purpose of the service, the data source, and the limitations of the service.
4. **Contact or Team Page:** This page introduces the team members and their roles in the project.

## 10. Development Plan
* **Step 1. Data Preparation:** First, the team will prepare the National Standard Parking Lot Dataset. Unnecessary columns will be removed, and missing latitude or longitude values will be handled.
* **Step 2. Basic Website Layout:** The team will build the basic website structure, including the Home page, input form, and Result page.
* **Step 3. Map and Marker Implementation:** The team will connect a map API and display the destination and nearby parking lots using different marker colors.
* **Step 4. Parking Lot Filtering:** The team will calculate the distance between the destination and each parking lot. Only parking lots within the selected radius will be displayed.
* **Step 5. Parking Information Output:** The team will display parking lot information cards with operating hours, fee information, payment method, and other useful details.
* **Step 6. Final Testing and Deployment:** The team will test the service with several destination examples and deploy the final website using Vercel.

### Role Division
* **Member 1:** Dataset cleaning and parking lot filtering logic
* **Member 2:** Frontend page layout and input form
* **Member 3:** Map API integration and marker visualization
* **Member 4:** Result page, information cards, README, and AI_USAGE.md

## 11. Expected Result
The final service will allow users to search for parking lots near their destination and compare them easily.
By showing the destination and nearby parking lots on a map, along with operating hours and fee information, ParkingMate can help users make better parking decisions before arriving at their destination.
