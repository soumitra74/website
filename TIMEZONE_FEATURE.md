# Timezone Support for "Where is Soumitra" Feature

## Overview

The "Where is Soumitra" feature now includes comprehensive timezone support to provide accurate activity information regardless of the visitor's location. The system converts the visitor's local time to IST (Indian Standard Time) to determine what Soumitra would be doing at that moment.

## How It Works

### Timezone Conversion
- **Visitor's Local Time**: The system detects the visitor's local timezone using `Intl.DateTimeFormat().resolvedOptions().timeZone`
- **IST Conversion**: Converts the visitor's local time to IST using `toLocaleString()` with `timeZone: 'Asia/Kolkata'`
- **Activity Determination**: Uses the IST time to determine Soumitra's current activity based on his daily routine

### Key Components

#### 1. Timezone Utilities (`src/lib/utils.ts`)
- `convertToIST(localDate: Date)`: Converts any local time to IST using `toLocaleString()` with `timeZone: 'Asia/Kolkata'`
- `getCurrentISTTime()`: Gets the current time in IST
- `formatTimeWithTimezone(date: Date, showTimezone: boolean)`: Formats time with timezone info
- `getTimezoneInfo(localDate: Date)`: Returns comprehensive timezone information using native browser timezone APIs

#### 2. Updated Components
- **Spot Me Page** (`src/app/spot-me/page.tsx`): Full page implementation
- **Spot Me Popup** (`src/components/spot-me-popup.tsx`): Modal implementation

### Features

#### Real-time Timezone Display
- Shows visitor's local time with timezone name
- Shows Soumitra's time in IST
- Updates automatically every minute
- Handles timezone detection errors gracefully

#### Example Display
```
Your time: 14:30 EST (America/New_York)
Soumitra's time: 01:00 IST
```

#### Error Handling
- Graceful fallback if timezone detection fails
- Console logging for debugging
- Continues to work even if timezone conversion encounters issues

## Technical Implementation

### Timezone Conversion Logic
```javascript
// Simple conversion using toLocaleString with timeZone option
const istTimeString = localDate.toLocaleString('en-US', {
  timeZone: 'Asia/Kolkata'
})

// For time-only display
const istTimeOnly = localDate.toLocaleTimeString('en-US', {
  hour12: false,
  hour: '2-digit',
  minute: '2-digit',
  timeZone: 'Asia/Kolkata'
})
```

### Activity Update Cycle
- Initial activity determination on component mount
- Automatic refresh every 60 seconds
- Timezone information updates with each refresh

## Testing

A test file is included (`src/lib/timezone-test.ts`) with functions to verify:
- Basic timezone conversion
- Specific timezone scenarios (EST, PST, UTC to IST)
- Error handling

## Browser Compatibility

- Uses standard JavaScript `Date` API
- Leverages `Intl.DateTimeFormat()` for timezone detection
- Compatible with all modern browsers
- Graceful degradation for older browsers

## Future Enhancements

Potential improvements could include:
- Support for daylight saving time transitions
- More detailed timezone information display
- Customizable timezone preferences
- Historical timezone data for activity tracking
