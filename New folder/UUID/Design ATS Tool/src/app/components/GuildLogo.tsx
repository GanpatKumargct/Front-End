import guildLogo from '../../imports/Guild_Logo_White-1.png';

interface GuildLogoProps {
  className?: string;
  theme?: 'light' | 'dark';
}

export function GuildLogo({
  className = 'h-9 w-9',
  theme = 'dark'
}: GuildLogoProps) {
  return (
    <div className={`${className} flex items-center justify-center`}>
      <img
        src={guildLogo}
        alt="The Guild"
        className="w-full h-full object-contain transition-all duration-300"
        style={{
          filter:
            theme === 'light'
              ? 'invert(1) drop-shadow(0 1px 2px rgba(0, 0, 0, 0.08))'
              : 'drop-shadow(0 1px 3px rgba(0, 0, 0, 0.2))',
        }}
      />
    </div>
  );
}