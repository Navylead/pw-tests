// @ts-check
import{test, expect} from "@playwright/test"
import {LoginPage} from "../pages/LoginPage"
import {Editor} from "../pages/Editor"
import {Dashboard} from "../pages/Dashboard"
import {MainPage} from "../pages/MainPage"

test.describe('UI', ()=>{
    test.beforeEach(async({page})=>{
        page.setViewportSize({"width": 1600, "height": 900})
    })
    
    // test.use({ storageState: 'auth.json' });                    // ФАЙЛ с сохранённой сессией

    test.only('КАПЧА', async ({page})=>{
        const editor = new Editor(page)
        const httpsTest = [
            'https://flyvi.dev/ru',
            'https://flyvi.dev/ru/presentations',
            'https://flyvi.dev/ru/marketplace',
            'https://flyvi.dev/ru/sozdat-sertifikat',
            'https://flyvi.dev/ru/content',
            'https://flyvi.dev/ru/tariffs',
            'https://flyvi.dev/ru/templates',
            'https://flyvi.dev/ru/blog',
            'https://flyvi.dev/ru/ii-masterskaya',
            'https://flyvi.dev/ru/sozdat-banner',
            'https://flyvi.dev/ru/logo',
            'https://flyvi.dev/ru/vkpage',
            'https://flyvi.dev/ru/resume',
            'https://flyvi.dev/ru/qrcode',
            'https://flyvi.dev/ru/sozdat-vizitku',
            'https://flyvi.dev/ru/priglasitelnyye',
            'https://flyvi.dev/ru/otkrytki',
            'https://flyvi.dev/ru/sozdat-buklet',
            'https://flyvi.dev/ru/sozdat-buklet',
            'https://flyvi.dev/ru/oblozhki-video',
            'https://flyvi.dev/ru/otkrytki-na-novyj-god',
            'https://flyvi.dev/ru/menyu',
            'https://flyvi.dev/ru/prajs-listy',
            'https://flyvi.dev/ru/svadebnoe-priglashenie',
            'https://flyvi.dev/ru/shablony-dlya-lichnoj-ehffektivnosti',
            'https://flyvi.dev/ru/online-doska',
            'https://flyvi.dev/ru/23-fevralya',
            'https://flyvi.dev/ru/8-marta',
            'https://flyvi.dev/ru/9-maya',
            'https://flyvi.dev/ru/kollazh',
            'https://flyvi.dev/ru/plakaty-i-postery'
        ]       
        const httpsProd = [
            'https://flyvi.io/ru',
            'https://flyvi.io/ru/presentations',
            'https://flyvi.io/ru/marketplace',
            'https://flyvi.io/ru/sozdat-sertifikat',
            'https://flyvi.io/ru/content',
            'https://flyvi.io/ru/tariffs',
            'https://flyvi.io/ru/templates',
            'https://flyvi.io/ru/blog',
            'https://flyvi.io/ru/ii-masterskaya',
            'https://flyvi.io/ru/sozdat-banner',
            'https://flyvi.io/ru/logo',
            'https://flyvi.io/ru/vkpage',
            'https://flyvi.io/ru/resume',
            'https://flyvi.io/ru/qrcode',
            'https://flyvi.io/ru/sozdat-vizitku',
            'https://flyvi.io/ru/priglasitelnyye',
            'https://flyvi.io/ru/otkrytki',
            'https://flyvi.io/ru/sozdat-buklet',
            'https://flyvi.io/ru/sozdat-buklet',
            'https://flyvi.io/ru/oblozhki-video',
            'https://flyvi.io/ru/otkrytki-na-novyj-god',
            'https://flyvi.io/ru/menyu',
            'https://flyvi.io/ru/prajs-listy',
            'https://flyvi.io/ru/svadebnoe-priglashenie',
            'https://flyvi.io/ru/shablony-dlya-lichnoj-ehffektivnosti',
            'https://flyvi.io/ru/online-doska',
            'https://flyvi.io/ru/23-fevralya',
            'https://flyvi.io/ru/8-marta',
            'https://flyvi.io/ru/9-maya',
            'https://flyvi.io/ru/kollazh',
            'https://flyvi.io/ru/plakaty-i-postery'
        ]  
        for(let i = 0; i < 31; i++) {
            await page.goto(httpsProd[i], {timeout: 120000})
            // await page.pause()
            const frame = page.locator('iframe[src*="https://smartcaptcha.yandexcloud.net/advanced"]').contentFrame()            
            const iframeSubmitBtn = frame.locator('[data-testid="submit"]')
            await iframeSubmitBtn.highlight()            
            await iframeSubmitBtn.waitFor({timeout: 25000})
        }   
        
        await page.pause()
    })

    test('ГЕНЕРАЦИЯ ФОТО ИИ', async({page})=>{
        const editor = new Editor(page)
        await page.goto('/app/designs/61bb153a-ab29-402c-b5c9-0c303fba998b')
        await expect(editor.downloadBtn).toBeVisible()                      // Отображение кнопки СКАЧАТЬ ДИЗАНЙ
        await page.locator('.flyvi-decors-drawer__menu_wrapper >> text=ИИ-мастерская').click() // Открыть меню ИИ-Генератора
        let tokens = page.locator('.tokens-count_container_count')          // Счётчик токенов для генерации
        const previewImg = page.locator('.images img')                      // Превьюшка первого фото ИИ
        // const previewImg2 = page.locator('.images img').nth(1)           // Превьюшка второго фото ИИ
        const genInput = page.locator('textarea')                           // Инпут для промпта
        const genBtn = page.locator('.neuro-btn >> text=Сгенерировать изображение') // Кнопка генерации ФОТО ИИ
        const AISize = page.locator('.neuro-settings .v-input__control').nth(1)     // Меню выбора размеров
        const AIStyle = page.locator('.neuro-settings .styles')                     // Меню выбора стиля генерации
        await expect(tokens).toBeVisible()
        let text = await tokens.innerText()       
        const tokenCounter = parseInt(text)                                 // Счётчик токенов
        if(tokenCounter < 1) {
            throw new Error('<<<НЕДОСТАТОЧНО ТОКЕНОВ>>>')}                  // Вылетает ошибка, если токенов осталось меньше 1
        await genInput.fill('Большой ядерный взрыв')                        // Ввод промпта
        await AISize.click()
        await page.locator('.v-list-item__title >> text=9:16 (576 x 1024)').click() // Выбор размера генерируемой картинки
        await AIStyle.click()
        await page.locator('.styles_item >> text=Энди Уорхол').click()              // Выбор стиля генерируемой картинки
        await expect (genBtn).toBeVisible()                                         // Отображение кнопки начала Генерации
        await genBtn.click()                                                        // Клик по кнопке ГЕНЕРАЦИИ

        await previewImg.first().waitFor({ timeout: 13000 })  // Ожидаем появление превьюшек
        const countImg1 = await page.$$('.images img')
        await expect (countImg1.length).toEqual(4)
        const countImg2 = await page.$$eval('.images img', (img) => img.length)
        await expect (countImg2).toEqual(4)    
        // await previewImg2.waitFor({ timeout: 13000 })
        const imgs = page.locator('.images img')
        const img1 = page.locator('.images img').nth(0)
        const img2 = page.locator('.images img').nth(1)
        const img3 = page.locator('.images img').nth(2)
        const img4 = page.locator('.images img').nth(3)
        await expect(img1).toBeVisible()            // Проверка, что картинка ИИ опоявилась в меню
        await expect(img2).toBeVisible()            // Проверка, что картинка ИИ опоявилась в меню
        const count = await imgs.count()
        await expect(count).toBe(4)
        tokens = page.locator('.tokens-count_container_count')
        text = await tokens.innerText()  
        const newTokenCounter = parseInt(text)              // Счётчик токенов после генерации
        await expect(newTokenCounter).toBe(tokenCounter-1)  // Проверка, что токены потратились
        await page.pause()
    })   

    test('ЗАГЛУШКА 2', async ({page})=>{
        const editor = new Editor(page)
        await page.goto('/app/designs/a594cd68-4b51-4dfc-b666-de8447afe85b')
        await editor.downloadBtn.waitFor()
        await page.pause()
    })
})