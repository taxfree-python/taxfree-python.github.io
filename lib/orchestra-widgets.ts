export const ORCHESTRA_WIDGET_NAMES = ['LayoutViewer', 'EvolutionReplay', 'ABPlayer'] as const;

export type OrchestraWidgetName = (typeof ORCHESTRA_WIDGET_NAMES)[number];

const ORCHESTRA_WIDGET_NAME_SET: ReadonlySet<string> = new Set(ORCHESTRA_WIDGET_NAMES);

const ORCHESTRA_PLACEHOLDER_PATTERN = '<div[^>]*data-orchestra-widget="([^"]+)"[^>]*></div>';

export function isOrchestraWidgetName(name: string): name is OrchestraWidgetName {
  return ORCHESTRA_WIDGET_NAME_SET.has(name);
}

export function createOrchestraPlaceholderRegex(): RegExp {
  return new RegExp(ORCHESTRA_PLACEHOLDER_PATTERN, 'g');
}

export function hasOrchestraPlaceholders(html: string): boolean {
  const placeholder = createOrchestraPlaceholderRegex();
  let match: RegExpExecArray | null;
  while ((match = placeholder.exec(html)) !== null) {
    const name = match[1];
    if (name !== undefined && isOrchestraWidgetName(name)) {
      return true;
    }
  }
  return false;
}
