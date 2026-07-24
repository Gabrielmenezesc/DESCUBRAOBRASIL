/**
 * Retorna o caminho correto para assets estáticos respeitando o basePath
 * configurado via NEXT_PUBLIC_BASE_PATH (definido no next.config.ts).
 *
 * Uso:
 *   import { assetPath } from '@/lib/assetPath';
 *   <img src={assetPath('/logo-descubra.png')} />
 */
export function assetPath(path: string): string {
  const base = process.env.NEXT_PUBLIC_BASE_PATH ?? '';
  // Garante que não haja barra dupla
  return `${base}${path.startsWith('/') ? path : `/${path}`}`;
}
