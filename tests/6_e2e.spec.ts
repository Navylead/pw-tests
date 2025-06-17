// @ts-check
import{test, expect} from "@playwright/test"
import {LoginPage} from "../pages/LoginPage"
import {Editor} from "../pages/Editor"
import {Dashboard} from "../pages/Dashboard"
import RegistrationPage from "../pages/RegistrationPage"
import creds from '../auth/creds.json'

test.describe('Сквозные тесты', ()=>{
    test.beforeEach(async({page})=>{
        page.setViewportSize({"width": 1600, "height": 900})
    })

    test('Тест 1', async({page})=>{
        const loginPage = new LoginPage(page)
        const dashboard = new Dashboard(page)
        const editor = new Editor(page)
        // Переход на страницу авторизации       
        
        await loginPage.login(creds.email1, creds.password1)
        // Создаём дизайн по кастомным размерам
        const customSizeDesignBtn = page.locator('.v-main >> text=Задать свой размер')
        await customSizeDesignBtn.click()
        // Вводим значения
        const sizeInput = page.locator('.resize-dialog input')
        await sizeInput.first().fill('1000')
        await sizeInput.nth(1).fill('2000')
        await page.waitForTimeout(4000) // УБРАТЬ ЯВНОЕ ОЖИДАЕНИЕ
        const createDesignBtn = page.locator('.resize-dialog').getByRole('button').getByText('Создать дизайн')
        await createDesignBtn.click()
        // await page.pause()
        // Если ловим ошибку, кликаем ещё раз по созданию дизайна
        const errorBanner = page.getByText('BACKGROUND')
        if(await errorBanner.isVisible){
            await createDesignBtn.click()
        }
        // Проверяем, что дизайн открылся и изменения сохранены
        await editor.changesSavedBtn.waitFor({timeout:20000})
        // Открываем меню создания текстовых декоров
        const addTextMenu = page.getByText('Текст')
        await addTextMenu.click()
        await page.locator('.v-responsive__content').first().waitFor()
        // Добавляем текст нв дизайн
        const addText = page.getByText('Добавьте')
        await addText.first().click()
        // Проверяем, что текстовый декор отоборажается на холсте
        await editor.decor.waitFor()

        // await page.pause()
    })
})








