import { Page, Locator } from '@playwright/test';
import { expect } from "@playwright/test"
import { Dashboard } from "./Dashboard"
import { MainPage } from "./MainPage"
import creds from '../auth/creds.json'


export class LoginPage {
    readonly page: Page
    readonly emailInput: Locator
    readonly passwordInput: Locator
    readonly submitBtn: Locator
    readonly beginWorkBtn: Locator
    readonly restoreBtn: Locator
    readonly nameInput: Locator
    readonly loginByPasswordBtn: Locator
    loginResponse: any
    meResponse: any

    constructor(page: Page){
        this.page = page
        
        this.emailInput = page.locator('input[name="email"]')                             // Инпут электоронной почты
        this.passwordInput = page.locator('input[name="password"]')                       // Инпут пароля
        this.submitBtn = page.locator('button[type="submit"]:has-text("Войти")')          // Кнопка ВОЙТИ
        this.loginByPasswordBtn = page.getByRole('button', {name: 'Войти по паролю'})     // Кнопка входа по паролю
        this.beginWorkBtn = page.locator('button >> text=Начать работу')                  // Кнопка НАЧАТЬ РАБОТУ
        this.restoreBtn = page.locator('.accent--text', {hasText: 'Забыли пароль?'})      // Кнопка ЗАБЫЛИ ПАРОЛЬ?
        this.nameInput = page.locator('input#name')                                       // Инпут имени
    }

    async login(email: string, password: string) {
        const dashboard = new Dashboard(this.page)
        const mainPage = new MainPage(this.page)
        // Переход на Мейн
        await this.page.goto('/ru')
        // Клик по кнопке "Войти"
        await mainPage.logInBtn.click()
        // Заполнение полей авторизации
        await this.loginByPasswordBtn.waitFor({timeout: 30000})
        await this.loginByPasswordBtn.click()
        await this.emailInput.fill(email)
        await this.passwordInput.fill(password)
        // Перехват ответов АПИ "login" и "me"
        const [responseLogin, responseMe] = await Promise.all([
            this.page.waitForResponse('**/api/auth/login'),
            this.page.waitForResponse('**/api/auth/me'),
            this.submitBtn.click()
        ])
        this.loginResponse = await responseLogin.json()
        this.meResponse = await responseMe.json()
        // Првоерка отображения кнопки создания дизайна в Дашборде
        await dashboard.createDesignBtn.waitFor({timeout:25000})
        await this.page.waitForURL('/app')
        //await this.page.context().storageState({ path: 'auth.json' });
    }

    async loginTest(email: string, password: string) {
        const dashboard = new Dashboard(this.page)
        const mainPage = new MainPage(this.page)
        // Переход на Мейн
        await this.page.goto('https://flyvi.dev/ru')
        // Клик по кнопке "Войти"
        await mainPage.logInBtn.click()
        // Заполнение полей авторизации
        await this.loginByPasswordBtn.waitFor({timeout: 30000})
        await this.loginByPasswordBtn.click()
        await this.emailInput.fill(email)
        await this.passwordInput.fill(password)
        // Перехват ответов АПИ "login" и "me"
        const [responseLogin, responseMe] = await Promise.all([
            this.page.waitForResponse('**/api/auth/login'),
            this.page.waitForResponse('**/api/auth/me'),
            this.submitBtn.click()
        ])
        this.loginResponse = await responseLogin.json()
        this.meResponse = await responseMe.json()
        // Проверка отображения кнопки создания дизайна в Дашборде
        await dashboard.createDesignBtn.waitFor({timeout:25000})
        await this.page.waitForURL('https://flyvi.dev/app')
        //await this.page.context().storageState({ path: 'auth.json' });
    }
}