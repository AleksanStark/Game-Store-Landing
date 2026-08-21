<template>
  <ChatWidget />
  <header>
    <nav class="wrap">
      <div class="logo">
        <img src="/logo.svg" width="50" height="50" alt="logo" />
      </div>
      <div class="navlinks">
        <a href="javascript:void(0)" @click="selectCategory('PlayStation')"
          >PlayStation</a
        >
        <a href="#computers">Компьютеры</a>
        <a href="javascript:void(0)" @click="selectCategory('Смартфоны')"
          >Смартфоны</a
        >
        <a href="javascript:void(0)" @click="selectCategory('Dyson')">Dyson</a>
        <a href="javascript:void(0)" @click="selectCategory('Игры')">Игры</a>
        <a href="#b2b">Опт / B2B</a>
        <a href="#why">О компании</a>
        <a href="#contacts">Контакты</a>
      </div>

      <a
        href="https://t.me/konsoliv"
        target="_blank"
        rel="noopener"
        class="btn btn-primary btn-sm"
        >Связаться с нами</a
      >
      <button class="burger" @click="openMenu()">☰</button>
    </nav>
  </header>

  <!-- MOBILE MENU -->
  <div class="mobile-menu" id="mobileMenu">
    <button class="mobile-menu-close" @click="closeMenu()">&times;</button>
    <nav class="mobile-links">
      <a href="#playstation" @click="closeMenu()">PlayStation</a>
      <a href="#computers" @click="closeMenu()">Компьютеры</a>
      <a
        href="javascript:void(0)"
        @click="
          closeMenu();
          selectCategory('Смартфоны');
        "
        >Смартфоны</a
      >
      <a
        href="javascript:void(0)"
        @click="
          closeMenu();
          selectCategory('Dyson');
        "
        >Dyson</a
      >
      <a href="#games" @click="closeMenu()">Игры</a>
      <a href="#b2b" @click="closeMenu()">Опт / B2B</a>
      <a href="#why" @click="closeMenu()">О компании</a>
      <a href="#contacts" @click="closeMenu()">Контакты</a>
    </nav>
    <a
      href="https://t.me/konsoliv"
      target="_blank"
      rel="noopener"
      class="btn btn-primary"
      >Связаться с нами</a
    >
  </div>

  <!-- HERO -->
  <section class="hero">
    <div class="wrap hero-grid">
      <div>
        <h1>
          PlayStation, компьютеры и
          <span class="accent-word">электроника</span> из Кореи — по всему миру
        </h1>
        <p class="lead">
          Новая и проверенная б/у техника. Продажа по всей Южной Корее и
          международные поставки электроники по всему миру.
        </p>
        <div class="hero-actions">
          <a href="#stock" class="btn btn-primary">Посмотреть товары</a>
          <a
            href="https://t.me/konsoliv"
            target="_blank"
            rel="noopener"
            class="btn btn-ghost"
            >Связаться с нами</a
          >
        </div>
        <div class="trust-row">
          <span>Южная Корея</span>
          <span>Международные поставки</span>
          <span>Розница и опт</span>
        </div>
      </div>

      <div class="hero-cards">
        <div
          class="prod-card"
          @click="openOrderModal('PS5 Pro', 'от 1 081 392 ₩')"
        >
          <div class="prod-photo">
            <span class="tag used">Б/у</span>
            <img
              src="/assets/ps5-pro.jpeg"
              alt="PS5 Pro"
              class="prod-icon-img"
              loading="lazy"
            />
          </div>
          <div class="prod-body">
            <h4>PS5 Pro</h4>
            <div class="cond">Б/У, гарантия</div>
            <div class="prod-foot">
              <span class="price">от 1 081 392 ₩</span>
              <span class="link-btn">Заказать →</span>
            </div>
          </div>
        </div>

        <div
          class="prod-card"
          @click="openOrderModal('Игры и PlayStation-аккаунты', 'по запросу')"
        >
          <div class="prod-photo">
            <span class="tag new">Хит</span>
            <img
              src="/assets/playstation-account-games.jpg"
              alt="Игры и аккаунты"
              class="prod-icon-img"
              loading="lazy"
            />
          </div>
          <div class="prod-body">
            <h4>Игры и аккаунты</h4>
            <div class="cond">Диски и PlayStation-аккаунты</div>
            <div class="prod-foot">
              <span class="price ask">По запросу</span>
              <span class="link-btn">Заказать →</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- PREORDER GTA 6 -->
  <section class="section preorder">
    <div class="wrap preorder-grid">
      <div class="preorder-visual">
        <span class="tag new">Предзаказ</span>
        <img
          src="/assets/grant-the-auto-six.jpg"
          alt="Предзаказ GTA 6"
          class="preorder-img"
        />
      </div>
      <div class="preorder-content">
        <div class="eyebrow">Скоро в продаже</div>
        <h2>Grand Theft Auto VI — открыт предзаказ</h2>
        <p>
          Забронируйте копию заранее — гарантируем наличие в день релиза.
          Уточним точную дату выхода и формат (диск / цифровая версия) для PS5.
        </p>
        <div class="preorder-actions">
          <a
            href="javascript:void(0)"
            @click="openOrderModal('Предзаказ GTA 6', 'уточняется')"
            class="btn btn-primary"
            >Оформить предзаказ →</a
          >

          <a
            href="javascript:void(0)"
            @click="openOrderModal('Предзаказ GTA 6', 'уточняется')"
            class="btn btn-ghost"
            >Узнать детали</a
          >
        </div>
      </div>
    </div>
  </section>

  <!-- 1. ЧТО У НАС МОЖНО КУПИТЬ -->
  <section class="section" id="electronics">
    <div class="wrap">
      <div class="section-head">
        <h2>Что у нас можно купить</h2>
        <p>
          Основные направления — от игровых консолей до техники под заказ. Новое
          и проверенное б/у.
        </p>
      </div>

      <div class="cat-grid">
        <div
          class="cat-card"
          id="playstation"
          @click="selectCategory('PlayStation')"
          style="cursor: pointer"
        >
          <svg
            class="icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.3"
          >
            <rect x="3" y="8" width="18" height="10" rx="4" />
            <circle cx="8" cy="13" r="1.2" fill="currentColor" stroke="none" />
            <circle cx="16" cy="12" r="1" fill="currentColor" stroke="none" />
            <circle cx="18" cy="14" r="1" fill="currentColor" stroke="none" />
          </svg>
          <h3>Sony PlayStation</h3>
          <p>PS5 Pro, PS5 Slim и другие версии — новые и б/у.</p>
          <div class="go">Смотреть →</div>
        </div>
        <div class="cat-card" @click="GoToComputers()" style="cursor: pointer">
          <svg
            class="icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.3"
          >
            <rect x="3" y="4" width="18" height="12" rx="1" />
            <path d="M8 20h8M12 16v4" />
          </svg>
          <h3>Компьютеры</h3>
          <p>Игровые и рабочие системы — новые и б/у.</p>
          <div class="go">Смотреть →</div>
        </div>
        <div
          class="cat-card"
          id="smartphones"
          @click="selectCategory('Смартфоны')"
          style="cursor: pointer"
        >
          <svg
            class="icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.3"
          >
            <rect x="7" y="2" width="10" height="20" rx="2" />
            <path d="M11 18h2" />
          </svg>
          <h3>Смартфоны</h3>
          <p>Apple iPhone, Samsung Galaxy и другие модели.</p>
          <div class="go">Смотреть →</div>
        </div>
        <div
          class="cat-card"
          id="dyson"
          @click="selectCategory('Dyson')"
          style="cursor: pointer"
        >
          <svg
            class="icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.3"
          >
            <circle cx="12" cy="14" r="6" />
            <path d="M12 2v6M9 4h6" />
          </svg>
          <h3>Техника Dyson</h3>
          <p>Фены, стайлеры, пылесосы и другая техника.</p>
          <div class="go">Смотреть →</div>
        </div>
        <div
          class="cat-card"
          id="games"
          @click="selectCategory('Игры')"
          style="cursor: pointer"
        >
          <svg
            class="icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.3"
          >
            <rect x="2" y="7" width="20" height="11" rx="5" />
            <path d="M7 12.5h4M9 10.5v4" />
            <circle cx="17" cy="11" r="1" fill="currentColor" stroke="none" />
            <circle cx="15" cy="14" r="1" fill="currentColor" stroke="none" />
          </svg>
          <h3>Игры и аккаунты</h3>
          <p>Диски для PS4/PS5 и PlayStation-аккаунты с нужными играми.</p>
          <div class="go">Смотреть →</div>
        </div>
        <div
          class="cat-card"
          @click="openOrderModal('Электроника под заказ', 'по запросу')"
          style="cursor: pointer"
        >
          <svg
            class="icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.3"
          >
            <path d="M12 3l8 4.5v9L12 21l-8-4.5v-9L12 3z" />
            <path d="M12 3v18M4 7.5l8 4.5 8-4.5" />
          </svg>
          <h3>Электроника под заказ</h3>
          <p>Нужный бренд или модель — найдём в Корее и организуем отправку.</p>
          <div class="go">Запросить →</div>
        </div>
      </div>
    </div>
  </section>

  <!-- 2. КАТАЛОГ (ПОПУЛЯРНОЕ → ВСЁ НАЛИЧИЕ) -->
  <section class="section" id="stock">
    <div class="wrap">
      <div class="eyebrow">В наличии</div>
      <div class="section-head">
        <h2 id="catalogTitle">Популярные товары</h2>
        <p id="catalogSubtitle">
          PlayStation и игры — самые частые запросы. Остальной ассортимент — по
          кнопке ниже.
        </p>
      </div>

      <div class="catalog-controls">
        <div class="cond-toggle" id="condToggle">
          <button
            class="cond-btn"
            :class="{ active: condition === 'all' }"
            data-cond="all"
            @click="setCondition('all')"
          >
            Все
          </button>
          <button
            class="cond-btn"
            :class="{ active: condition === 'new' }"
            data-cond="new"
            @click="setCondition('new')"
          >
            Новое
          </button>
          <button
            class="cond-btn"
            :class="{ active: condition === 'used' }"
            data-cond="used"
            @click="setCondition('used')"
          >
            Б/у
          </button>
        </div>
        <div class="pill-row" id="categoryPills">
          <button
            @click="setCategory(product_category.name)"
            class="pill-btn"
            :class="{ active: category === product_category.name }"
            :key="product_category.id"
            v-for="product_category in categories"
          >
            {{ product_category.name }}
          </button>
        </div>
      </div>

      <div class="prod-grid" id="prodGrid" ref="prodGrid">
        <div
          class="prod-card"
          v-for="product in list"
          :key="product.id"
          @click="openOrderModal(product.name, String(product.price))"
        >
          <div class="prod-photo">
            <span
              class="tag"
              :class="product.condition === 'new' ? 'new' : 'used'"
            >
              {{ product.condition === "new" ? "Новое" : "Б/У" }}
            </span>
            <img
              :src="getImageUrl(product.img)"
              :alt="product.name"
              class="prod-icon-img"
              loading="lazy"
            />
          </div>

          <div class="prod-body">
            <h4>{{ product.name }}</h4>
            <h5
              class="text-xs font-bold mb-2"
              v-if="product.category_name === 'playstation'"
            >
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
              <span class="price"> от ${{ product.price }} и выше</span>
              <span class="link-btn"> Заказать →</span>
            </div>
          </div>
        </div>
      </div>

      <div class="center-cta" id="showAllWrap">
        <a
          v-if="category !== 'Все'"
          href="javascript:void(0)"
          class="btn btn-ghost"
          @click="setCategory('Все')"
          >Посмотреть всё наличие</a
        >
      </div>
    </div>
  </section>

  <!-- 3. КОМПЬЮТЕРЫ: ГОТОВЫЕ И НА ЗАКАЗ -->
  <section class="section" id="computers" ref="computers">
    <div class="wrap">
      <div class="eyebrow">Компьютеры</div>
      <div class="section-head">
        <h2>Готовый ПК или сборка под себя</h2>
        <p>
          Игровые и рабочие компьютеры — в наличии или собранные с нуля под ваш
          бюджет и задачи.
        </p>
      </div>

      <div class="split">
        <div class="split-col">
          <div class="kicker">Готовые сборки</div>
          <h3>Собран и протестирован</h3>
          <p>Проверенные конфигурации в наличии — можно заказать сразу.</p>
          <ul class="mini-list">
            <li
              @click="
                openOrderModal(
                  'Готовый ПК — Старт (RTX 4060 / Ryzen 5)',
                  '$980',
                )
              "
              style="cursor: pointer"
            >
              <span>Старт — RTX 4060 / Ryzen 5</span><b>$980</b>
            </li>
            <li
              @click="
                openOrderModal(
                  'Готовый ПК — Игровой (RTX 4070 Ti / i7)',
                  '$1 650',
                )
              "
              style="cursor: pointer"
            >
              <span>Игровой — RTX 4070 Ti / i7</span><b>$1 650</b>
            </li>
            <li
              @click="
                openOrderModal('Готовый ПК — Про (RTX 4090 / i9)', '$3 200')
              "
              style="cursor: pointer"
            >
              <span>Про — RTX 4090 / i9</span><b>$3 200</b>
            </li>
          </ul>
          <a
            href="javascript:void(0)"
            @click="
              openOrderModal('Готовый ПК (уточнить конфигурацию)', 'уточняется')
            "
            class="btn btn-primary btn-sm"
            >Заказать готовый ПК</a
          >
        </div>
        <div class="split-col alt">
          <div class="kicker">Сборка под заказ</div>
          <h3>Комплектующие — любые, под вас</h3>
          <p>
            Расскажите, для чего нужен компьютер и какой бюджет — подберём
            комплектующие или используем ваши пожелания.
          </p>
          <div class="step-row">
            <span class="step-pill"><b>1</b>Бюджет</span>
            <span class="step-pill"><b>2</b>Назначение</span>
            <span class="step-pill"><b>3</b>Комплектующие</span>
            <span class="step-pill"><b>4</b>Контакт</span>
          </div>
          <a
            href="javascript:void(0)"
            @click="openOrderModal('Сборка ПК под заказ', 'по запросу')"
            class="btn btn-ghost btn-sm"
            >Собрать ПК под себя</a
          >
        </div>
      </div>
    </div>
  </section>

  <!-- 4. ИГРЫ И АККАУНТЫ -->
  <section class="section">
    <div class="wrap">
      <div class="eyebrow">PlayStation</div>
      <div class="section-head">
        <h2>Игры и PlayStation-аккаунты</h2>
        <p>Диски или готовый аккаунт с нужной библиотекой игр.</p>
      </div>

      <div class="split">
        <div class="split-col">
          <div class="kicker">Игры на дисках</div>
          <h3>Новые и б/у диски PS4 / PS5</h3>
          <p>
            Актуальные релизы и проверенная классика — в наличии и под заказ.
          </p>
          <a @click="selectCategory('Игры')" class="btn btn-primary btn-sm"
            >Посмотреть игры</a
          >
        </div>
        <div class="split-col alt">
          <div class="kicker">PlayStation-аккаунты</div>
          <h3>Заказ аккаунта с нужной игрой</h3>
          <p>
            Скажите, что хотите играть — подберём аккаунт с нужной библиотекой.
          </p>
          <a
            href="javascript:void(0)"
            @click="openOrderModal('PlayStation-аккаунт', 'по запросу')"
            class="btn btn-ghost btn-sm"
            >Заказать аккаунт</a
          >
        </div>
      </div>
    </div>
  </section>

  <!-- 5. НОВАЯ И Б/У ТЕХНИКА -->
  <section class="section">
    <div class="wrap">
      <div class="eyebrow">Гарантия качества</div>
      <div class="section-head">
        <h2>Выбирайте вариант под свой бюджет</h2>
      </div>
      <div class="split">
        <div class="split-col">
          <div class="kicker">Новая техника</div>
          <h3>Заводская комплектация</h3>
          <p>Новые устройства, без вскрытой упаковки, с полной гарантией.</p>
        </div>
        <div class="split-col alt">
          <div class="kicker">Б/у техника</div>
          <h3>Проверено перед продажей</h3>
          <p>Каждое устройство проверяем на состояние и работоспособность.</p>
        </div>
      </div>
      <div class="center-cta">
        <a href="#stock" class="btn btn-ghost">Узнать, что есть в наличии</a>
      </div>
    </div>
  </section>

  <!-- 6. B2B -->
  <section class="section" id="b2b">
    <div class="wrap">
      <div class="eyebrow">Оптовые поставки</div>
      <div class="b2b">
        <div>
          <h2>Поставки электроники из Южной Кореи</h2>
          <p>
            Работаем с магазинами, реселлерами, оптовыми покупателями и
            зарубежными партнёрами. Подберём товар, подготовим заказ и
            организуем международную отправку.
          </p>
          <div class="b2b-tags">
            <span>PlayStation</span><span>Смартфоны</span><span>Компьютеры</span
            ><span>Dyson</span><span>Под заказ</span>
          </div>
          <a
            href="javascript:void(0)"
            @click="openOrderModal('Оптовый запрос (B2B)', 'по запросу')"
            class="btn btn-primary"
            >Запросить оптовое предложение</a
          >
        </div>
        <div class="b2b-visual">
          <svg viewBox="0 0 200 200" width="70%">
            <circle
              cx="100"
              cy="100"
              r="70"
              fill="none"
              stroke="var(--line-strong)"
            />
            <circle
              cx="100"
              cy="100"
              r="45"
              fill="none"
              stroke="var(--line-strong)"
            />
            <line x1="100" y1="10" x2="100" y2="190" stroke="var(--line)" />
            <line x1="10" y1="100" x2="190" y2="100" stroke="var(--line)" />
            <circle cx="100" cy="30" r="3" fill="var(--accent)" />
            <circle cx="160" cy="70" r="3" fill="var(--accent)" />
            <circle cx="150" cy="150" r="3" fill="var(--accent)" />
            <circle cx="55" cy="160" r="3" fill="var(--accent)" />
          </svg>
        </div>
      </div>
    </div>
  </section>

  <!-- 7. WHY US -->
  <section class="section" id="why">
    <div class="wrap">
      <div class="eyebrow">Почему выбирают нас</div>
      <div class="why-grid">
        <div class="why-cell">
          <div class="num">A</div>
          <h4>Новое и проверенное б/у</h4>
          <p>Каждое устройство тестируется перед продажей.</p>
        </div>
        <div class="why-cell">
          <div class="num">B</div>
          <h4>Вся Южная Корея</h4>
          <p>Продажа частным клиентам и розничным магазинам.</p>
        </div>
        <div class="why-cell">
          <div class="num">C</div>
          <h4>Международная доставка</h4>
          <p>Организуем отправку в любую страну.</p>
        </div>
        <div class="why-cell">
          <div class="num">D</div>
          <h4>Розница и опт</h4>
          <p>Работаем с частными клиентами и B2B-партнёрами.</p>
        </div>
      </div>
    </div>
  </section>

  <!-- 8. FINAL CTA -->
  <section class="final" id="contacts">
    <div class="wrap">
      <div class="eyebrow" style="justify-content: center">Контакт</div>
      <h2>Не нашли нужный товар?</h2>
      <p>
        Напишите нам — проверим наличие в Корее и предложим подходящий вариант.
      </p>
      <div class="contact-btns">
        <a
          href="https://www.facebook.com/share/g/14nbBxF7CmA/?mibextid=wwXIfr"
          class="btn btn-primary"
          >Facebook</a
        >
        <a href="https://wa.me/821032946606" class="btn btn-primary"
          >WhatsApp</a
        >

        <a
          href="https://t.me/konsoliv"
          target="_blank"
          rel="noopener"
          class="btn btn-primary"
          >Telegram</a
        >
      </div>
      <div class="contact-grid">
        <div>
          <div
            class="font-mono text-[11px] text-[color:var(--text-dim)] uppercase tracking-[0.06em] pl-0 mb-2"
          >
            Телефон
          </div>
          <a href="tel:+821032946606" class="v">+82 10-3294-6606</a>
        </div>
        <div>
          <div class="k">Адрес</div>
          <div class="v">광주광역시 광산구 산정공원로 63-1</div>
        </div>
        <div>
          <div class="k">Часы работы</div>
          <div class="v">Пн–Сб, 10:00–19:00 (KST)</div>
        </div>
        <!-- <div>
          <div class="k">Реквизиты</div>
          <div class="v">ИП / название компании</div>
        </div> -->
        <div>
          <div class="k">Мы в соцсетях</div>
          <div class="social-row">
            <a
              href="https://www.instagram.com/timplay_official?igsh=MWVoYW90cXhqdmd2cg%3D%3D&utm_source=qr"
              target="_blank"
              rel="noopener"
              aria-label="Instagram"
              title="Instagram"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1.6"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <rect x="2" y="2" width="20" height="20" rx="5" />
                <circle cx="12" cy="12" r="4" />
                <circle
                  cx="17.5"
                  cy="6.5"
                  r="1"
                  fill="currentColor"
                  stroke="none"
                />
              </svg>
            </a>

            <a
              href="https://www.tiktok.com/@timplay6606?_r=1&_t=ZS-994Oq0nSqw8"
              target="_blank"
              rel="noopener"
              aria-label="TikTok"
              title="TikTok"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1.6"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M16 3v10.5a3.5 3.5 0 1 1-3.5-3.5" />
                <path d="M16 3c0 2.5 2 4.5 4.5 4.5" />
              </svg>
            </a>

            <a
              href="https://www.facebook.com/share/g/14nbBxF7CmA/?mibextid=wwXIfr"
              target="_blank"
              rel="noopener"
              aria-label="Facebook"
              title="Facebook"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1.6"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path
                  d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"
                />
              </svg>
            </a>

            <a
              href="https://t.me/timakonsoli"
              target="_blank"
              rel="noopener"
              aria-label="Telegram-канал"
              title="Telegram-канал"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1.6"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path
                  d="M22 3 2 11l6.5 2.3M22 3l-3.5 18-9-6.7M22 3 8.5 13.3m0 0V19l3-3.2"
                />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  </section>
  <hr />
  <footer>
    <div class="wrap">
      <span id="copyright-text"
        >© {{ new Date().getFullYear() }} TIM GAME STORE</span
      >
    </div>
  </footer>

  <!-- ORDER MODAL -->
  <div
    class="modal-overlay"
    :class="{ open: modalIsOpen }"
    @click="closeOrderModal()"
    id="orderModal"
  >
    <div class="modal-box" @click.stop>
      <button class="modal-close" @click="closeOrderModal()">&times;</button>
      <div class="modal-kicker">Заявка на заказ</div>
      <h3 id="modalProductName">{{ productName }}</h3>
      <div class="modal-price" id="modalProductPrice">{{ productPrice }}</div>

      <form id="orderForm" @submit.prevent="submitOrder()">
        <div class="field">
          <label for="ordName">Имя</label>
          <input
            type="text"
            v-model="name"
            id="ordName"
            required
            placeholder="Как к вам обращаться"
          />
        </div>
        <div class="field">
          <label for="ordContact">Telegram или телефон для связи</label>
          <input
            type="text"
            v-model="contact"
            id="ordContact"
            required
            placeholder="@username или +82..."
          />
        </div>
        <button
          :disabled="submitting"
          type="submit"
          class="btn btn-primary modal-submit"
        >
          Отправить заявку
        </button>
        <div
          class="modal-status"
          :class="{ err: submit_error, ok: submit_success }"
          id="modalStatus"
        >
          {{ statusOrder }}
        </div>
        <div class="modal-note">
          После отправки заявки менеджер получит уведомление, и откроется чат в
          Telegram, где можно уточнить детали.
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Category, Product, ProductOut } from "~/types";

const modalIsOpen = ref(false);
const menuIsOpen = ref(false);
const productName = ref("");
const productPrice = ref("");
const condition = ref("all");
const category = ref("Популярное");
const prodGrid = ref<HTMLDivElement | null>(null);
const computers = ref<HTMLDivElement | null>(null);
const products = ref<ProductOut[]>([]);
const categories = ref<Category[]>([]);
const name = ref("");
const contact = ref("");
const statusOrder = ref("");
const submitting = ref(false);
const submit_error = ref(false);
const submit_success = ref(false);

const submitOrder = async function () {
  const text =
    "🛒 Новый заказ с сайта\n" +
    "───────────────\n" +
    "Товар: " +
    productName.value +
    "\n" +
    "Цена: " +
    productPrice.value +
    "\n" +
    "Имя: " +
    name.value +
    "\n" +
    "Контакт: " +
    contact.value;

  statusOrder.value = "Отправляем заявку…";
  submitting.value = true;
  try {
    const response = await $fetch("/api/send-message", {
      method: "POST",
      body: {
        message: text,
      },
    });

    if (response.success) {
      submitting.value = false;
      submit_success.value = true;
      statusOrder.value = "Заявка отправлена! Открываем чат…";

      setTimeout(function () {
        navigateTo("https://t.me/konsoliv", {
          external: true,
          open: {
            target: "_blank",
          },
        });
        closeOrderModal();
      }, 500);
    }
  } catch (error) {
    statusOrder.value = "Не удалось отправить";
    submitting.value = false;
    submit_error.value = true;
  } finally {
    name.value = "";
    contact.value = "";
  }
};

const config = useRuntimeConfig();

const getImageUrl = (path: string) => {
  if (!path) return "";

  if (path.startsWith("http") || path.startsWith("blob:")) {
    return path;
  }

  const baseUrl = config.public.mediaBase.replace(/\/$/, "");
  const cleanPath = path.trim();
  const imgPath = cleanPath.startsWith("/") ? cleanPath : `/${cleanPath}`;

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

// const PRODUCTS = [
//   {
//     cat: "playstation",
//     name: "PS5 Pro",
//     img: "/assets/ps5-pro.jpeg",
//     cond: "new",
//     price: "от $900 и выше",
//   },

//   {
//     cat: "playstation",
//     name: "PS5 Pro",
//     img: "/assets/ps5-pro.jpeg",
//     cond: "used",
//     price: "от $780 и выше",
//   },
//   {
//     cat: "playstation",
//     name: "PS5 Slim",
//     img: "/assets/ps5-digital-edition.jpeg",
//     cond: "used",
//     price: "от $400 и выше",
//   },

//   {
//     cat: "playstation",
//     name: "PlayStation VR2",
//     img: "/assets/ps-vr-2.jpeg",
//     cond: "new",
//     price: "цена от $400 и выше",
//   },

//   {
//     cat: "playstation",
//     name: "PlayStation VR2",
//     img: "/assets/ps-vr-2.jpeg",
//     cond: "used",
//     price: "от $400 и выше",
//   },

//   {
//     cat: "playstation",
//     name: "PS5 Disc Edition",
//     img: "/assets/ps5-disc-edition.jpeg",
//     cond: "new",
//     price: "от $400 и выше",
//   },

//   {
//     cat: "playstation",
//     name: "PS5 Disc Edition",
//     img: "/assets/ps5-disc-edition.jpeg",
//     cond: "used",
//     price: "от $400 и выше",
//   },

//   {
//     cat: "playstation",
//     name: "PS5 Slim Disc Edition (новая)",
//     img: "/assets/ps5-slim-disc-edition.jpg",
//     cond: "new",
//     price: "от $600 и выше",
//   },

//   {
//     cat: "playstation",
//     name: "PS5 Slim Disc Edition (Б/У)",
//     img: "/assets/ps5-slim-disc-edition.jpg",
//     cond: "used",
//     price: "от $400 и выше",
//   },

//   {
//     cat: "playstation",
//     name: "PS5 Slim Digital Edition (новая)",
//     img: "/assets/ps5-slim-digital-edition.jpg",
//     cond: "new",
//     price: "от $600 и выше",
//   },

//   {
//     cat: "playstation",
//     name: "PS5 Slim Digital Edition (Б/У)",
//     img: "/assets/ps5-slim-digital-edition.jpg",
//     cond: "used",
//     price: "от $400 и выше",
//   },

//   {
//     cat: "playstation",
//     name: "PS4 Slim",
//     img: "/assets/ps4-slim.jpg",
//     cond: "used",
//     price: "от $150 и выше",
//   },

//   {
//     cat: "playstation",
//     name: "PS4 Pro",
//     img: "/assets/ps4-pro.jpg",
//     cond: "new",
//     price: "от $220 и выше",
//   },

//   {
//     cat: "playstation",
//     name: "PS4 Pro",
//     img: "/assets/ps4-pro.jpg",
//     cond: "used",
//     price: "от $220 и выше",
//   },
//   {
//     cat: "games",
//     name: "Ghost of Tsushima (диск)",
//     img: "/assets/ps5-ghost-of-tsushima-disk.jpg",
//     cond: "new",
//     price: "$45",
//   },
//   {
//     cat: "games",
//     name: "The Last of Us Part II (диск)",
//     img: "/assets/ps5-the-last-of-us-two.jpg",
//     cond: "used",
//     price: "$25",
//   },
//   {
//     cat: "games",
//     name: "PlayStation-аккаунт (набор игр)",
//     img: "/assets/playstation-account-games.jpg",
//     cond: "new",
//     price: "по запросу",
//   },
//   {
//     cat: "games",
//     name: "EA Sports FC 25 (диск)",
//     img: "/assets/ps5-fc25.jpg",
//     cond: "used",
//     price: "$20",
//   },
//   // {
//   //   cat: "computers",
//   //   name: "Gaming PC — RTX 4060",
//   //   cond: "new",
//   //   price: "$980",
//   // },
//   // {
//   //   cat: "computers",
//   //   name: "Gaming PC — RTX 4070 Ti",
//   //   cond: "new",
//   //   price: "$1 650",
//   // },
//   // {
//   //   cat: "computers",
//   //   name: "Рабочая станция i7",
//   //   cond: "used",
//   //   price: "$700",
//   // },
//   {
//     cat: "smartphones",
//     name: "iPhone 17 Pro",
//     img: "/assets/iphone-17-pro.jpg",
//     cond: "new",
//     price: "от $1050",
//   },
//   {
//     cat: "smartphones",
//     name: "iPhone 15",
//     img: "/assets/iphone-15.jpg",
//     cond: "used",
//     price: "от $520",
//   },
//   {
//     cat: "smartphones",
//     name: "Samsung Galaxy S25",
//     img: "/assets/samsung-s25.jpg",
//     cond: "used",
//     price: "от $610",
//   },
//   {
//     cat: "smartphones",
//     name: "Samsung Galaxy S25 Ultra",
//     img: "/assets/samsung-s25-ultra.jpg",
//     cond: "new",
//     price: "от $950",
//   },
//   {
//     cat: "dyson",
//     name: "Dyson Airwrap",
//     img: "/assets/dyson-airwrap.jpg",
//     cond: "new",
//     price: "от $430",
//   },
//   {
//     cat: "dyson",
//     name: "Dyson V15 (пылесос)",
//     img: "/assets/dyson-v15.jpg",
//     cond: "used",
//     price: "от $310",
//   },
//   {
//     cat: "dyson",
//     name: "Dyson Supersonic",
//     img: "/assets/dyson-supersonic.jpg",
//     cond: "new",
//     price: "от $390",
//   },
// ] as const;

// const CATEGORIES = [
//   ["featured", "Популярное"],
//   ["all", "Все"],
//   ["playstation", "PlayStation"],
//   ["games", "Игры"],
//   // ["computers", "Компьютеры"],
//   ["smartphones", "Смартфоны"],
//   ["dyson", "Dyson"],
// ] as const;

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

const setCondition = (cond: "all" | "new" | "used") => {
  condition.value = cond;
};

const setCategory = function (cat: string) {
  category.value = cat;
};

const selectCategory = function (cat: string) {
  setCategory(cat);
  prodGrid.value?.scrollIntoView({ behavior: "smooth" });
};

const openOrderModal = function (product_name: string, product_price: string) {
  modalIsOpen.value = true;
  productName.value = product_name;
  productPrice.value = product_price;
};

const openMenu = function () {
  menuIsOpen.value = true;
};

const closeMenu = function () {
  menuIsOpen.value = false;
};

const closeOrderModal = function () {
  modalIsOpen.value = false;
};

const GoToComputers = function () {
  computers.value?.scrollIntoView({ behavior: "smooth" });
};

onMounted(async () => {
  products.value = productsResponse.data.value;
  categories.value = categoriesResponse.data.value;

  console.log("PRODUCTS:", products.value);
  console.log("CATEGORIES:", categories.value);

  console.log(
    "CATEGORY NAMES:",
    products.value.map((p) => p.category_name),
  );
});
</script>

<style scoped>
.social-row {
  display: flex;
  gap: 14px;
  margin-top: 2px;
}
.social-row a {
  color: var(--text-muted, #989c9f);
  display: inline-flex;
  transition:
    color 0.15s ease,
    transform 0.15s ease;
}
.social-row a:hover {
  color: var(--accent, #c9974c);
  transform: translateY(-1px);
}
.social-row svg {
  width: 19px;
  height: 19px;
}
</style>
