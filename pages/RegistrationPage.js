import { expect } from "@playwright/test"
import Dashboard from "./Dashboard"
import MainPage from "./MainPage"
import { timeout } from "../playwright.config"

class RegistrationPage {

    constructor(page){

        this.page = page
        this.emailInput = page.locator('[placeholder="Введите адрес электронной почты"]')   // Инпут электоронной почты
        this.passwordInput = page.locator('[placeholder="Создайте пароль"]')                // Инпут пароля
        this.beginWorkBtn = page.locator('button >> text=Начать работу')                    // Кнопка НАЧАТЬ РАБОТУ
        this.nameInput = page.locator('input#name')                                         // Инпут имени
        this.checkBoxTermOfUse = page.locator('.dialog-form div.v-input--selection-controls__ripple').first() // Чекбокс №1
    }
}


export default RegistrationPage;