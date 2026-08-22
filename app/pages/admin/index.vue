<template>
  <AdminChatLauncher />
  <section class="admin-products">
    <div class="admin-products-head">
      <div>
        <h2>Товары</h2>
        <p>
          {{ list.length }} позиций
          {{ category !== "all" ? "в этой категории" : "в каталоге" }}
        </p>
      </div>
    </div>

    <div class="catalog-controls">
      <div class="cond-toggle">
        <button
          class="cond-btn"
          :class="{ active: condition === 'all' }"
          @click="setCondition('all')"
        >
          Все
        </button>
        <button
          class="cond-btn"
          :class="{ active: condition === 'new' }"
          @click="setCondition('new')"
        >
          Новое
        </button>
        <button
          class="cond-btn"
          :class="{ active: condition === 'used' }"
          @click="setCondition('used')"
        >
          Б/у
        </button>
      </div>
      <div class="pill-row">
        <button
          v-for="c in categories"
          :key="c.id"
          class="pill-btn"
          :class="{ active: category === c.name }"
          @click="setCategory(c.name)"
        >
          {{ c.name }}

          <span
            class="pill-delete-x"
            @click.stop="confirmDeleteCategory(c)"
            role="button"
            :aria-label="`Удалить категорию ${c.name}`"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2.4"
            >
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </span>
        </button>

        <button class="pill-create-btn" @click="openCreateCategoryModal">
          создать категорию
        </button>
      </div>
    </div>

    <div class="prod-grid">
      <!-- КАРТОЧКА "ДОБАВИТЬ ТОВАР" -->
      <button class="prod-card add-card" @click="openCreateModal">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.6"
        >
          <path d="M12 5v14M5 12h14" />
        </svg>
        <span>Добавить товар</span>
      </button>

      <!-- СУЩЕСТВУЮЩИЕ ТОВАРЫ -->
      <div
        class="prod-card"
        @click="openEditModal(product)"
        v-for="product in list"
        :key="`${product.id}`"
      >
        <div class="prod-photo">
          <span
            class="tag"
            :class="product.condition === 'new' ? 'new' : 'used'"
          >
            {{ product.condition === "new" ? "Новое" : "Б/У" }}
          </span>

          <img
            :src="config.public.mediaBase + product.img"
            :alt="product.name"
            class="prod-icon-img"
            loading="lazy"
          />
        </div>

        <div class="prod-body">
          <h4>{{ product.name }}</h4>
          <h5 v-if="product.category_name === 'PlayStation'">
            Стоимость и комплектацию уточняйте у консультанта
          </h5>
          <div class="cond">
            {{
              product.condition === "new"
                ? "Новое, гарантия"
                : "Б/у, проверено перед продажей"
            }}
          </div>

          <div class="prod-foot">
            <span class="price"> цена от ₩{{ product.price }} и выше</span>
          </div>

          <!-- АДМИН-ДЕЙСТВИЯ: под заголовком и ценой -->
          <div class="admin-card-actions">
            <button class="admin-mini-btn" @click.stop="openEditModal(product)">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1.8"
              >
                <path d="M12 20h9" />
                <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" />
              </svg>
              Изменить
            </button>
            <button
              class="admin-mini-btn danger"
              @click.stop="confirmDelete(product)"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1.8"
              >
                <path
                  d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0-1 14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2L4 6"
                />
              </svg>
              Удалить
            </button>
          </div>
        </div>
      </div>
    </div>

    <p v-if="list.length === 0" class="empty-note">
      Товаров с такими фильтрами нет.
    </p>

    <!-- ================= МОДАЛКА СОЗДАНИЯ / РЕДАКТИРОВАНИЯ ================= -->
    <Transition name="modal-pop">
      <div v-if="isModalOpen" class="pm-overlay" @click="closeModal">
        <div class="pm-box" @click.stop>
          <button class="pm-close" @click="closeModal">&times;</button>
          <div class="pm-kicker">
            {{ isEditing ? "Редактирование" : "Новый товар" }}
          </div>
          <h3>{{ isEditing ? form.name || "Товар" : "Добавить товар" }}</h3>

          <form
            v-if="!isEditing"
            class="pm-form"
            @submit.prevent="submitCreateProduct"
          >
            <div class="pm-field">
              <label>Название</label>
              <input
                v-model="form.name"
                type="text"
                placeholder="Например: PS5 Slim Digital Edition"
                required
              />
            </div>

            <div class="pm-row">
              <div class="pm-field">
                <label>Категория</label>
                <select v-model="form.category_id" required>
                  <option value="" disabled>Выберите категорию</option>
                  <option
                    v-for="category in categories"
                    :value="category.id"
                    :key="category.id"
                  >
                    {{ category.name }}
                  </option>
                </select>
              </div>
              <div class="pm-field">
                <label>Состояние</label>
                <select v-model="form.condition">
                  <option value="new">Новое</option>
                  <option value="used">Б/у</option>
                </select>
              </div>
            </div>

            <div class="pm-row">
              <div class="pm-field">
                <label>Цена</label>
                <input
                  v-model="form.price"
                  type="text"
                  placeholder="от  ₩780 или «по запросу»"
                  required
                />
              </div>
            </div>

            <div class="pm-field">
              <label>Фото</label>
              <div class="pm-dropzone" @click="fileInput?.click()">
                <img v-if="form.img" :src="getImageUrl(form.img)" alt="" />
                <template v-else>
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="1.5"
                  >
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <path d="M17 8l-5-5-5 5" />
                    <path d="M12 3v12" />
                  </svg>
                  <span>Нажмите, чтобы выбрать фото</span>
                </template>
              </div>
              <input
                ref="fileInput"
                type="file"
                accept="image/*"
                hidden
                @change="onFileSelected"
              />
            </div>
            <!-- 
            <div class="pm-field" v-if="isEditing && editingId">
              <ImageOrderManager
                :product-id="editingId"
                :images="editingImages"
                @updated="(images: ProductImage[]) => (editingImages = images)"
              />
            </div> -->

            <div v-if="status" class="pm-status err">{{ status }}</div>

            <div class="pm-actions">
              <button
                type="submit"
                class="abtn abtn-primary"
                :disabled="submitting"
              >
                {{
                  submitting
                    ? "Сохраняем..."
                    : isEditing
                      ? "Сохранить изменения"
                      : "Добавить товар"
                }}
              </button>
              <button
                v-if="isEditing"
                type="button"
                class="abtn abtn-ghost"
                @click="closeModal"
              >
                Отмена
              </button>
            </div>
          </form>

          <form
            v-if="isEditing"
            class="pm-form"
            @submit.prevent="submitUpdateProduct"
          >
            <div class="pm-field">
              <label>Название</label>
              <input
                v-model="form.name"
                type="text"
                placeholder="Например: PS5 Slim Digital Edition"
                required
              />
            </div>

            <div class="pm-row">
              <div class="pm-field">
                <label>Категория</label>
                <select v-model="form.category_id" required>
                  <option value="">Выберите категорию</option>
                  <option
                    v-for="category in categories"
                    :value="category.id"
                    :key="category.id"
                  >
                    {{ category.name }}
                  </option>
                </select>
              </div>
              <div class="pm-field">
                <label>Состояние</label>
                <select v-model="form.condition">
                  <option value="new">Новое</option>
                  <option value="used">Б/у</option>
                </select>
              </div>
            </div>

            <div class="pm-row">
              <div class="pm-field">
                <label>Цена</label>
                <input
                  v-model="form.price"
                  type="text"
                  placeholder="от  ₩780 или «по запросу»"
                  required
                />
              </div>
            </div>

            <div class="pm-field">
              <label>Фото</label>
              <div class="pm-dropzone" @click="fileInput?.click()">
                <img v-if="form.img" :src="getImageUrl(form.img)" alt="" />
                <template v-else>
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="1.5"
                  >
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <path d="M17 8l-5-5-5 5" />
                    <path d="M12 3v12" />
                  </svg>
                  <span>Нажмите, чтобы выбрать фото</span>
                </template>
              </div>
              <input
                ref="fileInput"
                type="file"
                accept="image/*"
                hidden
                @change="onReplaceFileSelected"
              />
            </div>
            <!-- 
            <div class="pm-field" v-if="isEditing && editingId">
              <ImageOrderManager
                :product-id="editingId"
                :images="editingImages"
                @updated="(images: ProductImage[]) => (editingImages = images)"
              />
            </div> -->

            <div class="pm-actions">
              <button
                type="submit"
                class="abtn abtn-primary"
                :disabled="submitting"
              >
                {{
                  submitting
                    ? "Сохраняем..."
                    : isEditing
                      ? "Сохранить изменения"
                      : "Добавить товар"
                }}
              </button>
              <button
                v-if="isEditing"
                type="button"
                class="abtn abtn-ghost"
                @click="closeModal"
              >
                Отмена
              </button>
            </div>
          </form>
        </div>
      </div>
    </Transition>

    <Transition name="modal-pop">
      <div
        v-if="isCategoryModalOpen"
        class="pm-overlay"
        @click="closeCategoryModal"
      >
        <div class="pm-box" @click.stop>
          <button class="pm-close" @click="closeCategoryModal">&times;</button>
          <div class="pm-kicker">Создание категории</div>
          <h3>Создать новую категорию</h3>

          <form class="pm-form" @submit.prevent="submitCreateCategory">
            <div class="pm-field">
              <label>Название</label>
              <input
                v-model="form.name"
                type="text"
                placeholder="Например: Playstation"
                required
              />
            </div>

            <div v-if="status" class="pm-status err">{{ status }}</div>

            <div class="pm-actions">
              <button
                type="submit"
                class="abtn abtn-primary"
                :disabled="submitting"
              >
                {{
                  submitting
                    ? "Сохраняем..."
                    : isEditing
                      ? "Сохранить изменения"
                      : "Создать новую категорию"
                }}
              </button>
              <button
                v-if="isEditing"
                type="button"
                class="abtn abtn-ghost"
                @click="closeModal"
              >
                Отмена
              </button>
            </div>
          </form>
        </div>
      </div>
    </Transition>
  </section>
</template>

<script setup lang="ts">
import "~/assets/css/admin.css";

import type { Product, Category, ProductImage, ProductOut } from "~/types";

definePageMeta({ middleware: "admin" });

const condition = ref<"all" | "new" | "used">("all");
const category = ref("Все");
const categories = ref<Category[]>([]);
const products = ref<ProductOut[]>([]);
const setCondition = (c: typeof condition.value) => (condition.value = c);
const setCategory = (c: string) => (category.value = c);

// Заглушка — заменить на fetch с /products

const config = useRuntimeConfig();

// Формирует правильную ссылку на картинку
const getImageUrl = (path: string) => {
  if (!path) return "";

  // Если это уже полная ссылка или локальное превью
  if (path.startsWith("http") || path.startsWith("blob:")) {
    return path;
  }

  // Используем mediaBase вместо apiBase
  const baseUrl = config.public.mediaBase.replace(/\/$/, "");
  const imgPath = path.startsWith("/") ? path : `/${path}`;

  return `${baseUrl}${imgPath}`;
};

const productsResponse = await useFetch<ProductOut[]>("/products", {
  baseURL: config.public.apiBase,
  default: () => [],
});

const categoriesResponse = await useFetch<Category[]>("/categories", {
  baseURL: config.public.apiBase,
  default: () => [],
});

const list = computed(() => {
  if (category.value === "Популярное")
    return products.value.filter(
      (product) =>
        (product.category_name === "PlayStation" ||
          product.category_name === "Игры") &&
        (condition.value === "all" || product.condition === condition.value),
    );
  return products.value.filter((product) => {
    const matchesCategory =
      category.value === "Все" ||
      category.value === "Популярное" ||
      product.category_name === category.value;

    const matchesCnodition =
      condition.value === "all" || product.condition === condition.value;
    return matchesCategory && matchesCnodition;
  });
});
// ---------- МОДАЛКА ----------
const isModalOpen = ref(false);
const isCategoryModalOpen = ref(false);
const isEditing = ref(false);
const editingSku = ref<number | null>(null);
const submitting = ref(false);
const status = ref("");
const fileInput = ref<HTMLInputElement | null>(null);
const editingId = ref<number | null>(null); // ← добавить
const editingImages = ref<ProductImage[]>([]);
const { apiFetch } = useAdminApi();

const emptyForm = () => ({
  id: 0,
  img_id: 0,
  name: "".toLowerCase(),
  file: null as File | null,
  category_id: null as number | null,
  condition: "new",
  price: "₩0",
  img: "",
});
const form = reactive(emptyForm());

const openCreateModal = () => {
  Object.assign(form, emptyForm());

  const playstation = categories.value.find(
    (cat) => cat.name === "PlayStation",
  );
  form.category_id = playstation?.id ?? categories.value[0]?.id ?? null;
  isEditing.value = false;
  editingSku.value = null;
  editingId.value = null; // ← добавить
  editingImages.value = [];
  status.value = "";
  isModalOpen.value = true;
};

const openCreateCategoryModal = () => {
  isCategoryModalOpen.value = true;
};

const openEditModal = async (product: ProductOut) => {
  Object.assign(form, { ...product });
  form.price = `₩${product.price}`;
  console.log(form.img_id);
  isEditing.value = true;
  editingSku.value = product.id;
  status.value = "";
  isModalOpen.value = true;
  editingId.value = product.id;
  editingImages.value = await apiFetch(`/products/${product.id}/images`);
};

const closeModal = () => {
  isModalOpen.value = false;
  editingId.value = null;
  editingImages.value = [];
  Object.assign(form, emptyForm());
};

const closeCategoryModal = () => {
  isCategoryModalOpen.value = false;
  form.name = "";
};

const onFileSelected = async (e: Event) => {
  const file = (e.target as HTMLInputElement).files?.[0];
  if (!file) return;

  form.img = URL.createObjectURL(file); // превью; реальная загрузка — в submitForm
  form.file = file;
  (form as any)._file = file;
};

const onReplaceFileSelected = async (e: Event) => {
  const file = (e.target as HTMLInputElement).files?.[0];
  if (!file) return;

  const image = editingImages.value.find((image) => image.path === form.img);

  try {
    const formData = new FormData();
    formData.append("file", file);

    if (image) {
      const updated = await apiFetch<ProductImage>(
        `/images/${form.id}/images`,
        {
          method: "POST",
          body: formData,
        },
      );

      if (updated.path) {
        form.img = updated.path;
      }
    }

    const upatedProductWithoutImage = await apiFetch<ProductImage>(
      `/products/${form.id}/images`,
      {
        method: "POST",
        body: formData,
      },
    );

    if (upatedProductWithoutImage) {
      form.img = upatedProductWithoutImage.path;
    }
  } catch (error) {
    console.log(error);
  }
};

const submitCreateCategory = async () => {
  if (!form.name) {
    status.value = "Введите название категории";
    return;
  }
  const category = await apiFetch<Category>("/categories", {
    method: "POST",
    body: { name: form.name },
  });

  categories.value.push(category);

  closeCategoryModal();
};

const submitCreateProduct = async () => {
  const validPrice = form.price.replace("₩", "").trim();
  const numericPrice = Number(validPrice);

  if (!form.category_id) {
    status.value = "Выберите категорию";
    return;
  }

  if (!validPrice || isNaN(numericPrice) || numericPrice <= 0) {
    status.value = "Введите цену больше 0";
    return;
  }

  if (!form.file) {
    status.value = "Файл не выбран";
    return;
  }

  const product = await apiFetch<Product>("/products", {
    method: "POST",
    body: {
      category_id: form.category_id,
      name: form.name,
      price: validPrice,
      condition: form.condition,
    },
  });

  const formData = new FormData();

  formData.append("file", form.file);

  const image = await apiFetch<ProductImage>(`/products/${product.id}/images`, {
    method: "POST",
    body: formData,
  });

  const category = categories.value.find(
    (category) => category.id === form.category_id,
  );

  if (category) {
    products.value.unshift({
      ...product,
      img: image.path,
      img_id: image.id,
      category_name: category.name,
    });
  }

  closeModal();
};

const submitUpdateProduct = async () => {
  const validPrice = form.price.replace("₩", "").trim();
  const numericPrice = Number(validPrice);

  if (!form.category_id) {
    status.value = "Выберите категорию";
    return;
  }

  if (!validPrice || isNaN(numericPrice) || numericPrice <= 0) {
    status.value = "Введите цену больше 0";
    return;
  }

  if (!form.file) {
    status.value = "Файл не выбран";
    return;
  }

  const updatedProduct = await apiFetch<Product>(`/products/${form.id}`, {
    method: "PATCH",
    body: {
      category_id: form.category_id,
      name: form.name,
      price: validPrice,
      condition: form.condition,
    },
  });

  if (updatedProduct.id) {
    closeModal();
  }
};

const confirmDelete = async (product: ProductOut) => {
  if (!confirm(`Удалить «${product.name}»? Это необратимо.`)) return;

  await apiFetch(`/images/${product.img_id}`, {
    method: "DELETE",
  });

  await apiFetch(`/products/${product.id}`, {
    method: "DELETE",
  });

  products.value = products.value.filter((p) => p.id !== product.id);
};

const confirmDeleteCategory = async (category: Category) => {
  if (!confirm(`Удалить  «${category.name}»? Это необратимо`)) return;

  await apiFetch(`/categories/${category.id}`, {
    method: "DELETE",
  });

  categories.value = categories.value.filter((cat) => cat.id != category.id);
};

onMounted(async () => {
  categories.value = categoriesResponse.data.value;
  products.value = productsResponse.data.value;
});
</script>

<style scoped>
.admin-products {
  padding: 32px 36px 64px;
  max-width: 1320px;
  margin: 0 auto;
}
.admin-products-head {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 24px;
}
.admin-products-head h2 {
  font-family: "Space Grotesk", sans-serif;
  font-size: 22px;
  margin-bottom: 4px;
}
.admin-products-head p {
  color: var(--text-muted, #989c9f);
  font-size: 13.5px;
}

.abtn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 9px 16px;
  border-radius: var(--radius);
  font-family: "Space Grotesk", sans-serif;
  font-weight: 600;
  font-size: 13px;
  border: 1px solid transparent;
  cursor: pointer;
  transition:
    background 0.12s ease,
    border-color 0.12s ease,
    color 0.12s ease;
}

.abtn-primary {
  background: var(--accent);
  color: var(--accent-ink);
}

/* ---------- "ДОБАВИТЬ ТОВАР" ---------- */
.add-card {
  background: transparent;
  border: 2px dashed var(--accent, #c9974c);
  border-radius: var(--radius, 2px);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  min-height: 100%;
  cursor: pointer;
  color: var(--accent, #c9974c);
  font-family: "Space Grotesk", sans-serif;
  font-weight: 600;
  font-size: 14px;
  transition:
    background 0.15s ease,
    transform 0.15s ease;
}
.add-card:hover {
  background: var(--accent-soft, rgba(201, 151, 76, 0.14));
  transform: translateY(-2px);
}
.add-card svg {
  width: 30px;
  height: 30px;
}

/* ---------- ДЕЙСТВИЯ НА КАРТОЧКЕ ---------- */
.admin-card-actions {
  display: flex;
  gap: 8px;
  margin-top: 14px;
  padding-top: 14px;
  border-top: 1px solid var(--line, rgba(255, 255, 255, 0.09));
}
.admin-mini-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 7px 8px;
  border-radius: var(--radius, 2px);
  border: 1px solid var(--line-strong, rgba(255, 255, 255, 0.16));
  background: transparent;
  color: var(--text-muted, #989c9f);
  font-family: "IBM Plex Mono", monospace;
  font-size: 11.5px;
  cursor: pointer;
  transition:
    border-color 0.15s ease,
    color 0.15s ease;
}
.admin-mini-btn svg {
  width: 13px;
  height: 13px;
}
.admin-mini-btn:hover {
  border-color: var(--accent, #c9974c);
  color: var(--accent, #c9974c);
}
.admin-mini-btn.danger:hover {
  border-color: #c9584c;
  color: #c9584c;
}

.pub-chip {
  position: absolute;
  top: 12px;
  right: 12px;
  font-family: "IBM Plex Mono", monospace;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  padding: 4px 8px;
  border-radius: 3px;
  background: #101214;
  border: 1px solid rgba(255, 255, 255, 0.1);
}
.pub-chip.is-pub {
  color: #7fa66b;
}
.pub-chip.is-draft {
  color: var(--text-dim, #6b6f73);
}

/* ---------- МОДАЛКА ---------- */
.pm-overlay {
  position: fixed;
  inset: 0;
  z-index: 100;
  background: rgba(10, 11, 12, 0.75);
  backdrop-filter: blur(3px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}
.pm-box {
  width: 100%;
  max-width: 480px;
  max-height: calc(100vh - 40px);
  overflow-y: auto;
  background: var(--bg-elev, #17191c);
  border: 1px solid var(--line-strong, rgba(255, 255, 255, 0.16));
  border-radius: 4px;
  padding: 30px;
  position: relative;
}
.pm-close {
  position: absolute;
  top: 16px;
  right: 16px;
  background: none;
  border: none;
  color: var(--text-dim, #6b6f73);
  font-size: 20px;
  cursor: pointer;
}
.pm-close:hover {
  color: var(--text, #f2f1ec);
}
.pm-kicker {
  font-family: "IBM Plex Mono", monospace;
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--accent, #c9974c);
  margin-bottom: 8px;
}
.pm-box h3 {
  font-family: "Space Grotesk", sans-serif;
  font-size: 19px;
  margin-bottom: 22px;
}

.pm-form {
  display: flex;
  flex-direction: column;
}
.pm-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}
.pm-field {
  margin-bottom: 16px;
}
.pm-field label {
  display: block;
  font-size: 12.5px;
  color: var(--text-muted, #989c9f);
  margin-bottom: 7px;
}
.pm-field input,
.pm-field select {
  width: 100%;
  background: var(--bg, #0f1113);
  border: 1px solid var(--line-strong, rgba(255, 255, 255, 0.16));
  color: var(--text, #f2f1ec);
  padding: 10px 12px;
  font-family: "Inter", sans-serif;
  font-size: 13.5px;
  border-radius: 2px;
}
.pm-field input:focus,
.pm-field select:focus {
  outline: none;
  border-color: var(--accent, #c9974c);
}

.pm-dropzone {
  border: 1px dashed var(--line-strong, rgba(255, 255, 255, 0.16));
  border-radius: 2px;
  min-height: 100px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  color: var(--text-dim, #6b6f73);
  font-size: 12.5px;
  cursor: pointer;
  overflow: hidden;
  transition:
    border-color 0.15s ease,
    color 0.15s ease;
}
.pm-dropzone:hover {
  border-color: var(--accent, #c9974c);
  color: var(--accent, #c9974c);
}
.pm-dropzone svg {
  width: 22px;
  height: 22px;
}
.pm-dropzone img {
  width: 100%;
  height: 110px;
  object-fit: cover;
}

.pm-status {
  font-family: "IBM Plex Mono", monospace;
  font-size: 12.5px;
  margin-bottom: 14px;
}
.pm-status.ok {
  color: var(--accent, #c9974c);
}
.pm-status.err {
  color: #d97777;
}

.pm-actions {
  display: flex;
  gap: 10px;
}

.modal-pop-enter-active,
.modal-pop-leave-active {
  transition: opacity 0.15s ease;
}
.modal-pop-enter-from,
.modal-pop-leave-to {
  opacity: 0;
}

@media (max-width: 600px) {
  .pm-row {
    grid-template-columns: 1fr;
  }
  .admin-products {
    padding: 20px 16px 48px;
  }
}

/* добавить в <style scoped> */

.pill-btn {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: clamp(6px, 1.5vw, 9px);
  padding-right: clamp(
    10px,
    2.5vw,
    15px
  ); /* место под крестик, чтобы текст не наезжал */
}

.pill-delete-x {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: clamp(14px, 3.2vw, 17px);
  height: clamp(14px, 3.2vw, 17px);
  border-radius: 50%;
  color: var(--text-dim, #6b6f73);
  background: rgba(255, 255, 255, 0.06);
  flex-shrink: 0;
  cursor: pointer;
  transition:
    background 0.15s ease,
    color 0.15s ease,
    transform 0.15s ease;
}
.pill-delete-x svg {
  width: 58%;
  height: 58%;
  pointer-events: none; /* клик всегда попадает на .pill-delete-x, не на svg внутри */
}
.pill-delete-x:hover {
  background: #c9584c;
  color: #fff;
  transform: scale(1.12);
}
.pill-btn.active .pill-delete-x {
  color: var(--accent-ink, #171208);
  background: rgba(23, 18, 8, 0.18);
}
.pill-btn.active .pill-delete-x:hover {
  background: #c9584c;
  color: #fff;
}

@media (max-width: 480px) {
  .pill-btn {
    padding: 7px 12px;
    font-size: 12px;
  }
}
</style>
