import { Page, Locator } from '@playwright/test';
import { expect } from "@playwright/test"
import {Dashboard} from "./Dashboard"
import {MainPage} from "./MainPage"

export class RegistrationPage {
    readonly page: Page
    readonly emailInput: Locator
    readonly passwordInput: Locator
    readonly beginWorkBtn: Locator
    readonly nameInput: Locator
    readonly checkBoxTermOfUse: Locator
    readonly registrationBtn: Locator
    readonly registrationByPasswordBtn: Locator
    readonly registrationByCodeBtn: Locator

    constructor(page: Page){
        this.page = page
        this.emailInput = page.locator('[placeholder="Введите адрес электронной почты"]')           // Инпут электоронной почты
        this.passwordInput = page.locator('[placeholder="Создайте пароль"]')                        // Инпут пароля
        this.beginWorkBtn = page.locator('button >> text=Начать работу')                            // Кнопка НАЧАТЬ РАБОТУ
        this.nameInput = page.locator('input#name')                                                 // Инпут имени
        this.checkBoxTermOfUse = page.locator('.dialog-form div.v-input--selection-controls__ripple').first() // Чекбокс №1
        this.registrationBtn = page.locator('button:has-text("Зарегистрироваться")')                // Кнопка регистрации
        this.registrationByPasswordBtn = page.getByRole('button', {name: 'Регистрация по паролю'})  // Кнопка регистрации по ПАРОЛЮ
        this.registrationByCodeBtn = page.getByRole('button', {name: 'Получить код подтверждения'}) // Кнопка регистрации по КОДУ
    }

    // Команда регистрации пользователя на ПРОДЕ
    async register(name: string, email: string, password: string) {
        const mainPage = new MainPage(this.page)
        const dashboard = new Dashboard(this.page)
        await this.page.goto('/ru')
        await mainPage.registerBtn.click()
        await this.registrationByPasswordBtn.waitFor()
        await this.registrationByPasswordBtn.click()
        await this.nameInput.fill(name)
        await this.emailInput.fill(email)
        await this.passwordInput.fill(password)
        await this.checkBoxTermOfUse.click()
        await this.beginWorkBtn.click()
    }

    // Команда регистрации пользователя на ТЕСТЕ
    async registerTest(name: string, email: string, password: string) {
        const mainPage = new MainPage(this.page)
        const dashboard = new Dashboard(this.page)
        await this.page.goto('https://flyvi.dev/ru')
        await mainPage.registerBtn.click()
        await this.registrationByPasswordBtn.waitFor()
        await this.registrationByPasswordBtn.click()
        await this.nameInput.fill(name)
        await this.emailInput.fill(email)
        await this.passwordInput.fill(password)
        await this.checkBoxTermOfUse.click()
        await this.beginWorkBtn.click()
    }
}


export default RegistrationPage;