import { Image } from 'expo-image';
import { useState, type ReactElement } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Linking,
  Pressable,
  useWindowDimensions,
  View,
} from 'react-native';

import type { LibraryPhoto } from '@/attachments/domain/services/photo-library';
import { usePhotoAccess } from '@/attachments/presentation/hooks/use-photo-access';
import { usePickPhoto } from '@/attachments/presentation/hooks/use-pick-photo';
import { useRecentPhotos } from '@/attachments/presentation/hooks/use-recent-photos';
import { StepHeader } from '@/products/presentation/components/step-header';
import { usePurchaseDraftStore } from '@/products/presentation/stores/purchase-draft.store';
import { usePreferencesStore } from '@/settings/presentation/stores/preferences.store';
import { EmptyState } from '@/shared/presentation/components/empty-state';
import { Icon } from '@/shared/presentation/components/icon';
import { PrimaryButton } from '@/shared/presentation/components/primary-button';
import { TextButton } from '@/shared/presentation/components/text-button';
import { fonts, maxContentWidth } from '@/shared/presentation/constants/theme';
import { toErrorMessage } from '@/shared/presentation/errors/error-messages';
import { useScreenInsets } from '@/shared/presentation/hooks/use-screen-insets';
import { useTheme } from '@/shared/presentation/hooks/use-theme';
import { useToday } from '@/shared/presentation/hooks/use-today';
import { showToast } from '@/shared/presentation/stores/toast.store';
import { makeStyles } from '@/shared/presentation/utils/make-styles';

const columns = 3;
const gap = 4;
const padding = 20;

export function PurchaseGalleryStep() {
  const colors = useTheme();
  const styles = useStyles();
  const today = useToday();
  const { top, bottom } = useScreenInsets();
  const { width } = useWindowDimensions();
  const { goTo, fillFromPhoto, fillManually } = usePurchaseDraftStore();
  const defaultMonths = usePreferencesStore((state) => state.defaultMonths);
  const { access, isError: isAccessError, retry, request, chooseMore } = usePhotoAccess();
  const canList = access === 'all' || access === 'limited';
  const recent = useRecentPhotos(canList);
  const pick = usePickPhoto();
  const photos = canList ? (recent.data ?? []) : [];
  const size = (Math.min(width, maxContentWidth) - padding * 2 - gap * (columns - 1)) / columns;

  function choose(id: string) {
    pick.mutate(id, {
      onSuccess: (photo) => fillFromPhoto(photo, today, defaultMonths),
      onError: (error) => showToast(toErrorMessage(error), 'info'),
    });
  }

  function loadMore() {
    if (recent.hasNextPage && !recent.isFetching && !recent.isFetchNextPageError) recent.fetchNextPage();
  }

  const manualButton = (
    <TextButton
      label="Ingresar a mano"
      icon="edit"
      onPress={() => fillManually(today, defaultMonths)}
      style={styles.link}
      textStyle={styles.linkText}
    />
  );
  const chooseMoreButton = (
    <TextButton
      label="Elegir más fotos"
      icon="gallery"
      onPress={chooseMore}
      style={styles.link}
      textStyle={styles.linkText}
    />
  );

  // Lo que se muestra cuando no hay cuadrícula.
  function renderStatus(): ReactElement {
    if (access === 'unavailable') {
      return (
        <View style={styles.status}>
          <EmptyState message="La galería no está disponible en web" />
          {manualButton}
        </View>
      );
    }
    if (access === 'denied' || access === 'blocked') {
      const isBlocked = access === 'blocked';
      return (
        <View style={styles.status}>
          <EmptyState
            message={
              isBlocked
                ? 'El acceso a tus fotos está bloqueado. Actívalo en los ajustes para elegir el recibo.'
                : 'Necesitamos acceso a tus fotos para que elijas la del recibo.'
            }
          />
          {isBlocked ? (
            <PrimaryButton label="Abrir ajustes" icon="settings" onPress={() => void Linking.openSettings()} />
          ) : (
            <PrimaryButton label="Permitir acceso" icon="gallery" onPress={request} />
          )}
          {manualButton}
        </View>
      );
    }
    if (isAccessError || recent.isError) {
      return (
        <View style={styles.status}>
          <EmptyState message="No se pudieron cargar las fotos." />
          <PrimaryButton
            label="Reintentar"
            icon="retry"
            onPress={isAccessError ? retry : () => void recent.refetch()}
          />
        </View>
      );
    }
    if (!recent.data) return <ActivityIndicator color={colors.green} style={styles.loading} />;
    return (
      <View style={styles.status}>
        <EmptyState message="No hay fotos en tu galería." />
        {access === 'limited' && chooseMoreButton}
        {manualButton}
      </View>
    );
  }

  return (
    <FlatList
      data={photos}
      numColumns={columns}
      keyExtractor={({ id }) => id}
      extraData={pick.isPending}
      contentContainerStyle={{
        paddingTop: top + 2,
        paddingBottom: bottom + 10,
        paddingHorizontal: padding,
        gap,
      }}
      columnWrapperStyle={{ gap }}
      ListHeaderComponent={
        <View style={styles.header}>
          <StepHeader title="Fotos recientes" cancelColor={colors.green} onCancel={() => goTo('source')} />
          {access === 'limited' && photos.length > 0 && chooseMoreButton}
        </View>
      }
      ListEmptyComponent={renderStatus()}
      ListFooterComponent={
        recent.isFetchingNextPage ? (
          <ActivityIndicator color={colors.green} style={styles.footer} />
        ) : recent.isFetchNextPageError && photos.length > 0 ? (
          <TextButton
            label="Reintentar"
            icon="retry"
            onPress={() => void recent.fetchNextPage()}
            style={styles.link}
            textStyle={styles.linkText}
          />
        ) : undefined
      }
      onEndReached={loadMore}
      renderItem={({ item, index }) => (
        <PhotoCell
          photo={item}
          label={`Foto ${index + 1}`}
          size={size}
          disabled={pick.isPending}
          isPicking={pick.isPending && pick.variables === item.id}
          onPress={() => choose(item.id)}
        />
      )}
    />
  );
}

interface PhotoCellProps {
  photo: LibraryPhoto;
  label: string;
  size: number;
  disabled: boolean;
  isPicking: boolean;
  onPress: () => void;
}

function PhotoCell({ photo, label, size, disabled, isPicking, onPress }: PhotoCellProps) {
  const colors = useTheme();
  const styles = useStyles();
  const [hasFailed, setHasFailed] = useState(false);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled, busy: isPicking }}
      disabled={disabled}
      onPress={onPress}
      style={[styles.photo, { width: size, height: size }]}>
      {hasFailed ? (
        <Icon name="gallery" color={colors.muted} />
      ) : (
        <Image
          source={{ uri: photo.previewUri }}
          recyclingKey={photo.id}
          contentFit="cover"
          onError={() => setHasFailed(true)}
          style={styles.image}
        />
      )}
      {isPicking && (
        <View style={styles.picking}>
          <ActivityIndicator color={colors.paper} />
        </View>
      )}
    </Pressable>
  );
}

const useStyles = makeStyles((c) => ({
  header: { gap: 16, marginBottom: 16 - gap },
  status: { gap: 16 },
  loading: { paddingVertical: 36 },
  footer: { paddingVertical: 16 },
  link: { padding: 12, alignItems: 'center' },
  linkText: { fontFamily: fonts.sansMedium, fontSize: 15, color: c.green },
  photo: { alignItems: 'center', justifyContent: 'center', backgroundColor: c.tile },
  image: { width: '100%', height: '100%' },
  picking: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: c.backdrop,
  },
}));
