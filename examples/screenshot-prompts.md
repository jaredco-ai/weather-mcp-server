# WeatherTrax MCP Server - Screenshot Examples
# Format these to look like Claude conversations for promotional images

---

## Screenshot 1: Simple Current Weather Query

**User Prompt:**
```
What's the weather like in San Francisco right now?
```

**Claude's Response (after calling weatherTool):**
```
I'll check the current weather in San Francisco for you.

[Uses weatherTool with location="San Francisco, CA", query_type="current"]

It is currently 54°F and Clear in San Francisco.

Current conditions:
• Temperature: 54°F (feels like 54°F)
• Condition: Clear
• Wind: 5 mph W
• Humidity: 65%
• UV Index: 0
• Visibility: 10 miles
• Pressure: 1013 mb
• Cloud Cover: 0%

The weather is pleasant with clear skies and light winds.
```

---

## Screenshot 2: Multi-Day Forecast

**User Prompt:**
```
I'm visiting New York City this week. Can you give me a 5-day weather forecast?
```

**Claude's Response (after calling weatherTool):**
```
I'll get you a 5-day forecast for New York City.

[Uses weatherTool with location="New York", query_type="multi_day", num_days=5]

Here's your 5-day forecast for New York:

**Wednesday, March 26, 2026**
• High: 79°F / Low: 42°F
• Condition: Sunny
• Precipitation: 0% chance
• Wind: 18 mph SW
• Sunrise: 06:49 AM | Sunset: 07:15 PM

**Thursday, March 27, 2026**
• High: 59°F / Low: 39°F
• Condition: Moderate rain
• Precipitation: 88% chance
• Wind: 19 mph WNW
• Sunrise: 06:48 AM | Sunset: 07:16 PM

**Friday, March 28, 2026**
• High: 41°F / Low: 28°F
• Condition: Sunny
• Wind: 17 mph W
• Sunrise: 06:46 AM | Sunset: 07:17 PM

[... continues for 2 more days]

You'll have beautiful weather on Wednesday, but bring an umbrella for Thursday!
```

---

## Screenshot 3: Planning Query

**User Prompt:**
```
I'm planning an outdoor wedding in Miami next weekend. Can you help me understand what weather to expect?
```

**Claude's Response (after calling weatherPlanningTool):**
```
I'll check the weather forecast for Miami to help you plan your outdoor wedding.

[Uses weatherPlanningTool with location="Miami, FL", context="outdoor event planning"]

Here's your 7-day planning forecast for Miami:

**Wednesday, March 26** - Perfect conditions
• High: 82°F / Low: 73°F
• Sunny, 0% rain
• Wind: 12 mph E
• Sunrise: 07:18 AM | Sunset: 07:35 PM

**Thursday, March 27** - Great weather
• High: 77°F / Low: 72°F
• Partly Cloudy, 0% rain
• Wind: 12 mph E
• Sunrise: 07:17 AM | Sunset: 07:35 PM

[... shows next 5 days]

**Planning Recommendation:**
The forecast looks excellent for an outdoor wedding! Wednesday and Thursday both show clear skies with comfortable temperatures in the high 70s to low 80s. No rain expected, and winds are light (12 mph), which is ideal for outdoor events. The evening temperatures will be pleasant, staying in the low-to-mid 70s.

I'd recommend having some shade options for guests during the ceremony if it's during peak afternoon hours, but overall conditions are perfect for an outdoor celebration!
```

---

## Screenshot 4: Location Comparison

**User Prompt:**
```
I'm deciding between Seattle and Austin for a trip next week. Can you compare the weather for both cities?
```

**Claude's Response (after calling weatherTool twice):**
```
I'll check the weather forecast for both Seattle and Austin to help you decide.

[Uses weatherTool for Seattle]
[Uses weatherTool for Austin]

**Seattle Weather (Next 3 Days):**
• March 26: 56°F, Cloudy, 45% rain
• March 27: 54°F, Light rain, 70% rain
• March 28: 52°F, Partly cloudy, 20% rain

**Austin Weather (Next 3 Days):**
• March 26: 78°F, Sunny, 0% rain
• March 27: 82°F, Sunny, 0% rain
• March 28: 85°F, Partly cloudy, 10% rain

**Comparison:**
Austin will have significantly better weather next week - sunny skies, warm temperatures (78-85°F), and minimal rain chance. Seattle will be cooler (52-56°F) with frequent rain and cloudy conditions.

If weather is a priority, Austin is definitely the better choice for next week!
```

---

## Screenshot 5: Construction Planning

**User Prompt:**
```
I need to schedule construction work in Denver over the next 7 days. Which days would be best based on weather conditions?
```

**Claude's Response (after calling weatherPlanningTool):**
```
I'll analyze the weather forecast for Denver to help you schedule your construction work.

[Uses weatherPlanningTool with location="Denver", context="construction scheduling"]

**Denver 7-Day Construction Weather Forecast:**

✅ **Best Days for Outdoor Work:**
• March 26: Sunny, 62°F high, 0% rain, light wind (8 mph)
• March 28: Sunny, 58°F high, 0% rain, moderate wind (12 mph)
• March 30: Partly cloudy, 60°F high, 10% rain

⚠️ **Challenging Days:**
• March 27: Rain showers, 52°F, 65% precipitation
• March 29: Windy conditions, gusts up to 25 mph

❌ **Avoid:**
• March 31: Heavy rain expected, 80% precipitation

**Recommendation:**
Schedule your most critical outdoor work for March 26 and 28 when you'll have dry, sunny conditions. March 27 and 31 should be reserved for indoor work or used as buffer days due to rain. If you need continuous work days, March 26 is your safest bet to start.

Wind conditions are generally manageable throughout the week except March 29, so plan accordingly if you're working at height or with lightweight materials.
```

---

## How to Create Screenshots:

1. Format each example in a text editor or notes app to look like a Claude conversation
2. Use a clean white background
3. Make the user prompt bold/larger
4. Include the [Uses weatherTool...] line to show MCP integration
5. Format the response clearly with bullet points and sections
6. Take a screenshot of the complete conversation
7. Crop to show just the relevant exchange

These examples show real-world use cases and how Claude makes your weather data actionable!
