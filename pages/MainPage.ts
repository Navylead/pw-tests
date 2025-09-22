import { Page, Locator } from '@playwright/test';

export class MainPage {
    readonly page: Page
    readonly logInBtn: Locator
    readonly registerBtn: Locator
    readonly templateSearch: Locator

    constructor(page: Page){
        this.page = page
        this.logInBtn = page.locator('._10RG-m a >> text=Войти')                       // Кнопка ВОЙТИ на посадках
        this.registerBtn = page.locator('text=Зарегистрироваться').nth(0)              // Кнопка ЗАРЕГИСТРИРОВАТЬСЯ на посадках
        this.templateSearch = page.locator('[placeholder="Поиск по шаблонам Flyvi"]')  // Инпут поиска по шаблонам
    }
}