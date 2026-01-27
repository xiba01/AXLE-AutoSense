# AutomobileXP API Integration Guide

## Overview
AutomobileXP has been transformed from a static storytelling platform into a dynamic car configuration and comparison system using the RapidAPI Car Specs API.

## New Features

### 🚗 **Dynamic Car Selection**
- **CarSelector Component**: Select make, model, year, and trim
- **Real-time API Integration**: Fetches live car specifications
- **Fallback Data**: Mock data for Toyota Prius Prime when API is unavailable

### 📊 **Dynamic Scene Generation**
- **API-Driven Content**: Scenes generated from actual car specifications
- **Real-time Updates**: Story updates automatically when car selection changes
- **Multiple Scene Types**: Specs, performance, features, and comparison scenes

### ⚡ **Car Comparison System**
- **ComparisonPanel**: Side-by-side comparison of multiple vehicles
- **Visual Interface**: Add/remove cars with intuitive UI
- **Key Metrics**: Price, performance, efficiency comparisons

### 🏪 **Enhanced State Management**
- **useCarStore**: Centralized car configuration state
- **API Integration**: Handles loading states, errors, and data fetching
- **Configuration Persistence**: User selections maintained across sessions

## Setup Instructions

### 1. Environment Configuration
```bash
# Copy the example environment file
cp .env.example .env

# Add your RapidAPI key
VITE_RAPIDAPI_KEY=your_rapidapi_key_here
VITE_RAPIDAPI_HOST=car-specs.p.rapidapi.com
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Start Development Server
```bash
npm run dev
```

## Architecture Overview

### 📁 **New Files Created**
```
src/
├── services/
│   ├── carSpecsApi.ts          # API service layer
│   └── sceneGenerator.ts       # Dynamic scene generation
├── store/
│   └── useCarStore.ts          # Car configuration state
├── hooks/
│   └── useApiStory.ts          # API story integration hook
├── components/
│   ├── CarSelector.tsx         # Car selection UI
│   ├── ApiDrivenStory.tsx      # Story data updater
│   └── ComparisonPanel.tsx     # Car comparison interface
└── types.ts                     # Updated with API types
```

### 🔧 **Key Components**

#### **CarSpecsService** (`src/services/carSpecsApi.ts`)
- Handles all API communication with RapidAPI
- Provides fallback mock data for development
- Transforms API responses to internal data structure

#### **SceneGenerator** (`src/services/sceneGenerator.ts`)
- Creates dynamic scenes from car specifications
- Generates hotspots based on actual car features
- Handles comparison scene generation

#### **CarSelector** (`src/components/CarSelector.tsx`)
- Interactive car selection interface
- Cascading dropdowns for make/model/year/trim
- Real-time API integration with loading states

#### **ComparisonPanel** (`src/components/ComparisonPanel.tsx`)
- Side-by-side car comparison
- Add/remove cars dynamically
- Visual comparison metrics

## Usage

### **Selecting a Car**
1. Open the CarSelector panel (top-left)
2. Choose Make → Model → Year → Trim
3. Story automatically updates with new car data

### **Comparing Cars**
1. Select multiple cars using CarSelector
2. Click "Add Current Car" in ComparisonPanel
3. View side-by-side comparisons
4. Comparison scene appears in story flow

### **Dynamic Content**
- Story scenes update automatically when car selection changes
- Hotspots display real car specifications
- Performance metrics reflect actual vehicle data

## API Integration Details

### **RapidAPI Car Specs Integration**
- **Endpoint**: `https://car-specs.p.rapidapi.com/v1/cars`
- **Authentication**: X-RapidAPI-Key header
- **Rate Limits**: Follow RapidAPI pricing tiers

### **Fallback System**
- Mock Toyota Prius Prime 2024 data when API unavailable
- Graceful error handling with user feedback
- Development mode without API key required

### **Data Transformation**
- API responses normalized to internal `CarSpecification` interface
- Consistent data structure across all components
- Type-safe integration with TypeScript

## Features in Detail

### **Dynamic Scene Types**
1. **Specs Scene**: Engine, performance, and efficiency metrics
2. **Performance Scene**: 0-60, top speed, horsepower details
3. **Features Scene**: Standard and optional features
4. **Comparison Scene**: Side-by-side vehicle comparisons

### **Interactive Hotspots**
- **Engine Hotspot**: Displacement, horsepower, torque details
- **Performance Hotspot**: Acceleration and speed metrics
- **Efficiency Hotspot**: City/highway/combined MPG
- **Feature Hotspots**: Interior and exterior features

### **State Management**
- **Current Car**: Selected vehicle configuration
- **Available Cars**: API-fetched specifications
- **Comparison List**: Cars selected for comparison
- **Loading States**: Async operation feedback
- **Error Handling**: User-friendly error messages

## Development Notes

### **TypeScript Integration**
- Full type safety for API responses
- Interface definitions for all car data
- Generic type handling for API integration

### **Error Handling**
- API failure fallbacks to mock data
- User-friendly error messages
- Loading state management

### **Performance Optimization**
- Lazy loading of car specifications
- Efficient state updates
- Optimized re-renders with Zustand

## Future Enhancements

### **Planned Features**
- [ ] Real pricing integration with dealerships
- [ ] Inventory availability checking
- [ ] User configuration saving
- [ ] Advanced filtering options
- [ ] 3D car visualization
- [ ] Test drive scheduling

### **API Expansions**
- [ ] Multiple car data providers
- [ ] Real-time pricing feeds
- [ ] Inventory management APIs
- [ ] Configuration validation

## Troubleshooting

### **Common Issues**
1. **API Key Not Working**: Verify RapidAPI subscription and key validity
2. **No Data Loading**: Check network connectivity and API status
3. **TypeScript Errors**: Ensure all dependencies are installed

### **Debug Mode**
- Mock data automatically used when API key missing
- Console logging for API requests/responses
- Error boundary handling for API failures

## Support

For API integration issues:
1. Check RapidAPI documentation
2. Verify API key and subscription
3. Review browser console for errors
4. Test with mock data first

Enjoy your dynamic AutomobileXP experience! 🚗✨
