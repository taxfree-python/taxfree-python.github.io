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
  // Core skills only: Python, React/TypeScript, AI Agents
  const coreSkills = skills.filter(skill =>
    ['Python', 'React/TypeScript', 'AI Agents'].includes(skill.name)
  );

  // Main experiences only: PFN, RIKEN, LayerX
  const mainExperiences = activities.filter(activity =>
    ['pfn-education-project-engineer', 'riken-bdr-part-timer', 'layerx-summer-internship'].includes(activity.id)
  );

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: 'background.default',
      }}
    >
      <Container maxWidth="md">
        <Box sx={{ py: 8 }}>
        <SkillsSection
          selectedSkill={null}
          onSkillClick={() => {}}
          activities={mainExperiences}
          skillGroups={skillGroups}
          skills={coreSkills}
        />
        <ActivitiesSection
          selectedSkill={null}
          activities={mainExperiences}
          allActivities={activities}
        />
        <QualificationsSection content={qualifications} />
        </Box>
      </Container>
    </Box>
  );
}
