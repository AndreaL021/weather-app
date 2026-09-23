export const Palette = {
  "neutral900": "hsl(243, 96%, 9%)",
  "neutral800": "hsl(243, 27%, 20%)",
  "neutral700": "hsl(243, 23%, 24%)",
  "neutral600": "hsl(243, 23%, 30%)",
  "neutral300": "hsl(240, 6%, 70%)",
  "neutral200": "hsl(250, 6%, 84%)",
  "neutral0": "hsl(0, 0%, 100%)",
  "orange500": "hsl(28, 100%, 52%)",
  "blue500": "hsl(233, 67%, 56%)",
  "blue700": "hsl(248, 70%, 36%)"
} as const;

export const Colors = {
  background: Palette.neutral900,
  surface: Palette.neutral800,
  surfaceRaised: Palette.neutral700,
  border: Palette.neutral600,
  text: Palette.neutral0,
  textSecondary: Palette.neutral200,
  textMuted: Palette.neutral300,
  primary: Palette.blue500,
  primaryDark: Palette.blue700,
  accent: Palette.orange500,
} as const;

export type ThemeColor = keyof typeof Colors;


export const Fonts = {
  "bodyLight": "DMSans-Light",
  "body": "DMSans-Medium",
  "bodySemiBold": "DMSans-SemiBold",
  "bodySemiBoldItalic": "DMSans-SemiBoldItalic",
  "bodyBold": "DMSans-Bold",
  "heading": "BricolageGrotesque-Bold"
} as const;

// Da passare a useFonts(FontAssets) quando creeremo il layout per caricare i fonts
export const FontAssets = {
  [Fonts.bodyLight]: require('../../assets/fonts/DM_Sans/static/DMSans-Light.ttf'),
  [Fonts.body]: require('../../assets/fonts/DM_Sans/static/DMSans-Medium.ttf'),
  [Fonts.bodySemiBold]: require('../../assets/fonts/DM_Sans/static/DMSans-SemiBold.ttf'),
  [Fonts.bodySemiBoldItalic]: require('../../assets/fonts/DM_Sans/static/DMSans-SemiBoldItalic.ttf'),
  [Fonts.bodyBold]: require('../../assets/fonts/DM_Sans/static/DMSans-Bold.ttf'),
  [Fonts.heading]: require('../../assets/fonts/Bricolage_Grotesque/static/BricolageGrotesque-Bold.ttf'),
};

export const FontSizes = { body: 18 } as const;
