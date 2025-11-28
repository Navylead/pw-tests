import { Page, Locator } from '@playwright/test';

export class Editor {
    readonly page: Page
    readonly decor: Locator
    readonly canvas: Locator
    readonly canvasBackground: Locator
    readonly downloadBtn: Locator
    readonly changesSavedBtn: Locator
    readonly continueBtn: Locator
    readonly changeDesignSizeBtn: Locator
    readonly randomTemplateBtn: Locator
    readonly deleteBgBtn: Locator
    readonly basketBtn: Locator
    readonly aiEditorBtn: Locator
    readonly tokensCountAiEditor: Locator
    readonly deformationBtn: Locator
    readonly eraserBtn: Locator
    readonly proBanner: Locator
    readonly uploadMedia: Locator

    constructor(page: Page){
        this.page = page        
        this.decor = page.locator('.story-box-inner__wrapper .decor-layer')                 // Любой декор на холсте
        this.canvas = page.locator('.story-box-inner__wrapper')                             // Холст
        this.canvasBackground = page.locator('.flyvi-decor-background-wrapper')             // Бэкграунд холста
        this.downloadBtn = page.locator('.header button', {hasText:'Скачать'})              // Кнопка скачивани дизайна
        this.changesSavedBtn = page.locator('header button >> text=Изменения сохранены')    // Кнопка Изменения сохранены
        this.continueBtn = page.locator('.dialog-wrapper button >> text = Продолжить редактирование') // Кнопка Продолжить редактирование
        this.changeDesignSizeBtn = page.locator('#editorHeader button >> text=Изменить размер')       // Кнопка редактирования размера дизайна
        this.randomTemplateBtn = page.locator('#decorsDrawer button >> text=Случайный шаблон')        // Кнопка Случайного шаблона
        this.deleteBgBtn = page.locator('button >> text=Удалить фон')                                 // Кнопка Удалить Фон
        this.deformationBtn = page.locator('#editorToolbar button:has(g[mask="url(#mask0_17110_5152)"])') // Кнопка Деформации
        this.eraserBtn = page.locator('#editorToolbar button:has([d="M4.50001 8L11 14.5"])')              // Кнопка Ластика
        this.basketBtn = page.locator('#editorToolbar .defaultPanel_oVC9j button').nth(3)                 // Кнопка Корзина
        this.aiEditorBtn = page.locator('#editorToolbar button:has-text("Редактировать")')                // Кнопка ИИ-редактора
        this.tokensCountAiEditor = page.locator('.tokens .tokens-count_container_count')                  // Счётчик токенов в ИИ-редакторе
        this.proBanner = page.locator('.dialogWrapper_FVcGt button:has-text("Получить бесплатную пробную версию")') // Баннер тарифа ПРО
        this.uploadMedia = page.locator('button').getByText('Загрузить медиа')

    }

    // Получение количества токенов
    getTokenCount = async () =>{
        await this.tokensCountAiEditor.waitFor()
        const text = await this.tokensCountAiEditor.textContent()
        return Number(text)
    }

    // Получение количества токенов через АПИ
    getTokenCountApi = async () =>{
        const apiToken = await this.page.waitForResponse('**/api/tokens/balance')
        const apiJson = await apiToken.json()
        return apiJson.monthly_tokens + apiJson.permanent_tokens
    }

    // Выбор страницы на скачивание
    choosePageToDownload = async (pageNumber: Number) =>{
        await this.downloadBtn.click()
        const allPagesMenu = this.page.locator('button >> text=Все страницы')
        await allPagesMenu.click()
        const allPages = this.page.locator('[role="menu"]').nth(1).locator('button >> text=Все страницы')
        await allPages.click()
        const currentPage = this.page.locator('[role="menu"]').nth(1).locator(`button:has-text("${pageNumber}")`)
        await currentPage.click()
        const doneBtn = this.page.locator('[role="menu"]').nth(1).locator('button').getByText('Готово')
        await doneBtn.click()
        const downloadBtn = this.page.locator('.site-story-download__menu').getByRole('button', {name: 'Скачать'})
        await downloadBtn.click()
    }
}