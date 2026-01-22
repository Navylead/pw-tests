// @ts-nocheck
import {test, expect} from "@playwright/test"
import { describe } from "node:test"
import {LoginPage} from "../pages/LoginPage"
import {Editor} from "../pages/Editor"
import { timeout } from "../playwright.config"
import creds from "../auth/creds.json"
import {Dashboard} from "../pages/Dashboard"
import { MainPage } from "../pages/MainPage"
import { AiWorkshop } from "../pages/AiWorkshop"


test.describe('Релизные тесты', ()=>{

test.describe('Тесты премиумности', ()=>{
    test.beforeEach(async({page})=>{
        page.setViewportSize({"width": 1600, "height": 900})
    })

    test.use({ storageState: 'auth/auth3.json' });                    // <<<ФАЙЛ С СОХРАНЁННОЙ СЕССИЕЙ ТАРИФА СТАРТ - xedibe*>>>

    test('Дашборд. Проверка тарифа в ЛК', async ({page})=>{
        const dashboard = new Dashboard(page)
        await page.goto('/app')
        // Проверяем, что на Дашборде отображается тариф Старт
        const dashboardTariff = await page.locator('.drawer-account__tariff-name').textContent()
        expect(dashboardTariff.trim()).toEqual('БЕСПЛАТНО')
        // Переход в настройки ЛК
        await dashboard.userLogo.waitFor()
        await dashboard.userLogo.click()
        await page.locator('text=Мой профиль').click()
        await page.waitForURL('/app/user/profile')
        // Переход на вкладку Подписка
        const subscriptionBtn = page.locator('text=Подписка')
        await subscriptionBtn.waitFor()
        await subscriptionBtn.click()
        // Проверяем, что отображается тариф Старт
        const tariff = await page.locator('.col_oXhib:has-text("Тарифы") [class="cardTitle_hYN+x"]').first()        
        const tariffName = await tariff.textContent()
        expect(tariffName.trim()).toEqual('Старт')

        // await page.pause()
    })

    test('ИИ-мастерская. Отображение попапа платной подписки при ГЕНЕРАЦИИ ФОТО на бесплатном тарифе', async ({page})=>{
        const dashboard = new Dashboard(page)
        await page.goto('/app/image-generator')
        // Проверяем, что количество токенов соответствует условиям отображения водяного знака
        const balance = await dashboard.getTokenCount()        
        expect(balance, '<<<НЕДОСТАТОЧНО ТОКЕНОВ>>>').toBeGreaterThan(0)
        expect(balance, '<<<ТОКЕНОВ БОЛЬШЕ 4>>>').toBeLessThan(5)
        // Ждём отображения кнопки смены тарифа на ПРО
        await dashboard.changeToProBtn.waitFor()
        // Вводим промпт и запускаем генерацию фото
        const textInput = page.locator('.textarea_bottom textarea')
        await textInput.fill('Рандомное изображение')
        await dashboard.imgGenerateBtn.click()
        // Проверяем, что появляется попап платной подписки
        const banner = page.locator('.dialog-box')
        await banner.waitFor()
        await banner.locator('button >> text=Получить бесплатную пробную версию').waitFor()   

        // await page.pause()
    })

    test('ИИ-мастерская. Отображение попапа платной подписки при использовании ии-мастерской на бесплатном тарифе', async ({page})=>{
        const dashboard = new Dashboard(page)
        await page.goto('/app/image-generator')
        // Проверяем, что количество токенов соответствует условиям отображения водяного знака
        const balance = await dashboard.getTokenCount()        
        expect(balance, '<<<НЕДОСТАТОЧНО ТОКЕНОВ>>>').toBeGreaterThan(0)
        expect(balance, '<<<ТОКЕНОВ БОЛЬШЕ 4>>>').toBeLessThan(5)
        // Ждём отображения кнопки смены тарифа на ПРО
        await dashboard.changeToProBtn.waitFor()
        await dashboard.aiImage.click()
        const colorizationBtn = page.locator('.dialog-wrapper >> text=Колоризация')
        await colorizationBtn.click()
        // Проверяем, что отображается баннер перехода на платную подписку
        await dashboard.proBanner.waitFor()
        await dashboard.proBanner.locator('button >> text=Получить бесплатную пробную версию').waitFor()
        
        // await page.pause()
    })

    test('↓↓↓ ИИ-мастерская. СКАЧИВАНИЕ ии-фото на бесплатном тарифе. ИСТОРИЯ ГЕНЕРАЦИИ. СПИСОК', async ({page})=>{
        const dashboard = new Dashboard(page)
        await page.goto('/app/image-generator')
        // Проверяем, что количество токенов соответствует условиям отображения водяного знака
        const balance = await dashboard.getTokenCount()        
        expect(balance, '<<<НЕДОСТАТОЧНО ТОКЕНОВ>>>').toBeGreaterThan(0)
        expect(balance, '<<<ТОКЕНОВ БОЛЬШЕ 4>>>').toBeLessThan(5)
        // Ждём отображения кнопки смены тарифа на ПРО
        await dashboard.changeToProBtn.waitFor()
        // Клик по кнопке скачивания в попапе
        const aiImage = page.locator('[class="ai-generator__history"] [class="image-container"]').first()        
        await aiImage.hover()              
        await aiImage.locator('button').nth(2).click()
        // Проверяем, что отображается баннер перехода на платную подписку
        await dashboard.proBanner.waitFor()
        await dashboard.proBanner.locator('button >> text=Получить бесплатную пробную версию').waitFor()
        // Проверяем, что скачивание началось
        const popupCloseBtn = page.locator('[class="dialogWrapper_FVcGt"] [class="close-icon"]')
        const [fileDownload] = await Promise.all([
            page.waitForEvent('download'),
            popupCloseBtn.click()
        ])
        // Проверяем, что фото скачалось
        expect(fileDownload).toBeTruthy()
        // Проверяем, что разрешение файла корректное
        const filename = fileDownload.suggestedFilename()
        expect(filename).toContain('.jpg')
        
        await page.pause()
    })

    test('↓↓↓ ИИ-мастерская. СКАЧИВАНИЕ ии-фото на бесплатном тарифе. ИСТОРИЯ ГЕНЕРАЦИИ. ПОПАП', async ({page})=>{
        const dashboard = new Dashboard(page)
        await page.goto('/app/image-generator')
        // Проверяем, что количество токенов соответствует условиям отображения водяного знака
        const balance = await dashboard.getTokenCount()        
        expect(balance, '<<<НЕДОСТАТОЧНО ТОКЕНОВ>>>').toBeGreaterThan(0)
        expect(balance, '<<<ТОКЕНОВ БОЛЬШЕ 4>>>').toBeLessThan(5)
        // Ждём отображения кнопки смены тарифа на ПРО
        await dashboard.changeToProBtn.waitFor()
        // Кликаем по сгененрированному фото
        await dashboard.aiImage.click()
        // Клик по кнопке скачивания в попапе
        const popupDownloadBtn = page.locator('.ai-generator__dialog_btn-container button').nth(1)
        await popupDownloadBtn.click()
        // Проверяем, что отображается баннер перехода на платную подписку
        await dashboard.proBanner.waitFor()
        await dashboard.proBanner.locator('button >> text=Получить бесплатную пробную версию').waitFor()
        // Проверяем, что скачивание началось
        const popupCloseBtn = page.locator('[class="dialogWrapper_FVcGt"] [class="close-icon"]')
        const [fileDownload] = await Promise.all([
            page.waitForEvent('download'),
            popupCloseBtn.click()
        ])
        // Проверяем, что фото скачалось
        expect(fileDownload).toBeTruthy()
        // Проверяем, что разрешение файла корректное
        const filename = fileDownload.suggestedFilename()
        expect(filename).toContain('.jpg')
        
        await page.pause()
    })

    test('↓↓↓ ИИ-мастерская. СКАЧИВАНИЕ ии-фото на бесплатном тарифе. ИИ-РЕДАКТОР', async ({page})=>{
        const dashboard = new Dashboard(page)
        await page.goto('/app/image-generator')
        // Проверяем, что количество токенов соответствует условиям отображения водяного знака
        const balance = await dashboard.getTokenCount()        
        expect(balance, '<<<НЕДОСТАТОЧНО ТОКЕНОВ>>>').toBeGreaterThan(0)
        expect(balance, '<<<ТОКЕНОВ БОЛЬШЕ 4>>>').toBeLessThan(5)
        // Ждём отображения кнопки смены тарифа на ПРО
        await dashboard.changeToProBtn.waitFor()
        // Переходим в ИИ-РЕДАКТОР
        await dashboard.aiImage.hover()
        const downloadBtn = page.getByRole('button', {name:"Изменить"})  
        await downloadBtn.click()
        // Клик по кнопке скачивания в ИИ-РЕДАКТОРЕ
        const aiEditorDownloadBtn = page.locator('[class="ai-editor__main_canvas_img"] button').nth(3)
        await aiEditorDownloadBtn.click()
        // Проверяем, что отображается баннер перехода на платную подписку
        await dashboard.proBanner.waitFor()
        await dashboard.proBanner.locator('button >> text=Получить бесплатную пробную версию').waitFor()
        // Проверяем, что скачивание началось
        const popupCloseBtn = page.locator('[class="dialogWrapper_FVcGt"] [class="close-icon"]')
        const [fileDownload] = await Promise.all([
            page.waitForEvent('download'),
            popupCloseBtn.click()
        ])
        // Проверяем, что фото скачалось
        expect(fileDownload).toBeTruthy()
        // Проверяем, что разрешение файла корректное
        const filename = fileDownload.suggestedFilename()
        expect(filename).toContain('.jpg')
        
        await page.pause()
    })

    test('↓↓↓ ИИ-мастерская. СКАЧИВАНИЕ ии-фото на бесплатном тарифе. ГАЛЕРЕЯ', async ({page})=>{
        const dashboard = new Dashboard(page)
        await page.goto('/app/gallery')
        // Проверяем, что количество токенов соответствует условиям отображения водяного знака
        const balance = await dashboard.getTokenCount()        
        expect(balance, '<<<НЕДОСТАТОЧНО ТОКЕНОВ>>>').toBeGreaterThan(0)
        expect(balance, '<<<ТОКЕНОВ БОЛЬШЕ 4>>>').toBeLessThan(5)
        // Ждём отображения кнопки смены тарифа на ПРО
        await dashboard.changeToProBtn.waitFor()
        // Клик по кнопке скачивания первого фото в списке
        const imgPreview = page.locator('[class="v-responsive__content"]').first()
        await imgPreview.hover()
        const downloadBtn = imgPreview.getByRole('button').nth(2)
        await downloadBtn.click()        
        // Проверяем, что отображается баннер перехода на платную подписку
        await dashboard.proBanner.waitFor()
        await dashboard.proBanner.locator('button >> text=Получить бесплатную пробную версию').waitFor()
        // Проверяем, что скачивание началось
        const popupCloseBtn = page.locator('[class="dialogWrapper_FVcGt"] [class="close-icon"]')
        const [fileDownload] = await Promise.all([
            page.waitForEvent('download'),
            popupCloseBtn.click()
        ])
        // Проверяем, что фото скачалось
        expect(fileDownload).toBeTruthy()
        // Проверяем, что разрешение файла корректное
        const filename = fileDownload.suggestedFilename()
        expect(filename).toContain('.jpg')
        
        await page.pause()
    })

    test('↓↓↓ ИИ-мастерская. СКАЧИВАНИЕ ии-фото на бесплатном тарифе. ГАЛЕРЕЯ. ПОПАП', async ({page})=>{
        const dashboard = new Dashboard(page)
        await page.goto('/app/gallery')
        // Проверяем, что количество токенов соответствует условиям отображения водяного знака
        const balance = await dashboard.getTokenCount()        
        expect(balance, '<<<НЕДОСТАТОЧНО ТОКЕНОВ>>>').toBeGreaterThan(0)
        expect(balance, '<<<ТОКЕНОВ БОЛЬШЕ 4>>>').toBeLessThan(5)
        // Ждём отображения кнопки смены тарифа на ПРО
        await dashboard.changeToProBtn.waitFor()
        // Кликаем по сгененрированному фото
        const imgPreview = page.locator('[class="v-responsive__content"]').first()
        await imgPreview.click()
        // Ждём появления карточки фото
        const popup = page.locator('[class="dialog-wrapper"]')
        await popup.waitFor()
        // Кликаем по кнопке Скачать
        await popup.getByRole('button').nth(1).click()
        // Проверяем, что отображается баннер перехода на платную подписку
        await dashboard.proBanner.waitFor()
        await dashboard.proBanner.locator('button >> text=Получить бесплатную пробную версию').waitFor()
        // Проверяем, что скачивание началось
        const popupCloseBtn = page.locator('[class="dialogWrapper_FVcGt"] [class="close-icon"]')
        const [fileDownload] = await Promise.all([
            page.waitForEvent('download'),
            popupCloseBtn.click()
        ])
        // Проверяем, что фото скачалось
        expect(fileDownload).toBeTruthy()
        // Проверяем, что разрешение файла корректное
        const filename = fileDownload.suggestedFilename()
        expect(filename).toContain('.jpg')
        
        await page.pause()
    })

    test('⊗⊗⊗ ИИ-мастерская. СОЗДАНИЕ ДИЗАЙНА из ии-фото на бесплатном тарифе. ИСТОРИЯ ГЕНЕРАЦИИ. СПИСОК', async ({page, context})=>{
        const dashboard = new Dashboard(page)
        const editor = new Editor(page)
        await page.goto('/app/image-generator')
        // Проверяем, что количество токенов соответствует условиям отображения водяного знака
        const balance = await dashboard.getTokenCount()        
        expect(balance, '<<<НЕДОСТАТОЧНО ТОКЕНОВ>>>').toBeGreaterThan(0)
        expect(balance, '<<<ТОКЕНОВ БОЛЬШЕ 4>>>').toBeLessThan(5)
        // Ждём отображения кнопки смены тарифа на ПРО
        await dashboard.changeToProBtn.waitFor()
        // Создаём дизайн
        const aiImage = page.locator('[class="ai-generator__history"] [class="image-container"]').first()        
        await aiImage.hover()
        await aiImage.locator('button').nth(1).highlight()        
        await aiImage.locator('button').nth(1).click()
        const [newTab] = await Promise.all([
            context.waitForEvent('page'),
            page.getByText(/использовать/i).click()
        ])
        // Проверяем, что дизайн создался
        await newTab.waitForLoadState('load', {timeout: 25000})
        await newTab.getByRole('button', {name: "Скачать"}).waitFor()    
        
        await page.pause()
    })

    test('⊗⊗⊗ ИИ-мастерская. СОЗДАНИЕ ДИЗАЙНА из ии-фото на бесплатном тарифе. ИСТОРИЯ ГЕНЕРАЦИИ. ПОПАП', async ({page, context})=>{
        const dashboard = new Dashboard(page)
        await page.goto('/app/image-generator')
        // Проверяем, что количество токенов соответствует условиям отображения водяного знака
        const balance = await dashboard.getTokenCount()        
        expect(balance, '<<<НЕДОСТАТОЧНО ТОКЕНОВ>>>').toBeGreaterThan(0)
        expect(balance, '<<<ТОКЕНОВ БОЛЬШЕ 4>>>').toBeLessThan(5)
        // Ждём отображения кнопки смены тарифа на ПРО
        await dashboard.changeToProBtn.waitFor()
        // Кликаем по сгененрированному фото
        await dashboard.aiImage.click()
        // Создаём дизайн
        const createDesign = page.getByRole('button', {name: "Использовать в дизайне"})
        const [newTab] = await Promise.all([
            context.waitForEvent('page'),
            await createDesign.click()
        ])
        // Проверка, что дизайн создался
        await newTab.waitForLoadState('load', {timeout: 25000})
        await newTab.getByRole('button', {name: "Скачать"}).waitFor()        
        
        await page.pause()
    })

    test('⊗⊗⊗ ИИ-мастерская. СОЗДАНИЕ ДИЗАЙНА из ии-фото на бесплатном тарифе. ИИ-РЕДАКТОР', async ({page, context})=>{
        const dashboard = new Dashboard(page)
        await page.goto('/app/image-generator')
        // Проверяем, что количество токенов соответствует условиям отображения водяного знака
        const balance = await dashboard.getTokenCount()        
        expect(balance, '<<<НЕДОСТАТОЧНО ТОКЕНОВ>>>').toBeGreaterThan(0)
        expect(balance, '<<<ТОКЕНОВ БОЛЬШЕ 4>>>').toBeLessThan(5)
        // Ждём отображения кнопки смены тарифа на ПРО
        await dashboard.changeToProBtn.waitFor()
        // Переходим в ИИ-РЕДАКТОР
        await dashboard.aiImage.hover()
        const goToEditor = page.locator('[class="image-container"]').first().locator('button').nth(4)        
        await goToEditor.click()
        // Создаём дизайн
        const [newTab] = await Promise.all([
            context.waitForEvent('page'),
            page.locator('[class="helpers__container"] button').nth(3).click()
        ])
        // Проверяем, что дизайн создался
        await newTab.waitForLoadState('load', {timeout: 25000})
        await newTab.getByRole('button', {name: "Скачать"}).waitFor() 
        
        await page.pause()
    })

    test('⊗⊗⊗ ИИ-мастерская. СОЗДАНИЕ ДИЗАЙНА из ии-фото на бесплатном тарифе. ГАЛЕРЕЯ', async ({page, context})=>{
        const dashboard = new Dashboard(page)
        await page.goto('/app/gallery')
        // Проверяем, что количество токенов соответствует условиям отображения водяного знака
        const balance = await dashboard.getTokenCount()        
        expect(balance, '<<<НЕДОСТАТОЧНО ТОКЕНОВ>>>').toBeGreaterThan(0)
        expect(balance, '<<<ТОКЕНОВ БОЛЬШЕ 4>>>').toBeLessThan(5)
        // Ждём отображения кнопки смены тарифа на ПРО
        await dashboard.changeToProBtn.waitFor()
        // Создаём дизайн
        const aiImage = page.locator('[class="v-responsive__content"]').first()    
        await aiImage.hover()
        await aiImage.locator('div [class="image-container_icons_icon"] button').highlight()        
        await aiImage.locator('div [class="image-container_icons_icon"] button').click()
        const [newTab] = await Promise.all([
            context.waitForEvent('page'),
            page.getByText('Использовать в дизайне').click()
        ])
        // Проверяем, что дизайн создался
        await newTab.waitForLoadState('load', {timeout: 25000})
        await newTab.getByRole('button', {name: "Скачать"}).waitFor()       
        
        await page.pause()
    })

    test('⊗⊗⊗ ИИ-мастерская. СОЗДАНИЕ ДИЗАЙНА из ии-фото на бесплатном тарифе. ГАЛЕРЕЯ. ПОПАП', async ({page, context})=>{
        const dashboard = new Dashboard(page)
        await page.goto('/app/gallery')
        // Проверяем, что количество токенов соответствует условиям отображения водяного знака
        const balance = await dashboard.getTokenCount()        
        expect(balance, '<<<НЕДОСТАТОЧНО ТОКЕНОВ>>>').toBeGreaterThan(0)
        expect(balance, '<<<ТОКЕНОВ БОЛЬШЕ 4>>>').toBeLessThan(5)
        // Ждём отображения кнопки смены тарифа на ПРО
        await dashboard.changeToProBtn.waitFor()
        // Кликаем по сгененрированному фото
        const imgPreview = page.locator('[class="v-responsive__content"]').first()
        await imgPreview.click()
        // Ждём появления карточки фото
        const popup = page.locator('[class="dialog-wrapper"]')
        await popup.waitFor()
        // Создаём дизайн
        const [newTab] = await Promise.all([
            context.waitForEvent('page'),
            popup.getByRole('button', {name: "Использовать в дизайне"}).click()
        ])
        // Проверяем, что дизайн создался
        await newTab.waitForLoadState('load', {timeout: 25000})
        await newTab.getByRole('button', {name: "Скачать"}).waitFor()       
        
        await page.pause()
    })

    test('ИИ-мастерская. Отображение попапа платной подписки при КОПИРОВАНИИ сгененрированного фото на бесплатном тарифе', async ({page})=>{
        const dashboard = new Dashboard(page)
        await page.goto('/app/image-generator')
        // Проверяем, что количество токенов соответствует условиям отображения водяного знака
        const balance = await dashboard.getTokenCount()        
        expect(balance, '<<<НЕДОСТАТОЧНО ТОКЕНОВ>>>').toBeGreaterThan(0)
        expect(balance, '<<<ТОКЕНОВ БОЛЬШЕ 4>>>').toBeLessThan(5)
        // Ждём отображения кнопки смены тарифа на ПРО
        await dashboard.changeToProBtn.waitFor()
        // Кликаем по сгененрированному фото
        await dashboard.aiImage.click()
        // Клик по кнопке скачивания в попапе
        const popupDownloadBtn = page.locator('.ai-generator__dialog_btn-container button').nth(2)
        await popupDownloadBtn.click()
        // Проверяем, что отображается баннер перехода на платную подписку
        await dashboard.proBanner.waitFor()
        await dashboard.proBanner.locator('button >> text=Получить бесплатную пробную версию').waitFor()
        
        await page.pause()
    })

    test('ИИ-мастерская. Отображение ВОДЯНОГО ЗНАКА на бесплатном тарифе', async({page})=>{
        const dashboard = new Dashboard(page)
        await page.goto('/app/image-generator')
        // Проверяем, что количество токенов соответствует условиям отображения водяного знака
        const balance = await dashboard.getTokenCount()        
        expect(balance, '<<<НЕДОСТАТОЧНО ТОКЕНОВ>>>').toBeGreaterThan(0)
        expect(balance, '<<<ТОКЕНОВ БОЛЬШЕ 4>>>').toBeLessThan(5)
        // Ждём отображения кнопки смены тарифа на ПРО
        await dashboard.changeToProBtn.waitFor()
        // Водяные знаки на картинках в последнем блоке
        const waterMark = page.locator('.ai-generator__history [id*="section"]').first().locator('img[alt="watermark"]')
        // Проверяем, что количество водяных знаков равно 4
        await expect(waterMark).toHaveCount(4)
        // await waterMark.highlight()
        await waterMark.first().waitFor()

        await page.pause()
    })

    test('Эдитор. Использование ии-редактора на бесплатном тарифе', async({page})=>{
        const dashboard = new Dashboard(page)
        const editor = new Editor(page)
        await page.goto('/app/designs/453089c9-dfc6-4b9b-90b3-36b02f721c68')
        await editor.changesSavedBtn.waitFor()
        // Кликаем по фото на холсте
        await editor.decor.waitFor({timeout:10000})
        await editor.decor.click()
        // Переходим в меню ии-редактора
        await editor.aiEditorBtn.click()
        // Проверяем, что на функциях в меню отображает иконка премиума
        const waterMark = page.locator('.ai-editor .premium-label')
        await expect(waterMark).toHaveCount(12)
        // await waterMark.highlight()
        // Кликаем по кнопке Колоризации
        const colorization = page.locator('.ai-editor >> text=Колоризация')
        await colorization.click()
        const banner = page.locator('.dialog-box')
        // Проверяем, что отображается баннер перехода на платную подписку
        await banner.waitFor()
        await banner.locator('button >> text=Получить бесплатную пробную версию').waitFor()        
        
        // await page.pause()
    })

    test('Эдитор. Скачивание премиум-элемента: ИКОНКА', async({page})=>{
        const editor = new Editor(page)
        await page.goto('/app/designs/a9d4defc-7041-452a-91c4-9c9569eceea6')
        await editor.changesSavedBtn.waitFor()
        await editor.downloadBtn.click()
        const allPagesMenu = page.locator('button >> text=Все страницы')
        await allPagesMenu.click()
        const allPages = page.locator('[role="menu"]').nth(1).locator('button >> text=Все страницы')
        await allPages.click()
        const currentPage = page.locator('[role="menu"]').nth(1).locator('button >> text=Страница 1').nth(0)
        await currentPage.click()
        const doneBtn = page.locator('[role="menu"]').nth(1).locator('button').getByText('Готово')
        await doneBtn.click()
        const downloadButton = page.locator('.site-story-download__menu button >> text=Скачать')
        await downloadButton.waitFor()
        await downloadButton.click()
        const getTariffBtn = page.locator('.dialogWrapper_FVcGt button >> text=Получить бесплатную пробную версию')
        await getTariffBtn.waitFor()

        //await page.pause()
    })

    test('Эдитор. Скачивание премиум-элемента: ВЕКТОР', async({page})=>{
        const editor = new Editor(page)
        await page.goto('/app/designs/a9d4defc-7041-452a-91c4-9c9569eceea6')
        await editor.changesSavedBtn.waitFor()
        await editor.downloadBtn.click()
        const allPagesMenu = page.locator('button >> text=Все страницы')
        await allPagesMenu.click()
        const allPages = page.locator('[role="menu"]').nth(1).locator('button >> text=Все страницы')
        await allPages.click()
        const currentPage = page.locator('[role="menu"]').nth(1).locator('button >> text=Страница 2')
        await currentPage.click()
        const doneBtn = page.locator('[role="menu"]').nth(1).locator('button').getByText('Готово')
        await doneBtn.click()
        const downloadButton = page.locator('.site-story-download__menu button >> text=Скачать')
        await downloadButton.waitFor()
        await downloadButton.click()
        const getTariffBtn = page.locator('.dialogWrapper_FVcGt button >> text=Получить бесплатную пробную версию')
        await getTariffBtn.waitFor()
        
        //await page.pause()
    })

    test('Эдитор. Скачивание премиум-элемента: ШРИФТ', async({page})=>{
        const editor = new Editor(page)
        await page.goto('/app/designs/a9d4defc-7041-452a-91c4-9c9569eceea6')
        await editor.changesSavedBtn.waitFor()
        await editor.downloadBtn.click()
        const allPagesMenu = page.locator('button >> text=Все страницы')
        await allPagesMenu.click()
        const allPages = page.locator('[role="menu"]').nth(1).locator('button >> text=Все страницы')
        await allPages.click()
        const currentPage = page.locator('[role="menu"]').nth(1).locator('button >> text=Страница 3')
        await currentPage.click()
        const doneBtn = page.locator('[role="menu"]').nth(1).locator('button').getByText('Готово')
        await doneBtn.click()
        const downloadButton = page.locator('.site-story-download__menu button >> text=Скачать')
        await downloadButton.waitFor()
        await downloadButton.click()
        const getTariffBtn = page.locator('.dialogWrapper_FVcGt button >> text=Получить бесплатную пробную версию')
        await getTariffBtn.waitFor()
        
        //await page.pause()
    })

    test('Эдитор. Скачивание премиум-элемента: АНИМАЦИЯ', async({page})=>{
        const editor = new Editor(page)
        await page.goto('/app/designs/a9d4defc-7041-452a-91c4-9c9569eceea6')
        await editor.changesSavedBtn.waitFor()
        await editor.downloadBtn.click()
        const allPagesMenu = page.locator('button >> text=Все страницы')
        await allPagesMenu.click()
        const allPages = page.locator('[role="menu"]').nth(1).locator('button >> text=Все страницы')
        await allPages.click()
        const currentPage = page.locator('[role="menu"]').nth(1).locator('button >> text=Страница 4')
        await currentPage.click()
        const doneBtn = page.locator('[role="menu"]').nth(1).locator('button').getByText('Готово')
        await doneBtn.click()
        const downloadButton = page.locator('.site-story-download__menu button >> text=Скачать')
        await downloadButton.waitFor()
        await downloadButton.click()
        const getTariffBtn = page.locator('.dialogWrapper_FVcGt button >> text=Получить бесплатную пробную версию')
        await getTariffBtn.waitFor()
        
        //await page.pause()
    })

    test.skip('Эдитор. Скачивание премиум-элемента: АНИМАЦИЯ для декоров <<<НЕ РАБОТАЕТ!!!>>>', async({page})=>{
        const editor = new Editor(page)
        await page.goto('/app/designs/a9d4defc-7041-452a-91c4-9c9569eceea6')
        await editor.changesSavedBtn.waitFor()
        await editor.downloadBtn.click()
        const allPagesMenu = page.locator('button >> text=Все страницы')
        await allPagesMenu.click()
        const allPages = page.locator('[role="menu"]').nth(1).locator('button >> text=Все страницы')
        await allPages.click()
        const currentPage = page.locator('[role="menu"]').nth(1).locator('button >> text=Страница 5')
        await currentPage.click()
        const doneBtn = page.locator('[role="menu"]').nth(1).locator('button').getByText('Готово')
        await doneBtn.click()
        const downloadButton = page.locator('.site-story-download__menu button >> text=Скачать')
        await downloadButton.waitFor()
        await downloadButton.click()
        const getTariffBtn = page.locator('.dialogWrapper_FVcGt button >> text=Получить бесплатную пробную версию')
        await getTariffBtn.waitFor()
        
        //await page.pause()
    })

    test('Эдитор. Скачивание премиум-элемента: ФИГУРА', async({page})=>{
        const editor = new Editor(page)
        await page.goto('/app/designs/a9d4defc-7041-452a-91c4-9c9569eceea6')
        await editor.changesSavedBtn.waitFor()
        await editor.downloadBtn.click()
        const allPagesMenu = page.locator('button >> text=Все страницы')
        await allPagesMenu.click()
        const allPages = page.locator('[role="menu"]').nth(1).locator('button >> text=Все страницы')
        await allPages.click()
        const currentPage = page.locator('[role="menu"]').nth(1).locator('button >> text=Страница 6')
        await currentPage.click()
        const doneBtn = page.locator('[role="menu"]').nth(1).locator('button').getByText('Готово')
        await doneBtn.click()
        const downloadButton = page.locator('.site-story-download__menu button >> text=Скачать')
        await downloadButton.waitFor()
        await downloadButton.click()
        const getTariffBtn = page.locator('.dialogWrapper_FVcGt button >> text=Получить бесплатную пробную версию')
        await getTariffBtn.waitFor()
        
        //await page.pause()
    })

    test('Эдитор. Скачивание премиум-элемента: ЭЛЕМЕНТ', async({page})=>{
        const editor = new Editor(page)
        await page.goto('/app/designs/a9d4defc-7041-452a-91c4-9c9569eceea6')
        await editor.changesSavedBtn.waitFor()
        await editor.downloadBtn.click()
        const allPagesMenu = page.locator('button >> text=Все страницы')
        await allPagesMenu.click()
        const allPages = page.locator('[role="menu"]').nth(1).locator('button >> text=Все страницы')
        await allPages.click()
        const currentPage = page.locator('[role="menu"]').nth(1).locator('button >> text=Страница 7')
        await currentPage.click()
        const doneBtn = page.locator('[role="menu"]').nth(1).locator('button').getByText('Готово')
        await doneBtn.click()
        const downloadButton = page.locator('.site-story-download__menu button >> text=Скачать')
        await downloadButton.waitFor()
        await downloadButton.click()
        const getTariffBtn = page.locator('.dialogWrapper_FVcGt button >> text=Получить бесплатную пробную версию')
        await getTariffBtn.waitFor()
        
        //await page.pause()
    })

    test('Эдитор. Скачивание премиум-элемента: ШАБЛОН', async({page})=>{
        const editor = new Editor(page)
        await page.goto('/app/designs/a9d4defc-7041-452a-91c4-9c9569eceea6')
        await editor.changesSavedBtn.waitFor()
        await editor.downloadBtn.click()
        const allPagesMenu = page.locator('button >> text=Все страницы')
        await allPagesMenu.click()
        const allPages = page.locator('[role="menu"]').nth(1).locator('button >> text=Все страницы')
        await allPages.click()
        const currentPage = page.locator('[role="menu"]').nth(1).locator('button >> text=Страница 8')
        await currentPage.click()
        const doneBtn = page.locator('[role="menu"]').nth(1).locator('button').getByText('Готово')
        await doneBtn.click()
        const downloadButton = page.locator('.site-story-download__menu button >> text=Скачать')
        await downloadButton.waitFor()
        await downloadButton.click()
        const getTariffBtn = page.locator('.dialogWrapper_FVcGt button >> text=Получить бесплатную пробную версию')
        await getTariffBtn.waitFor()
        
        //await page.pause()
    })

    test('Эдитор. Скачивание премиум-элемента: МАСКА', async({page})=>{
        const editor = new Editor(page)
        await page.goto('/app/designs/a9d4defc-7041-452a-91c4-9c9569eceea6')
        await editor.changesSavedBtn.waitFor()
        await editor.downloadBtn.click()
        const allPagesMenu = page.locator('button >> text=Все страницы')
        await allPagesMenu.click()
        const allPages = page.locator('[role="menu"]').nth(1).locator('button >> text=Все страницы')
        await allPages.click()
        const currentPage = page.locator('[role="menu"]').nth(1).locator('button >> text=Страница 9')
        await currentPage.click()
        const doneBtn = page.locator('[role="menu"]').nth(1).locator('button').getByText('Готово')
        await doneBtn.click()
        const downloadButton = page.locator('.site-story-download__menu button >> text=Скачать')
        await downloadButton.waitFor()
        await downloadButton.click()
        const getTariffBtn = page.locator('.dialogWrapper_FVcGt button >> text=Получить бесплатную пробную версию')
        await getTariffBtn.waitFor()
        
        //await page.pause()
    })

    test('Эдитор. Скачивание премиум-элемента: ФОН', async({page})=>{
        const editor = new Editor(page)
        await page.goto('/app/designs/a9d4defc-7041-452a-91c4-9c9569eceea6')
        await editor.changesSavedBtn.waitFor()
        await editor.downloadBtn.click()
        const allPagesMenu = page.locator('button >> text=Все страницы')
        await allPagesMenu.click()
        const allPages = page.locator('[role="menu"]').nth(1).locator('button >> text=Все страницы')
        await allPages.click()
        const currentPage = page.locator('[role="menu"]').nth(1).locator('button >> text=Страница 1').nth(1)
        await currentPage.click()
        const doneBtn = page.locator('[role="menu"]').nth(1).locator('button').getByText('Готово')
        await doneBtn.click()
        const downloadButton = page.locator('.site-story-download__menu button >> text=Скачать')
        await downloadButton.waitFor()
        await downloadButton.click()
        const getTariffBtn = page.locator('.dialogWrapper_FVcGt button >> text=Получить бесплатную пробную версию')
        await getTariffBtn.waitFor()
        
        //await page.pause()
    })

    test('Эдитор. Премиум-функция: ПРОЗРАЧНЫЙ ФОН', async({page})=>{
        const editor = new Editor(page)
        await page.goto('/app/designs/bfa1beaf-4a61-44b1-9596-4cf4cac3b25d')
        await editor.changesSavedBtn.waitFor()
        await editor.downloadBtn.click()
        const background = page.locator('.site-story-download__menu div >> text=Прозрачный фон')
        await background.click()
        const getTariffBtn = page.locator('.dialogWrapper_FVcGt button >> text=Получить бесплатную пробную версию')
        await getTariffBtn.waitFor()
        
        //await page.pause()
    })

    test('Эдитор. Премиум-функция: ОТОБРАЖЕНИЕ ВОДЯНОГО ЗНАКА', async({page})=>{
        const editor = new Editor(page)
        await page.goto('/app/designs/bfa1beaf-4a61-44b1-9596-4cf4cac3b25d')
        await editor.changesSavedBtn.waitFor()
        await editor.downloadBtn.click()
        const watermark = page.locator('.site-story-download__menu div >> text=Отображение водяного знака')
        await watermark.click()
        const getTariffBtn = page.locator('.dialogWrapper_FVcGt button >> text=Получить бесплатную пробную версию')
        await getTariffBtn.waitFor()
        
        //await page.pause()
    })

    test('Эдитор. Премиум-функция: СКЕЙЛ ДИЗАЙНА ПРИ СКАЧИВАНИИ', async({page})=>{
        const editor = new Editor(page)
        await page.goto('/app/designs/bfa1beaf-4a61-44b1-9596-4cf4cac3b25d')
        await editor.changesSavedBtn.waitFor()
        await editor.downloadBtn.click()
        const sizeBtn = page.locator('.site-story-download__menu').locator('text=Размер')
        await sizeBtn.waitFor()
        await sizeBtn.click({force:true})
        const getTariffBtn = page.locator('.dialogWrapper_FVcGt button >> text=Получить бесплатную пробную версию')
        await getTariffBtn.waitFor()
        
        //await page.pause()
    })

    test('Эдитор. Премиум-функция: ИЗМЕНИТЬ РАЗМЕР ДИЗАЙНА', async({page})=>{
        const editor = new Editor(page)
        await page.goto('/app/designs/bfa1beaf-4a61-44b1-9596-4cf4cac3b25d')
        await editor.changesSavedBtn.waitFor()
        await editor.changeDesignSizeBtn.click()
        const designType = page.locator('[role="menu"] [role="option"] >> text=Резюме')
        await designType.click()
        const changeButton = page.locator('[role="menu"] button >> text=Изменить').first()
        await changeButton.waitFor()
        await changeButton.click()        
        const getTariffBtn = page.locator('.dialogWrapper_FVcGt button >> text=Получить бесплатную пробную версию')
        await getTariffBtn.waitFor()
        
        //await page.pause()
    })

    test('Эдитор. Премиум-функция: ДЕФОРМАЦИЯ ДЛЯ ФОТО', async({page})=>{
        const editor = new Editor(page)
        await page.goto('/app/designs/bfa1beaf-4a61-44b1-9596-4cf4cac3b25d')
        // Ждём загрузку дизайна
        await editor.changesSavedBtn.waitFor()
        // Кликаем по декору
        await editor.decor.click()
        // Кликаем по кнопке Деформации
        await editor.deformationBtn.waitFor()        
        await editor.deformationBtn.click()
        // Ждём отображения попапа преиум-подписки        
        const getTariffBtn = page.locator('.dialogWrapper_FVcGt button >> text=Получить бесплатную пробную версию')
        await getTariffBtn.waitFor()
        
        // await page.pause()
    })

    test('Эдитор. Премиум-функция: УДАЛИТЬ ФОН ДЛЯ ФОТО', async({page})=>{
        const editor = new Editor(page)
        await page.goto('/app/designs/bfa1beaf-4a61-44b1-9596-4cf4cac3b25d')
        await editor.changesSavedBtn.waitFor()
        await editor.decor.click()
        const deformationButton = page.locator('#editorToolbar button').getByText('Удалить фон')
        await deformationButton.click()
        const getTariffBtn = page.locator('.dialogWrapper_FVcGt button >> text=Получить бесплатную пробную версию')
        await getTariffBtn.waitFor()
        
        //await page.pause()
    })

    test('Эдитор. Премиум-функция: ЛАСТИК ДЛЯ ФОТО', async({page})=>{
        const editor = new Editor(page)
        await page.goto('/app/designs/bfa1beaf-4a61-44b1-9596-4cf4cac3b25d')
        // Ожидаем загрузку дизайна
        await editor.changesSavedBtn.waitFor()
        // Кликаем по декору
        await editor.decor.click()
        // Кликаем по кнопке Ластика
        await editor.eraserBtn.waitFor()        
        await editor.eraserBtn.click()
        // Ждём отображение попапа премиума
        const getTariffBtn = page.locator('.dialogWrapper_FVcGt button >> text=Получить бесплатную пробную версию')
        await getTariffBtn.waitFor()
        
        // await page.pause()
    })

    test('Дашборд. Переход на тариф ПРО из ЛК', async({page})=>{
        const editor = new Editor(page)
        await page.goto('/app')
        const drawer = page.locator('text=Попробовать Flyvi Pro')
        await drawer.click()        
        const getTariffBtn = page.locator('.dialogWrapper_FVcGt button >> text=Получить бесплатную пробную версию')
        await getTariffBtn.waitFor()        
        
        //await page.pause()
    })

    test('Эдитор. Редактирование БРЕНДБУКА на бесплатном тарифе', async ({page})=>{
        const editor = new Editor(page)
        await page.goto('/app/brand')
        // await page.pause()
        // Кликаем по Брендбуку в списке
        const brandbook = page.locator('.brand-list-item:has-text("ПРЕМИУМ")')
        await brandbook.waitFor({timeout: 12000})
        await brandbook.click()
        // Кликаем в меню редактирования брендбука по кнопке "Сохранить изменения"
        const saveChangesBtn = page.locator('.header-brand-save-btn').getByText('Сохранить изменения')
        await saveChangesBtn.waitFor()
        await saveChangesBtn.click()
        // Ждём отображение попапа премиума
        await editor.proBanner.waitFor()      

        await page.pause()
    })

    test('Эдитор. Скачивание премиум-элемента: ЛОГО из Брендбука', async ({page})=>{
        const editor = new Editor(page)
        await page.goto('/app/designs/a9d4defc-7041-452a-91c4-9c9569eceea6')
        // Выбираем страницу на скачивание
        await editor.choosePageToDownload(11)
        // Ждём отображение попапа премиума
        await editor.proBanner.waitFor()  

        // await page.pause()
    })

    test('Эдитор. Скачивание премиум-элемента: ЭЛЕМЕНТ из Брендбука', async ({page})=>{
        const editor = new Editor(page)
        await page.goto('/app/designs/a9d4defc-7041-452a-91c4-9c9569eceea6')
        // Выбираем страницу на скачивание
        await editor.choosePageToDownload(12)
        // Ждём отображение попапа премиума
        await editor.proBanner.waitFor()
            
        // await page.pause()
    })

    test('Эдитор. Скачивание премиум-элемента: ФОН из Брендбука', async ({page})=>{
        const editor = new Editor(page)
        await page.goto('/app/designs/a9d4defc-7041-452a-91c4-9c9569eceea6')
        // Выбираем страницу на скачивание
        await editor.choosePageToDownload(13)
        // Ждём отображение попапа премиума
        await editor.proBanner.waitFor()

        // await page.pause()
    })

    test('Эдитор. Скачивание премиум-элемента: СЕТ из Брендбука', async ({page})=>{
        const editor = new Editor(page)
        await page.goto('/app/designs/a9d4defc-7041-452a-91c4-9c9569eceea6')
        // Выбираем страницу на скачивание
        await editor.choosePageToDownload(14)
        // Ждём отображение попапа премиума
        await editor.proBanner.waitFor()

        // await page.pause()
    })

    test('Эдитор. Добавление декора из БРЕНДБУКА дизайн: Лого', async ({page})=>{
        const editor = new Editor(page)
        await page.goto('/app/designs/a9d4defc-7041-452a-91c4-9c9569eceea6')
        // Переход в Брендбук
        await page.locator('text=Брендбук').click()
        // Ожидание загрузки медиа в брендбуке и клик по первому элементу
        const brandbookMedia = page.locator('.flyvi-decors-drawer__list.flyvi-decors-drawer__list_open .logos-list-item-content:has(img[src*="/decors-types/uploads-images/brands-custom/"])')
        await brandbookMedia.first().waitFor({state: "visible", timeout: 10000})
        await brandbookMedia.first().click()
        // Ждём отображение попапа премиума
        await editor.proBanner.waitFor()

        // await page.pause()
    })

    test('Эдитор. Добавление декора из БРЕНДБУКА дизайн: Фон', async ({page})=>{
        const editor = new Editor(page)
        await page.goto('/app/designs/a9d4defc-7041-452a-91c4-9c9569eceea6')
        // Переход в Брендбук
        await page.locator('text=Брендбук').click()
        // Ожидание загрузки медиа в брендбуке и клик по первому элементу
        const brandbookMedia = page.locator('.flyvi-decors-drawer__list.flyvi-decors-drawer__list_open .logos-list-item-content:has(img[src*="/decors-types/backgrounds/brands-custom/"])')
        await brandbookMedia.nth(0).waitFor({state: "visible", timeout: 10000})
        await brandbookMedia.nth(0).click()
        // Ждём отображение попапа премиума
        await editor.proBanner.waitFor()

        // await page.pause()
    })

    test('Эдитор. Добавление декора из БРЕНДБУКА дизайн: Элемент', async ({page})=>{
        const editor = new Editor(page)
        await page.goto('/app/designs/a9d4defc-7041-452a-91c4-9c9569eceea6')
        // Переход в Брендбук
        await page.locator('text=Брендбук').click()
        // Ожидание загрузки медиа в брендбуке и клик по первому элементу
        const brandbookMedia = page.locator('.flyvi-decors-drawer__list.flyvi-decors-drawer__list_open .logos-list-item-content:has(img[src*="/decors-types/elements/brands-custom/"])')
        await brandbookMedia.nth(0).waitFor({state: "visible", timeout: 10000})
        await brandbookMedia.nth(0).click()
        // Ждём отображение попапа премиума
        await editor.proBanner.waitFor()

        // await page.pause()
    })

    test('Эдитор. Добавление декора из БРЕНДБУКА в дизайн: Сет', async ({page})=>{
        const editor = new Editor(page)
        await page.goto('/app/designs/a9d4defc-7041-452a-91c4-9c9569eceea6')
        // Переход в Брендбук
        await page.locator('text=Брендбук').click()
        // Ожидание загрузки медиа в брендбуке и клик по первому элементу
        const brandbookMedia = page.locator('.flyvi-decors-drawer__list.flyvi-decors-drawer__list_open [class="text-template-container"]')
        await brandbookMedia.nth(0).waitFor({state: "visible", timeout: 10000})
        await brandbookMedia.nth(0).click()
        // Ждём отображение попапа премиума
        await editor.proBanner.waitFor()

        // await page.pause()
    })

    test('Эдитор. Загрузка фото в редактор сверх лимита', async({page})=>{
        const editor = new Editor(page)
        await page.goto('/app/designs/bfa1beaf-4a61-44b1-9596-4cf4cac3b25d')
        await editor.downloadBtn.waitFor()
        // Переходим во вкладку Загрузки
        await page.locator('text="Загрузки"').click()
        // Кликаем по кнопке "Загрузить медиа"
        const [fileChooser] = await Promise.all([
            page.waitForEvent('filechooser'),
            await editor.uploadMedia.click()
        ])
        // Загружаем своё фото
        await fileChooser.setFiles('tests/resources/test1.jpg')        
        // Ждём появления попапа премиум-загрузки
        editor.proBanner.waitFor()

        await page.pause()
    })
})

test.describe('ОБЩИЕ ПО ЭДИТОРУ', ()=>{
    test.beforeEach(async({page})=>{
        page.setViewportSize({"width": 1600, "height": 900})
    })
    test.use({ storageState: 'auth/auth1.json' });                    // <<<ФАЙЛ С СОХРАНЁННОЙ СЕССИЕЙ PRO>>>

    test('Эдитор. Генерация фото ИИ', async({page})=>{
        const editor = new Editor(page)
        await page.goto('/app/designs/61bb153a-ab29-402c-b5c9-0c303fba998b')        
        await editor.downloadBtn.waitFor({timeout: 10000})                                // Отображение кнопки СКАЧАТЬ ДИЗАНЙ
        await page.locator('.flyvi-decors-drawer__menu_wrapper >> text=ИИ-мастерская').click() // Открыть меню ИИ-Генератора
        const balanceResponse = await page.waitForResponse('**/api/tokens/balance')       // Апишка баланса токенов
        const balance = await balanceResponse.json()        
        await expect(balance.monthly_tokens+balance.permanent_tokens, '<<<НЕДОСТАТОЧНО ТОКЕНОВ - АПИ>>>').toBeGreaterThan(0) 
        let tokens = page.locator('.tokens-count_container_count')          // Счётчик токенов для генерации
        const previewImg = page.locator('.images img')                      // Превьюшка первого фото ИИ
        // const previewImg2 = page.locator('.images img').nth(1)           // Превьюшка второго фото ИИ
        const genInput = page.locator('textarea')                           // Инпут для промпта
        const genBtn = page.locator('.neuro-btn >> text=Сгенерировать изображение') // Кнопка генерации ФОТО ИИ
        const AISize = page.locator('.neuro-settings .v-input__control').nth(1)     // Меню выбора размеров
        const AIStyle = page.locator('.neuro-settings .styles')                     // Меню выбора стиля генерации           
        await genInput.fill('Большой ядерный взрыв')                                // Ввод промпта
        await AISize.click()
        await page.locator('.v-list-item__title >> text=9:16 (576 x 1024)').click() // Выбор размера генерируемой картинки
        await AIStyle.click()
        await page.locator('.styles_item >> text=Энди Уорхол').click()              // Выбор стиля генерируемой картинки
        await expect(tokens).toBeVisible()
        let text = await tokens.innerText()       
        const tokenCounter = parseInt(text)                                         // Счётчик токенов
        if(tokenCounter < 1) {
            throw new Error('<<<НЕДОСТАТОЧНО ТОКЕНОВ>>>')}                          // Вылетает ошибка, если токенов осталось меньше 1
        await expect (genBtn).toBeVisible()                                         // Отображение кнопки начала Генерации
        await genBtn.click()                                                        // Клик по кнопке ГЕНЕРАЦИИ
        await previewImg.first().waitFor({ state: "visible", timeout: 40000 })      // Ожидаем появление превьюшек
        const countImg1 = await page.$$('.images img')
        await expect (countImg1.length).toEqual(4)
        const countImg2 = await page.$$eval('.images img', (img) => img.length)
        await expect (countImg2).toEqual(4)  
        // await previewImg2.waitFor({ timeout: 13000 })
        const imgs = page.locator('.images img')
        const count = await imgs.count()
        await expect(count).toBe(4)
        tokens = page.locator('.tokens-count_container_count')
        text = await tokens.innerText()  
        const newTokenCounter = parseInt(text)              // Счётчик токенов после генерации
        await expect(newTokenCounter).toBe(tokenCounter-1)  // Проверка, что токены потратились
        // await page.pause()
    })

    test('Эдитор. Скачивание дизайна JPG', async ({page})=>{
        const editor = new Editor(page)

        const responses = []                                    // Массив с ответами АПИ скачивания дизайна
        page.on('response', async resp=>{
            if(resp.url().includes('/download-status')){
                responses.push(resp)}                           // Перехват всех ответов АПИ скачивания
        })
        await page.goto('/app/designs/2a24881a-930d-4a11-a034-969632f9e74c')
        await editor.changesSavedBtn.waitFor()
        await editor.downloadBtn.click()                        // Клик по кнопке СКАЧАТЬ
        const designType = page.locator('[class="site-story-download__menu"] [role="button"]').first()        
        await designType.click()                                // Клик по меню выбора формата дизайна
        await page.locator('text = JPG').click()                // Выбор формата  JPG
        const menuDownloadBtn = page.locator('.site-story-download__menu button >> text = Скачать')
        await menuDownloadBtn.click()                           // Скачать дизайн
        await editor.continueBtn.waitFor({timeout:18000})       // Ожидание появления меню после скачивания дизайна
        const lastResp = responses[responses.length-1]          // Последний ответ АПИ
		const respBody = await lastResp.json()                  // Парсим ответ
        expect(respBody.status).toEqual('DONE')                 // Проверка, что по АПИ приходит стаутс DONE        

        await page.pause()
    })

    test('Эдитор. Создание дизайна - История Instagram', async ({page})=>{
        const dashboard = new Dashboard(page)
        const editor = new Editor(page)

        await page.goto('/app')
        await dashboard.createDesignBtn.waitFor()
        await dashboard.createDesignBtn.click()
        await page.locator('.category >> text=Соцсети').click()
        await page.locator('.category >> text=История Instagram').click()
        await page.waitForURL('**/designs/*')
        await editor.changeDesignSizeBtn.waitFor()
        await editor.downloadBtn.waitFor()

        await page.pause()
    })

    test('Папки. Создание дизайна из шаблона в папке', async ({page, context})=>{
        const dashboard = new Dashboard(page)
        // Переход в раздел ПАПКИ
        await page.goto('/app/folders')
        // Переход в папку юзера      
        await page.getByText('33').click()
        const folderName = page.locator('[class="folder_menu_header"] [class="header_name"]')
        await expect(folderName).toHaveText('33')
        // Переходво вкладку ШАБЛОНЫ
        await page.locator('[class="folder_menu_tabs"]').getByText('Шаблоны').click()
        const template = page.locator('[class="folderTemplateContainer_Zki+H"]').first()
        await template.waitFor({timeout: 20000})        
        // Создаём дизайн
        const [newTab] = await Promise.all([
            context.waitForEvent('page', {timeout: 20000}),
            template.click()
        ])
        // Проверяем, что открылся Эдитор
        await newTab.locator('[id="editorHeader"]').getByRole('button', {name: "Изменения сохранены"}).waitFor()
        await newTab.locator('[id="editorHeader"]').getByRole('button', {name: "Скачать"}).waitFor()

        await page.pause()
    })

    test('Дашборд. Создание дизайна из загруженного фото', async({page, context})=>{
        const dashboard = new Dashboard(page)
        const editor = new Editor(page)
        // Переход в Дашборд
        await page.goto('/app')
        // Открываем меню создания дизайнов
        await dashboard.createDesignBtn.waitFor()
        await dashboard.createDesignBtn.click()
        // Клик по кнопке "Редактировать фото" и загрузка своего фото
        const [fileChooser] = await Promise.all([
            page.waitForEvent('filechooser'),            
            page.getByRole('button', {name: "Редактировать фото"}).click()
        ])        
        await fileChooser.setFiles('tests/resources/test2.jpg')
        // Проверка, что открылся дизайн
        await editor.changesSavedBtn.waitFor({timeout: 25000}) 
        // Проверка, что в дизайне есть фото
        await editor.decor.waitFor()    

        await page.pause()
    })

    test('Мэйн. Создание дизайна из шаблона', async({page, context})=>{
        const main = new MainPage(page)

        // Переход на Мэйн
        await page.goto('/ru/templates')
        // Поиск по шаблонам
        await main.templateSearch.waitFor()
        await main.templateSearch.fill('озон')
        await page.keyboard.press('Enter')
        // Кликаем по одному из найденных шаблонов
        const searchResult = page.locator('._1gypXs')
        await searchResult.waitFor()
        const template = page.getByAltText(/озон/i)
        // Создаём дизайн
        await template.nth(2).click()

        const [newTab] = await Promise.all([
            context.waitForEvent('page', {timeout: 25000}),            
            page.locator('[class="_2zGUXR"]:has(a:has-text("Использовать в дизайне"))').click()
        ])
        await newTab.waitForLoadState('load')

        await page.pause()        
    })

    test('Дашборд. Создание дизайна по своим размерам', async ({page})=>{
        const dashboard = new Dashboard(page)
        const editor = new Editor(page)

        await page.goto('/app')
        // Ожидание загрузки страницы
        const designList = page.locator('.stories-list .v-responsive__content').first()
        await designList.waitFor({timeout: 15000})
        await dashboard.templateSearch.waitFor()
        // Клик по кнопке создания дизайна
        await dashboard.createDesignBtn.waitFor()
        await dashboard.createDesignBtn.click()
        // Выбираем свой размер
        const customSizeButton = page.locator('[role="menu"] button >> text=Настраиваемый размер')
        await customSizeButton.click()
        const widthInput = page.locator('.custom-design-menu input').first()
        await widthInput.clear()
        await widthInput.fill('2222')
        const height = page.locator('.custom-design-menu input').nth(1)
        await height.clear()
        await height.fill('2222')
        // Создаём дизайн
        const createCustomDesignButton = page.locator('.custom-design-menu button >> text=Создать дизайн')
        await createCustomDesignButton.click()
        if(await page.locator('div').getByText('BACKGROUND').isVisible()) {
            await page.waitForTimeout(5000) // Убрать явное ожидание
            await createCustomDesignButton.click()
        }
        await page.waitForURL('**/designs/*')
        await editor.changeDesignSizeBtn.waitFor()
        await editor.downloadBtn.waitFor()

        await editor.canvas.isVisible()
        const designSize = await editor.canvas.evaluate(el=>{
            return {
                height: el.clientHeight,
                width: el.clientWidth}
        })
        expect(designSize.height).toEqual(2222)
        expect(designSize.width).toEqual(2222)        

        await page.pause()
    })

    test('Дашборд. Создание WEB-STORY', async ({page, context})=>{
        const dashboard = new Dashboard(page)
        const editor = new Editor(page)
        await page.goto('/app')
        await dashboard.createDesignBtn.waitFor()
        await page.locator('[href="/app/dashboard"]').click()
        const createStoryButton = page.locator('button >> text=Создать сторис')
        // ПЕРЕХОД НА НОВУЮ ВКЛАДКУ
        const [newTab] = await Promise.all([
            context.waitForEvent('page', {timeout: 15000}),
            createStoryButton.click() // Клик по кнопке
      ])
        const publishButton = newTab.locator('#editorHeader button >> text=Опубликовать на сайте')
        const chooseAlbumButton = newTab.locator('#editorHeader button >> text=Выбрать альбом')
        await publishButton.isVisible()
        await chooseAlbumButton.isVisible()
        await publishButton.click()

        await newTab.pause()
    })

    test('Эдитор. Изменение размера дизайна', async({page})=>{
        const editor = new Editor(page)
        let oldWidth, newWidth
        const randomNumber = Math.floor(100 + Math.random() * 900)

        await page.goto('/app/designs/0c0837e6-e171-4e09-b590-45d3554a4da0')
        await editor.changesSavedBtn.isVisible()
        oldWidth = await editor.canvas.evaluate(el=>el.clientWidth)
        await editor.changeDesignSizeBtn.click()
        const setSizeButton = page.locator('button >> text=Настраиваемый размер')
        await setSizeButton.click()
        const widthInput = page.locator('.change-size-actions input').first()
        await widthInput.clear()
        await widthInput.fill('1'+randomNumber)
        const changeSizeButton = page.locator('.change-size-actions button >> text=Изменить').first()
        // await changeSizeButton.highlight()
        await changeSizeButton.click()
        newWidth = await editor.canvas.evaluate(el => el.clientWidth)
        await expect(oldWidth).not.toEqual(newWidth)
        // console.log('<<<OLDOLDODODLDLDODLDLOD>>>', oldWidth)
        // console.log('<<<NEWNWNEWNENEWNENWENWNE>>>', newWidth)
        // const resizeBanner = page.locator('.Vue-Toastification__toast-body >> text=Размер дизайна изменен')
        // await resizeBanner.waitFor()

        // await page.pause()
    })

    test('Эдитор. Случайный шаблон', async ({page})=>{
        const editor = new Editor(page)
        let oldBackground: string, newBackground: string
        await page.goto('/app/designs/892617f4-7acf-4e1b-add3-adfcaa62e753')
        const api = await page.waitForResponse('**/get-content?itemType=DECOR-TYPE&type=TEMPLATE*')
        await editor.changesSavedBtn.waitFor()
        oldBackground = await editor.canvasBackground.evaluate(el => el.dataset.key) // Атрибут фона ДО 
        // Проверка, что загрузились шаблоны в левом меню
        const defaultTemlate = page.locator('[class="v-responsive__content"]')
        await defaultTemlate.nth(0).waitFor({timeout: 20000})
        // await page.waitForTimeout(3000)
        await editor.randomTemplateBtn.click()                                       // Клик по кнопке Случайный Шаблон
        await page.locator('.loading-blur-screen').waitFor({state: 'detached', timeout:10000})
        // Проверка, что шаблон применился
        await expect(async ()=>{
            newBackground = await editor.canvasBackground.evaluate(el => el.dataset.key) // Атрибут фона ПОСЛЕ 
            await expect(oldBackground).not.toEqual(newBackground)        
        }).toPass({timeout: 12000})
        
        await page.pause()
    })

    test('Эдитор. УДАЛЕНИЕ ФОНА У ФОТО АПЛОАД', async({page})=>{
        const editor = new Editor(page)
        await page.goto('/app/designs/3ba00c33-3def-4599-b474-b5429c86af82')
        await editor.changeDesignSizeBtn.waitFor()
        await editor.decor.locator('img[src*="uploads"]').click({force:true})                  // Клик по декору на холсте
        await editor.deleteBgBtn.click()                                                       // Удаляем фон
        await page.locator('.loading-blur-screen').waitFor({state: 'detached', timeout:10000}) // Ожидание завершения процесса
        const noBgImg = editor.canvas.locator('[src*="no-bg"]')
        await noBgImg.waitFor({timeout:10000})                                                 // Ждем, пока на холсте не появится фото БЕЗ фона
        const originalImg = page.locator('text="Оригинал"') 
        await originalImg.click()                                                              // Возвращаем оригинал фото
        // Проверяем, что на холсте появился оригинал фото        
        await editor.decor.locator('img:not([src*="no-bg"])[src*="uploads-images"]').waitFor() 
        const icon = page.locator('img[src*="icon8-icons"]')
        await icon.click()                                                                     // Кликаем по иконке на холсте

        // await page.pause()
    })

    test('Эдитор. УДАЛЕНИЕ ФОНА У ФОТО ИИ', async({page})=>{
        const editor = new Editor(page)
        await page.goto('/app/designs/df8778a4-80bc-41c7-9832-a827bc92439b')
        await editor.changeDesignSizeBtn.waitFor()
        await editor.decor.locator('img[src*="/ai-text2img"]').click({force:true})              // Клик по декору на холсте
        await editor.deleteBgBtn.click()                                                       // Удаляем фон
        await page.locator('.loading-blur-screen').waitFor({state: 'detached', timeout:10000}) // Ожидание завершения процесса
        const noBgImg = editor.canvas.locator('[src*="no-bg"]')
        await noBgImg.waitFor({timeout:10000})                                                 // Ждем, пока на холсте не появится фото БЕЗ фона
        const originalImg = page.locator('text="Оригинал"') 
        await originalImg.click()                                                              // Возвращаем оригинал фото
        // Проверяем, что на холсте появился оригинал фото        
        await editor.decor.locator('img:not([src*="no-bg"])[src*="/ai-text2img"]').waitFor() 
        const icon = page.locator('img[src*="icon8-icons"]')
        await icon.click()                                                                     // Кликаем по иконке на холсте

        // await page.pause()
    })

    test('Эдитор. УДАЛЕНИЕ ФОНА У ФОТО АНСПЛЭШ', async({page})=>{
        const editor = new Editor(page)
        await page.goto('/app/designs/c6454766-a526-4c1c-a6e2-35dd47af8812')
        await editor.changeDesignSizeBtn.waitFor()
        await editor.decor.locator('img[src*="/unsplash"]').click({force:true})                 // Клик по декору на холсте
        await editor.deleteBgBtn.click()                                                       // Удаляем фон
        await page.locator('.loading-blur-screen').waitFor({state: 'detached', timeout:10000}) // Ожидание завершения процесса
        const noBgImg = editor.canvas.locator('[src*="no-bg"]')
        await noBgImg.waitFor({timeout:10000})                                                 // Ждем, пока на холсте не появится фото БЕЗ фона
        const originalImg = page.locator('text="Оригинал"') 
        await originalImg.click()                                                              // Возвращаем оригинал фото
        // Проверяем, что на холсте появился оригинал фото        
        await editor.decor.locator('img:not([src*="no-bg"])[src*="/unsplash"]').waitFor() 
        const icon = page.locator('img[src*="icon8-icons"]')
        await icon.click()                                                                     // Кликаем по иконке на холсте

        // await page.pause()
    })
    
    test('Эдитор. Колоризация изображения', async({page})=>{
        const editor = new Editor(page)
        let oldCount: number, newCount: number
        let oldImg: string, newImg: string
        await page.goto('/app/designs/b458253d-90a5-4523-8af0-dc19001f9ad7')
        await editor.changesSavedBtn.waitFor()
        // Получаем сслыку фото до генерации
        oldImg = await editor.decor.locator('img').getAttribute('src')
        // Кликаем по первому фото в дизайне
        await editor.decor.click()
        // Кликаем по кнопке ИИ-редактора в тулбаре
        await editor.aiEditorBtn.click()
        // Проверяем, что баланс токенов больше 0
        const apiToken = await page.waitForResponse('**/api/tokens/balance')
        const apiJson = await apiToken.json()
        oldCount = apiJson.monthly_tokens + apiJson.permanent_tokens
        await expect(oldCount).toBeGreaterThan(0)
        // Применяем редактирование
        await page.locator('text=Колоризация').click()
        const loader = page.locator('.story-editor .preloader')
        await loader.waitFor()
        await expect(loader).toBeHidden({timeout:30000})
        // Проверяем, что отображается изменённое изображение
        newImg = await editor.decor.locator('img').getAttribute('src')
        await expect(async ()=>{
            expect(oldImg).not.toEqual(newImg)
        }).toPass({timeout: 10000})
        // Проверяем, что токены потратились
        await expect(async()=>{
            const tokens = await editor.tokensCountAiEditor
            newCount = Number(await tokens.textContent())
            expect(newCount).toEqual(oldCount-1)
        }).toPass({timeout:10000})

        await page.pause()
    })

    test('Эдитор. Улучшение изображения', async({page})=>{
        const editor = new Editor(page)
        let oldCount: number, newCount: number
        let oldImg: string, newImg: string
        await page.goto('/app/designs/a438f148-0a3e-447c-96f4-759d8d9ac428')
        await editor.changesSavedBtn.waitFor()
        // Фиксируем ссылку на фото до ии-редактора
        oldImg = await editor.decor.locator('img').getAttribute('src')
        // Кликаем по первому фото в дизайне
        await editor.decor.click({force:true})
        // Кликаем по кнопке ИИ-редактора в тулбаре
        await editor.aiEditorBtn.click()
        // Проверяем, что баланс токенов больше 0
        oldCount = await editor.getTokenCountApi()
        await expect(oldCount).toBeGreaterThan(0)
        // Применяем редактирование
        await page.locator('text=Улучшить изображение').click()
        const loader = page.locator('.story-editor .preloader')
        await loader.waitFor()
        // Проверяем, что токены потратились
        await expect(async ()=>{
            newCount = await editor.getTokenCountApi()
            await expect(newCount).toEqual(oldCount-1)
        }).toPass({timeout: 30000})               
        // Проверяем, что отображается изменённое изображение
        await expect(newCount).toEqual(oldCount-1)         
        await expect(loader).toBeHidden({timeout:10000}) 
        newImg = await editor.decor.locator('img').getAttribute('src')
        await expect(async()=>{
            expect(oldImg).not.toEqual(newImg)
        }).toPass({timeout:10000})    

        await page.pause()
    })

    test('Эдитор. Удаление фона', async({page})=>{
        const editor = new Editor(page)
        let oldCount: number, newCount: number
        await page.goto('/app/designs/f3948fa8-225d-40bd-9a4e-75b320f7e868')
        await editor.changesSavedBtn.waitFor()
        // Кликаем по первому фото в дизайне
        await editor.decor.locator('img[src*="/decors-types/uploads-images/"]').click({force:true})
        // Кликаем по кнопке ИИ-редактора в тулбаре
        await editor.aiEditorBtn.click()
        // Проверяем, что баланс токенов больше 0        
        oldCount = await editor.getTokenCountApi()
        await expect(oldCount).toBeGreaterThan(0)
        // Применяем редактирование
        await page.locator('.ai-editor__main_choose-styles_list_item:has-text("Удалить фон")').click()
        const loader = page.locator('.story-editor .preloader')
        await loader.waitFor()
        // Проверяем, что токены потратились
        await expect(async()=>{
            newCount = await editor.getTokenCountApi()
            await expect(oldCount).toEqual(newCount+1)
        }).toPass({timeout: 13000})        
        // Ждём завершения редактирования
        await expect(loader).toBeHidden({timeout:10000})
        // Клик по кнопке "Без фона"
        const noBgPreview = page.locator('text=Без фона')
        await noBgPreview.click()
        // Проверяем, что отображается изменённое изображение
        const newImg = page.locator('.story-box-inner__wrapper img[src*="-no-bg"]')
        await newImg.waitFor({timeout:15000})        
        // Возвращаем оригинал фото
        await page.locator('text=Оригинал').click()
        // Проверяем, что оригинал снова в дизайне
        await editor.decor.locator('[data-decor-type="UPLOAD-IMAGE"] img:not([src*="no-bg"])').waitFor()
        await editor.decor.locator('img[src*="/icon8-icons"]').click()
        
        await page.pause()
    })

    test('Эдитор. Дорисовка изображения', async({page})=>{
        const editor = new Editor(page)
        let oldCount: number, newCount: number
        let oldImg: string, newImg: string
        await page.goto('/app/designs/7d0d1e26-74b2-4776-9094-666549d6e286')
        await editor.changesSavedBtn.waitFor()
        // Фиксируем фото до редактирования
        oldImg = await editor.decor.locator('img').getAttribute('src')
        // Кликаем по первому фото в дизайне
        await editor.decor.click({force:true})
        // Кликаем по кнопке ИИ-редактора в тулбаре
        await editor.aiEditorBtn.click()
        // Проверяем, что баланс токенов больше 0
        oldCount = await editor.getTokenCountApi()
        await expect(oldCount).toBeGreaterThan(0)
        // Применяем редактирование
        await page.locator('.ai-editor__main_choose-styles_list_item:has-text("Дорисовать изображение")').click()
        // Выбираем формат дорисовки 16:9
        const format169 = page.locator('.ai-editor_menu__format:has(div[style="aspect-ratio: 9 / 16;"])')
        await format169.click()
        // Выполняем дорисовку
        const startBtn = page.getByRole('button', {name:"Дорисовать изображение"})
        await startBtn.click()
        const loader = page.locator('.ai-editor__main_canvas .preloader')
        await loader.waitFor()
        // Проверяем, что токены потратились
        await expect(async () =>{
            newCount = await editor.getTokenCountApi()            
            await expect(newCount).toEqual(oldCount-1) 
        }).toPass({timeout: 30000})
        // Ждём, пока пропадёт баннер прогресса
        await expect(loader).toBeHidden({timeout:15000})
        // Клик по ПРИМЕНИТЬ
        const acceptBtn = page.locator('text=Применить')
        await acceptBtn.click()
        // Проверяем, что отображается изменённое изображение в дизайне        
        await expect(async()=>{
            newImg = await editor.decor.locator('img').getAttribute('src')
            expect(oldImg).not.toEqual(newImg)
        }).toPass({timeout: 10000}) 

        // await page.pause()
    })

    test('ДАШБОРД. Создание дизайна с превышением максимально допустимого размера ШИРИНЫ', async({page})=>{
        const dashboard = new Dashboard(page)
        // Переход в Дашборд
        await page.goto('/app')
        await dashboard.createDesignBtn.waitFor()
        // Клик по кнопке "Задать свой размер"
        await page.locator('text=Задать свой размер').click()
        const widthInput = await page.locator('.resize-dialog input').first()
        const createDesignBtn = page.locator('.resize-dialog').getByRole('button', {name: "Создать дизайн"})
        // Ввод в инпут ШИРИНЫ значения больше допустимого
        await widthInput.clear()
        await widthInput.fill('3001')
        // Клик по кнопке "Создать дизайн"
        await createDesignBtn.click()
        // Проверка, что появился баннер с ошибкой
        const errorBanner = page.locator('.Vue-Toastification__container.top-right:has-text("Ширина дизайна должна быть")')
        await errorBanner.waitFor()
        await createDesignBtn.waitFor()

        // await page.pause()
    })

    test('ДАШБОРД. Создание дизайна с превышением максимально допустимого размера ВЫСОТЫ', async({page})=>{
        const dashboard = new Dashboard(page)
        // Переход в Дашборд
        await page.goto('/app')
        await dashboard.createDesignBtn.waitFor()
        // Клик по кнопке "Задать свой размер"
        await page.locator('text=Задать свой размер').click()
        const widthInput = await page.locator('.resize-dialog input').nth(1)
        const createDesignBtn = page.locator('.resize-dialog').getByRole('button', {name: "Создать дизайн"})
        // Ввод в инпут ВЫСОТЫ значения больше допустимого
        await widthInput.clear()
        await widthInput.fill('3001')
        // Клик по кнопке "Создать дизайн"
        await createDesignBtn.click()
        // Проверка, что появился баннер с ошибкой
        const errorBanner = page.locator('.Vue-Toastification__container.top-right:has-text("Высота дизайна должна быть")')
        await errorBanner.waitFor()
        await createDesignBtn.waitFor()

        // await page.pause()
    })

    test('ДАШБОРД. Создание дизайна с ШИРИНОЙ меньше допустимого значения', async({page})=>{
        const dashboard = new Dashboard(page)
        // Переход в Дашборд
        await page.goto('/app')
        await dashboard.createDesignBtn.waitFor()
        // Клик по кнопке "Задать свой размер"
        await page.locator('text=Задать свой размер').click()
        const widthInput = await page.locator('.resize-dialog input').first()
        const createDesignBtn = page.locator('.resize-dialog').getByRole('button', {name: "Создать дизайн"})
        // Ввод в инпут ШИРИНЫ значения меньше допустимого
        await widthInput.clear()
        await widthInput.fill('49')
        // Клик по кнопке "Создать дизайн"
        await createDesignBtn.click()
        // Проверка, что появился баннер с ошибкой
        const errorBanner = page.locator('.Vue-Toastification__container.top-right:has-text("Ширина дизайна должна быть")')
        await errorBanner.waitFor()
        await createDesignBtn.waitFor()

        // await page.pause()
    })

    test('ДАШБОРД. Создание дизайна с ВЫСОТОЙ меньше допустимого значения', async({page})=>{
        const dashboard = new Dashboard(page)
        // Переход в Дашборд
        await page.goto('/app')
        await dashboard.createDesignBtn.waitFor()
        // Клик по кнопке "Задать свой размер"
        await page.locator('text=Задать свой размер').click()
        const widthInput = await page.locator('.resize-dialog input').nth(1)
        const createDesignBtn = page.locator('.resize-dialog').getByRole('button', {name: "Создать дизайн"})
        // Ввод в инпут ВЫСОТЫ значения меньше допустимого
        await widthInput.clear()
        await widthInput.fill('49')
        // Клик по кнопке "Создать дизайн"
        await createDesignBtn.click()
        // Проверка, что появился баннер с ошибкой
        const errorBanner = page.locator('.Vue-Toastification__container.top-right:has-text("Высота дизайна должна быть")')
        await errorBanner.waitFor()
        await createDesignBtn.waitFor()

        // await page.pause()
    })

    test('Дашборд. Поиск по шаблонам', async({page})=>{
        const dashboard = new Dashboard(page)
        const prompt = '14 февраля'
        // Переход в Дашборд
        await page.goto('/app')
        // Поиск по шаблонам
        await dashboard.templateSearch.waitFor()
        await dashboard.templateSearch.fill(prompt)
        await page.keyboard.press('Enter')
        // Проверка, что по запросу нашлись шаблоны
        const searchResult = page.locator('.header_8GPuj')
        await searchResult.waitFor()
        const searchResultPrompt = await searchResult.locator('h2').textContent()
        const searchResultCount = await searchResult.locator('p').evaluate(el=> parseInt(el.textContent, 10))    
        // console.log('TEXT', searchResultPrompt);
        // console.log('NUMBER', searchResultCount);
        expect(searchResultPrompt).toContain(prompt)
        expect(searchResultCount).toBeGreaterThan(0)

        await page.pause()
    })

    test('Мэйн. Поиск по шаблонам', async({page})=>{        
        const main = new MainPage(page)
        const prompt = '14 февраля'
        // Переход в Дашборд
        await page.goto('/ru/templates')
        // Поиск по шаблонам
        await main.templateSearch.waitFor()
        await main.templateSearch.fill(prompt)
        await page.keyboard.press('Enter')
        // Проверка, что по запросу нашлись шаблоны
        const searchResult = page.locator('._1gypXs')
        await searchResult.waitFor()
        const searchResultPrompt = await searchResult.locator('h2').textContent()
        const searchResultCount = await searchResult.locator('p').evaluate(el=> parseInt(el.textContent, 10))
        expect(searchResultPrompt).toContain(prompt)
        expect(searchResultCount).toBeGreaterThan(0)

        // await page.pause()
    })

    test('Эдитор. Поиск по шаблонам', async ({page})=>{
        const editor = new Editor(page)
        // Переход в дизайн
        await page.goto('/app/designs/61bb153a-ab29-402c-b5c9-0c303fba998b')
        await editor.changesSavedBtn.waitFor()
        // Ождиание подгрузки шаблонов в левом меню
        const templatesList = await page.locator('.content_iAKDM [style*="decors-types/templates/"]')
        expect(templatesList.nth(0)).toBeVisible({timeout: 15000})        
        // Поиск по шаблонам
        const templatesInput = page.getByPlaceholder('Поиск шаблонов')
        await templatesInput.waitFor()
        await templatesInput.fill('еда')
        await page.keyboard.press('Enter')
        // Проверка, что появились результаты поиска
        await page.locator('.title_xLixx').first().waitFor({state: "hidden"})
        const templatesSearch = page.locator('.list_XCx5H [style*="decors-types/templates/"]')
        await templatesSearch.first().waitFor({timeout: 15000})
        const templatesCount = await templatesSearch.count()
        expect(templatesCount).toBeGreaterThan(0)        
        const notFoundMessage = page.locator('[class="message-not-found"]')
        // await notFoundMessage.waitFor({state: "hidden"})
        await expect(notFoundMessage, '<<<Ничего не найдено!!!>>>').not.toBeVisible()
        
        await page.pause()
    })

    test('Эдитор. Поиск по Шрифтам', async({page})=>{
        const editor = new Editor(page)
        // Переходим в дизайн
        await page.goto('/app/designs/11ffc3bd-f2fd-4ca5-80bb-b1c56a51e604')
        await editor.changesSavedBtn.waitFor()
        // Кликаем по текстовому декору
        await editor.decor.first().click()
        // Открываем меню смены шрифта
        const fontBtn = page.locator('[class="toolbar-center-container"] [class="selectLabel_oRghk"]')
        await fontBtn.waitFor()
        await fontBtn.click()
        // Вводим поисковый запрос в инпут поиска по шрифтам
        const fontInput = page.locator('[class="v-text-field__slot"]:has(label:has-text("Поиск шрифта")) input[type="text"]')
        await fontInput.waitFor()
        await fontInput.fill('lon')        
        // Проверяем, что результат поиска корректный
        const fonts = page.locator('[class="font-container"]:has-text("Все шрифты") [class="font-item"]')        
        await expect(fonts).toHaveCount(4)
        for(let i = 0; i < 4; i++) {            
            await expect(fonts.nth(i)).toHaveAttribute('style', /lon/i)
        }
        
        await page.pause()
    })

    test('Эдитор. Поиск по Фото', async ({page})=>{
        const editor = new Editor(page)
        // Переход в дизайн
        await page.goto('/app/designs/61bb153a-ab29-402c-b5c9-0c303fba998b')
        await editor.changesSavedBtn.waitFor()
        // Переход в раздел Медиа
        await page.getByText('Медиа').click()
        // Ождиание подгрузки фото в левом меню
        const folderHeader = page.locator('.title_xLixx:has-text("Недавно использованные")')
        await folderHeader.waitFor({timeout: 25000})
        const photoList = await page.locator('.content_iAKDM [id="item_ELEMENT-0"]:has([style*="decors-types/unsplash/"])')
        await photoList.nth(0).waitFor()   
        // Поиск по фото
        const photoInput = page.getByPlaceholder('Поиск фотографий')
        await photoInput.waitFor()
        await photoInput.fill('мама')
        await page.keyboard.press('Enter')
        // Проверка, что появились результаты поиска
        await page.locator('.title_xLixx').first().waitFor({state: "hidden"})
        const photoSearch = page.locator('[class="preview_AWmZ1"] .v-responsive__content')
        await photoSearch.first().waitFor()
        const photoCount = await photoSearch.count()        
        // Найденных элементов больше 0
        expect(photoCount).toBeGreaterThan(0)        
        
        // await page.pause()
    })

    test('Эдитор. Поиск по Видео', async ({page})=>{
        const editor = new Editor(page)
        // Переход в дизайн
        await page.goto('/app/designs/61bb153a-ab29-402c-b5c9-0c303fba998b')
        await editor.changesSavedBtn.waitFor()
        await page.locator('[id="decorsDrawer"]').locator('text="Медиа"').click()
        await page.locator('[class="tabs-wrapper"] button:has-text("Видео")').click()        
        // Ождиание подгрузки видео в левом меню
        const folderHeader = page.locator('[class="title_xLixx"]').getByText('Природа').nth(0)
        await folderHeader.waitFor()
        const pexelList = await page.locator('.category_Wh3UH .v-responsive__content')        
        await pexelList.nth(0).waitFor()   
        // Поиск по видео
        const pexelInput = page.getByPlaceholder('Поиск видео')
        await pexelInput.waitFor()
        await pexelInput.fill('катер')
        await page.keyboard.press('Enter')
        // Проверка, что появились результаты поиска
        await page.locator('.title_xLixx').first().waitFor({state: "hidden"})
        const pexelSearch = page.locator('[class="preview_AWmZ1"] .v-responsive__content')
        await pexelSearch.first().waitFor()
        const pexelCount = await pexelSearch.count()        
        // Найденных элементов больше 0
        expect(pexelCount).toBeGreaterThan(0)        
        
        await page.pause()
    })

    test('Эдитор. Поиск по Аудио', async ({page})=>{
        const editor = new Editor(page)
        // Переход в дизайн
        await page.goto('/app/designs/61bb153a-ab29-402c-b5c9-0c303fba998b')
        await editor.changesSavedBtn.waitFor()
        await page.locator('[id="decorsDrawer"]').locator('text="Медиа"').click()
        await page.locator('[class="tabs-wrapper"] button:has-text("Аудио")').click()        
        // Ождиание подгрузки аудио в левом меню
        const folderHeader = page.locator('[class="list_on0km"]').getByText('Природа')
        await folderHeader.waitFor()
        const audioCover = await page.locator('[class="list_on0km"] img[src*="/cover_preview"]')        
        await audioCover.first().waitFor()   
        // Поиск по аудио
        const audioInput = page.getByPlaceholder('Поиск аудио')
        await audioInput.waitFor()
        await audioInput.fill('магия')
        await page.keyboard.press('Enter')
        // Проверка, что появились результаты поиска
        await page.locator('.title_xLixx').first().waitFor({state: "hidden"})        
        const audioSearch = page.locator('[class="audioList_Uw3TR"] .album-cover:has(img[src*="/cover_preview"])')
        await audioSearch.first().waitFor()
        const audioCount = await audioSearch.count()        
        // Найденных элементов больше 0
        expect(audioCount).toBeGreaterThan(0)        
        
        // await page.pause()
    })

    test('Эдитор. Поиск по Элементам', async ({page})=>{
        const editor = new Editor(page)
        // Переход в дизайн
        await page.goto('/app/designs/61bb153a-ab29-402c-b5c9-0c303fba998b')
        await editor.changesSavedBtn.waitFor()
        await page.locator('[id="decorsDrawer"]').locator('text="Элементы"').click()               
        // Ождиание подгрузки элементов в левом меню
        const folderHeader = page.locator('[class="category_Wh3UH"]').getByText('Фигуры и линии')
        await folderHeader.waitFor()        
        const figureCover = await page.locator('[class="category_Wh3UH"]').first().locator('[class="preview_GXe+p"]')        
        await figureCover.first().waitFor()         
        // Поиск по элементам
        const elementInput = page.getByPlaceholder('Поиск медиа')
        await elementInput.waitFor()
        await elementInput.fill('огонь')        
        // Проверка, что появились результаты поиска
        await folderHeader.waitFor({state: "hidden"}) 
        // Проверка найденных GIF 
        const gifFolder = page.locator('[class="category_Wh3UH"]:has-text("Гифки")')
        await gifFolder.waitFor()
        const gif = gifFolder.locator('.v-responsive__content')
        for (let i = 0; i < 3; i++){
            await expect(gif.nth(i)).toBeVisible()
        }        
        // Проверка найденных Элементов 
        const elementsFolder = page.locator('[class="category_Wh3UH"]:has-text("Элементы")')
        await elementsFolder.waitFor()
        const elements = elementsFolder.locator('.v-responsive__content')
        for (let i = 0; i < 3; i++){
            await expect(elements.nth(i)).toBeVisible()
        }
        // Проверка найденных Иконок 
        const iconsFolder = page.locator('[class="category_Wh3UH"]:has-text("Иконки")')
        await iconsFolder.waitFor()
        const icons = iconsFolder.locator('.v-responsive__content')
        for (let i = 0; i < 3; i++){
            await expect(icons.nth(i)).toBeVisible()
        }
        // Проверка найденных Иллюстраций 
        const vectorsFolder = page.locator('[class="category_Wh3UH"]:has-text("Иллюстрации")')
        await vectorsFolder.waitFor()
        const vectors = vectorsFolder.locator('.v-responsive__content')
        for (let i = 0; i < 3; i++){
            await expect(vectors.nth(i)).toBeVisible()
        }             
        
        // await page.pause()
    })

    test('Дашборд. Поиск по дизайнам', async ({page}) => {
        const dashboard = new Dashboard(page)

        // Переход на страницу дизайнов
        await page.goto('/app/designs')
        await dashboard.createDesignBtn.waitFor({timeout: 15000})
        // Проверяем, что дизайны загрузились
        const design = page.locator('.v-responsive__content:has(.v-responsive__content)')
        await expect(async()=>{
            const designCount = await design.count()
            await expect(designCount).toBeGreaterThan(20)
        }).toPass({timeout: 10000})        
        // Вводим запрос в поиск по дизайнам
        await dashboard.designSearchInput.fill('искомый')
        await page.keyboard.press('Enter')
        // Проверяем количество найденных дизайнов и их названия
        const designTitle = page.locator('[class="card-title cardTitle_tvse0"]') 
        await expect(designTitle).toHaveCount(3)
        for(let i = 0; i < 3; i++) {
            await expect(designTitle.nth(i)).toContainText('Искомый')
        }

        // await page.pause()
    })
})

test.describe('Тесты ИИ-мастерской для ПРО тарифа', ()=>{
    test.beforeEach(async({page})=>{
        page.setViewportSize({"width": 1600, "height": 900})
    })
    test.use({ storageState: 'auth/auth1.json' });                    // <<<ФАЙЛ С СОХРАНЁННОЙ СЕССИЕЙ PRO>>>

    test('ИИ-мастерская. Генерация ФОТО', async({page})=>{
        const editor = new Editor(page)
        const workshop = new AiWorkshop(page)
        let oldCount: Number, newCount: Number    
        await page.goto('/app/image-generator')        
        await workshop.tokenCount.waitFor()

        const tk = page.locator('.header .span-text >> text=Токены')
        await tk.highlight()
        const text2 = await tk.evaluate(text => text.textContent)
        const text1 = await tk.textContent()
        await expect(text2.trim()).toEqual('Токены')
        await expect(text1.trim()).toEqual('Токены')

        await expect(async ()=>{
            const tokenText = await workshop.tokenCount.textContent()
            oldCount = Number(tokenText)
            expect(oldCount, '<<<НЕДОСТАТОЧНО ТОКЕНОВ>>>').toBeGreaterThan(0)
        }).toPass({timeout:10000})    

        await workshop.imgPrompt.fill('картонный кот')
        const styleBtn = page.locator('.ai-generator__main >> text="Без стиля"')
        await styleBtn.click()
        const cinemaStyle = page.locator('.dropdown-item:has-text("Кинематографический")')
        await cinemaStyle.click()
        await workshop.imgGenerateBtn.click()
        const newImgs = page.locator('.ai-generator__history div[id*="section"]').nth(0).locator('img[src*="flyvi.io/ai-history"]')
        await expect(async ()=>{            
            const imgSize = await newImgs.evaluateAll(imgs =>
                imgs.every(img => img.naturalHeight > 0))
        }).toPass()        

        const text2img = page.waitForResponse('**/api/text2img?prompt=*', {timeout:25000})    
        const response = await text2img
        const json = await response.json()
        await expect(json.data.prompt_ru).toEqual('картонный кот')
        await expect(json.data.images[0].model).toEqual('playground')                  // Модель playground
        await expect(json.data.images[0].path).toContain('.jpg')
        await expect(json.data.images[1].model).toEqual('stablecascade')               // Модель stablecascade
        await expect(json.data.images[1].path).toContain('.jpg')
        await expect(json.data.images[2].model).toEqual('sd')                          // Модель sd
        await expect(json.data.images[2].path).toContain('.jpg')
        await expect(json.data.images[3].model).toEqual('flux')                        // Модель flux
        await expect(json.data.images[3].path).toContain('.jpg')

        await expect(async ()=>{            
            const imgSize = await newImgs.evaluateAll(imgs =>
                imgs.every(img => img.naturalHeight > 0)
            )
        }).toPass()
        // await newImgs.highlight()
        await expect(async ()=>{
            const tokenText = await workshop.tokenCount.textContent()
            newCount = Number(tokenText)
            expect(oldCount, '<<<ТОКЕНЫ НЕ ПОТРАТИЛИСЬ>>>').toEqual(newCount+1)
        }).toPass({timeout:10000})  

        await page.pause()
    })

    test('ИИ-мастерская. Создание дизайна из сгененрированного фото. История генерации. Попап', async ({page, context})=>{
        const editor = new Editor(page)
        const workshop = new AiWorkshop(page)
        // Переход в ИИ-мастерскую
        await page.goto('/app/image-generator')
        await workshop.tokenCount.waitFor()
        // Выбираем первую сгенерированную картинку и кликаем по ней
        const imgHistory = page.locator('img[src*="/ai-history/"]').nth(0)
        await imgHistory.waitFor()
        const imgLink = await imgHistory.evaluate(img => img.getAttribute('src'))
        await imgHistory.click()
        // Проверяем, что ссылка на фото в истории и в открывшемся попапе одинаковые
        const imgPreview = await page.locator('.dialog-wrapper img[src*="/ai-history/"]')
        const imgPreviewLink = await imgPreview.evaluate(img => img.getAttribute('src'))
        await expect(imgPreviewLink).toEqual(imgLink)
        // Кликаем по кнопке "Использовать в дизайне"
        const createDesignFromBtn = page.locator('.dialog-wrapper button >> text=Использовать в дизайне')
        const [newTab] = await Promise.all([
            context.waitForEvent('page', {timeout: 25000}),
            createDesignFromBtn.click() // Клик по кнопке
        ])
        // Ждём перехода на другую вкалдку и проверяем, что есть фото на холсте
        await newTab.waitForURL('**/designs/*', {timeout:10000})
        const downloadBtn = newTab.locator('.header button >> text=Скачать')
        await downloadBtn.waitFor()
        const canvasImg = newTab.locator('.story-box-inner__wrapper img')  
        await canvasImg.waitFor()
        // console.log('<<<LINK>>>', canvasImgLink)       

        await page.pause()
    })

    test('ИИ-мастерская. Загрузка своего фото в ии-редактор', async({page})=>{
        const wh = new AiWorkshop(page)        
        // Переход в ИИ-редактор
        await page.goto('/app/image-editor')
        // Загружаем своё фото в ии-редактор
        const uploadBtn = page.locator('[class="upload_img"] span:has(span:has-text("Загрузить изображение"))')
        const [aploadImg] = await Promise.all([
            page.waitForEvent('filechooser'),
            uploadBtn.click()
        ])
        await aploadImg.setFiles('tests/resources/test1.jpg')
        // Проверяем, что фото появилось в редакторе
        const uploadedImg = page.locator('[class="zoom-container"] img[src*="/tmp/"]')
        await uploadedImg.waitFor()

        await page.pause()
    })

    test('ИИ-мастерская. Удаление фона', async({page})=>{
        const workshop = new AiWorkshop(page)
        let oldToken: string, newToken: string
        let oldImg: string, newImg: string
        // Переход в ИИ-редактор
        await page.goto('/app/image-editor')
        // Проверяем баланс токенов
        oldToken = await workshop.getTokenCount()
        expect(oldToken, "<<<НЕДОСТАТОЧНО ТОКЕНОВ>>>").toBeGreaterThan(0)
        // Загружаем своё фото в ии-редактор
        const uploadBtn = page.locator('[class="upload_img"] span:has(span:has-text("Загрузить изображение"))')
        const [aploadImg] = await Promise.all([
            page.waitForEvent('filechooser'),
            await uploadBtn.click()
        ])
        await aploadImg.setFiles('tests/resources/test1.jpg')
        // Сохраняем ссылку на первую картинку
        const uploadedImg = page.locator('[class="zoom-container"] img[src*="/tmp/"]')
        await uploadedImg.waitFor()
        oldImg = await uploadedImg.getAttribute('src')
        // Применяем редактирование
        newToken = await Promise.all([
            workshop.getTokenCount(),
            page.getByText('Удалить фон').click()
        ])
        // Проверяем, что токены потратились
        expect(newToken[0], '<<<Токены не потратились!!!>>>').toEqual(oldToken-1)
        // Ждём, пока не поменяется картинка
        await expect(async()=>{
            newImg = await uploadedImg.getAttribute('src')
            expect(newImg).not.toEqual(oldImg)
        }).toPass({timeout: 15000})    

        await page.pause()
    })

    test('ИИ-мастерская. Удаление водяного знака', async({page})=>{
        const workshop = new AiWorkshop(page)
        let oldToken: string, newToken: string
        let oldImg: string, newImg: string
        // Переход в ИИ-редактор
        await page.goto('/app/image-editor')
        // Проверяем баланс токенов
        oldToken = await workshop.getTokenCount()
        expect(oldToken, "<<<НЕДОСТАТОЧНО ТОКЕНОВ>>>").toBeGreaterThan(0)
        // Загружаем своё фото в ии-редактор
        const uploadBtn = page.locator('[class="upload_img"] span:has(span:has-text("Загрузить изображение"))')
        const [aploadImg] = await Promise.all([
            page.waitForEvent('filechooser'),
            await uploadBtn.click()
        ])
        await aploadImg.setFiles('tests/resources/test1.jpg')
        // Сохраняем ссылку на первую картинку
        const uploadedImg = page.locator('[class="zoom-container"] img[src*="/tmp/"]')
        await uploadedImg.waitFor()
        oldImg = await uploadedImg.getAttribute('src')
        // Применяем редактирование
        newToken = await Promise.all([
            workshop.getTokenCount(),
            page.getByText('Удалить водяной знак').click()
        ])
        // Проверяем, что токены потратились
        expect(newToken[0], '<<<Токены не потратились!!!>>>').toEqual(oldToken-1)
        // Ждём, пока не поменяется картинка картинка
        await expect(async()=>{
            newImg = await uploadedImg.getAttribute('src')
            expect(newImg).not.toEqual(oldImg)
        }).toPass({timeout: 20000})        

        await page.pause()
    })

    test('ИИ-мастерская. Колоризация', async({page})=>{
        const workshop = new AiWorkshop(page)
        let oldToken: string, newToken: string
        let oldImg: string, newImg: string
        // Переход в ИИ-редактор
        await page.goto('/app/image-editor')
        // Проверяем баланс токенов
        oldToken = await workshop.getTokenCount()
        expect(oldToken, "<<<НЕДОСТАТОЧНО ТОКЕНОВ>>>").toBeGreaterThan(0)
        // Загружаем своё фото в ии-редактор
        const uploadBtn = page.locator('[class="upload_img"] span:has(span:has-text("Загрузить изображение"))')
        const [aploadImg] = await Promise.all([
            page.waitForEvent('filechooser'),
            await uploadBtn.click()
        ])
        await aploadImg.setFiles('tests/resources/test1.jpg')
        // Сохраняем ссылку на первую картинку
        const uploadedImg = page.locator('[class="zoom-container"] img[src*="/tmp/"]')
        await uploadedImg.waitFor()
        oldImg = await uploadedImg.getAttribute('src')
        // Применяем редактирование
        newToken = await Promise.all([
            workshop.getTokenCount(),
            page.getByText('Колоризация').click()
        ])
        // Проверяем, что токены потратились
        expect(newToken[0], '<<<Токены не потратились!!!>>>').toEqual(oldToken-1)
        // Переключаем переключатель ДО/ПОСЛЕ
        const toggle = page.locator('[class="custom-switch"]')
        await toggle.isVisible({timeout: 25000})
        await toggle.click()
        // Ждём, пока не поменяется картинка картинка
        await expect(async()=>{
            newImg = await uploadedImg.getAttribute('src')
            expect(newImg).not.toEqual(oldImg)
        }).toPass({timeout: 15000})

        // console.log(oldImg);
        // console.log(newImg);

        await page.pause()
    })

    test('ИИ-мастерская. Улучшить изображение', async({page})=>{
        const workshop = new AiWorkshop(page)
        let oldToken: string, newToken: string
        let oldImg: string, newImg: string
        // Переход в ИИ-редактор
        await page.goto('/app/image-editor')
        // Проверяем баланс токенов
        oldToken = await workshop.getTokenCount()
        expect(oldToken, "<<<НЕДОСТАТОЧНО ТОКЕНОВ>>>").toBeGreaterThan(0)
        // Загружаем своё фото в ии-редактор
        const uploadBtn = page.locator('[class="upload_img"] span:has(span:has-text("Загрузить изображение"))')
        const [aploadImg] = await Promise.all([
            page.waitForEvent('filechooser'),
            uploadBtn.click()
        ])
        await aploadImg.setFiles('tests/resources/test1.jpg')
        // Сохраняем ссылку на первую картинку
        const uploadedImg = page.locator('[class="zoom-container"] img[src*="/tmp/"]')
        await uploadedImg.waitFor()
        oldImg = await uploadedImg.getAttribute('src')
        // Применяем редактирование
        newToken = await Promise.all([
            workshop.getTokenCount(),
            page.getByText('Улучшить изображение').click()
        ])
        // Проверяем, что токены потратились
        expect(newToken[0], '<<<Токены не потратились!!!>>>').toEqual(oldToken-1)
        // Переключаем переключатель ДО/ПОСЛЕ
        const toggle = page.locator('[class="custom-switch"]')
        await toggle.isVisible({timeout: 25000})
        await toggle.click()
        // Ждём, пока не поменяется картинка картинка
        await expect(async()=>{
            newImg = await uploadedImg.getAttribute('src')
            expect(newImg).not.toEqual(oldImg)
        }).toPass({timeout: 15000})

        await page.pause()
    })

    test('ИИ-мастерская. Изменить изображение', async({page})=>{
        const workshop = new AiWorkshop(page)
        let oldToken: string, newToken: string
        let oldImg: string, newImg: string
        // Переход в ИИ-редактор
        await page.goto('/app/image-editor')
        // Проверяем баланс токенов
        oldToken = await workshop.getTokenCount()
        expect(oldToken, "<<<НЕДОСТАТОЧНО ТОКЕНОВ>>>").toBeGreaterThan(0)
        // Загружаем своё фото в ии-редактор
        const uploadBtn = page.locator('[class="upload_img"] span:has(span:has-text("Загрузить изображение"))')
        const [aploadImg] = await Promise.all([
            page.waitForEvent('filechooser'),
            uploadBtn.click()
        ])
        await aploadImg.setFiles('tests/resources/test1.jpg')
        // Сохраняем ссылку на первую картинку
        const uploadedImg = page.locator('[class="zoom-container"] img[src*="/tmp/"]')
        await uploadedImg.waitFor()
        oldImg = await uploadedImg.getAttribute('src')
        // Переходим в меню инструмента
        await page.getByText('Изменить изображение').click()
        await page.getByPlaceholder('Введите текст запроса').fill('Добавь солнечные очки')
        // Применяем редактирование
        newToken = await Promise.all([
            workshop.getTokenCount({timeout: 25000}),
            await page.getByRole('button', {name: "Изменить изображение"}).click()
        ])
        expect(newToken[0], '<<<Токены не потратились!!!>>>').toEqual(oldToken-1)
        // Ждём, пока не поменяется картинка
        await expect(async()=>{
            newImg = await uploadedImg.getAttribute('src')
            expect(newImg).not.toEqual(oldImg)
        }).toPass({timeout: 20000})

        await page.pause()        
    })
})
})