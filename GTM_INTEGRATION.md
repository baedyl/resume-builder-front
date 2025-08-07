# Google Tag Manager (GTM) Integration

This application uses `react-gtm-module` for Google Tag Manager integration to track user interactions and events.

## Setup

### 1. Environment Variables

Add your GTM ID to your environment variables:

```env
VITE_GTM_ID=GTM-XXXXXXX
```

### 2. Initialization

GTM is automatically initialized in `src/main.jsx` when the application starts.

## Usage

### Using the GTM Context

Import and use the GTM context in any component:

```tsx
import { useGTMContext } from '../contexts/GTMContext';

const MyComponent = () => {
  const { 
    trackButtonClick, 
    trackResumeAction, 
    trackAIEnhancement,
    trackPageView,
    trackFormSubmission 
  } = useGTMContext();

  const handleButtonClick = () => {
    trackButtonClick('my_button', 'engagement');
    // Your button logic here
  };

  return (
    <button onClick={handleButtonClick}>
      Click Me
    </button>
  );
};
```

### Available Tracking Functions

#### 1. `trackButtonClick(buttonName, category)`
Tracks button clicks with optional category.

```tsx
trackButtonClick('download_pdf', 'resume');
trackButtonClick('enhance_summary', 'ai');
```

#### 2. `trackResumeAction(action, template, language)`
Tracks resume-related actions.

```tsx
trackResumeAction('form_submit', 'modern', 'en');
trackResumeAction('pdf_download', 'colorful', 'fr');
```

#### 3. `trackAIEnhancement(type, language, success)`
Tracks AI enhancement attempts.

```tsx
trackAIEnhancement('summary', 'en', true);
trackAIEnhancement('description', 'fr', false);
```

#### 4. `trackFormSubmission(formName, success)`
Tracks form submissions.

```tsx
trackFormSubmission('resume_form', true);
trackFormSubmission('cover_letter_form', false);
```

#### 5. `trackPageView(page)`
Tracks page views (automatically called by GTMProvider).

#### 6. `pushEvent(customEvent)`
For custom events not covered by the above functions.

```tsx
pushEvent({
  event: 'custom_event',
  category: 'custom',
  action: 'action_name',
  label: 'custom_label',
  value: 123
});
```

## Event Categories

### Resume Actions
- `form_submit` - When user submits resume form
- `pdf_download` - When user downloads PDF
- `template_change` - When user changes template
- `language_change` - When user changes language

### AI Enhancement
- `enhance_success` - Successful AI enhancement
- `enhance_error` - Failed AI enhancement

### Navigation
- `button_click` - General button clicks
- `logout` - User logout
- `dark_mode_toggle` - Theme toggle

### Forms
- `submit_success` - Successful form submission
- `submit_error` - Failed form submission

## Data Layer Structure

All events include:
- `event` - The event name
- `timestamp` - ISO timestamp
- `category` - Event category
- `action` - Specific action
- `label` - Additional context
- `value` - Numeric value (if applicable)

## Example Implementation

Here's how the ResumeForm component tracks events:

```tsx
// Track form submission
trackResumeAction('form_submit', selectedTemplate, selectedLanguage);

// Track PDF download
trackResumeAction('pdf_download', selectedTemplate, selectedLanguage);

// Track AI enhancement
trackAIEnhancement('summary', selectedLanguage, true);
```

## Testing

To test GTM events:

1. Open browser developer tools
2. Go to the Network tab
3. Filter by "collect" or your GTM endpoint
4. Perform actions in the app
5. Verify events are being sent

## Custom Events

For custom tracking needs, use the `pushEvent` function:

```tsx
const { pushEvent } = useGTMContext();

pushEvent({
  event: 'custom_metric',
  category: 'analytics',
  action: 'track_conversion',
  label: 'premium_upgrade',
  value: 99.99
});
```

## Best Practices

1. **Consistent Naming**: Use consistent event names across the application
2. **Meaningful Categories**: Group related events under meaningful categories
3. **Include Context**: Always include relevant context in labels
4. **Error Tracking**: Track both success and failure states
5. **Performance**: Don't over-track - focus on meaningful user interactions

## Troubleshooting

### Events not appearing in GTM
1. Check that `VITE_GTM_ID` is set correctly
2. Verify GTM container is published
3. Check browser console for errors
4. Ensure GTM is properly initialized

### Performance issues
1. Limit tracking to meaningful interactions
2. Use debouncing for rapid events
3. Consider batching events if needed 