import { Page, Locator } from '@playwright/test';

export class AiWorkshop {
    readonly page: Page
    readonly imgPrompt: Locator
    readonly imgGenerateBtn: Locator
    readonly aiImage: Locator
    readonly proBanner: Locator
    readonly tokenCount: Locator

    constructor(page: Page){
        this.page = page
        this.imgPrompt = page.locator('.ai-generator__main textarea')                                        // Инпут генерации фото
        this.imgGenerateBtn = page.locator('.ai-generator__main button >> text=Сгенерировать изображение')   // Кнопка генерации фото
        this.tokenCount = page.locator('.header .tokens-count_container_count')                              // Счётчик токенов
        this.aiImage = page.locator('[class="ai-generator__history"] img[src*="ai-history"]').first()        // Сгенерированное фото в ии-мастерской
        this.proBanner = page.locator('.dialog-box')                                                         // Банер ПРО-подписки в ии-мастерской
    }

    // Получение количества токенов через АПИ
    getTokenCount = async () =>{
        const response = await this.page.waitForResponse('**/api/tokens/balance', {timeout:20000})
        const balance = await response.json()
        return balance.monthly_tokens + balance.permanent_tokens
    }
}