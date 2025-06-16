class Dashboard {
    constructor(page){
        this.page = page
        this.userLogo = page.locator('.site-header .profile-name:has-text("Л")')                // Лого юзера
        this.createDesignBtn = page.locator('.site-header button:has-text("Создать дизайн")')   // Кнопка Создать Дизайн
        this.tokenCount = page.locator('.header .tokens-count_container_count')                 // Счётчик токенов
        this.imgPrompt = page.locator('.ai-generator textarea')                                 // Инпут генерации фото
        this.imgGenerateBtn = page.locator('.ai-generator button >> text=Сгенерировать изображение')    // Кнопка генерации фото
        this.changeToProBtn = page.locator('.drawer-account >> text=Попробовать Flyvi Pro бесплатно')   // Кнопка перехода на тариф PRO
        this.aiImage = page.locator('.ai-generator img[src*="ai-history"]').first()                     // Сгенерированное фото в ии-мастерской
        this.proBanner = page.locator('.dialog-box')                                                    // Банер ПРО-подписки в ии-мастерской
    }
}
export default Dashboard;