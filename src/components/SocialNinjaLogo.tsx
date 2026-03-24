interface LogoProps {
  badge?: string;
  badgeColor?: string;
  size?: 'sm' | 'md' | 'lg';
}

const SocialNinjaLogo = ({ badge, badgeColor = 'text-text-secondary', size = 'md' }: LogoProps) => {
  const textSize = size === 'lg' ? 'text-3xl' : size === 'md' ? 'text-xl' : 'text-lg';
  
  return (
    <div className="flex flex-col">
      <span className={`${textSize} font-bold tracking-tight`}>
        <span className="text-foreground">Social</span>
        <span className="text-primary">Ninja</span>
      </span>
      {badge && (
        <span className={`text-[11px] ${badgeColor} mt-0.5`}>{badge}</span>
      )}
    </div>
  );
};

export default SocialNinjaLogo;
