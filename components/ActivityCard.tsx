import { Typography, Box } from '@mui/material';
import { Card } from './Card';
import { SkillTag } from './SkillTag';
import { LinkifiedText } from './LinkifiedText';

interface ActivityCardProps {
  title: string;
  date: string;
  description: string;
  skills: string[];
  onClick?: () => void;
}

export function ActivityCard({ title, date, description, skills, onClick }: ActivityCardProps) {
  const getSkillVariant = (skill: string): 'blue' | 'green' => {
    const programmingLanguages = ['Python', 'TypeScript'];
    return programmingLanguages.includes(skill) ? 'blue' : 'green';
  };

  const sortedSkills = Array.from(new Set(skills)).sort((a, b) => a.localeCompare(b, 'ja'));

  return (
    <Card onClick={onClick}>
      <Typography variant="h5" component="h3" gutterBottom>
        {title}
      </Typography>
      <Typography variant="body2" color="text.secondary" gutterBottom>
        {date}
      </Typography>
      <Typography variant="body1" color="text.primary" sx={{ mb: 2 }}>
        <LinkifiedText text={description} />
      </Typography>
      {sortedSkills.length > 0 && (
        <Box display="flex" flexWrap="wrap" gap={1} mt={2}>
          {sortedSkills.map((skill) => (
            <SkillTag key={skill} label={skill} variant={getSkillVariant(skill)} />
          ))}
        </Box>
      )}
    </Card>
  );
}
