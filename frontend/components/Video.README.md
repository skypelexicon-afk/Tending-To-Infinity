# Video Component

A comprehensive video player component for displaying course videos with navigation between sections and subsections.

## Features

- **Full-screen video player** with course structure sidebar
- **Section and subsection navigation** with collapsible structure
- **Previous/Next navigation** for seamless video switching
- **Progress tracking** showing current video position
- **Responsive design** that works on all screen sizes
- **Auto-expand current section** when video is selected
- **Visual indicators** for current video and video availability

## Usage

### As a Modal (in existing page)

```tsx
import Video from '@/components/Video';
import { useState } from 'react';

function CoursePage() {
  const [showVideoPlayer, setShowVideoPlayer] = useState(false);
  const [selectedSubSectionId, setSelectedSubSectionId] = useState<number | null>(null);

  return (
    <>
      {/* Your page content */}
      <button
        onClick={() => {
          setSelectedSubSectionId(123); // subsection ID
          setShowVideoPlayer(true);
        }}
      >
        Watch Video
      </button>

      {/* Video Player Modal */}
      {showVideoPlayer && (
        <Video
          courseDetails={courseDetails}
          initialSubSectionId={selectedSubSectionId || undefined}
          onClose={() => {
            setShowVideoPlayer(false);
            setSelectedSubSectionId(null);
          }}
        />
      )}
    </>
  );
}
```

### As a Full Page (dedicated route)

Create a page at `/app/student/dashboard/course/[id]/video/[subSectionId]/page.tsx`:

```tsx
'use client';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getCourseDetails } from '@/lib/api/Courses';
import Video from '@/components/Video';

export default function VideoPage() {
  const { id, subSectionId } = useParams();
  const router = useRouter();
  const [courseDetails, setCourseDetails] = useState(null);

  useEffect(() => {
    // Fetch course details
    getCourseDetails(Number(id)).then(setCourseDetails);
  }, [id]);

  return (
    <Video
      courseDetails={courseDetails}
      initialSubSectionId={Number(subSectionId)}
      onClose={() => router.push(`/student/dashboard/course/${id}`)}
    />
  );
}
```

## Props

### `VideoPlayerProps`

| Prop | Type | Description |
|------|------|-------------|
| `courseDetails` | `CourseDetails \| null` | Course data with sections and subsections |
| `initialSubSectionId?` | `number` | ID of subsection to start with (optional) |
| `onClose` | `() => void` | Callback function when user closes video player |

## Component Structure

```
Video Player
├── Sidebar (Course Structure)
│   ├── Header (Course title + Close button)
│   └── Sections List
│       ├── Section (Collapsible)
│       └── Subsections
│           ├── Video Subsections (clickable)
│           └── Other Subsections (non-clickable)
└── Main Area
    ├── Video Header (Current video title)
    ├── Video Player (iframe/video element)
    └── Navigation Controls
        ├── Previous Button
        ├── Progress Indicator
        └── Next Button
```

## Styling

The component uses Tailwind CSS classes with a purple/gray color scheme:

- **Primary color**: Purple (`bg-purple-600`, `text-purple-800`)
- **Secondary color**: Gray (`bg-gray-100`, `text-gray-600`)
- **Interactive states**: Hover effects and disabled states
- **Layout**: Flexbox with fixed sidebar and flexible main area

## Data Requirements

The component expects `CourseDetails` object with this structure:

```typescript
interface CourseDetails {
  id: number;
  title: string;
  sections: Section[];
  // ... other properties
}

interface Section {
  id: number;
  name: string;
  subSections: SubSection[];
  // ... other properties
}

interface SubSection {
  id: number;
  name: string;
  file_url: string;
  type: 'video' | 'text' | 'quiz'; // etc.
  // ... other properties
}
```

## Navigation Logic

1. **Auto-detection**: If no `initialSubSectionId` is provided, finds first video subsection
2. **Section expansion**: Automatically expands the section containing current video
3. **Sequential navigation**: Previous/Next buttons navigate through all video subsections in order
4. **Smart filtering**: Only shows video subsections as clickable/navigable

## Keyboard Support

Currently mouse/touch only. Future versions could include:
- `Space` - Play/Pause
- `←/→` - Previous/Next video
- `Esc` - Close player

## Browser Compatibility

- Supports all modern browsers with iframe video support
- Responsive design works on mobile and desktop
- Requires JavaScript enabled
