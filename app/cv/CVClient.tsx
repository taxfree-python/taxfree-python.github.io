'use client';

import { Container, Box } from '@mui/material';
import { SkillsSection } from '@/components/SkillsSection';
import { ActivitiesSection } from '@/components/ActivitiesSection';
import { CertificationsSection } from '@/components/CertificationsSection';
import type { ProjectActivity } from '@/types/activities';
import type { SkillDetail } from '@/types/skills';
import type { CertificationsContent } from '@/types/profile';

interface CVClientProps {
  activities: ProjectActivity[];
  skills: SkillDetail[];
  certifications: CertificationsContent;
}

export default function CVClient({ activities, skills, certifications }: CVClientProps) {
  // Core skills only: Python, React/TypeScript, AI Agents
  const coreSkills = skills.filter(skill =>
    ['Python', 'React/TypeScript', 'AI Agents'].includes(skill.name)
  );

  // Main experiences only: PFN, RIKEN, LayerX
  const mainExperiences = activities.filter(activity =>
    ['pfn-education-project-engineer', 'riken-bdr-part-timer', 'layerx-ai-workforce-intern'].includes(activity.id)
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
            skills={coreSkills}
          />
          <ActivitiesSection
            activities={mainExperiences}
            allActivities={activities}
          />
          <CertificationsSection content={certifications} />
        </Box>
      </Container>
    </Box>
  );
}
