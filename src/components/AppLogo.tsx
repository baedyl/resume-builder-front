import { useEffect, useState } from 'react';

function useIsDarkMode(): boolean {
  const getDark = () => typeof document !== 'undefined' && document.documentElement.classList.contains('dark');
  const [isDark, setIsDark] = useState<boolean>(getDark());

  useEffect(() => {
    const el = document.documentElement;
    const observer = new MutationObserver(() => setIsDark(getDark()));
    observer.observe(el, { attributes: true, attributeFilter: ['class'] });

    // Also react to system preference changes if user hasn't toggled
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const onChange = () => setIsDark(getDark());
    if (media?.addEventListener) media.addEventListener('change', onChange);
    else if ((media as any)?.addListener) (media as any).addListener(onChange);

    return () => {
      observer.disconnect();
      if (media?.removeEventListener) media.removeEventListener('change', onChange);
      else if ((media as any)?.removeListener) (media as any).removeListener(onChange);
    };
  }, []);

  return isDark;
}

type AppLogoProps = {
  className?: string;
  alt?: string;
  lightSrc?: string; // shown in light mode
  darkSrc?: string; // shown in dark mode
};

const AppLogo: React.FC<AppLogoProps> = ({
  className,
  alt = 'Resume Builder',
  lightSrc = '/logo_white_small.svg',
  darkSrc = '/logo_dark_small.svg',
}) => {
  const isDark = useIsDarkMode();
  const src = isDark ? darkSrc : lightSrc;
  return <img src={src} alt={alt} className={className} decoding="async" fetchPriority="high" />;
};

export default AppLogo;


