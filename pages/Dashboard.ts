import { Page, Locator } from '@playwright/test';

export class Dashboard {
    readonly page: Page;
    readonly userLogo: Locator
    readonly createDesignBtn: Locator
    readonly tokenCount: Locator
    readonly imgPrompt: Locator
    readonly imgGenerateBtn: Locator
    readonly changeToProBtn: Locator
    readonly aiImage: Locator
    readonly proBanner: Locator
    readonly templateSearch: Locator

    constructor(page: Page){
        this.page = page
        this.userLogo = page.locator('.site-header .profile')                                   // Лого юзера
        this.createDesignBtn = page.locator('.site-header button:has-text("Создать дизайн")')   // Кнопка Создать Дизайн
        this.tokenCount = page.locator('.header .tokens-count_container_count')                 // Счётчик токенов
        this.imgPrompt = page.locator('.ai-generator textarea')                                 // Инпут генерации фото
        this.imgGenerateBtn = page.locator('.ai-generator button >> text=Сгенерировать изображение')    // Кнопка генерации фото
        this.changeToProBtn = page.locator('.drawer-account >> text=Попробовать Flyvi Pro бесплатно')   // Кнопка перехода на тариф PRO
        this.aiImage = page.locator('.ai-generator img[src*="ai-history"]').first()                     // Сгенерированное фото в ии-мастерской
        this.proBanner = page.locator('.dialog-box')                                                    // Банер ПРО-подписки в ии-мастерской
        this.templateSearch = page.locator('[id="templates-search"]')                           // Инпут поиска по шаблонам
    }

    // Получение количества токенов через АПИ
    getTokenCount = async () =>{
        const response = await this.page.waitForResponse('**/api/tokens/balance')
        const balance = await response.json()
        return balance.monthly_tokens + balance.permanent_tokens
    }
}