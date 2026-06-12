'use client';

import { Container, Box } from '@mui/material';
import { SkillsSection } from '@/components/SkillsSection';
import { ActivitiesSection } from '@/components/ActivitiesSection';
import { PublicationsSection } from '@/components/PublicationsSection';
import { CertificationsSection } from '@/components/CertificationsSection';
import type { CertificationsContent } from '@/types/profile';
import type { ProjectActivity } from '@/types/activities';
import type { Publication } from '@/types/publications';
import type { SkillDetail } from '@/types/skills';

type CVClientProps = {
  activities: ProjectActivity[];
  skills: SkillDetail[];
  publications: Publication[];
  certifications: CertificationsContent;
};

const coreSkillNames: ReadonlySet<string> = new Set([
  'Python',
  'React/TypeScript',
  'AI Agents',
]);

const mainExperienceIds: ReadonlySet<string> = new Set([
  'pfn-education-project-engineer',
  'riken-bdr-part-timer',
  'layerx-ai-workforce-intern',
  'autonomous-lab-scheduling',
  'doctor-car-data-analysis',
]);

export default function CVClient({ activities, skills, publications, certifications }: CVClientProps) {
  // Core skills only: Python, React/TypeScript, AI Agents
  const coreSkills = skills.filter((skill) => coreSkillNames.has(skill.name));

  // Main experiences: PFN, RIKEN, LayerX + all research projects
  const mainExperiences = activities.filter((activity) => mainExperienceIds.has(activity.id));

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
          <PublicationsSection publications={publications} />
          <CertificationsSection content={certifications} />
        </Box>
      </Container>
    </Box>
  );
}
