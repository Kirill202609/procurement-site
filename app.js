const STATUSES = {
  new:         { label: 'Новая',           color: '#64748b' },
  in_progress: { label: 'В работе',        color: '#0369a1' },
  approval:    { label: 'Согласование',    color: '#a16207' },
  tender:      { label: 'Сбор КП/Тендер',  color: '#c2410c' },
  contract:    { label: 'Договор',          color: '#6d28d9' },
  delivery:    { label: 'Поставка',         color: '#0f766e' },
  done:        { label: 'Завершена',        color: '#166534' },
};

const PRIORITIES = {
  low:      { label: 'Низкий',      color: '#64748b' },
  medium:   { label: 'Средний',     color: '#0369a1' },
  high:     { label: 'Высокий',     color: '#c2410c' },
  critical: { label: 'Критический', color: '#991b1b' },
};

const CATEGORIES = [
  'Оборудование','IT и ПО','Канцелярия','Услуги',
  'Строительство/Ремонт','Транспорт','Сырьё и материалы',
  'Мебель','Консалтинг','Маркетинг','Обучение','Прочее'
];

const CURRENCIES = { RUB:'₽', USD:'$', EUR:'€', CNY:'¥', KZT:'₸' };

function _d(n) {
  const d = new Date(); d.setDate(d.getDate() + n);
  return d.toISOString().split('T')[0];
}

const DEMO = [
  { id:'1', number:'ЗАК-2026-0001', title:'Закупка ноутбуков для отдела разработки', category:'IT и ПО', initiator:'ИТ-департамент', responsible:'Петров А.В.', supplier:'ТехноСити', amount:'2250000', currency:'RUB', status:'tender', priority:'high', deadline:_d(12), createdAt:new Date().toISOString(), description:'15 ноутбуков HP ProBook для команды разработки', comment:'Запрошены КП у 4 поставщиков' },
  { id:'2', number:'ЗАК-2026-0002', title:'Ремонт конференц-зала', category:'Строительство/Ремонт', initiator:'АХО', responsible:'Смирнова Е.Н.', supplier:'СтройМастер', amount:'890000', currency:'RUB', status:'contract', priority:'medium', deadline:_d(5), createdAt:new Date().toISOString(), description:'Косметический ремонт, замена напольного покрытия', comment:'Договор на подписи у юристов' },
  { id:'3', number:'ЗАК-2026-0003', title:'Годовая подписка Yandex Cloud', category:'IT и ПО', initiator:'ИТ-департамент', responsible:'Петров А.В.', supplier:'Яндекс', amount:'1450000', currency:'RUB', status:'approval', priority:'critical', deadline:_d(2), createdAt:new Date().toISOString(), description:'Продление годовой подписки на облачные сервисы', comment:'СРОЧНО: старая подписка скоро истекает' },
  { id:'4', number:'ЗАК-2026-0004', title:'Канцелярия и расходники Q2', category:'Канцелярия', initiator:'АХО', responsible:'Козлова М.И.', supplier:'Комус', amount:'180000', currency:'RUB', status:'delivery', priority:'low', deadline:_d(8), createdAt:new Date().toISOString(), description:'Стандартный заказ канцелярии на квартал', comment:'Частичная поставка получена' },
  { id:'5', number:'ЗАК-2026-0005', title:'Консалтинг по налоговой оптимизации', category:'Консалтинг', initiator:'Финансы', responsible:'Иванов С.П.', supplier:'Deloitte', amount:'35000', currency:'EUR', status:'in_progress', priority:'high', deadline:_d(-3), createdAt:new Date().toISOString(), description:'Аудит и рекомендации по налоговой оптимизации', comment:'Согласование цены' },
  { id:'6', number:'ЗАК-2026-0006', title:'Обновление серверного оборудования', category:'Оборудование', initiator:'ИТ-департамент', responsible:'Петров А.В.', supplier:'', amount:'4800000', currency:'RUB', status:'new', priority:'high', deadline:_d(30), createdAt:new Date().toISOString(), description:'HP DL380 Gen11, 4 сервера для ЦОД', comment:'Формируем ТЗ' },
  { id:'7', number:'ЗАК-2026-0007', title:'Корпоративное обучение Agile', category:'Обучение', initiator:'HR', responsible:'Новикова Т.А.', supplier:'ScrumTrek', amount:'520000', currency:'RUB', status:'done', priority:'medium', deadline:_d(-10), createdAt:new Date().toISOString(), description:'Обучение 30 человек методологии Agile/Scrum', comment:'Акты подписаны' },
  { id:'8', number:'ЗАК-2026-0008', title:'Лицензии Microsoft 365', category:'IT и ПО', initiator:'ИТ-департамент', responsible:'Петров А.В.', supplier:'Softline', amount:'780000', currency:'RUB', status:'approval', priority:'medium', deadline:_d(15), createdAt:new Date().toISOString(), description:'Продление 50 корпоративных лицензий', comment:'' },
  { id:'9', number:'ЗАК-2026-0009', title:'Брендированный мерч для мероприятий', category:'Маркетинг', initiator:'Маркетинг', responsible:'Новикова Т.А.', supplier:'', amount:'320000', currency:'RUB', status:'tender', priority:'low', deadline:_d(20), createdAt:new Date().toISOString(), description:'Футболки, блокноты, ручки с логотипом', comment:'Сравниваем образцы' },
];

function getTasks() {
  try {
    const s = localStorage.getItem('proc-tasks');
    if (s) return JSON.parse(s);
  } catch(e) {}
  saveTasks(DEMO);
  return DEMO;
}

function saveTasks(tasks) {
  try { localStorage.setItem('proc-tasks', JSON.stringify(tasks)); } catch(e) {}
}

function fmtMoney(amount, currency = 'RUB') {
  const n = parseFloat(amount);
  if (!n) return '—';
  const sym = CURRENCIES[currency] || currency;
  const s = n >= 1000000
    ? (n/1000000).toFixed(1).replace('.0','') + ' млн'
    : new Intl.NumberFormat('ru-RU', {maximumFractionDigits:0}).format(n);
  return s + ' ' + sym;
}

function fmtDate(d) {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('ru-RU', {day:'2-digit',month:'2-digit',year:'numeric'});
}

function deadlineInfo(deadline, status) {
  if (!deadline || status === 'done') return null;
  const days = Math.ceil((new Date(deadline) - Date.now()) / 86400000);
  if (days < 0)   return { label: `−${Math.abs(days)} дн`, cls: 'chip-red' };
  if (days === 0) return { label: 'Сегодня', cls: 'chip-orange' };
  if (days <= 3)  return { label: `${days} дн`, cls: 'chip-orange' };
  if (days <= 7)  return { label: `${days} дн`, cls: 'chip-yellow' };
  return { label: `${days} дн`, cls: 'chip-green' };
}

function genNumber(tasks) {
  const year = new Date().getFullYear();
  const nums = tasks.map(t => t.number).filter(n => n?.startsWith(`ЗАК-${year}-`))
    .map(n => parseInt(n.split('-')[2]) || 0);
  return `ЗАК-${year}-${String((nums.length ? Math.max(...nums) : 0) + 1).padStart(4,'0')}`;
}

function esc(s) {
  return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

function statusBadge(s) {
  return `<span class="badge badge-${esc(s)}">${esc((STATUSES[s]||{label:s}).label)}</span>`;
}

const NEWS = [
  { id:1, tag:'Объявление', tagColor:'rgba(74,110,224,0.12)', tagText:'#4a6ee0', title:'Обновление положения о закупках с 1 июня 2026', body:'Вводятся новые требования к квалификации поставщиков: обязательная аккредитация на портале и предоставление финансовой отчётности за последние 2 года.', date:'12 мая 2026', dateISO:'2026-05-12' },
  { id:2, tag:'Итоги',      tagColor:'rgba(22,101,52,0.1)',    tagText:'#166534', title:'Экономия 8,2% по итогам тендеров Q1 2026', body:'По результатам конкурентных закупок первого квартала достигнута экономия бюджета 8,2% относительно первоначальных заявок подразделений.', date:'5 мая 2026', dateISO:'2026-05-05' },
  { id:3, tag:'Важно',      tagColor:'rgba(194,65,12,0.1)',    tagText:'#c2410c', title:'Переход на электронный документооборот', body:'С 1 июля 2026 все первичные документы (акты, счета, накладные) принимаются исключительно в электронном виде через систему ЭДО.', date:'28 апреля 2026', dateISO:'2026-04-28' },
  { id:4, tag:'Объявление', tagColor:'rgba(74,110,224,0.12)', tagText:'#4a6ee0', title:'Новый поставщик IT-оборудования аккредитован', body:'Компания «ТехноСити» успешно прошла аккредитацию и включена в реестр квалифицированных поставщиков по категории «Оборудование» и «IT и ПО».', date:'20 апреля 2026', dateISO:'2026-04-20' },
  { id:5, tag:'Итоги',      tagColor:'rgba(22,101,52,0.1)',    tagText:'#166534', title:'Завершён тендер на корпоративное обучение Agile', body:'По итогам конкурса выбран подрядчик ScrumTrek. Обучение 30 сотрудников запланировано на май 2026. Достигнута экономия 15% от стартовой цены.', date:'10 апреля 2026', dateISO:'2026-04-10' },
  { id:6, tag:'Важно',      tagColor:'rgba(194,65,12,0.1)',    tagText:'#c2410c', title:'Требования к банковским гарантиям изменены', body:'С 1 мая 2026 банковская гарантия обязательна для контрактов свыше 5 млн ₽. Перечень аккредитованных банков опубликован в разделе документов.', date:'1 апреля 2026', dateISO:'2026-04-01' },
  { id:7, tag:'Объявление', tagColor:'rgba(74,110,224,0.12)', tagText:'#4a6ee0', title:'Запущен обновлённый корпоративный портал закупок', body:'Новый портал обеспечивает полный цикл: от подачи заявки до закрытия акта. Все данные в реальном времени, история операций сохраняется.', date:'15 марта 2026', dateISO:'2026-03-15' },
  { id:8, tag:'Итоги',      tagColor:'rgba(22,101,52,0.1)',    tagText:'#166534', title:'Годовой отчёт по закупкам за 2025 год опубликован', body:'Общий объём закупок составил 420 млн ₽. Доля конкурентных процедур выросла до 78%. Среднее время цикла закупки сократилось с 32 до 24 дней.', date:'28 февраля 2026', dateISO:'2026-02-28' },
];

function navHTML(active) {
  const links = [
    ['index.html','Главная'],
    ['tenders.html','Закупки'],
    ['news.html','Новости'],
    ['team.html','Команда'],
    ['docs.html','Документы'],
    ['howto.html','Как купить?'],
    ['survey.html','Опросы'],
    ['suppliers.html','Поставщикам'],
  ];
  return `<nav class="navbar">
  <div class="container">
    <a href="index.html" class="nav-brand">
      <div class="brand-icon">ДЗ</div>
      <div><div class="brand-name">Дирекция закупок</div><div class="brand-sub">Корпоративный портал</div></div>
    </a>
    <div class="nav-links">
      ${links.map(([href,label])=>`<a href="${href}" class="nav-link${active===href?' active':''}">${label}</a>`).join('')}
    </div>
    <div class="nav-actions">
      <a href="tenders.html" class="btn btn-primary btn-sm">+ Новая закупка</a>
    </div>
  </div>
</nav>`;
}

function footerHTML() {
  return `<footer class="footer">
  <div class="container">
    <div class="footer-grid">
      <div>
        <div style="display:flex;align-items:center;gap:10px;margin-bottom:16px">
          <div class="brand-icon">ДЗ</div>
          <div><div class="brand-name">Дирекция закупок</div><div class="brand-sub">Корпоративный портал</div></div>
        </div>
        <p style="font-size:13px;color:var(--muted);line-height:1.6;max-width:260px">Централизованная служба управления корпоративными закупками. Прозрачно, эффективно, в срок.</p>
      </div>
      <div>
        <div class="footer-heading">Навигация</div>
        <a href="index.html" class="footer-link">Главная</a>
        <a href="tenders.html" class="footer-link">Реестр закупок</a>
        <a href="news.html" class="footer-link">Новости</a>
        <a href="team.html" class="footer-link">Команда</a>
        <a href="docs.html" class="footer-link">Документы</a>
        <a href="howto.html" class="footer-link">Как купить?</a>
        <a href="survey.html" class="footer-link">Опросы</a>
        <a href="suppliers.html" class="footer-link">Поставщикам</a>
      </div>
      <div>
        <div class="footer-heading">Документы</div>
        <a href="#" class="footer-link">Положение о закупках</a>
        <a href="#" class="footer-link">Этический кодекс</a>
        <a href="#" class="footer-link">Шаблоны договоров</a>
      </div>
      <div>
        <div class="footer-heading">Контакты</div>
        <a href="mailto:zakupki@company.ru" class="footer-link">zakupki@company.ru</a>
        <a href="tel:+74951234567" class="footer-link">+7 (495) 123-45-67</a>
        <span class="footer-link">Пн–Пт, 9:00–18:00</span>
      </div>
    </div>
    <div class="footer-bottom">
      <span>© 2026 Дирекция закупок. Все права защищены.</span>
      <span>v2.6.0</span>
    </div>
  </div>
</footer>`;
}
