import { Typography, Box } from '@mui/material';
import { Card } from './Card';
import { SkillTag } from './SkillTag';

interface ActivityCardProps {
  title: string;
  date: string;
  description: string;
  skills: string[];
  onClick?: () => void;
}

export function ActivityCard({ title, date, description, skills, onClick }: ActivityCardProps) {
  const getSkillVariant = (skill: string): 'blue' | 'green' => {
    const programmingLanguages = ['Python', 'TypeScript', 'JavaScript', 'Go', 'Rust'];
    return programmingLanguages.includes(skill) ? 'blue' : 'green';
  };

  return (
    <Card onClick={onClick}>
      <Typography variant="h5" component="h3" gutterBottom>
        {title}
      </Typography>
      <Typography variant="body2" color="text.secondary" gutterBottom>
        {date}
      </Typography>
      <Typography variant="body1" color="text.primary" sx={{ mb: 2 }}>
        {description}
      </Typography>
      {skills.length > 0 && (
        <Box display="flex" flexWrap="wrap" gap={1} mt={2}>
          {skills.map((skill) => (
            <SkillTag key={skill} label={skill} variant={getSkillVariant(skill)} />
          ))}
        </Box>
      )}
    </Card>
  );
}
