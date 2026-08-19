<template>
  <div class="img-order">
    <div class="img-order-head">
      <span>Фото товара</span>
      <span class="hint">Перетащите вниз — нижнее фото станет обложкой</span>
    </div>

    <div class="img-order-list">
      <div
        v-for="(image, index) in localImages"
        :key="image.id"
        class="img-order-item"
        :class="{
          dragging: draggingId === image.id,
          'drag-over': dragOverId === image.id,
          cover: index === localImages.length - 1,
        }"
        draggable="true"
        @dragstart="onDragStart(image.id)"
        @dragend="onDragEnd"
        @dragover.prevent="onDragOver(image.id)"
        @dragleave="onDragLeave"
        @drop.prevent="onDrop(image.id)"
      >
        <div class="img-order-handle">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.6"
          >
            <circle cx="9" cy="6" r="1" fill="currentColor" stroke="none" />
            <circle cx="15" cy="6" r="1" fill="currentColor" stroke="none" />
            <circle cx="9" cy="12" r="1" fill="currentColor" stroke="none" />
            <circle cx="15" cy="12" r="1" fill="currentColor" stroke="none" />
            <circle cx="9" cy="18" r="1" fill="currentColor" stroke="none" />
            <circle cx="15" cy="18" r="1" fill="currentColor" stroke="none" />
          </svg>
        </div>

        <img :src="image.path" :alt="`Фото ${index + 1}`" />

        <div class="img-order-meta">
          <span class="img-order-index mono"
            >{{ index + 1 }} / {{ localImages.length }}</span
          >
          <span v-if="index === localImages.length - 1" class="cover-badge"
            >Обложка</span
          >
        </div>

        <button
          type="button"
          class="img-order-replace"
          draggable="false"
          :disabled="replacingId === image.id"
          @click="triggerReplace(image.id)"
          @mousedown.stop
          aria-label="Заменить фото"
        >
          <svg
            v-if="replacingId !== image.id"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.8"
          >
            <path d="M21 12a9 9 0 1 1-2.6-6.3L21 8" />
            <path d="M21 3v5h-5" />
          </svg>
          <span v-else class="spinner" />
        </button>

        <button
          type="button"
          class="img-order-remove"
          draggable="false"
          @click="removeImage(image.id)"
          @mousedown.stop
          aria-label="Удалить фото"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.8"
          >
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div v-if="localImages.length === 0" class="img-order-empty">
        Фото ещё не загружены
      </div>
    </div>

    <input
      ref="replaceInput"
      type="file"
      accept="image/*"
      hidden
      @change="onReplaceFileSelected"
    />

    <div class="img-order-actions">
      <button
        type="button"
        class="abtn abtn-primary abtn-sm"
        :disabled="!dirty || saving"
        @click="save"
      >
        {{ saving ? "Сохраняем..." : "Сохранить порядок" }}
      </button>
      <span v-if="savedMessage" class="saved-msg">{{ savedMessage }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ProductImage } from "~/types";

const { apiFetch } = useAdminApi();

const props = defineProps<{
  productId: number;
  images: ProductImage[];
}>();

const emit = defineEmits<{
  (e: "updated", images: ProductImage[]): void;
}>();

// локальная копия — редактируем на клиенте, отправляем на сервер только по кнопке "Сохранить"
const localImages = ref<ProductImage[]>([...props.images]);
const originalOrder = ref(props.images.map((i) => i.id).join(","));
const dirty = computed(
  () => localImages.value.map((i) => i.id).join(",") !== originalOrder.value,
);

const saving = ref(false);
const savedMessage = ref("");

const draggingId = ref<number | null>(null);
const dragOverId = ref<number | null>(null);

const onDragStart = (id: number) => {
  draggingId.value = id;
};
const onDragEnd = () => {
  draggingId.value = null;
  dragOverId.value = null;
};
const onDragOver = (id: number) => {
  if (id !== draggingId.value) dragOverId.value = id;
};
const onDragLeave = () => {
  dragOverId.value = null;
};

const onDrop = (targetId: number) => {
  if (draggingId.value === null || draggingId.value === targetId) return;

  const fromIndex = localImages.value.findIndex(
    (i) => i.id === draggingId.value,
  );
  const toIndex = localImages.value.findIndex((i) => i.id === targetId);
  if (fromIndex === -1 || toIndex === -1) return;

  const [moved] = localImages.value.splice(fromIndex, 1);
  if (!moved) return;
  localImages.value.splice(toIndex, 0, moved);

  draggingId.value = null;
  dragOverId.value = null;
};

const removeImage = (id: number) => {
  localImages.value = localImages.value.filter((i) => i.id !== id);
};

// ---------- ЗАМЕНА ФОТО ----------
const replaceInput = ref<HTMLInputElement | null>(null);
const replaceTargetId = ref<number | null>(null);
const replacingId = ref<number | null>(null);

const triggerReplace = (imageId: number) => {
  replaceTargetId.value = imageId;
  replaceInput.value?.click();
};

const onReplaceFileSelected = async (e: Event) => {
  const file = (e.target as HTMLInputElement).files?.[0];
  const targetId = replaceTargetId.value;
  if (!file || targetId === null) return;

  replacingId.value = targetId;
  try {
    const formData = new FormData();
    formData.append("file", file);

    const updated = await apiFetch<ProductImage>(
      `/images/${targetId}/replace`,
      {
        method: "PUT",
        body: formData,
      },
    );

    // меняем путь на месте — id и позиция в списке остаются прежними
    const idx = localImages.value.findIndex((i) => i.id === targetId);
    if (idx !== -1) localImages.value[idx] = updated;

    originalOrder.value = localImages.value.map((i) => i.id).join(","); // порядок не менялся
    emit("updated", localImages.value);
  } catch {
    savedMessage.value = "Не удалось заменить фото";
  } finally {
    replacingId.value = null;
    replaceTargetId.value = null;
    if (replaceInput.value) replaceInput.value.value = ""; // сброс, чтобы можно было выбрать тот же файл повторно
  }
};

const save = async () => {
  saving.value = true;
  savedMessage.value = "";
  try {
    // индекс в массиве = новая позиция; нижний элемент (последний индекс) получает
    // наибольшее значение position — это то, что бэкенд трактует как обложку
    const orderedIds = localImages.value.map((img) => img.id);

    const updated = await apiFetch<ProductImage[]>(
      `/products/${props.productId}/images/reorder`,
      {
        method: "PUT",
        body: { ordered_ids: orderedIds },
      },
    );

    localImages.value = updated;
    originalOrder.value = updated.map((i) => i.id).join(",");
    emit("updated", updated);
    savedMessage.value = "Порядок сохранён";
    setTimeout(() => (savedMessage.value = ""), 2000);
  } catch {
    savedMessage.value = "Не удалось сохранить";
  } finally {
    saving.value = false;
  }
};

watch(
  () => props.images,
  (val) => {
    localImages.value = [...val];
    originalOrder.value = val.map((i) => i.id).join(",");
  },
);
</script>

<style scoped>
.img-order {
  border: 1px solid var(--line-strong, rgba(255, 255, 255, 0.16));
  border-radius: 4px;
  padding: 16px;
  background: var(--bg, #0f1113);
}
.img-order-head {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 12px;
  font-size: 12.5px;
  color: var(--text-muted, #989c9f);
}
.img-order-head .hint {
  font-family: "IBM Plex Mono", monospace;
  font-size: 11px;
  color: var(--text-dim, #6b6f73);
}

.img-order-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.img-order-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 10px;
  border: 1px solid var(--line, rgba(255, 255, 255, 0.09));
  border-radius: 3px;
  background: var(--bg-elev, #17191c);
  cursor: grab;
  transition:
    border-color 0.12s ease,
    opacity 0.12s ease,
    transform 0.12s ease;
}
.img-order-item:active {
  cursor: grabbing;
}
.img-order-item.dragging {
  opacity: 0.4;
}
.img-order-item.drag-over {
  border-color: var(--accent, #c9974c);
  transform: translateY(2px);
}
.img-order-item.cover {
  border-color: var(--accent, #c9974c);
  background: var(--accent-soft, rgba(201, 151, 76, 0.14));
}

.img-order-handle {
  color: var(--text-dim, #6b6f73);
  flex-shrink: 0;
}
.img-order-handle svg {
  width: 16px;
  height: 16px;
}

.img-order-item img {
  width: 46px;
  height: 46px;
  object-fit: cover;
  border-radius: 3px;
  flex-shrink: 0;
}

.img-order-meta {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 8px;
}
.img-order-index {
  font-size: 11px;
  color: var(--text-dim, #6b6f73);
}
.cover-badge {
  font-family: "IBM Plex Mono", monospace;
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: var(--accent, #c9974c);
  border: 1px solid var(--accent, #c9974c);
  padding: 2px 7px;
  border-radius: 10px;
}

.img-order-replace {
  background: none;
  border: none;
  color: var(--text-dim, #6b6f73);
  cursor: pointer;
  padding: 4px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}
.img-order-replace:hover:not(:disabled) {
  color: var(--accent, #c9974c);
}
.img-order-replace:disabled {
  cursor: not-allowed;
}
.img-order-replace svg {
  width: 15px;
  height: 15px;
}
.spinner {
  width: 13px;
  height: 13px;
  border: 2px solid var(--line-strong, rgba(255, 255, 255, 0.16));
  border-top-color: var(--accent, #c9974c);
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
  display: block;
}
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.img-order-remove {
  background: none;
  border: none;
  color: var(--text-dim, #6b6f73);
  cursor: pointer;
  padding: 4px;
  flex-shrink: 0;
}
.img-order-remove:hover {
  color: #c9584c;
}
.img-order-remove svg {
  width: 14px;
  height: 14px;
}

.img-order-empty {
  padding: 24px;
  text-align: center;
  color: var(--text-dim, #6b6f73);
  font-size: 12.5px;
}

.img-order-actions {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 14px;
}
.saved-msg {
  font-family: "IBM Plex Mono", monospace;
  font-size: 12px;
  color: var(--accent, #c9974c);
}

.abtn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 9px 16px;
  border-radius: 2px;
  font-family: "Space Grotesk", sans-serif;
  font-weight: 600;
  font-size: 13px;
  border: 1px solid transparent;
  cursor: pointer;
  transition:
    background 0.12s ease,
    opacity 0.12s ease;
}
.abtn-primary {
  background: var(--accent, #c9974c);
  color: var(--accent-ink, #171208);
}
.abtn-primary:hover:not(:disabled) {
  background: #dba85b;
}
.abtn-primary:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}
.abtn-sm {
  padding: 6px 11px;
  font-size: 12px;
}
</style>
