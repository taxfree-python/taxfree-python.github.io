'use client';

import { useState } from 'react';
import { Container, Typography, Box } from '@mui/material';
import { SkillCard } from './SkillCard';
import { SkillDialog } from './SkillDialog';
import { ProjectActivity } from '../types/activities';
import { SkillDetail, SkillGroup } from '../types/skills';

interface SkillsSectionProps {
  selectedSkill: string | null;
  onSkillClick: (skill: string) => void;
  activities: ProjectActivity[];
  skillGroups: SkillGroup[];
  skills: SkillDetail[];
}

export function SkillsSection({ selectedSkill, onSkillClick, activities, skillGroups, skills }: SkillsSectionProps) {
  const [dialogSkill, setDialogSkill] = useState<SkillDetail | null>(null);

  const handleCardClick = (skill: SkillDetail) => {
    if (skill.filterable) {
      onSkillClick(skill.name);
    }
    setDialogSkill(skill);
  };

  const handleCloseDialog = () => {
    setDialogSkill(null);
  };

  return (
    <Container maxWidth="md" component="section" sx={{ py: 6 }}>
      <Typography variant="h2" component="h2" gutterBottom>
        Skills & Experience
      </Typography>

      {skillGroups.map((group) => {
        const groupedSkills = skills.filter((skill) => skill.category === group.id);
        if (groupedSkills.length === 0) return null;

        return (
          <Box key={group.id} mb={5}>
            <Typography variant="h3" component="h3" mb={2}>
              {group.title}
            </Typography>

            <Box
              display="grid"
              gridTemplateColumns={{ xs: '1fr', md: 'repeat(2, 1fr)' }}
              gap={2}
            >
              {groupedSkills.map((skill) => (
                <SkillCard
                  key={skill.name}
                  skill={skill}
                  onClick={() => handleCardClick(skill)}
                  isActive={selectedSkill === skill.name}
                />
              ))}
            </Box>
          </Box>
        );
      })}

      <SkillDialog
        skill={dialogSkill}
        isOpen={dialogSkill !== null}
        onClose={handleCloseDialog}
        relatedItems={
          dialogSkill
            ? (dialogSkill.relatedItemIds ?? [])
                .map((id) => activities.find((item) => item.id === id))
                .filter((item): item is ProjectActivity => Boolean(item))
            : []
        }
      />
    </Container>
  );
}
