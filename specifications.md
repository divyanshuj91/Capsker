# Detailed Feature Specifications — capsker

## 1. Column Auto-Detection Spec
The CSV importer must match incoming headers using lowercase sub-string matching and Levenshtein distance against known aliases:
- **Team**: `team`, `team name`, `team_name`, `group`, `squad`
- **Full Name**: `name`, `full name`, `member`, `participant`, `lead name`
- **Email**: `email`, `e-mail`, `mail address`, `lead email`
- **Phone**: `phone`, `mobile`, `contact`, `whatsapp`, `phone number`
- **GitHub**: `github`, `github profile`, `gh`, `repo`
- **LinkedIn**: `linkedin`, `linkedin url`, `li`
- **Institution**: `college`, `university`, `school`, `institution`, `org`

## 2. Canvas Dynamic Placeholder Spec
Coordinate configuration objects must match this strict TypeScript interface:
```typescript
export interface TemplatePlaceholder {
  id: string;
  field: 'teamName' | 'participantName' | 'role' | 'teamNumber' | 'institution' | 'qrCode';
  x: number;          // Pixels from left
  y: number;          // Pixels from top
  width?: number;
  height?: number;
  fontFamily: string; // e.g., 'Space Grotesk', 'Inter'
  fontSize: number;   // In pt/px
  fontWeight: 'normal' | 'bold' | '800';
  color: string;      // Hex string '#000000'
  textAlign: 'left' | 'center' | 'right';
  textTransform?: 'uppercase' | 'capitalize' | 'none';
}