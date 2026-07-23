import { HeroSection } from '@/components/HeroSection';
import { heroContent } from '@/data/profile';

export default function Home() {
  return <HeroSection {...heroContent} />;
}
