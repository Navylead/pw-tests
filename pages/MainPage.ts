import { Page, Locator } from '@playwright/test';

export class MainPage {
    readonly page: Page
    readonly logInBtn: Locator

    constructor(page: Page){
        this.page = page
        this.logInBtn = page.locator('._10RG-m a >> text=Войти')         // Кнопка ВОЙТИ на посадках
    }
}