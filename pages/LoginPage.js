import { expect } from "@playwright/test"
import Dashboard from "./Dashboard"
import MainPage from "./MainPage"
import creds from '../auth/creds.json'


class LoginPage {
    constructor(page){
        this.page = page
        
        this.emailInput = page.locator('input[name="email"]')                             // Инпут электоронной почты
        this.passwordInput = page.locator('input[name="password"]')                       // Инпут пароля
        this.submitBtn = page.getByRole('button',{name: 'Войти'}).nth(2)                  // Кнопка ВОЙТИ
        this.beginWorkBtn = page.locator('button >> text=Начать работу')                  // Кнопка НАЧАТЬ РАБОТУ
        this.restoreBtn = page.locator('.accent--text', {hasText: 'Забыли пароль?'})      // Кнопка ЗАБЫЛИ ПАРОЛЬ?
        this.nameInput = page.locator('input#name')                                       // Инпут имени
    }

    async login() {
        const dashboard = new Dashboard(this.page)
        const mainPage = new MainPage(this.page)
        await this.page.goto('/ru')
        await mainPage.logInBtn.click()
        await this.emailInput.type(creds.email1)
        await this.passwordInput.type(creds.password1)
        await this.submitBtn.click()
        await dashboard.createDesignBtn.waitFor({timeout:15000})
        await this.page.waitForURL('/app')
        //await this.page.context().storageState({ path: 'auth.json' });
    }
}


export default LoginPage;