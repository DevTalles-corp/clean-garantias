import { useInfiniteQuery, type InfiniteData } from '@tanstack/react-query';

import type { LibraryPhoto } from '@/attachments/domain/services/photo-library';
import { useUseCases } from '@/shared/presentation/providers/use-cases.context';

export const recentPhotosKey = ['recent-photos'];
const pageSize = 60;

// Las fotos nuevas desplazan las páginas: se descartan las repetidas.
function selectPhotos({ pages }: InfiniteData<LibraryPhoto[]>): LibraryPhoto[] {
  return [...new Map(pages.flat().map((photo) => [photo.id, photo])).values()];
}

export function useRecentPhotos(enabled: boolean) {
  const { photos } = useUseCases();
  return useInfiniteQuery({
    queryKey: recentPhotosKey,
    queryFn: ({ pageParam }) => photos.findRecent.execute(pageSize, pageParam),
    initialPageParam: 0,
    getNextPageParam: (lastPage, pages) =>
      lastPage.length < pageSize ? undefined : pages.length * pageSize,
    select: selectPhotos,
    enabled,
    gcTime: 0, // al volver a entrar se recarga la lista
  });
}
