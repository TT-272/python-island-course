// 极简路由：够用就好，不引入 react-router
//
// 用 hash（#/lesson/py-01）而不是路径。原因：部署到 GitHub Pages 这类静态托管时
// 站点在子路径下，而且服务器没有 SPA 回退 —— 用路径的话刷新深层链接会 404。
// hash 后面的内容不会发给服务器，所以服务器永远只看到根路径，怎么刷都不会 404。
import { useEffect, useState } from 'react';

export type Route =
  | { name: 'map' }
  | { name: 'region'; id: string }
  | { name: 'lesson'; id: string }
  | { name: 'badges' }
  | { name: 'about' }
  | { name: 'engine' };

export function parsePath(path: string): Route {
  const p = path.replace(/\/+$/, '') || '/';
  if (p === '/') return { name: 'map' };
  if (p === '/badges') return { name: 'badges' };
  if (p === '/about') return { name: 'about' };
  if (p === '/engine') return { name: 'engine' };
  let m = p.match(/^\/region\/([^/]+)$/);
  if (m) return { name: 'region', id: decodeURIComponent(m[1]) };
  m = p.match(/^\/lesson\/([^/]+)$/);
  if (m) return { name: 'lesson', id: decodeURIComponent(m[1]) };
  return { name: 'map' };
}

/** 地址栏 hash 对应的路由；没有 hash 就当作首页 */
function routeFromHash(): Route {
  return parsePath(location.hash.replace(/^#/, '') || '/');
}

export function useRoute(): [Route, (to: string) => void] {
  const [route, setRoute] = useState<Route>(routeFromHash);

  useEffect(() => {
    const onHash = () => {
      setRoute(routeFromHash());
      window.scrollTo(0, 0);
    };
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  const go = (to: string) => {
    if (location.hash === `#${to}`) return;
    location.hash = to;   // 触发 hashchange，同时写入浏览历史（后退键可用）
  };

  return [route, go];
}
