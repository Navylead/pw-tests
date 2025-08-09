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

    constructor(page: Page){
        this.page = page
        this.emailInput = page.locator('[placeholder="Введите адрес электронной почты"]')   // Инпут электоронной почты
        this.passwordInput = page.locator('[placeholder="Создайте пароль"]')                // Инпут пароля
        this.beginWorkBtn = page.locator('button >> text=Начать работу')                    // Кнопка НАЧАТЬ РАБОТУ
        this.nameInput = page.locator('input#name')                                         // Инпут имени
        this.checkBoxTermOfUse = page.locator('.dialog-form div.v-input--selection-controls__ripple').first() // Чекбокс №1
        this.registrationBtn = page.locator('button:has-text("Зарегистрироваться")')        // Кнопка регистрации
    }
}


export default RegistrationPage;