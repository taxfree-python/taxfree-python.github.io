'use client';

import { useState } from 'react';
import { Container, Typography, Box } from '@mui/material';
import { SkillsSection } from '@/components/SkillsSection';
import { ActivitiesSection } from '@/components/ActivitiesSection';
import { QualificationsSection } from '@/components/QualificationsSection';
import type { ProjectActivity } from '@/types/activities';
import type { SkillDetail, SkillGroup } from '@/types/skills';
import type { QualificationsContent } from '@/types/profile';

interface CVClientProps {
  activities: ProjectActivity[];
  skillGroups: SkillGroup[];
  skills: SkillDetail[];
  qualifications: QualificationsContent;
}

export default function CVClient({ activities, skillGroups, skills, qualifications }: CVClientProps) {
  const [selectedSkill, setSelectedSkill] = useState<string | null>(null);

  const handleSkillClick = (skill: string) => {
    if (selectedSkill === skill) {
      setSelectedSkill(null);
    } else {
      setSelectedSkill(skill);
      const activitiesSection = document.getElementById('activities-section');
      if (activitiesSection) {
        activitiesSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(to bottom, #f5f5f5 0%, #e8e8e8 100%)',
        '@media (prefers-color-scheme: dark)': {
          background: 'linear-gradient(to bottom, #0a0a0a 0%, #141414 100%)',
        },
      }}
    >
      <Container maxWidth="md">
        <Box sx={{ py: 8 }}>
        <Typography
          variant="h3"
          component="h1"
          fontWeight="bold"
          gutterBottom
          sx={{ mb: 6 }}
        >
          Curriculum Vitae
        </Typography>

        <SkillsSection
          selectedSkill={selectedSkill}
          onSkillClick={handleSkillClick}
          activities={activities}
          skillGroups={skillGroups}
          skills={skills}
        />
        <div id="activities-section">
          <ActivitiesSection selectedSkill={selectedSkill} activities={activities} />
        </div>
        <QualificationsSection content={qualifications} />
        </Box>
      </Container>
    </Box>
  );
}
