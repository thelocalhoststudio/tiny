import { defaultConfig } from '../site.config.ts';
import type { UserConfig } from '../types.ts';

function isPlainObject(item: unknown): item is Record<string, any> {
  return typeof item === 'object' && item !== null && !Array.isArray(item);
}

/**
 * Safely merge user configuration over theme defaults.
 * - Deeply merges nested configuration domain objects (author, seo, theme, features, search, analytics, ui)
 * - Completely replaces arrays (headerLinks, footerLinks, socialLinks, browse.dimensions)
 * - Retains full backward compatibility with legacy configuration shapes
 */
export function mergeConfig(defaults: UserConfig, overrides?: Partial<UserConfig> | null): UserConfig {
  if (!overrides) return { ...defaults };

  const result: any = { ...defaults };

  for (const key of Object.keys(overrides) as (keyof UserConfig)[]) {
    const overrideVal = overrides[key];
    const defaultVal = defaults[key];

    if (overrideVal === undefined) {
      continue;
    }

    if (Array.isArray(overrideVal)) {
      result[key] = [...overrideVal];
    } else if (isPlainObject(overrideVal) && isPlainObject(defaultVal)) {
      result[key] = {
        ...defaultVal,
        ...overrideVal,
      };
    } else {
      result[key] = overrideVal;
    }
  }

  const objectDomains: (keyof UserConfig)[] = [
    'author',
    'browse',
    'seo',
    'theme',
    'features',
    'search',
    'analytics',
    'ui',
  ];

  for (const domain of objectDomains) {
    if (isPlainObject(defaults[domain])) {
      result[domain] = {
        ...(defaults[domain] as any),
        ...(isPlainObject(result[domain]) ? result[domain] : {}),
      };
    }
  }

  return result as UserConfig;
}

export async function getConfig(): Promise<UserConfig> {
  try {
    const { getCollection } = await import('astro:content');
    const entries = await getCollection('siteConfig');
    const userConfig = entries.find((e: any) => e.id === 'config')?.data ?? {};

    return mergeConfig(defaultConfig, userConfig);
  } catch {
    return defaultConfig;
  }
}
