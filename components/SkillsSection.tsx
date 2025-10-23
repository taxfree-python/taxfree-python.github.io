import { Container, Typography, Box } from '@mui/material';
import { SkillCard } from './SkillCard';
import { skillGroups, skills } from '../data/skills';
import { projectsAndActivities } from '../data/activities';
import { ProjectActivity } from '../types/activities';

interface SkillsSectionProps {
  selectedSkill: string | null;
  onSkillClick: (skill: string) => void;
}

export function SkillsSection({ selectedSkill, onSkillClick }: SkillsSectionProps) {
  // 各スキルに関連するプロジェクト数を計算
  const getProjectCount = (skillName: string): number => {
    return projectsAndActivities.filter((activity) => activity.skills.includes(skillName)).length;
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
            <Box
              display="flex"
              flexDirection={{ xs: 'column', sm: 'row' }}
              alignItems={{ sm: 'baseline' }}
              justifyContent={{ sm: 'space-between' }}
              gap={1}
              mb={2}
            >
              <Typography variant="h3" component="h3">
                {group.title}
              </Typography>
              {group.description && (
                <Typography variant="body2" color="text.secondary">
                  {group.description}
                </Typography>
              )}
            </Box>

            <Box
              display="grid"
              gridTemplateColumns={{ xs: '1fr', md: 'repeat(2, 1fr)' }}
              gap={2}
            >
              {groupedSkills.map((skill) => {
                const projectCount = getProjectCount(skill.name);
                const canFilter = Boolean(skill.filterable && projectCount > 0);
                const dynamicHighlights = [
                  ...(skill.highlights ?? []),
                  ...(canFilter ? [`関連アクティビティ ${projectCount} 件`] : []),
                ];
                const relatedItems = (skill.relatedItemIds ?? [])
                  .map((id) =>
                    projectsAndActivities.find((item) => item.id === id)
                  )
                  .filter((item): item is ProjectActivity => Boolean(item));

                return (
                  <SkillCard
                    key={skill.name}
                    skill={{
                      ...skill,
                      highlights: dynamicHighlights,
                    }}
                    relatedItems={relatedItems}
                    onClick={canFilter ? () => onSkillClick(skill.name) : undefined}
                    isActive={canFilter && selectedSkill === skill.name}
                  />
                );
              })}
            </Box>
          </Box>
        );
      })}
    </Container>
  );
}
